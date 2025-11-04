import { searchMembers, getLeaderboard } from "$lib/data.server.js";
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const { searchParams } = url;
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";

  if (!search) {
    return json(
      {
        error: "Search query is required",
      },
      { status: 400 },
    );
  }

  try {
    const data = await searchMembers(search, page, 10);

    if (data.members.length === 0) {
      return json(
        {
          error: "No members found",
          users: [],
          pages: 0,
          timestamp: data.timestamp,
          optedIn: 0,
        },
        { status: 404 },
      );
    }

    // Get full leaderboard to calculate ranks
    const fullData = await getLeaderboard(1, 1000);
    const rankedMembers = data.members.map((member) => ({
      ...member,
      rank: fullData.members.findIndex((m) => m.id === member.id) + 1,
    }));

    return json({
      users: rankedMembers,
      pages: data.pages,
      timestamp: data.timestamp,
      optedIn: data.total,
    });
  } catch (error) {
    console.error('Error in search endpoint:', error);
    return json({ error: 'Failed to search members' }, { status: 500 });
  }
};
