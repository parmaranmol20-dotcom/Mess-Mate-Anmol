import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { DEMO_KITCHENS, DEMO_MEALS, PRICING_CONFIG } from "@/lib/constants";
import {
  Kitchen,
  Meal,
  OrderEnquiry,
  PartnerApplication,
  SkipRequest,
  Subscription,
  SubscriptionStatus,
} from "@/types";

const LOCAL_STORAGE_KEYS = {
  meals: "messmate_stored_meals",
  kitchens: "messmate_stored_kitchens",
  subscriptions: "messmate_stored_subscriptions",
  orders: "messmate_stored_orders",
  skipRequests: "messmate_stored_skips",
  partnerApps: "messmate_stored_partner_apps",
  pricingConfig: "messmate_stored_pricing",
};

// Safe localStorage access
function getLocal<T>(key: string, defaultVal: T): T {
  if (typeof window === "undefined") return defaultVal;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

// Initial demo subscription for Aarav Sharma (demo student)
const DEFAULT_DEMO_SUBSCRIPTION: Subscription = {
  id: "sub-dbs-001",
  userId: "demo-student-dbs-01",
  userName: "Aarav Sharma",
  userEmail: "aarav.sharma@dbs.edu.in",
  userPhone: "+91 98765 43210",
  planType: "monthly",
  mealPreferences: "both",
  startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  amount: 5299,
  status: "active",
  totalMeals: 60,
  remainingMeals: 48,
  notes: "Devbhoomi PG, Manduwala, Dehradun",
  createdAt: new Date().toISOString(),
};

// Default sample orders
const DEFAULT_DEMO_ORDERS: OrderEnquiry[] = [
  {
    id: "ord-101",
    userId: "demo-student-dbs-01",
    userName: "Aarav Sharma",
    userPhone: "+91 98765 43210",
    mealId: "meal-2",
    mealName: "Doon Special Rajma Chawal Thali",
    kitchenId: "kitch-2",
    kitchenName: "Doon Student Dabbawala",
    quantity: 1,
    amount: 100,
    preferredDate: new Date().toISOString().split("T")[0],
    mealType: "lunch",
    deliveryAddress: "Room 204, Devbhoomi Boys PG, Manduwala",
    status: "whatsapp_opened",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    notes: "Please deliver before 1:30 PM class",
  },
];

// Default sample skip requests
const DEFAULT_DEMO_SKIPS: SkipRequest[] = [
  {
    id: "skip-201",
    userId: "demo-student-dbs-01",
    userName: "Aarav Sharma",
    userEmail: "aarav.sharma@dbs.edu.in",
    subscriptionId: "sub-dbs-001",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    mealType: "dinner",
    reason: "DBS College Cultural Fest dinner with team",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
];

// Default sample partner application
const DEFAULT_DEMO_PARTNER_APPS: PartnerApplication[] = [
  {
    id: "app-301",
    ownerName: "Sunita Devi",
    kitchenName: "Pooja Homestyle Kitchen",
    phone: "+91 94120 55432",
    email: "sunita.kitchen@gmail.com",
    kitchenAddress: "Near DBS Sports Ground, Manduwala, Dehradun",
    foodCategory: "North Indian & Ghar ka Khana",
    operatingHours: "10:30 AM – 3:00 PM & 6:00 PM – 9:30 PM",
    description: "I have been cooking homely food for students for 6 years. Fresh chapatis, seasonal vegetables, and clean preparation.",
    fssaiNumber: "FSSAI-APPLIED-2024",
    status: "pending",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ==========================================
// MEALS SERVICE
// ==========================================
export async function getMeals(): Promise<Meal[]> {
  if (db && isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, "meals"));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Meal));
      }
    } catch (e) {
      console.warn("Firestore meals fetch fallback:", e);
    }
  }
  return getLocal<Meal[]>(LOCAL_STORAGE_KEYS.meals, DEMO_MEALS);
}

