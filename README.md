# 🍱 MessMate — Good food. Better days.

> **DGU Venture Quest Student Food-Tech Startup**  
> *Entrepreneurship & Innovation — DBS Global University, Dehradun*

MessMate is a student-first food-tech platform engineered to make affordable, hygienic, home-style food easily accessible to college students living in PGs and rented rooms around DBS Global University, Dehradun.

---

## 🌟 Executive Summary & Business Concept

- **Brand:** MessMate
- **Tagline:** Good food. Better days.
- **Mission:** Eliminate the student dilemma between expensive aggregator delivery apps and rigid, tasteless hostel mess schedules.
- **Target Audience:** First-year out-of-city students, UG/PG scholars living in Manduwala, Kandoli, Selaqui, and Prem Nagar PG corridors.
- **Pilot Location:** Exclusively DBS Global University & nearby PG clusters in Dehradun (no false nationwide delivery claims).
- **Core Unit Economics:**
  - Individual Homestyle Meal: **₹80 – ₹120** (Base illustrative price: ₹100).
  - Monthly Meal Budget Target: **₹2,500 – ₹3,500** (~₹88 to ₹93 per meal).
  - All pricing is dynamically configurable by administrators.
- **Ordering Model:** Direct, frictionless **WhatsApp Ordering** & subscription requests (no unnecessary aggregator payment commission or overhead).

---

## 🎨 Visual Identity & Design System

- **Primary Green:** `#174F38`
- **Secondary Green:** `#286C4D`
- **Cream Canvas:** `#F8F7F1`
- **Warm White:** `#FFFFFF`
- **Accent Orange:** `#F2A65A`
- **Dark Text:** `#1C2921`
- **Muted Text:** `#788078`
- **Typography:** *Playfair Display* for editorial headlines paired with *Plus Jakarta Sans* / *Inter* for crisp body typography.
- **Custom Logo:** Minimalist warm plate mark combined with aroma steam and welcoming smile curve.

---

## 🚀 Key Modules & Implemented Features

### 1. 🏠 Editorial Landing Page (`/`)
- Dynamic sticky navbar with transparent hero transition and responsive mobile drawer.
- Serving location badge: **"Currently serving: DBS & nearby PG areas, Dehradun"**.
- Problem Section: Expensive delivery, unhealthy food fatigue, rigid mess schedules.
- Solution Section: Homestyle cooking, student-friendly pricing, skip-a-meal guarantee, kitchen transparency.
- 5-Step How It Works guide.
- Popular homestyle meal cards with realistic Indian photography, portion metrics, and vegetarian indicators.
- Tiered Pricing Cards (Individual, Weekly, Monthly).
- Partner Kitchen spotlight & clearly identified demonstration student feedback.
- Interactive FAQ accordion.

### 2. 🔐 Google Authentication & Firebase Auth (`/login`)
- **Real Google OAuth sign-in flow** (`signInWithPopup` via Firebase Auth).
- **Email & Password login and registration** with automatic profile creation in Cloud Firestore (`users/{uid}`).
- Split-screen editorial authentication layout.
- Route protection and persistent sessions.
- Interactive **"Faculty & Evaluation Fast-Track"** toggle for instantaneous demo logins (Student & Admin) without requiring immediate API keys.

### 3. 🍛 Meal Marketplace (`/meals`)
- Real-time search by meal name, ingredients, or kitchen partner.
- Filter by Category (Thalis, Dal Rice, Combos, Light & Healthy).
- Filter by Diet (Pure Veg / Non-Veg).
- Filter by Meal Timing (Lunch / Dinner / Both).
- Filter by Price Range (Under ₹100 / ₹100+).
- Rich **Meal Detail Modal** displaying serving portions, fresh ingredients, kitchen background, and instant WhatsApp order dispatch.

### 4. 📅 Fair-Use Skip-a-Meal & Subscriptions (`/dashboard`, `/dashboard/skip`)
- Calendar-based meal skip scheduler with automatic duplicate request prevention.
- **Configurable Cutoff Policies:**
  - Lunch Cutoff: **9:00 AM** same morning.
  - Dinner Cutoff: **4:00 PM** same afternoon.
- **Credit Rollover Engine:** Approved meal skips automatically roll credits forward to extend the plan validity end date.

### 5. 📱 WhatsApp Ordering MVP
- One-click order creation stored in the database (`orders` collection) before redirecting to WhatsApp.
- Formatted pre-filled message generator containing Student Name, Meal Name, Quantity, Price Breakdown, Preferred Date, Slot (Lunch/Dinner), and Room/PG Delivery Address.
- Configurable WhatsApp business number (`NEXT_PUBLIC_WHATSAPP_NUMBER`).

### 6. 👩‍🍳 Kitchen Partner Portal (`/kitchen-partner`)
- Partner application form capturing Owner Name, Kitchen Name, Phone, Email, Dehradun Address, Food Category, Operating Slots, Kitchen Description, and FSSAI details.
- Stores applications with **Pending** status awaiting campus tasting and hygiene audit.

### 7. 🛡️ Admin Operations Hub (`/admin`)
- Real-time KPI metrics: Registered Students, Kitchen Applications, Active Kitchens, WhatsApp Orders & Subscriptions.
- Menu Catalog Manager: Add, Edit, and toggle availability of meals.
- Partner Audit Manager: Approve or Reject incoming kitchen applications.
- Pricing Configuration Engine: Adjust base selling price, weekly plan rates, and monthly budget targets on the fly.
- Order & Skip-a-Meal Ledger monitor.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom editorial brand tokens
- **Icons:** Lucide React
- **Animations:** Framer Motion & CSS micro-interactions
- **Backend / DB:** Firebase Authentication & Cloud Firestore (with `firestore.rules`)

---

## ⚙️ Setup & Firebase Configuration

### 1. Install & Run Locally
```bash
# Clone the repository and enter the directory
cd d:\MessMate

# Run development server
npm run dev

# Or build for production
npm run build
npm start
```
The application will be live at `http://localhost:3000`.

### 2. Connect Your Firebase Project
1. Create a project at [console.firebase.google.com](https://console.firebase.google.com) named `messmate-dgu`.
2. Register a Web App and copy your credentials into `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_WHATSAPP_NUMBER=918859012345
```
3. Enable **Google** and **Email/Password** under *Authentication > Sign-in method*.
4. Deploy the included `firestore.rules` to secure student collections and enforce role-based access.

---

## 🎓 University Faculty & Evaluation Demo Mode

To allow faculty and venture quest evaluators to test every feature instantly without needing to paste live API keys first, the application includes a built-in demo environment:
- Visit `/login` and click **"Demo Student"** to test the Student Dashboard, Skip-a-Meal calendar, and WhatsApp ordering flow.
- Click **"Demo Admin"** to test the Admin Operations Hub, Partner Approvals, Meal Catalog, and Pricing Engine.

