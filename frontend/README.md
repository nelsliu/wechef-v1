# WeChef Frontend

React + TypeScript + Vite interface for the WeChef recipe costing tool.

## Prerequisites
- Node.js 18+
- npm (bundled with Node)
- Running WeChef Flask backend (see `../backend`)

## Getting Started
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Copy the environment example and adjust the API URL if needed:
   ```bash
   cp .env.example .env
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the Vite URL from the terminal output (defaults to http://127.0.0.1:5173) and interact with the app.

## Available Scripts
- `npm run dev` – start Vite in development mode
- `npm run build` – create a production build
- `npm run preview` – preview the production build locally
- `npm run lint` – typecheck the project via TypeScript

## Tech Stack
- Vite + React + TypeScript
- Tailwind CSS with shadcn-inspired primitives
- TanStack Query for data fetching
- React Hook Form + Zod for form state and validation

The frontend reads the API base URL from `VITE_API_URL`. Ensure the backend is reachable at that address to load and save recipes.
