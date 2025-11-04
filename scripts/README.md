# Reputation Management Scripts

This directory contains CLI tools for managing the reputation leaderboard.

## Setup

Make sure you have set up your `.env` file with:

```bash
SUPABASE_URL=https://pyaheqkbmytxbbksuakp.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
ADMIN_API_KEY=your-secret-admin-api-key
```

## Scripts

### Add Reputation Points

Add or deduct reputation points from a member:

```bash
npm run add-rep <name> <points> <reason> <category>
```

**Examples:**

```bash
# Add 50 points for a bug fix
npm run add-rep "Alice" 50 "Fixed critical authentication bug" "Project Contributions"

# Add 100 points for winning a hackathon
npm run add-rep "Bob" 100 "Won HackXYZ 2025" "Achievements"

# Add 30 points for writing a blog post
npm run add-rep "Charlie" 30 "Wrote tutorial on React hooks" "Learning & Sharing"

# Deduct 10 points for a violation
npm run add-rep "Dave" -10 "Spam in community chat" "Penalty"
```

**Categories from the rubric:**
- `Project Contributions` - For code contributions, bug fixes, features
- `Learning & Sharing` - For blog posts, tutorials, presentations
- `Community Engagement` - For attending meetings, helping others, organizing events
- `Achievements` - For hackathon wins, project milestones
- `Innovation & Leadership` - For leading projects, implementing new ideas
- `Bonus & Special` - For exceptional contributions, monthly activity
- `Penalty` - For deductions

### Create a New Member

Create a new member in the leaderboard:

```bash
npm run create-member <name> [githubUsername] [avatarUrl]
```

**Examples:**

```bash
# Create a basic member
npm run create-member "Alice"

# Create a member with GitHub username
npm run create-member "Bob" "bob"

# Create a member with GitHub and avatar
npm run create-member "Charlie" "charlie" "https://avatars.githubusercontent.com/u/12345"
```

## Points Reference

Quick reference from the rubric:

### Project Contributions
- New open source project: 100
- Major feature: 50
- Bug fix/minor feature: 25
- Documentation: 15
- Code review: 10

### Learning & Sharing
- Workshop: 60
- Presentation/talk: 50
- Tutorial/guide: 40
- Blog post: 30
- Answer questions: 5

### Community Engagement
- Organize event: 40
- Collaborate on project: 35
- Mentor member: 30
- Recruit new member: 20
- Attend meeting: 10

### Achievements
- Win hackathon: 100
- Contribute to major OS project: 80
- Project reaches 100 stars: 75
- Complete challenge: 50
- Hackathon participation: 40

See the full rubric at `/rubric` on the website.
