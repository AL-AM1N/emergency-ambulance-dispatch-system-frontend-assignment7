# AmbuLink — Emergency Ambulance Dispatch System (Frontend)

A modern, responsive web application for on-demand emergency ambulance dispatch. AmbuLink connects **patients**, **drivers**, and **dispatchers (admins)** on a single platform for requesting, assigning, and tracking emergency medical transport.

This repository contains the **frontend** only. It consumes the Emergency Ambulance Dispatch System backend REST API.

## Features

### Patient
- Register, log in, and manage a profile
- Create emergency ambulance requests with location and medical details
- Track requests and trip status in real time
- View trip history and make payments via Stripe checkout

### Driver
- Register as a driver with vehicle and license details
- View assigned trips and update trip progress
- Manage driver profile

### Admin / Dispatcher
- Operational dashboard with analytics and charts
- Manage emergency requests and trips
- Manage ambulances, drivers, and hospitals
- Review payments and generate reports

### General
- Public marketing site (home, about, services, hospitals, FAQ, contact)
- Authentication with Google OAuth and email/password
- Role-based dashboards and guarded routes
- Animated page transitions and a polished, accessible UI
- One-click demo access for each role

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, [Base UI](https://base-ui.com/), shadcn-style components |
| Animation | [Motion](https://motion.dev/) |
| Data fetching | [TanStack Query](https://tanstack.com/query) |
| Forms & validation | [TanStack Form](https://tanstack.com/form), [Zod](https://zod.dev/) |
| HTTP client | [ofetch](https://github.com/unjs/ofetch) |
| Charts | [Recharts](https://recharts.org/) |
| Auth | JWT access/refresh tokens, Google OAuth |
| Payments | [Stripe](https://stripe.com/) (client-side checkout) |
| Linting & formatting | [Biome](https://biomejs.dev/) |

## Project Structure

```
src/
├── api/          # Typed API modules (auth, patient, driver, admin, payment, public)
├── app/          # Next.js App Router routes
│   ├── (public)/         # Marketing + authentication pages
│   └── (dashboard)/      # Role-based dashboards (admin, driver, patient)
├── components/   # UI, layout, dashboard, landing, auth, motion, shared components
├── context/      # React context (authentication)
├── hooks/        # Reusable hooks
├── lib/          # API client, auth helpers, formatting, motion, utils
├── providers/    # App providers (query, auth, motion, Google auth)
├── routes/       # Route constants and navigation menus
├── types/        # Shared TypeScript types
└── validation/   # Zod schemas
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A running instance of the backend API

### Installation

```bash
npm install
```

### Environment Configuration

Copy the example environment file and fill in the required values:

```bash
cp .env.example .env.local
```

Refer to `.env.example` for the variables that need to be configured. Never commit real credentials or secrets.

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run Biome checks |
| `npm run format` | Format code with Biome |
| `npm run typecheck` | Run TypeScript type checking |

## Building for Production

```bash
npm run build
npm run start
```

## License

This project is provided for academic/assignment purposes.
