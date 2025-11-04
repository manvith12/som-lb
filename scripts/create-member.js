#!/usr/bin/env node

/**
 * CLI Tool for creating new members
 * 
 * Usage:
 *   node scripts/create-member.js <name> [githubUsername] [avatarUrl]
 * 
 * Example:
 *   node scripts/create-member.js "Alice" "alice" "https://github.com/alice.png"
 */

import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
const API_URL = process.env.API_URL || 'http://localhost:5173';

if (!SUPABASE_URL || !ADMIN_API_KEY) {
	console.error('Error: Missing environment variables');
	console.error('Please set SUPABASE_URL and ADMIN_API_KEY in your .env file');
	process.exit(1);
}

const args = process.argv.slice(2);

if (args.length < 1) {
	console.log(`
Usage: node scripts/create-member.js <name> [githubUsername] [avatarUrl]

Arguments:
  name           - Member name (required)
  githubUsername - GitHub username (optional)
  avatarUrl      - Avatar image URL (optional)

Examples:
  node scripts/create-member.js "Alice"
  node scripts/create-member.js "Bob" "bob"
  node scripts/create-member.js "Charlie" "charlie" "https://avatars.githubusercontent.com/u/12345"
	`);
	process.exit(0);
}

const [name, githubUsername, avatarUrl] = args;

async function createMember() {
	try {
		const response = await fetch(`${API_URL}/api/reputation`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				githubUsername,
				avatarUrl,
				apiKey: ADMIN_API_KEY,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			console.error('Error:', data.error || 'Failed to create member');
			process.exit(1);
		}

		console.log('✅ Member created successfully!');
		console.log(`   Name: ${data.name}`);
		console.log(`   ID: ${data.id}`);
		console.log(`   Reputation: ${data.reputation} points`);
		if (data.github_username) {
			console.log(`   GitHub: @${data.github_username}`);
		}
	} catch (error) {
		console.error('Error:', error.message);
		process.exit(1);
	}
}

createMember();
