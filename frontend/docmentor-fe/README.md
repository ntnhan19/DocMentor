# DocMentor Frontend

The DocMentor frontend is a React + TypeScript application built with Vite. It provides the user interface for document-based chat, document management, AI analysis, dashboards, authentication, guest access, and administration.

## Technology Stack

- React 19
- TypeScript 5.9
- Vite with `rolldown-vite`
- React Router DOM 7
- Tailwind CSS
- Axios
- Fetch streaming for SSE responses
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Framer Motion
- Recharts
- React PDF / pdf.js
- Mammoth
- React Dropzone
- Lucide React and React Icons

## Installation

```bash
cd frontend/docmentor-fe
npm install
```

## Environment Variables

Create a `.env` file in `frontend/docmentor-fe/`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

`VITE_API_BASE_URL` is used as the backend base URL. If it is not provided, the application falls back to `http://localhost:8000`.

## Running Locally

```bash
npm run dev
```

The application runs at `http://localhost:5173` by default.

## Available Scripts

```bash
npm run dev          # Start the development server
npm run build        # Run TypeScript compilation and create a production build
npm run preview      # Preview the production build locally
npm run lint         # Run ESLint
npm run format       # Format source files with Prettier
npm run type-check   # Run TypeScript checks without building
```

## Directory Structure

```text
src/
|-- main.tsx                         # React entry point
|-- index.css                        # Global styles and Tailwind imports
|-- app/
|   |-- App.tsx                      # Root application component
|   |-- providers/
|       |-- AuthProvider.tsx         # Authentication provider
|       |-- BreadcrumbProvider.tsx
|-- routes/
|   |-- index.tsx                    # React Router configuration
|   |-- PrivateRoute.tsx             # Protected user routes
|-- pages/
|   |-- auth/                        # Login, register, forgot/reset password
|   |-- public/                      # Public and 404 pages
|   |-- user/                        # Chat, documents, dashboard, settings
|   |-- admin/                       # Admin dashboard/settings/logs
|-- components/
|   |-- common/                      # Button, Card, Input, Avatar, Pagination
|   |-- layout/                      # Guest/User/Auth layouts, Header, Sidebar
|   |-- dashboard/                   # Dashboard widgets
|   |-- admin/                       # Admin chart/stat components
|-- features/
|   |-- auth/                        # Authentication forms and Google OAuth button
|   |-- chat/                        # Chat UI, messages, sidebars, analysis viewers
|   |-- documents/                   # Upload, grid/list, filtering, viewer
|   |-- dashboard/                   # User/admin dashboard widgets
|   |-- homepage/                    # Homepage sections
|-- services/
|   |-- api/                         # apiClient, query/document/admin API services
|   |-- auth/                        # Authentication service
|   |-- chat/                        # Chat service
|   |-- document/                    # Document service
|   |-- dashboard/                   # Dashboard service
|   |-- analysis/                    # Analysis service
|   |-- admin/                       # Admin analytics/services
|-- hooks/
|   |-- api/                         # Query, mutation, pagination, infinite scroll hooks
|   |-- common/                      # Local storage, debounce, media query, etc.
|   |-- features/                    # useAuth, useChat, useDocuments, upload hooks
|-- store/
|   |-- useDocumentStore.ts          # Zustand document state
|-- types/                           # TypeScript interfaces and model types
|-- utils/                           # Constants, validators, helpers, formatters
```

## Routing

Routes are defined in `src/routes/index.tsx`.

| Route | Layout | Purpose |
| --- | --- | --- |
| `/` | `GuestLayout` | Guest chat landing experience |
| `/chat` | `GuestLayout` | Guest chat |
| `/chat/:conversationId` | `GuestLayout` | Guest chat with conversation parameter |
| `/login` | none | Login page |
| `/register` | none | Registration page |
| `/user` | `PrivateRoute` + `UserLayout` | Redirects to `/user/chat` |
| `/user/dashboard` | `UserLayout` | User dashboard |
| `/user/documents` | `UserLayout` | Document management |
| `/user/documents/:documentId` | `UserLayout` | Document detail page |
| `/user/chat/:conversationId?` | `UserLayout` | Authenticated user chat |
| `/user/settings` | `UserLayout` | User settings |
| `/admin` | `AdminLayout` | Redirects to `/admin/dashboard` |
| `/admin/dashboard` | `AdminLayout` | Admin dashboard |
| `*` | none | Not found page |

## API Integration

The frontend communicates with the backend through Axios and Fetch:

- `services/api/apiClient.ts`: shared Axios instance using `VITE_API_BASE_URL` and attaching the auth token from storage.
- `services/api/queryApiService.ts`: RAG requests, streaming responses, query history, feedback, and query statistics.
- `services/api/documentApiService.ts`: upload, list, detail, update, delete, download, and folder operations.
- `services/auth/authService.ts`: login, registration, Google OAuth, and current user data.
- `services/analysis/analysisService.ts`: summary, concepts, and quiz APIs.
- `services/admin/*`: admin analytics and admin services.
- `services/dashboard/dashboardService.ts`: user dashboard data.

Authentication tokens are stored in `localStorage` or `sessionStorage` using the key `auth_token`.

## Main UI Capabilities

### Chat

- Guest and authenticated chat modes.
- Document selection before asking questions.
- RAG requests to `/query/`.
- Streaming answer rendering.
- Message list, suggested questions, conversation sidebar, and selected-document sidebar.
- Source citation display from backend responses.
- Summary and quiz viewers for AI analysis results.

### Documents

- Drag-and-drop file upload.
- List and grid views.
- Search, filtering, quick preview, and detail view.
- Folder organization.
- PDF, DOCX, and TXT viewing in the browser.
- Processing-status display.

### Dashboard

- Quick statistics.
- Recent documents.
- Recent queries.
- Weekly activity.
- Document type distribution.
- Processing status.

### Authentication

- Email/password login.
- Account registration.
- Google OAuth.
- Forgot/reset password UI.
- Protected routes for the `/user` area.

### Administration

- Dedicated admin layout.
- Admin dashboard.
- Chart and statistics components.

## Production Build

```bash
npm run build
```

The production output is generated in `dist/`.

Preview the production build locally:

```bash
npm run preview
```

## Deployment

The project includes `vercel.json` for SPA routing on Vercel. Configure the following variables in the deployment environment:

```env
VITE_API_BASE_URL=https://your-backend-domain
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Development Notes

- Update the relevant service in `src/services` whenever backend endpoints change.
- Add new routes in `src/routes/index.tsx` and update layout/sidebar navigation where appropriate.
- Define shared API types in `src/types` when they are reused across multiple modules.
- Do not commit `.env` files.
- Run `npm run type-check` and `npm run build` before deployment.