export async function addMeal(mealData: Omit<Meal, "id">): Promise<Meal> {
  const newId = "meal-" + Date.now();
  const newMeal: Meal = { id: newId, ...mealData };

  if (db && isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, "meals"), mealData);
      return { id: docRef.id, ...mealData };
    } catch (e) {
      console.error("Firestore addMeal error:", e);
    }
  }

  const current = getLocal<Meal[]>(LOCAL_STORAGE_KEYS.meals, DEMO_MEALS);
  const updated = [newMeal, ...current];
  setLocal(LOCAL_STORAGE_KEYS.meals, updated);
  return newMeal;
}

export async function updateMeal(id: string, updates: Partial<Meal>): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await updateDoc(doc(db, "meals", id), updates);
      return;
    } catch (e) {
      console.error("Firestore updateMeal error:", e);
    }
  }

  const current = getLocal<Meal[]>(LOCAL_STORAGE_KEYS.meals, DEMO_MEALS);
  const updated = current.map((m) => (m.id === id ? { ...m, ...updates } : m));
  setLocal(LOCAL_STORAGE_KEYS.meals, updated);
}

export async function deleteMeal(id: string): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, "meals", id));
      return;
    } catch (e) {
      console.error("Firestore deleteMeal error:", e);
    }
  }

  const current = getLocal<Meal[]>(LOCAL_STORAGE_KEYS.meals, DEMO_MEALS);
  const updated = current.filter((m) => m.id !== id);
  setLocal(LOCAL_STORAGE_KEYS.meals, updated);
}

// ==========================================
// KITCHENS SERVICE
// ==========================================
export async function getKitchens(): Promise<Kitchen[]> {
  if (db && isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, "kitchens"));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Kitchen));
      }
    } catch (e) {
      console.warn("Firestore kitchens fetch fallback:", e);
    }
  }
  return getLocal<Kitchen[]>(LOCAL_STORAGE_KEYS.kitchens, DEMO_KITCHENS);
}

// ==========================================
// PARTNER APPLICATIONS
// ==========================================
export async function submitPartnerApplication(
  data: Omit<PartnerApplication, "id" | "status" | "createdAt">
): Promise<PartnerApplication> {
  const newApp: PartnerApplication = {
    id: "app-" + Date.now(),
    ...data,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  if (db && isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, "partnerApplications"), {
        ...data,
        status: "pending",
        createdAt: newApp.createdAt,
      });
      return { ...newApp, id: docRef.id };
    } catch (e) {
      console.error("Firestore partner application error:", e);
    }
  }

  const current = getLocal<PartnerApplication[]>(LOCAL_STORAGE_KEYS.partnerApps, DEFAULT_DEMO_PARTNER_APPS);
  const updated = [newApp, ...current];
  setLocal(LOCAL_STORAGE_KEYS.partnerApps, updated);
  return newApp;
}

export async function getPartnerApplications(): Promise<PartnerApplication[]> {
  if (db && isFirebaseConfigured) {
    try {
      const q = query(collection(db, "partnerApplications"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PartnerApplication));
      }
    } catch (e) {
      console.warn("Firestore partner apps fetch fallback:", e);
    }
  }
  return getLocal<PartnerApplication[]>(LOCAL_STORAGE_KEYS.partnerApps, DEFAULT_DEMO_PARTNER_APPS);
}

export async function updatePartnerApplicationStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await updateDoc(doc(db, "partnerApplications", id), { status });
      return;
    } catch (e) {
      console.error("Firestore update partner app error:", e);
    }
  }

  const current = getLocal<PartnerApplication[]>(LOCAL_STORAGE_KEYS.partnerApps, DEFAULT_DEMO_PARTNER_APPS);
  const updated = current.map((a) => (a.id === id ? { ...a, status } : a));
  setLocal(LOCAL_STORAGE_KEYS.partnerApps, updated);
}

