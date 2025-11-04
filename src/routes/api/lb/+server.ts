import { getLeaderboard } from "$lib/data.server.js";
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get("page") || "1");

  try {
    const data = await getLeaderboard(page, 10);

    return json({
      users: data.members,
      pages: data.pages,
      timestamp: data.timestamp,
      optedIn: data.total,
    });
  } catch (error) {
    console.error('Error in leaderboard endpoint:', error);
    return json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
