#!/usr/bin/env node

/**
 * CLI Tool for managing reputation points
 * 
 * Usage:
 *   node scripts/add-reputation.js <name> <points> <reason> <category>
 * 
 * Example:
 *   node scripts/add-reputation.js "Alice" 50 "Fixed critical bug in authentication" "Project Contributions"
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

if (args.length < 4) {
	console.log(`
Usage: node scripts/add-reputation.js <name> <points> <reason> <category>

Arguments:
  name      - Member name (will be created if doesn't exist)
  points    - Number of points to add (can be negative)
  reason    - Explanation for the points
  category  - Category (e.g., "Project Contributions", "Community Engagement")

Examples:
  node scripts/add-reputation.js "Alice" 50 "Fixed critical bug" "Project Contributions"
  node scripts/add-reputation.js "Bob" -10 "Spam violation" "Penalty"
  node scripts/add-reputation.js "Charlie" 100 "Won hackathon" "Achievements"

Categories from rubric:
  - Project Contributions
  - Learning & Sharing
  - Community Engagement
  - Achievements
  - Innovation & Leadership
  - Bonus & Special
  - Penalty (for deductions)
	`);
	process.exit(0);
}

const [name, pointsStr, reason, category] = args;
const points = parseInt(pointsStr);

if (isNaN(points)) {
	console.error('Error: Points must be a valid number');
	process.exit(1);
}

async function addReputation() {
	try {
		const response = await fetch(`${API_URL}/api/reputation`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				points,
				reason,
				category,
				apiKey: ADMIN_API_KEY,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			console.error('Error:', data.error || 'Failed to add reputation');
			process.exit(1);
		}

		if (data.success) {
			console.log('✅ Success!');
			console.log(`   Member: ${name}`);
			console.log(`   Points ${points > 0 ? 'added' : 'deducted'}: ${points > 0 ? '+' : ''}${points}`);
			console.log(`   New total: ${data.new_reputation} points`);
			console.log(`   Reason: ${reason}`);
			console.log(`   Category: ${category}`);
		} else {
			console.error('Error:', data.message);
			process.exit(1);
		}
	} catch (error) {
		console.error('Error:', error.message);
		process.exit(1);
	}
}

addReputation();
