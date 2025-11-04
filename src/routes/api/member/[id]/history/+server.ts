import { json } from '@sveltejs/kit';
import { getMemberHistory } from '$lib/data.server';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const memberId = parseInt(params.id);
		
		if (isNaN(memberId)) {
			return json({ error: 'Invalid member ID' }, { status: 400 });
		}

		const history = await getMemberHistory(memberId);

		return json(history);
	} catch (error) {
		console.error('Error fetching member history:', error);
		return json({ error: 'Failed to fetch member history' }, { status: 500 });
	}
};
