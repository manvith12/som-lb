import { json } from '@sveltejs/kit';
import { addReputation, createMember } from '$lib/data.server';
import type { RequestHandler } from './$types';

// POST /api/reputation - Add reputation points to a member
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, points, reason, category, apiKey } = await request.json();

		// Simple API key check (you should set this in your .env file)
		const validApiKey = process.env.ADMIN_API_KEY || 'change-me-in-production';
		
		if (!apiKey || apiKey !== validApiKey) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		if (!name || points === undefined || !reason || !category) {
			return json(
				{ error: 'Missing required fields: name, points, reason, category' },
				{ status: 400 }
			);
		}

		const result = await addReputation(name, points, reason, category);

		return json(result);
	} catch (error) {
		console.error('Error adding reputation:', error);
		return json({ error: 'Failed to add reputation' }, { status: 500 });
	}
};

// PUT /api/reputation - Create a new member
export const PUT: RequestHandler = async ({ request }) => {
	try {
		const { name, githubUsername, avatarUrl, apiKey } = await request.json();

		const validApiKey = process.env.ADMIN_API_KEY || 'change-me-in-production';
		
		if (!apiKey || apiKey !== validApiKey) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		if (!name) {
			return json({ error: 'Missing required field: name' }, { status: 400 });
		}

		const member = await createMember(name, githubUsername, avatarUrl);

		return json(member);
	} catch (error) {
		console.error('Error creating member:', error);
		return json({ error: 'Failed to create member' }, { status: 500 });
	}
};
