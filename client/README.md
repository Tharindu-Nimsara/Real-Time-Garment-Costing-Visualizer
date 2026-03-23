# Garment Cost Web (MERN)

This is a MERN stack project structure with separated frontend (`client`) and backend (`server`) apps.

## Folder Structure

- `client` - React frontend
- `server` - Node.js + Express backend

## Getting Started

### 1) Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2) Environment setup

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

You can also split variables into `server/.env` and `client/.env` if preferred.

### 3) Run apps

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

## Tech Stack

- MongoDB
- Express.js
- React
- Node.js