// ==========================================
// WHATSAPP ORDERS / ENQUIRIES
// ==========================================
export async function createOrderEnquiry(
  data: Omit<OrderEnquiry, "id" | "createdAt" | "status">
): Promise<OrderEnquiry> {
  const newOrder: OrderEnquiry = {
    id: "ord-" + Date.now(),
    ...data,
    status: "whatsapp_opened",
    createdAt: new Date().toISOString(),
  };

  if (db && isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ...data,
        status: "whatsapp_opened",
        createdAt: newOrder.createdAt,
      });
      return { ...newOrder, id: docRef.id };
    } catch (e) {
      console.error("Firestore createOrderEnquiry error:", e);
    }
  }

  const current = getLocal<OrderEnquiry[]>(LOCAL_STORAGE_KEYS.orders, DEFAULT_DEMO_ORDERS);
  const updated = [newOrder, ...current];
  setLocal(LOCAL_STORAGE_KEYS.orders, updated);
  return newOrder;
}

export async function getAllOrders(): Promise<OrderEnquiry[]> {
  if (db && isFirebaseConfigured) {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as OrderEnquiry));
      }
    } catch (e) {
      console.warn("Firestore getAllOrders error:", e);
    }
  }
  return getLocal<OrderEnquiry[]>(LOCAL_STORAGE_KEYS.orders, DEFAULT_DEMO_ORDERS);
}

export async function getUserOrders(userId: string): Promise<OrderEnquiry[]> {
  const all = await getAllOrders();
  return all.filter((o) => o.userId === userId);
}

// ==========================================
// SUBSCRIPTIONS
// ==========================================
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  if (db && isFirebaseConfigured) {
    try {
      const q = query(collection(db, "subscriptions"), where("userId", "==", userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as Subscription;
      }
    } catch (e) {
      console.warn("Firestore getUserSubscription error:", e);
    }
  }

  const allSubs = getLocal<Subscription[]>(LOCAL_STORAGE_KEYS.subscriptions, [DEFAULT_DEMO_SUBSCRIPTION]);
  const found = allSubs.find((s) => s.userId === userId && s.status !== "cancelled");
  return found || null;
}

export async function getAllSubscriptions(): Promise<Subscription[]> {
  if (db && isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, "subscriptions"));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Subscription));
      }
    } catch (e) {
      console.warn("Firestore getAllSubscriptions error:", e);
    }
  }
  return getLocal<Subscription[]>(LOCAL_STORAGE_KEYS.subscriptions, [DEFAULT_DEMO_SUBSCRIPTION]);
}

export async function createSubscription(
  data: Omit<Subscription, "id" | "createdAt">
): Promise<Subscription> {
  const newSub: Subscription = {
    id: "sub-" + Date.now(),
    ...data,
    createdAt: new Date().toISOString(),
  };

  if (db && isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, "subscriptions"), {
        ...data,
        createdAt: newSub.createdAt,
      });
      return { ...newSub, id: docRef.id };
    } catch (e) {
      console.error("Firestore createSubscription error:", e);
    }
  }

  const current = getLocal<Subscription[]>(LOCAL_STORAGE_KEYS.subscriptions, [DEFAULT_DEMO_SUBSCRIPTION]);
  const updated = [newSub, ...current];
  setLocal(LOCAL_STORAGE_KEYS.subscriptions, updated);
  return newSub;
}

export async function updateSubscriptionStatus(
  id: string,
  status: SubscriptionStatus
): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await updateDoc(doc(db, "subscriptions", id), { status });
      return;
    } catch (e) {
      console.error("Firestore updateSubscriptionStatus error:", e);
    }
  }

  const current = getLocal<Subscription[]>(LOCAL_STORAGE_KEYS.subscriptions, [DEFAULT_DEMO_SUBSCRIPTION]);
  const updated = current.map((s) => (s.id === id ? { ...s, status } : s));
  setLocal(LOCAL_STORAGE_KEYS.subscriptions, updated);
}

