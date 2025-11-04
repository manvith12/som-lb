# Open Source Club Reputation Leaderboard

A reputation-based leaderboard system for tracking contributions and engagement in an open source club. Members earn reputation points for various activities like contributing code, sharing knowledge, participating in events, and helping others.

## Features

- 🏆 **Reputation-based ranking** - Track member contributions with a point system
- 📊 **Detailed history** - View complete reputation history for each member
- 📚 **Clear rubric** - Transparent point system with predefined categories
- 🔍 **Search functionality** - Find members quickly
- 🎨 **Beautiful UI** - Clean, themed interface
- 🔧 **Easy management** - CLI tools for adding points and managing members
- ⚡ **Fast & cached** - Supabase backend with intelligent caching

## Setup

### 1. Prerequisites

- Node.js 18+
- A Supabase account and project

### 2. Database Setup

1. Go to your Supabase project: https://pyaheqkbmytxbbksuakp.supabase.co
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the SQL to create tables, indexes, policies, and functions

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
SUPABASE_URL=https://pyaheqkbmytxbbksuakp.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
ADMIN_API_KEY=your-secret-admin-api-key

PUBLIC_PLAUSIBLE_ENABLED=false
PUBLIC_PLAUSIBLE_HOST=https://plausible.io
PUBLIC_SITE_DOMAIN=example.com
```

**Important:**
- `SUPABASE_SERVICE_KEY` - Get this from Supabase Dashboard → Settings → API → service_role key (keep secret!)
- `ADMIN_API_KEY` - Create a strong random string for API authentication

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:5173 to see the leaderboard!

## Managing Reputation

### Add Reputation Points

Use the CLI to award or deduct points:

```bash
npm run add-rep "Member Name" <points> "Reason" "Category"
```

**Examples:**

```bash
# Award 50 points for a bug fix
npm run add-rep "Alice" 50 "Fixed authentication bug" "Project Contributions"

# Award 100 points for winning a hackathon
npm run add-rep "Bob" 100 "Won HackXYZ 2025" "Achievements"

# Deduct 10 points for a violation
npm run add-rep "Charlie" -10 "Spam in chat" "Penalty"
```

### Create New Members

```bash
npm run create-member "Member Name" [githubUsername] [avatarUrl]
```

**Examples:**

```bash
npm run create-member "Alice"
npm run create-member "Bob" "bob"
npm run create-member "Charlie" "charlie" "https://github.com/charlie.png"
```

### Categories

Based on the rubric at `/rubric`:

- **Project Contributions** - Code, bug fixes, features, documentation
- **Learning & Sharing** - Blog posts, tutorials, presentations, workshops
- **Community Engagement** - Meetings, events, mentoring, collaboration
- **Achievements** - Hackathons, challenges, project milestones
- **Innovation & Leadership** - Leading projects, implementing ideas
- **Bonus & Special** - Exceptional contributions, consistent activity
- **Penalty** - For deductions

## API Endpoints

### Public Endpoints

- `GET /api/lb?page=1` - Get leaderboard (paginated, 10 per page)
- `GET /api/search?search=alice&page=1` - Search members
- `GET /api/member/:id/history` - Get member's reputation history

### Protected Endpoints (Require API Key)

- `POST /api/reputation` - Add reputation points
- `PUT /api/reputation` - Create new member

## Project Structure

```
├── src/
│   ├── lib/
│   │   └── data.server.ts       # Supabase data functions
│   ├── routes/
│   │   ├── +page.svelte         # Main leaderboard page
│   │   ├── rubric/
│   │   │   └── +page.svelte     # Rubric page
│   │   └── api/
│   │       ├── lb/+server.ts    # Leaderboard API
│   │       ├── search/+server.ts # Search API
│   │       ├── reputation/+server.ts # Reputation management API
│   │       └── member/[id]/history/+server.ts # Member history API
├── scripts/
│   ├── add-reputation.js        # CLI tool for adding points
│   ├── create-member.js         # CLI tool for creating members
│   └── README.md                # Scripts documentation
├── supabase-setup.sql           # Database schema and setup
└── .env.example                 # Environment variables template
```

## Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cyteon/som-lb)

**See `DEPLOYMENT.md` for complete deployment guide.**

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy

This project is optimized for Vercel deployment with the Vercel adapter.

**Quick deployment:**
```bash
npm run deploy
```

**Other platforms:**
- Vercel (recommended)
- Netlify
- Railway
- Your own VPS (change adapter to `@sveltejs/adapter-node`)

Make sure to set the environment variables in your hosting platform.

**Required Environment Variables for Production:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `ADMIN_API_KEY`

See `DEPLOYMENT.md` and `PRODUCTION_CHECKLIST.md` for detailed instructions.

## Database Schema

### `members` Table

- `id` - Unique identifier
- `name` - Member name (unique)
- `reputation` - Current reputation points
- `avatar_url` - Profile image URL
- `github_username` - GitHub handle
- `created_at` - Account creation timestamp
- `updated_at` - Last modification timestamp

### `reputation_history` Table

- `id` - Unique identifier
- `member_id` - Reference to member
- `points` - Points added/deducted
- `reason` - Explanation for the change
- `category` - Category from rubric
- `created_at` - Timestamp of change

## Security

- Row Level Security (RLS) enabled on all tables
- Public read access, protected write access
- API key authentication for management endpoints
- Service role key kept server-side only

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

Built by [Cyteon](https://cyteon.dev) for open source clubs everywhere.

Original template based on Summer of Making leaderboard.

