# Student Record Management System

A simple full-stack student record application built with React and Spring Boot.

## Requirements

- Java 17 or later
- Node.js 20 or later
- Maven

## Backend

From the `backend` folder, run:

```bash
mvn spring-boot:run
```

The backend runs at `http://localhost:8080`.

Student API: `http://localhost:8080/api/students`

The application uses an H2 file database. Records are kept in `backend/data`.

## Frontend

From the `frontend` folder, run:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Features

- Add students
- View student records
- Edit student details
- Delete students
- Search by roll number
- Show the total number of students
- Validate required fields, unique roll numbers, and marks from 0 to 100

## API

- `GET /api/students`
- `GET /api/students/{id}`
- `POST /api/students`
- `PUT /api/students/{id}`
- `DELETE /api/students/{id}`
