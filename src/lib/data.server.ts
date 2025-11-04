import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_KEY } from '$env/static/private';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export interface Member {
	id: number;
	name: string;
	reputation: number;
	avatar_url: string | null;
	github_username: string | null;
	created_at: string;
	updated_at: string;
}

export interface ReputationHistory {
	id: number;
	member_id: number;
	points: number;
	reason: string;
	category: string;
	created_at: string;
}

export interface LeaderboardResponse {
	members: Member[];
	pages: number;
	total: number;
	timestamp: number;
}

let cache: {
	data: LeaderboardResponse | null;
	timestamp: number;
} = { data: null, timestamp: 0 };

export async function getLeaderboard(page: number = 1, pageSize: number = 10): Promise<LeaderboardResponse> {
	// 5 min cache for page 1
	if (page === 1 && cache.data && cache.timestamp > Date.now() - 1000 * 60 * 5) {
		console.log('cache hit');
		return cache.data;
	}

	const offset = (page - 1) * pageSize;

	// Get total count
	const { count } = await supabase
		.from('members')
		.select('*', { count: 'exact', head: true });

	// Get paginated members
	const { data: members, error } = await supabase
		.from('members')
		.select('*')
		.order('reputation', { ascending: false })
		.range(offset, offset + pageSize - 1);

	if (error) {
		console.error('Error fetching leaderboard:', error);
		if (cache.data) {
			console.log('Using cached data due to error');
			return cache.data;
		}
		throw error;
	}

	const response = {
		members: members || [],
		pages: Math.ceil((count || 0) / pageSize),
		total: count || 0,
		timestamp: Date.now()
	};

	if (page === 1) {
		cache = { data: response, timestamp: Date.now() };
	}

	return response;
}

export async function searchMembers(query: string, page: number = 1, pageSize: number = 10): Promise<LeaderboardResponse> {
	const offset = (page - 1) * pageSize;

	// Search by name
	const { data: members, error, count } = await supabase
		.from('members')
		.select('*', { count: 'exact' })
		.ilike('name', `%${query}%`)
		.order('reputation', { ascending: false })
		.range(offset, offset + pageSize - 1);

	if (error) {
		console.error('Error searching members:', error);
		throw error;
	}

	return {
		members: members || [],
		pages: Math.ceil((count || 0) / pageSize),
		total: count || 0,
		timestamp: Date.now()
	};
}

export async function getMemberHistory(memberId: number): Promise<ReputationHistory[]> {
	const { data, error } = await supabase
		.from('reputation_history')
		.select('*')
		.eq('member_id', memberId)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching member history:', error);
		throw error;
	}

	return data || [];
}

export async function getMemberByName(name: string): Promise<Member | null> {
	const { data, error } = await supabase
		.from('members')
		.select('*')
		.eq('name', name)
		.single();

	if (error) {
		if (error.code === 'PGRST116') {
			return null; // Not found
		}
		console.error('Error fetching member:', error);
		throw error;
	}

	return data;
}

export async function addReputation(
	name: string,
	points: number,
	reason: string,
	category: string
): Promise<{ success: boolean; message: string; new_reputation: number }> {
	const { data, error } = await supabase.rpc('add_reputation', {
		p_name: name,
		p_points: points,
		p_reason: reason,
		p_category: category
	});

	if (error) {
		console.error('Error adding reputation:', error);
		throw error;
	}

	return data[0];
}

export async function createMember(
	name: string,
	githubUsername?: string,
	avatarUrl?: string
): Promise<Member> {
	const { data, error } = await supabase
		.from('members')
		.insert({
			name,
			github_username: githubUsername,
			avatar_url: avatarUrl
		})
		.select()
		.single();

	if (error) {
		console.error('Error creating member:', error);
		throw error;
	}

	return data;
}

export async function updateMember(
	id: number,
	updates: Partial<Omit<Member, 'id' | 'created_at' | 'updated_at'>>
): Promise<Member> {
	const { data, error } = await supabase
		.from('members')
		.update(updates)
		.eq('id', id)
		.select()
		.single();

	if (error) {
		console.error('Error updating member:', error);
		throw error;
	}

	return data;
}