# Sällskap — Dining, Coordinated

Sällskap is a modern web application designed to simplify group dining, particularly for groups with diverse dietary needs. The platform guides users through a structured, multi-step flow to collect preferences, filter restaurants, and confirm a reservation that works for everyone.

The project emphasizes clarity, accessibility, and Scandinavian-inspired minimalism.

---

## Live Demo

[**Open the App →**](https://sallskap-git-main-martalendinezs-projects.vercel.app)


## Features

### Group Coordination Flow
- Select date, time, and number of people  
- Add dietary restrictions and preferences  
- Browse restaurants filtered by group needs  
- View menus, reviews, and restaurant details  
- Confirm a reservation through a guided interface  

### Smart Filtering
- Matches restaurants to dietary requirements  
- Supports:
  - Vegan
  - Vegetarian
  - Gluten-free
  - Dairy-free
  - Nut-free
  - Halal  
- Tag-based preferences such as:
  - Seasonal  
  - Organic  
  - Raw Bar  
  - Wood-Fired  

### Reservations
- Session-based storage for upcoming and past reservations  
- Status indicators for:
  - Confirmed  
  - Pending  
  - Cancelled bookings  

### User Interface
- Scandinavian-minimal design  
- Responsive layout  
- Dark mode support  
- Smooth animations powered by Framer Motion  

---

## Tech Stack

- React  
- TypeScript  
- Tailwind CSS  
- Framer Motion  
- React Router  
- Vercel (deployment)  

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

The app will be available at:  
http://localhost:5173  

### Build for production

```bash
npm run build
```

---

## Project Structure

```bash
src/
  components/   # Reusable UI components
  pages/        # Route-based screens (Landing, Steps, Browse, Confirmation)
  data/         # Restaurant dataset
  utils/        # Filtering logic and helpers
  context/      # (Optional) Reservation state
  styles/       # Global styles and Tailwind config
```
