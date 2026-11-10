export type UserRole = 'student' | 'admin' | 'partner';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  phone?: string;
  role: UserRole;
  college?: string;
  pgAddress?: string;
  createdAt: string;
}

export type MealCategory = 'thali' | 'dal_rice' | 'combo' | 'healthy' | 'curry_roti' | 'special';
export type FoodType = 'veg' | 'non-veg';
export type MealTiming = 'lunch' | 'dinner' | 'both';

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MealCategory;
  foodType: FoodType;
  imageURL: string;
  kitchenId: string;
  kitchenName: string;
  kitchenLocation: string;
  availability: boolean;
  mealTiming: MealTiming;
  portionInfo: string;
  ingredients: string[];
  isPopular?: boolean;
  isDemo?: boolean;
}

export interface Kitchen {
  id: string;
  ownerId?: string;
  name: string;
  address: string;
  description: string;
  phone: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  operatingHours: string;
  fssaiNumber?: string;
  foodCategory?: string;
  imageURL?: string;
  rating?: number;
  isDemo?: boolean;
}

export type SubscriptionPlan = 'weekly' | 'monthly';
export type SubscriptionStatus = 'active' | 'paused' | 'pending' | 'cancelled';

export interface Subscription {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  planType: SubscriptionPlan;
  mealPreferences: MealTiming;
  startDate: string;
  endDate: string;
  amount: number;
  status: SubscriptionStatus;
  totalMeals: number;
  remainingMeals: number;
  notes?: string;
  createdAt: string;
}

export interface SkipRequest {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  subscriptionId?: string;
  date: string;
  mealType: 'lunch' | 'dinner' | 'both';
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface OrderEnquiry {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  mealId: string;
  mealName: string;
  kitchenId?: string;
  kitchenName?: string;
  quantity: number;
  amount: number;
  preferredDate: string;
  mealType: 'lunch' | 'dinner';
  deliveryAddress: string;
  status: 'whatsapp_opened' | 'confirmed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface PartnerApplication {
  id: string;
  ownerName: string;
  kitchenName: string;
  phone: string;
  email: string;
  kitchenAddress: string;
  foodCategory: string;
  operatingHours: string;
  description: string;
  fssaiNumber?: string;
  kitchenPhotos?: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

