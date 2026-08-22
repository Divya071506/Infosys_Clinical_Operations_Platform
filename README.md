# Infosys Clinical Operations Platform (ICOP)

A comprehensive, enterprise-grade full-stack healthcare management application built with **React**, **Spring Boot 3**, and **MySQL 8**.

---

## 🩺 System Architecture

```text
React (Vite + Tailwind Glassmorphism)
   ↓ (Axios + JWT Bearer Interceptor)
Spring Boot REST API (Port 8080)
   ↓ (Spring Security + Bean Validation)
Service Layer (Business Logic & Conflict Prevention)
   ↓ (Spring Data JPA)
MySQL 8 Database (localhost:3306/infosys_clinical_operations)
```

---

## 🗂️ Project Structure

```text
Infosys_Clinical_Operations_Platform/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/infosys/clinicaloperations/
│   │   │   │   ├── config/             # WebConfig (CORS), DataInitializer
│   │   │   │   ├── controller/         # Auth, Patient, Doctor, Appointment, Admin
│   │   │   │   ├── dto/                # Request/Response data transfer objects
│   │   │   │   ├── entity/             # User, Patient, Doctor, Appointment, Enums
│   │   │   │   ├── exception/          # GlobalExceptionHandler, Custom Exceptions
│   │   │   │   ├── repository/         # Spring Data JPA Repositories
│   │   │   │   ├── security/           # JWT Service, Filter, SecurityConfig
│   │   │   │   ├── service/            # Business & persistence logic
│   │   │   │   └── ClinicalOperationsApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, Modal, Tables, Cards, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT session management)
│   │   ├── pages/              # LandingPage, Login, Register, Dashboards, CRUD
│   │   ├── services/           # Centralized Axios & API endpoints
│   │   ├── styles/             # Tailwind CSS & custom neon glass styling
│   │   ├── App.jsx             # React Router routing & ProtectedRoute
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS (Dark + Glassmorphism + Neon Healthcare theme)
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios (with centralized interceptors & token injection)

### Backend
- **Framework**: Spring Boot 3.3.4 (Java 21)
- **Security**: Spring Security & JJWT (HMAC SHA-256)
- **Persistence**: Spring Data JPA & Hibernate
- **Validation**: Jakarta Bean Validation
- **Database**: MySQL 8.x Connector
- **Build Tool**: Maven

---

## 🔐 Default Credentials

The platform automatically bootstraps the database with seed accounts and specialists on first launch:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@icop.com` | `Admin@123` | Full administrative control (patients, doctors, appointments, dashboard) |
| **PATIENT** | `john.doe@example.com` | `Patient@123` | Patient portal, self-booking, personal records, appointment cancellation |

---

## 🚀 Setup & Execution Guide

### Step 1: MySQL Database Setup

1. Start your local MySQL server (port `3306`).
2. Open MySQL CLI / Workbench and create the database (or allow Spring Boot's `createDatabaseIfNotExist=true` to auto-create it):
   ```sql
   CREATE DATABASE IF NOT EXISTS infosys_clinical_operations;
   ```

3. Update your password in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/infosys_clinical_operations?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
   *(Alternatively, set the environment variable `MYSQL_PASSWORD=your_password`)*

---

### Step 2: Run the Spring Boot Backend

Open a terminal in `backend/`:

```powershell
cd backend
mvn spring-boot:run
```

The Spring Boot backend will start on **`http://localhost:8080`**.

---

### Step 3: Run the React Frontend

Open another terminal in `frontend/`:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will start on **`http://localhost:5173`**.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new patient account | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT Bearer token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Authenticated |

### Patient Management (`/api/patients`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/patients` | Retrieve all patients (supports `?search=`) | ADMIN |
| `GET` | `/api/patients/{id}` | Get patient details by ID | ADMIN / PATIENT |
| `GET` | `/api/patients/me` | Get current logged-in patient details | PATIENT |
| `POST` | `/api/patients` | Create a new patient record | ADMIN |
| `PUT` | `/api/patients/{id}` | Update patient record | ADMIN / PATIENT |
| `DELETE` | `/api/patients/{id}` | Remove patient record | ADMIN |

### Doctor Management (`/api/doctors`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/doctors` | Get all doctors (supports `?search=&specialization=`) | Public |
| `GET` | `/api/doctors/active` | Get active clinicians available for booking | Public |
| `GET` | `/api/doctors/{id}` | Get doctor details by ID | Public |
| `POST` | `/api/doctors` | Add a new doctor profile | ADMIN |
| `PUT` | `/api/doctors/{id}` | Update doctor profile & availability | ADMIN |
| `DELETE` | `/api/doctors/{id}` | Remove doctor profile | ADMIN |

### Appointment Operations (`/api/appointments`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/appointments` | Filter appointments (`?status=&doctorId=&date=`) | ADMIN |
| `GET` | `/api/appointments/my` | Get current patient's appointments | PATIENT |
| `GET` | `/api/appointments/{id}` | Get appointment details by ID | Authenticated |
| `POST` | `/api/appointments` | Book new clinical appointment | PATIENT / ADMIN |
| `PUT` | `/api/appointments/{id}` | Update appointment schedule & details | ADMIN |
| `PUT` | `/api/appointments/{id}/status` | Update status (`PENDING`, `CONFIRMED`, etc.) | ADMIN |
| `PUT` | `/api/appointments/{id}/cancel` | Cancel an appointment | PATIENT / ADMIN |
| `DELETE` | `/api/appointments/{id}` | Delete appointment record | ADMIN |

### Admin Telemetry (`/api/admin`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Aggregated dashboard operational statistics | ADMIN |

---

## 🎨 UI/UX Features

- **Dark + Glassmorphism + Neon Healthcare**: Deep dark space backgrounds with glowing cyan, electric blue, and radiant purple accents.
- **Conflict Prevention**: Doctor schedule collision detection preventing multiple patients from reserving the same physician in the same time slot.
- **Centralized Axios Architecture**: Automatic JWT header attachment, token expiration interception, and standardized error messaging.
- **Fully Responsive Layout**: Collapsible mobile sidebar navigation drawer, fluid typography, and mobile-friendly tables.
