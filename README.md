# Tachyon Hub

A web application for managing game redeem codes with role-based access control.

## Features

- Discord OAuth authentication
- Redeem code management (create, edit, delete)
- API key generation for external integrations
- Role-based permissions (default, manager, admin)
- Account status management (active, suspended, banned)
- Dark mode support
- Responsive design

## Getting Started

### Prerequisites

- Bun or Nodejs
- Discord OAuth application
- [Backend API server](https://github.com/shio265/Tachyon/tree/non-docker)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

1. Create `.env` file:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_SUPPORT_URL=https://discord.gg/your-server
API_BASE_URL=http://localhost:4000
AUTH_KEY=your-auth-key
DEFAULT_API_KEY=your-default-api-key
```

1. Run the development server:

```bash
bun dev
```

1. Open <http://localhost:3000>

## User Roles

- **Default**: Can manage own redeem codes
- **Manager**: Can manage all redeem codes and view uploaders
- **Admin**: Full access including uploader management

## Project Structure

```strucs
app/
  api/           - API routes
  dashboard/     - Main dashboard page
  login/         - Login page
  terms-of-service/ - Terms of service
components/
  ui/            - Shadcn UI components
  auth-provider.tsx
  header.tsx
  codes-table.tsx
lib/
  types.ts       - TypeScript types
  utils.ts       - Utility functions
```
