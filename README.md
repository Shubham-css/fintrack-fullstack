<div align="center">

# 📊 FinTrack

### A Secure, Full-Stack Personal Finance Management Platform

*Empowering individuals to take full control of their financial health — one transaction at a time.*

---

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#️-technology-stack)
- [System Architecture](#-system-architecture)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
- [REST API Reference](#-rest-api-reference)
- [Security Model](#-security-model)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌐 Overview

**FinTrack** is a production-ready, full-stack personal finance management application designed with both security and user experience at its core. It provides individuals with a unified platform to track their income and expenses, enforce category-wise monthly budgets, and gain actionable insights into their spending behavior through real-time data visualizations.

The project is architected as a clean separation of concerns — a **Java Spring Boot RESTful API** on the backend, backed by a **MySQL** relational database, and a **React (Vite)** single-page application on the frontend. This architecture reflects real-world, enterprise-grade software design patterns, making FinTrack not only a useful personal tool but also a comprehensive reference implementation for full-stack development best practices.

Whether you are managing day-to-day grocery budgets or monitoring long-term savings trends, FinTrack gives you the clarity and control you need — all within a clean, modern, and responsive interface.

---

## ✨ Key Features

### 🔐 Stateless JWT Authentication
User registration and login are secured via **Spring Security** integrated with **JSON Web Tokens (JWT)**. Each authenticated request carries a signed, time-limited token, eliminating the need for server-side session storage. Token injection into outgoing HTTP requests is handled transparently via **Axios interceptors** on the frontend, ensuring a seamless and secure experience across all protected routes.

### 📈 Dynamic Financial Visualizations
FinTrack leverages **Recharts** to render interactive area charts that visualize a user's running account balance over time and display categorical spending trends across custom date ranges. These charts update in real-time as new transactions are recorded, giving users an always-current view of their financial trajectory without the need for a page refresh.

### 🎯 Smart Budget Management System
Users can define strict monthly spending limits for any number of custom categories — such as Groceries, Rent, Entertainment, or Travel. FinTrack dynamically aggregates all transactions belonging to each category and presents the spending progress via animated progress bars. The system instantly reflects changes as new transactions are logged, providing real-time budget consumption feedback.

### 🔔 Real-Time Over-Budget Alert System
FinTrack includes a reactive notification system built on custom browser events. When a newly logged expense causes a category's total spending to exceed its defined monthly budget, an event listener triggers a dynamic, dismissible alert notification — ensuring users are immediately aware of budget breaches without needing to manually navigate to the budgets page.

### 🔍 Global As-You-Type Search
A globally accessible search bar, powered by a **debounce-optimized** query mechanism, allows users to instantly find matching transactions and budget entries as they type. Queries are dispatched to the MySQL backend in real-time, and results are surfaced without any page reloads — providing a fast, fluid discovery experience across potentially large datasets.

### 📱 Responsive & Modern UI Design
The entire frontend interface is styled with **Tailwind CSS** and enhanced with **Lucide React** icons. The layout is fully responsive across desktop and mobile screen sizes. The design language prioritizes clarity and information density — ensuring users can navigate their financial data efficiently with minimal cognitive overhead.

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React** (via Vite) | Component-based SPA framework |
| **Tailwind CSS** | Utility-first responsive styling |
| **Recharts** | Interactive data visualization (area charts) |
| **Lucide React** | Consistent, lightweight icon library |
| **Axios** | HTTP client with JWT interceptor support |
| **React Hooks** | Local state and side-effect management |
| **Custom Events API** | Cross-component event broadcasting (budget alerts) |

### Backend

| Technology | Purpose |
|---|---|
| **Java 21** | Core programming language |
| **Spring Boot 3.x** | Application framework and auto-configuration |
| **Spring Security** | Authentication and authorization pipeline |
| **JWT (JSON Web Tokens)** | Stateless session management |
| **Spring Data JPA (Hibernate)** | ORM and database abstraction layer |
| **MySQL 8.x** | Relational database for persistent storage |
| **RESTful API (MVC)** | Structured endpoint design and separation of concerns |

---

## 🏗️ System Architecture

FinTrack follows a classic **three-tier architecture**, cleanly separating the presentation layer, business logic layer, and data layer:

```
┌─────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                     │
│         React SPA (Vite) — Port 5173                    │
│   Pages: Dashboard · Transactions · Budgets · Search    │
│   HTTP Client: Axios (with JWT Bearer Token injection)  │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS / REST (JSON)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                      │
│       Spring Boot 3.x REST API — Port 8080              │
│   Security: Spring Security + JWT Filter Chain          │
│   Business Logic: Service Layer (Transactional)         │
│   Data Access: Spring Data JPA Repositories             │
└───────────────────────┬─────────────────────────────────┘
                        │ JPA / Hibernate (SQL)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                           │
│             MySQL 8.x — fintrack_db                     │
│   Tables: users · transactions · budgets                │
└─────────────────────────────────────────────────────────┘
```

**Authentication Flow:**
1. User submits credentials → `POST /api/v1/auth/login`
2. Spring Security validates credentials against the database
3. Backend generates and returns a signed JWT
4. Frontend stores the JWT and attaches it as a `Bearer` token to all subsequent requests via Axios interceptors
5. Spring Security's JWT filter validates the token on every protected endpoint before routing the request

---

## 📁 Repository Structure

This project follows a **monorepo structure**, housing both the frontend and backend applications within a single unified workspace for streamlined development and version control.

```
FINTRACK-FULLSTACK/
│
├── fintrack-backend/                  # Spring Boot Application
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/fintrack/
│   │       │       ├── controller/    # REST Controllers (Auth, Transaction, Budget, Search)
│   │       │       ├── service/       # Business logic layer
│   │       │       ├── repository/    # Spring Data JPA repositories
│   │       │       ├── model/         # JPA Entity classes (User, Transaction, Budget)
│   │       │       ├── dto/           # Data Transfer Objects (Request/Response payloads)
│   │       │       ├── security/      # JWT utility, filter chain, security config
│   │       │       └── event/         # Custom application event listeners
│   │       └── resources/
│   │           └── application.properties   # DB config, JWT secret, server port
│   └── pom.xml                        # Maven dependencies
│
└── fintrack-frontend/                 # React (Vite) Application
    ├── src/
    │   ├── components/                # Reusable UI components
    │   │   ├── Sidebar.jsx
    │   │   ├── Topbar.jsx
    │   │   ├── AlertNotification.jsx
    │   │   └── BudgetProgressBar.jsx
    │   ├── pages/                     # Route-level views
    │   │   ├── Dashboard.jsx          # Summary, balance chart, recent transactions
    │   │   ├── Transactions.jsx       # Full transaction log with CRUD operations
    │   │   └── Budgets.jsx            # Budget management with progress tracking
    │   ├── services/                  # API communication layer
    │   │   └── api.js                 # Axios instance with JWT interceptor
    │   ├── App.jsx                    # Root component, routing configuration
    │   └── main.jsx                   # Vite entry point
    ├── index.html
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Getting Started

Follow these step-by-step instructions to run FinTrack locally on your development machine.

### Prerequisites

Ensure the following tools are installed and properly configured on your system before proceeding:

| Requirement | Version | Notes |
|---|---|---|
| **Java JDK** | 21+ | Verify with `java -version` |
| **Maven** | 3.8+ | Typically bundled with IDE or installed via package manager |
| **MySQL Server** | 8.x | Must be running locally |
| **Node.js** | 18+ | Verify with `node -v` |
| **npm** | 9+ | Comes bundled with Node.js |

---

### 1. Backend Setup

#### a) Prepare the Database

Log into your local MySQL instance and create the application database:

```sql
CREATE DATABASE fintrack_db;
```

> **Note:** FinTrack uses Spring Data JPA with `ddl-auto` configured to `update`. All tables (`users`, `transactions`, `budgets`) will be automatically created by Hibernate on the first application startup. No manual schema migration is required.

#### b) Configure Application Properties

Open `fintrack-backend/src/main/resources/application.properties` and update the following fields to match your local MySQL setup:

```properties
# ── Database Configuration ──────────────────────────────────────
spring.datasource.url=jdbc:mysql://localhost:3306/fintrack_db
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ── JPA / Hibernate ─────────────────────────────────────────────
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# ── JWT Configuration ────────────────────────────────────────────
jwt.secret=your_strong_random_secret_key_here
jwt.expiration=86400000

# ── Server ───────────────────────────────────────────────────────
server.port=8080
```

> ⚠️ **Security Note:** Never commit your `application.properties` containing real credentials to a public repository. Use environment variables or a secrets manager in production environments.

#### c) Start the Backend Server

Navigate into the backend directory and run the application using Maven:

```bash
cd fintrack-backend
./mvnw spring-boot:run
```

The Spring Boot server will start and be accessible at:
```
http://localhost:8080
```

You should see Hibernate's table creation logs in the terminal on first run, confirming successful database connectivity.

---

### 2. Frontend Setup

#### a) Install Node Dependencies

Open a **new terminal window**, navigate into the frontend directory, and install all required packages:

```bash
cd fintrack-frontend
npm install
```

#### b) Configure the API Base URL (Optional)

If your backend is running on a non-default host or port, update the base URL in the Axios configuration file:

```javascript
// src/services/api.js
const API = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});
```

#### c) Start the Development Server

```bash
npm run dev
```

The Vite development server will start with Hot Module Replacement (HMR) enabled, and the application will be accessible at:

```
http://localhost:5173
```

Open this URL in your browser. You will be greeted with the FinTrack login/registration page. Create a new account and begin tracking your finances immediately.

---

## 📡 REST API Reference

The Spring Boot backend exposes a structured RESTful API. All endpoints — with the exception of authentication routes — require a valid `Bearer` token in the `Authorization` request header.

**Authorization Header Format:**
```
Authorization: Bearer <your_jwt_token>
```

---

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new user account | ❌ No |
| `POST` | `/api/v1/auth/login` | Authenticate and receive a JWT | ❌ No |

**Register — Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Login — Response Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer"
}
```

---

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/transactions` | Retrieve all transactions for the authenticated user |
| `POST` | `/api/v1/transactions` | Create a new transaction |
| `PUT` | `/api/v1/transactions/{id}` | Update an existing transaction by ID |
| `DELETE` | `/api/v1/transactions/{id}` | Delete a transaction by ID |

**Create Transaction — Request Body:**
```json
{
  "type": "EXPENSE",
  "category": "Groceries",
  "amount": 52.75,
  "description": "Weekly grocery run",
  "date": "2025-06-15"
}
```

---

### Budgets

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/budgets` | Retrieve all budgets for the authenticated user |
| `POST` | `/api/v1/budgets` | Create a new budget category limit |
| `PUT` | `/api/v1/budgets/{id}` | Update a budget limit by ID |
| `DELETE` | `/api/v1/budgets/{id}` | Delete a budget by ID |

**Create Budget — Request Body:**
```json
{
  "category": "Entertainment",
  "monthlyLimit": 150.00,
  "month": "2025-06"
}
```

---

### Search

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/search?query={term}` | Search transactions and budgets by keyword |

---

## 🔒 Security Model

FinTrack's security architecture is designed around a **stateless, token-based authentication model** that is both scalable and resistant to common web vulnerabilities.

- **Password Hashing:** All user passwords are hashed using **BCrypt** before being persisted to the database. Raw passwords are never stored.
- **JWT Signing:** Tokens are signed with a secret key using the **HMAC-SHA256 (HS256)** algorithm. Any token tampered with after issuance will fail signature validation and be rejected.
- **Token Expiration:** JWTs carry an expiration claim (`exp`). Expired tokens are automatically rejected by the Spring Security filter, requiring users to re-authenticate.
- **Protected Routes:** All API endpoints beyond `/api/v1/auth/**` are guarded by a custom `JwtAuthenticationFilter` that validates the token before the request is forwarded to any controller.
- **CORS Configuration:** Cross-Origin Resource Sharing is explicitly configured in the Spring Security setup to allow requests exclusively from the trusted frontend origin (`http://localhost:5173` in development).

---

## 🔮 Roadmap

The following enhancements are planned for future development iterations:

- [ ] **CSV / PDF Export** — Allow users to export monthly transaction reports in CSV or PDF format for offline record-keeping and tax preparation.
- [ ] **Multi-Currency Support** — Enable transactions in multiple currencies with automatic exchange rate conversion via a third-party API.
- [ ] **Recurring Transactions** — Support for scheduling recurring income and expense entries (e.g., monthly rent, salary) that auto-populate at defined intervals.
- [ ] **Dark Mode Toggle** — A system-preference-aware dark mode with a manual override toggle, persisted to the user's profile.
- [ ] **User Profile Customization** — Profile page with avatar upload, name/email editing, and password change functionality.
- [ ] **Analytics Dashboard** — An advanced analytics page featuring monthly spending breakdowns, category comparison bar charts, and savings rate calculations.
- [ ] **Email Notifications** — Optional email alerts for budget breaches, delivered via an SMTP integration using Spring Mail.
- [ ] **OAuth2 Social Login** — Sign in with Google or GitHub using Spring Security's OAuth2 client support.
- [ ] **Docker Compose Setup** — Containerized deployment configuration for spinning up the entire stack (frontend, backend, MySQL) with a single command.
- [ ] **Unit & Integration Test Suite** — Comprehensive backend test coverage using JUnit 5 and Mockito, with frontend component tests via Vitest and React Testing Library.

---

## 🤝 Contributing

Contributions are warmly welcomed! If you would like to improve FinTrack, please follow this workflow:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with a descriptive message:
   ```bash
   git commit -m "feat: add recurring transaction support"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against the `main` branch with a clear description of your changes

Please ensure your code follows the existing conventions and that any new backend endpoints are accompanied by appropriate service-layer logic and tested manually before submission.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Built with ☕ Java, ⚛️ React, and a commitment to clean, purposeful software design.

*If you find FinTrack useful, consider giving the repository a ⭐ — it helps others discover the project.*

</div>
