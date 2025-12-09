# 🏰 The Secret Sticker Playground

Welcome to **The Secret Sticker Playground**! A fun, child-friendly project designed to explain complex Authentication concepts (JWT & OTP) using simple analogies like magic words and stickers.

![Playground Theme](https://img.shields.io/badge/Theme-Playground-FF6B6B?style=for-the-badge&logo=rocket)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=spring)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)

## 🎯 Project Goal
Traditional authentication flow descriptions (Bearer tokens, Authorization headers, Crypto signatures) are boring and hard to grasp. This project visualizes them as:
1.  **Requesting access** -> "Knocking on the Gate"
2.  **OTP (One Time Password)** -> "The Magic Word"
3.  **JWT (JSON Web Token)** -> "The Secret Sticker"
4.  **Protected Endpoints** -> "The Slide" & "The Sandbox"

## 🛠️ Tech Stack

### 🚂 Backend (The Engine Room)
-   **Java 17**
-   **Spring Boot 3.2.1**
-   **Spring Security** (Stateless setup)
-   **JJWT** (For generating and verifying JSON Web Tokens)
-   **In-Memory Storage** (Simulating a database for OTPs)

### 🎡 Frontend (The Playground)
-   **React** (Vite)
-   **Vanilla CSS** (Custom "Glassmorphism" design)
-   **Axios** (API communication)

## 🚀 How to Run

### Prerequisites
-   Java 17+ installed
-   Node.js installed
-   Maven (or use the Maven wrapper if added, otherwise use IDE)

### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run
```
*The server will start on port `8080`.*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The web app will start on `http://localhost:5173`.*

## 🏳️ How to Play (The Flow)

1.  **Entrance**: Enter your name (e.g., "Ziyad"). Click **"Ask for the Magic Word"**.
2.  **The Gatekeeper**: Check your **Backend Terminal** console. You will see a log message like:
    ```
    GATEKEEPER ALERT: Magic Word for Ziyad is: 123456
    ```
3.  **Verification**: Enter that 6-digit code into the Frontend box.
4.  **Access Granted**: You get a **Secret Sticker** (JWT)!
5.  **Blueprints Mode 🤓**: Click the "Show Blueprints" button in the app to see the actual Java code running behind the scenes for each step!

## 🧠 Educational Analogy

| Technical Term | Playground Analogy | What it does |
| :--- | :--- | :--- |
| **Authentication** | The Gatekeeper | Verifies who you are. |
| **OTP** | Magic Word | A temporary code sent to your phone (Console) to prove it's really you. |
| **JWT** | Secret Sticker | A digital pass signed by the Gatekeeper. You carry it around to get into places. |
| **Authorization** | Slide Guard | Checks if you have a valid Sticker before letting you play. |

## 🤝 Contributing
Feel free to fork this project and add more "Playground Equipment" (Protected Endpoints)!

---
*Built with ❤️ for learners of all ages.*
