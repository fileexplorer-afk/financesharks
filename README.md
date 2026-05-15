# FinanceSharks 🦈

Full-stack personal finance management app with real-time portfolio tracking, AI-powered insights, and family collaboration.

**Stack:** React 19 + TypeScript + Tailwind CSS 4 (frontend) · ASP.NET Core 10 + EF Core + PostgreSQL (backend) · Supabase (database)

---

## Project Structure

```
financesharks/
├── frontend/                     # React app
│   ├── src/                      # Source code
│   ├── public/                   # Static assets
│   ├── .env                      # Frontend env vars (gitignored)
│   ├── .env.example              # Example env vars
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   └── Financesharks.Api/        # .NET Web API
│       ├── Controllers/          # API endpoints
│       ├── Models/               # Domain entities
│       ├── Data/                 # EF Core DbContext + migrations
│       ├── DTOs/                 # Request/response models
│       ├── Services/             # Business logic
│       ├── Auth/                 # JWT + password hashing
│       └── Middleware/           # Error handling, rate limiting, security
├── .gitignore
├── plan.txt                      # Full implementation plan
└── README.md
```

---

## Prerequisites

- **Node.js** >= 20
- **.NET SDK** >= 10.0
- **PostgreSQL** (Supabase or local)
- **VS Code** with recommended extensions:
  - REST Client (for testing APIs via `backend/test-api.http`)

---

## Setup

### 1. Clone & install dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend/Financesharks.Api
dotnet restore
```

### 2. Configure database (Supabase)

Create a free Supabase project at https://supabase.com, then:

```bash
# Move secrets out of config files
cd backend/Financesharks.Api
dotnet user-secrets init

# Set your Supabase connection string
dotnet user-secrets set "ConnectionStrings:Supabase" "Host=YOUR_HOST;Port=6543;Database=postgres;Username=postgres.YOUR_PROJECT;Password=YOUR_PASSWORD;SSL Mode=Prefer;Command Timeout=120;Pooling=true;Maximum Pool Size=5"

# Set a strong JWT secret (min 32 characters)
dotnet user-secrets set "JwtSettings:Secret" "YOUR_32_CHAR_MIN_SECRET_KEY"
```

**Or use environment variables instead of user-secrets:**
```bash
# PowerShell
$env:ConnectionStrings__Supabase = "Host=..."
$env:JwtSettings__Secret = "..."

# CMD
set ConnectionStrings:Supabase=Host=...
set JwtSettings:Secret=...
```

### 3. Run database migrations

Option A — Via EF Core (requires active database):
```bash
dotnet ef database update
```

Option B — Via SQL script (paste in Supabase SQL Editor):
```
backend/migration.sql
```

### 4. Set up frontend env

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env` if needed:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Running

### Start the backend (Terminal 1)

```bash
cd backend/Financesharks.Api
dotnet run --launch-profile http
```

API runs on `http://localhost:5000`

### Start the frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Testing the API

### Using Postman

1. `POST http://localhost:5000/api/auth/register`
```json
{ "email": "demo@test.com", "name": "Demo", "password": "Demo@1234" }
```

2. `POST http://localhost:5000/api/auth/login`
```json
{ "email": "demo@test.com", "password": "Demo@1234" }
```

3. Copy the `accessToken` from the response
4. Use it as `Authorization: Bearer <token>` for all other endpoints

### Using VS Code REST Client

Open `backend/test-api.http` and click "Send Request" above each endpoint.

### Available endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/refresh` | No | Refresh JWT |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/dashboard/summary` | Yes | Dashboard overview |
| GET | `/api/accounts` | Yes | List accounts |
| POST | `/api/accounts` | Yes | Create account |
| GET | `/api/transactions` | Yes | List transactions |
| POST | `/api/transactions` | Yes | Create transaction |
| GET | `/api/goals` | Yes | List goals |
| POST | `/api/goals` | Yes | Create goal |
| GET | `/api/holdings` | Yes | List holdings |
| GET | `/api/portfolio/summary` | Yes | Portfolio overview |
| GET | `/api/reports/net-worth` | Yes | Net worth report |
| GET | `/api/reports/spending-by-category` | Yes | Spending breakdown |
| GET | `/api/reports/income-vs-expense` | Yes | Monthly income vs expense |
| GET | `/api/profile` | Yes | Get profile |
| PUT | `/api/profile` | Yes | Update profile |
| PUT | `/api/profile/password` | Yes | Change password |
| GET | `/api/family/members` | Yes | List family members |
| POST | `/api/family/invite` | Yes | Invite member |
| GET | `/api/insights/tips` | Yes | Spending tips |
| GET | `/api/insights/market` | Yes | Market insights |
| GET | `/api/insights/health` | Yes | Portfolio health |

---

## Security

- **Secrets never committed**: Database passwords, JWT secrets, and API keys are stored in `.NET User Secrets` (development) or environment variables (production). See `appsettings.Example.json` for the required config shape.
- **JWT auth**: Access tokens expire in 15 minutes. Refresh tokens rotate (old one revoked on refresh). Passwords hashed with BCrypt (work factor 12).
- **Rate limiting**: Auth endpoints limited to 60 requests per minute per IP. General API rate limiting configured via middleware.
- **Input validation**: All inputs validated server-side. Password requires uppercase, lowercase, number, and special character (min 8 chars).
- **Security headers**: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy set on every response.
- **Error handling**: Exception middleware returns generic messages in production. Stack traces exposed only in development.
- **CORS**: Restricted to known frontend origins (`localhost:5173`, `localhost:3000`).

---

## Deploying to GitHub

```bash
# The .gitignore already excludes secrets, build artifacts, and IDE files
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USER/financesharks.git
git push -u origin main
```

**Before pushing, verify** no secrets are tracked:
```bash
git status  # Check for .env, appsettings.Development.json, etc.
```

For production deployment, set environment variables on your hosting platform (Azure, Railway, Render, etc.) instead of using user-secrets. Required env vars:
- `ConnectionStrings__Supabase`
- `JwtSettings__Secret`
- `JwtSettings__Issuer`
- `JwtSettings__Audience`

---

## Possible issues

### Port 5000 already in use
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database connection hangs (Supabase free tier)
Free tier Supabase goes to sleep. Wake it up in the Supabase dashboard or use the SQL Editor for manual queries.
