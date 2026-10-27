# Online Quiz Application

A multiple-choice quiz app built with React, Vite, Spring Boot and H2.

## Requirements

- Java 17 or later
- Maven
- Node.js 20 or later

## Run the backend

Open a terminal in `backend` and run:

```bash
mvn spring-boot:run
```

Spring Boot starts on port 8080. The H2 database is initialized with five sample questions when the application starts for the first time.

## Run the frontend

Open another terminal in `frontend` and run:

```bash
npm install
npm run dev
```

Open the local address printed by Vite. Requests beginning with `/api` are proxied to Spring Boot.

## API

- `GET /api/questions` returns question text and options without correct answers.
- `POST /api/submit` accepts an answers object and returns the score and answer review.

Example submission:

```json
{
  "answers": {
    "1": "B",
    "2": "A"
  }
}
```

## Features

- Five multiple-choice questions
- One selected answer per question
- Loading and error states
- Score calculation on the backend
- Review of selected and correct answers after submission
- Retake quiz option
- Responsive layout