// ==========================================
// SKIP-A-MEAL REQUESTS
// ==========================================
export async function createSkipRequest(
  data: Omit<SkipRequest, "id" | "createdAt" | "status">
): Promise<{ success: boolean; request?: SkipRequest; error?: string }> {
  const allSkips = await getAllSkipRequests();

  // Prevent duplicate requests for the exact same date & mealType
  const exists = allSkips.find(
    (s) => s.userId === data.userId && s.date === data.date && (s.mealType === data.mealType || s.mealType === "both" || data.mealType === "both")
  );

  if (exists) {
    return {
      success: false,
      error: `A skip request for ${data.date} (${data.mealType}) already exists in your plan.`,
    };
  }

  const newSkip: SkipRequest = {
    id: "skip-" + Date.now(),
    ...data,
    status: "approved", // Automatically approved per plan policy
    createdAt: new Date().toISOString(),
  };

  if (db && isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, "skipRequests"), {
        ...data,
        status: "approved",
        createdAt: newSkip.createdAt,
      });
      return { success: true, request: { ...newSkip, id: docRef.id } };
    } catch (e) {
      console.error("Firestore createSkipRequest error:", e);
    }
  }

  const current = getLocal<SkipRequest[]>(LOCAL_STORAGE_KEYS.skipRequests, DEFAULT_DEMO_SKIPS);
  const updated = [newSkip, ...current];
  setLocal(LOCAL_STORAGE_KEYS.skipRequests, updated);

  return { success: true, request: newSkip };
}

export async function getAllSkipRequests(): Promise<SkipRequest[]> {
  if (db && isFirebaseConfigured) {
    try {
      const q = query(collection(db, "skipRequests"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SkipRequest));
      }
    } catch (e) {
      console.warn("Firestore getAllSkipRequests error:", e);
    }
  }
  return getLocal<SkipRequest[]>(LOCAL_STORAGE_KEYS.skipRequests, DEFAULT_DEMO_SKIPS);
}

export async function getUserSkipRequests(userId: string): Promise<SkipRequest[]> {
  const all = await getAllSkipRequests();
  return all.filter((s) => s.userId === userId);
}

export async function updateSkipRequestStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await updateDoc(doc(db, "skipRequests", id), { status });
      return;
    } catch (e) {
      console.error("Firestore updateSkipRequestStatus error:", e);
    }
  }

  const current = getLocal<SkipRequest[]>(LOCAL_STORAGE_KEYS.skipRequests, DEFAULT_DEMO_SKIPS);
  const updated = current.map((s) => (s.id === id ? { ...s, status } : s));
  setLocal(LOCAL_STORAGE_KEYS.skipRequests, updated);
}

// ==========================================
// PRICING CONFIGURATION (ADMIN MANAGED)
// ==========================================
export function getPricingConfig() {
  return getLocal(LOCAL_STORAGE_KEYS.pricingConfig, PRICING_CONFIG);
}

export function updatePricingConfig(newConfig: typeof PRICING_CONFIG) {
  setLocal(LOCAL_STORAGE_KEYS.pricingConfig, newConfig);
}

// ==========================================
// DEMO RESET HELPER (FOR FACULTY EVALUATION)
// ==========================================
export function resetToDemoDefaults() {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEYS.meals, JSON.stringify(DEMO_MEALS));
  localStorage.setItem(LOCAL_STORAGE_KEYS.kitchens, JSON.stringify(DEMO_KITCHENS));
  localStorage.setItem(LOCAL_STORAGE_KEYS.subscriptions, JSON.stringify([DEFAULT_DEMO_SUBSCRIPTION]));
  localStorage.setItem(LOCAL_STORAGE_KEYS.orders, JSON.stringify(DEFAULT_DEMO_ORDERS));
  localStorage.setItem(LOCAL_STORAGE_KEYS.skipRequests, JSON.stringify(DEFAULT_DEMO_SKIPS));
  localStorage.setItem(LOCAL_STORAGE_KEYS.partnerApps, JSON.stringify(DEFAULT_DEMO_PARTNER_APPS));
  localStorage.setItem(LOCAL_STORAGE_KEYS.pricingConfig, JSON.stringify(PRICING_CONFIG));
}

