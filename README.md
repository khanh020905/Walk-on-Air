# 👟 Walk on Air - Shoe Management System

![Java](https://img.shields.io/badge/Java-17%2B-orange) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0-green) ![React](https://img.shields.io/badge/React-18-blue) ![MySQL](https://img.shields.io/badge/MySQL-8.0-lightgrey) ![Gemini AI](https://img.shields.io/badge/AI-Gemini_1.5-purple)

**Walk on Air** is a full-stack e-commerce platform designed to modernize the shoe retail experience. It combines a robust Spring Boot backend with a dynamic React frontend, featuring an **AI-powered Sales Assistant** (powered by Google Gemini) to guide customers, real-time inventory management, and a seamless checkout process.

## 🚀 Key Features

### 🛒 Customer Experience
* **AI Sales Assistant:** Integrated chatbot using **Google Gemini 1.5 Flash** to answer customer queries and recommend shoes.
* **Product Discovery:** Advanced filtering by category (Men, Women, Kids), size, color, and price.
* **Smart Cart:** Persistent shopping cart with real-time stock validation.
* **Checkout System:** Simulated payment gateway generating QR codes for bank transfers.
* **User Accounts:** Secure registration, login, and profile management.

### 🛡️ Admin & Backend
* **Dashboard:** Comprehensive view of sales, orders, and inventory status.
* **Product Management:** CRUD operations for shoe inventory, including image handling.
* **Order Processing:** Track order status from "Pending" to "Paid/Shipped".
* **Security:** JWT-based Authentication and Role-Based Access Control (RBAC).

## 🛠️ Tech Stack

### Frontend
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS
* **State Management:** React Context API
* **Icons:** Lucide React
* **HTTP Client:** Fetch API

### Backend
* **Framework:** Spring Boot 3+ (Web, Data JPA, Security)
* **Language:** Java 17 or 21
* **Database:** MySQL
* **AI Integration:** Google Gemini API (REST Template & Jackson)
* **Build Tool:** Maven

---

## ⚙️ Installation & Setup

### Prerequisites
* [Java Development Kit (JDK) 17+](https://adoptium.net/)
* [Node.js & npm](https://nodejs.org/)
* [MySQL Server](https://dev.mysql.com/downloads/installer/)

### 1. Database Configuration
1. Open MySQL Workbench (or your preferred client).
2. Create the database:
   ```sql
   CREATE DATABASE ShoesManagement;
   ```
2. Backend Setup
Navigate to the backend directory:

Bash
```
cd shoe_backend
Open src/main/resources/application.properties and update your credentials:
```
Properties
```
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ShoesManagement
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Google Gemini AI Config
google.gemini.api.key=YOUR_GOOGLE_AI_STUDIO_KEY
google.gemini.url=[https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent](https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent)
Run the application:
```
Bash
```
mvn spring-boot:run
The backend will start on http://localhost:8080
```
3. Frontend Setup
Navigate to the frontend directory:

Bash
```
cd shoe_frontend
Install dependencies:
```
Bash
```
npm install
Create a .env file in the root of the frontend folder:
```
Bash
```
VITE_BACKEND_URL=http://localhost:8080
Start the development server:
```
Bash
```
npm run dev
```

```
Method,Endpoint,Description
POST,/api/user/login,Authenticate user & return JWT
POST,/api/user/register,Create a new customer account
GET,/api/products,Fetch all products with pagination
POST,/api/orders/create-order,Submit a new order (Checkout)
POST,/api/chatbot,Send user message to Gemini AI
```

📸 Screenshots   

## Nav-bar:
<img width="1861" height="74" alt="Screenshot 2026-01-11 211147" src="https://github.com/user-attachments/assets/e8290f1e-8ff3-4681-9938-fab57979e05b" />

## Home:
<img width="1860" height="921" alt="Screenshot 2026-01-11 211125" src="https://github.com/user-attachments/assets/1dbb99fc-1f47-439b-8793-b08b58e5e918" />

<img width="1857" height="838" alt="Screenshot 2026-01-11 211219" src="https://github.com/user-attachments/assets/f9ede853-032d-4a54-95a3-7e19b5ece30e" />

## Collections:
### Men:

<img width="1858" height="996" alt="Screenshot 2026-01-11 211337" src="https://github.com/user-attachments/assets/7d58c761-9792-4900-ac25-8d64207a2d7b" />

### Women:
<img width="1853" height="999" alt="image" src="https://github.com/user-attachments/assets/7ba0a32b-6da8-47ae-8728-3ce4b870c263" />

### Kids:
<img width="1854" height="999" alt="image" src="https://github.com/user-attachments/assets/9f0fc503-c8c3-453a-baf0-429b80f794ca" />

### Sale:
<img width="1855" height="1004" alt="image" src="https://github.com/user-attachments/assets/f9408684-bc1b-4e6e-9bf2-f5e93f461269" />


## Favorite:

<img width="1856" height="1005" alt="image" src="https://github.com/user-attachments/assets/ceb6cfa2-fdcd-4e36-bcf6-6894da0d17bb" />

## Cart:

<img width="1866" height="1008" alt="image" src="https://github.com/user-attachments/assets/955cd590-9195-4be1-b5e3-bed871a5dbcd" />
<img width="572" height="585" alt="image" src="https://github.com/user-attachments/assets/03fc81fb-92b6-4e7f-b720-14f2e94bb5b1" />

## Chatbot: 
<img width="339" height="466" alt="image" src="https://github.com/user-attachments/assets/16494254-4512-4c4e-a45f-e0f2faa29e8f" />


## Footer:

<img width="1854" height="379" alt="Screenshot 2026-01-11 211241" src="https://github.com/user-attachments/assets/5b63f425-f915-4bf3-ba87-0b3e9cea2154" />
