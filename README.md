# CreditFlow - Business Loan Application Platform

##NOTE THAT THIS PROJECT IS INCOMPLETE, FEEL FREE TO FORK

## Overview

**CreditFlow** is a web application designed to provide efficient credit access for Micro, Small, and Medium Enterprises (MSMEs). The platform enables businesses to apply for loans by filling out a detailed application form and receiving suggestions on potential loan providers based on their business details, financials, and requirements.

## Features

- **User Authentication**: Users can sign up and log in using their credentials. The platform utilizes JWT-based authentication for secure login and session management.
- **Business Loan Application**: Users can fill out a multi-step application form to apply for a business loan, including business details, loan requirements, and personal details.
- **Document Submission**: Users can upload necessary documents such as PAN card, GST registration certificate, bank statements, ITR, etc.
- **Loan Suggestions**: Based on the user’s financial details, the platform suggests various banks and financial institutions for loan applications.
- **Progress Tracker**: Users can track the status of their loan application from the homepage.
- **Basic Credit Scoring**: A basic credit scoring mechanism is implemented, providing users with suggestions based on revenue, expenses, and loan amounts.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs for password hashing

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/creditflow.git
cd creditflow
```
### 2. Install Dependencies
For frontend dependencies:

```bash
cd client
npm install
```
For backend dependencies:

```bash
cd server
npm install
```
### 3. Setup PostgreSQL Database
Create a PostgreSQL database and set up your tables according to the required schema for user data and loan applications.
Update the .env file with your database connection credentials.
Example .env file:

```ini
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=creditflow_db
JWT_SECRET=your_jwt_secret
```
### 4. Start the Application
For the backend (Node.js server):

```bash
cd server
npm start
```
For the frontend (static files):

```bash
cd client
npm start
```
Visit `http://localhost:3000` in your browser to access the application.

### 5. Usage
* Login: Sign up or log in using the credentials. After successful login, you’ll be redirected to the homepage.
* Apply for a Loan: Click "Apply Now" on the homepage to start filling out the loan application form.
* Track Loan Status: View the status of your loan application directly on the homepage after submission.

## Notes
* This is a demo version of the platform. Currently, it simulates the loan application process and provides suggestions based on input fields.
* The backend supports JWT authentication for user sessions and protects routes using token verification.
* Loan suggestions are basic and can be enhanced with advanced credit scoring models and integrations with financial institutions.

## Future Improvements
* Integration with real financial APIs to provide actual loan options.
* Implement detailed credit scoring algorithms based on a wider range of parameters.
* Expand the document upload and verification process to ensure a secure and seamless user experience.
