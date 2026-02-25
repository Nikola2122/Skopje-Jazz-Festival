# Skopje-Jazz-Festival – Music Events Platform

**Skopje-Jazz-Festival** is a web application that aggregates and displays **up-to-date music events in North Macedonia**, allowing users to discover concerts, track events they are interested in, and receive personalized recommendations.

Users can create an account, browse music events, mark events as *interested*, and search events by music category (e.g. jazz, rap, pop).  
An admin panel enables controlled management of events and artists, while an automated scraping script keeps the event data continuously updated.

The application is built with **Vue.js** and uses **Firebase** for authentication and data storage, providing real-time updates and secure access control.

---

## Features

- User authentication (sign up / login / logout) using Firebase Auth  
- Browse live **music events only** across North Macedonia  
- Mark events as **interested**  
- Personalized event recommendations based on user interests  
- Search events by music category (jazz, rap, pop, etc.)  
- Admin panel for managing events and artists  
- Events display associated performing artists  
- Automated scraping script to keep events and artists up to date  
- Real-time data synchronization via Firestore  

---

## Tech Stack

| Tech              | Purpose                                                                 |
|-------------------|-------------------------------------------------------------------------|
| **Vue.js**        | Frontend framework, reactive UI, component-based architecture           |
| **Vite**          | Fast development server and build tooling                                |
| **Firebase Auth** | User authentication and access control                                   |
| **Firestore**     | NoSQL database for events, artists, users, and interests                 |
| **Firebase SDK**  | Client-side communication with Firebase services                          |
| **Node.js**       | Runtime for development and scraping scripts                              |
| **Web Scraping**  | Automated ingestion of music event and artist data into Firestore        |

---

## Data Models

### Event
- Title  
- Music category (jazz, rap, pop, etc.)  
- Date & time  
- Location  
- Performing artists (references)  
- Source (scraped / admin-added)  

### Artist
- Name  
- Genre  
- Associated events  

### User
- Authentication credentials  
- Interested events  
- Preference signals for recommendations  

---

## How It Works

1. Music events and artists are stored in **Firestore**  
2. A scraping script periodically fetches new music events and artists  
3. Scraped data is normalized and saved to Firestore  
4. The frontend listens to Firestore for **real-time updates**  
5. Users authenticate via Firebase Auth  
6. User interactions (interested events) are stored per user  
7. Event recommendations are generated based on user interests  

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js)
- A **Firebase project** with:
  - Authentication enabled
  - Firestore database created

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Skopje-Jazz-Festival.git
cd Skopje-Jazz-Festival
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Firebase Configuration

Create a Firebase project and copy your configuration into the app.

Example `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

### 4. Run the Application

```bash
npm run dev
```

The app will be available at:

```text
http://localhost:5173
```

---

## Admin Panel

- Access restricted to a **single admin account**
- Admin capabilities:
  - Add new music events
  - Add new artists
  - Associate artists with events
  - Maintain curated event data

Authentication and access control are enforced using Firebase Auth and Firestore security rules.

---

## Scraping Script

The project includes an automated script that:

- Scrapes external sources for **music events only**
- Extracts event and artist information
- Inserts or updates records in Firestore
- Prevents duplicate events and artists

This ensures the platform remains **continuously up to date** with minimal manual effort.

---

## Authentication & Security

- Firebase Authentication handles:
  - User sign-up and login
  - Session management
- Firestore security rules ensure:
  - Users can only modify their own data
  - Admin-only access to event and artist management
