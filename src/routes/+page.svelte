<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    let data: {
        users: {
            id: number;
            name: string;
            reputation: number;
            avatar_url: string | null;
            github_username: string | null;
            history?: {
                points: number;
                reason: string;
                category: string;
                created_at: string;
            }[];
            rank?: number;
        }[];
        pages?: number;
        timestamp?: number;
        optedIn?: number;
    } = {
        users: [],
    };

    let page: number = 1;

    let hadSearchParam: boolean = false;
    let search: string = "";

    let popupData: {
        id: number;
        name: string;
        reputation: number;
        avatar_url: string | null;
        github_username: string | null;
        history?: {
            points: number;
            reason: string;
            category: string;
            created_at: string;
        }[];
    } | null = null;

    let loading: boolean = true;

    onMount(async () => {
        if (browser) {
            const urlParams = new URLSearchParams(window.location.search);

            const pageParam = urlParams.get("page");
            if (pageParam) {
                const parsedPage = parseInt(pageParam);
                if (!isNaN(parsedPage) && parsedPage > 0) {
                    page = parsedPage;
                }
            }

            search = urlParams.get("search") || "";

            if (search.trim()) {
                hadSearchParam = true;
            }
        }

        await fetchData();
    });

    async function fetchData() {
        try {
            let url = `/api/lb?page=${page}`;

            if (search.trim()) {
                url = `/api/search?search=${encodeURIComponent(search)}&page=${page}`;

                hadSearchParam = true;
            } else {
                hadSearchParam = false;
            }

            const response = await fetch(url);

            if (response.ok || (response.status === 404 && search.trim())) {
                data = await response.json();
                loading = false;
            } else {
                console.error("Failed to fetch leaderboard data");
                alert("Failed to fetch leaderboard data. Please try again later.");
            }
        } catch (error) {
            console.error("Error fetching leaderboard data:", error);
            alert("An error occurred while fetching leaderboard data. Please try again later.");
        }
    }

    async function fetchMemberHistory(memberId: number) {
        try {
            const response = await fetch(`/api/member/${memberId}/history`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error("Error fetching member history:", error);
        }
        return [];
    }

    let currentTime: number = new Date().getTime();

    setInterval(() => {
        currentTime = new Date().getTime();
    }, 1000);

    function generateTimeString(timestamp: number): string {
        const diff = currentTime - timestamp;
        if (diff < 60000) {
            return `${Math.floor(diff / 1000)} seconds ago`;
        } else if (diff < 3600000) {
            return `${(diff / 60000).toFixed(1)} minutes ago`;
        } else if (diff < 86400000) {
            return `${(diff / 3600000).toFixed(1)} hours ago`;
        } else {
            return `${(diff / 86400000).toFixed(1)} days ago`;
        }
    }
</script>

{#if loading}
    <div class="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
        <svg width="128" height="128" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" fill="#3b82f6"/>
            <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" fill="#3b82f6">
                <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/>
            </path>
        </svg>

        <p class="text-2xl text-white mt-4">Loading...</p>
    </div>
{:else}
    <div class="flex flex-col items-center px-2">
        <h1 class="text-4xl md:text-6xl mt-16 brown">Reputation Leaderboard</h1>
        <div class="flex md:text-lg">
            <a href="https://github.com/cyteon/som-lb" class="opacity-70 font-bold!">Source</a>
            <p class="brown opacity-40 mx-1">|</p>
            <a href="/rubric" class="opacity-70 font-bold!">View Rubric</a>
            <p class="brown opacity-40 mx-1">|</p>
            <p class="opacity-70 font-bold!">By <a href="https://cyteon.dev?utm_source=som-lb" class="font-bold!">Cyteon</a></p>
        </div>
        <div class="flex flex-col md:flex-row items-center">
            <div class="flex">
                <p class="opacity-70">
                    <span class="font-bold!">
                        {data.optedIn || 0}
                    </span> members found
                </p>
                <p class="brown opacity-40 mx-1">|</p>
                <p class="opacity-70">
                    {#if currentTime - (data.timestamp || 0) < 60000}
                        {
                            Math.floor((currentTime - (data.timestamp || 0)) / 1000)
                        } seconds ago
                    {:else}
                        {
                            ((currentTime- (data.timestamp || 0)) / 60000).toFixed(1)
                        } minutes ago
                    {/if}
                </p>
            </div>
        </div>


        <div class="mt-8 bg border rounded-md p-2 flex">
            <input 
                type="text" 
                placeholder="Search for a member..." 
                class="px-2 py-1 border rounded-md w-full focus:outline-none"
                bind:value={search}
            />

            <button 
                class="bg-blue-400 px-4 py-1 rounded-md ml-2 disabled:opacity-80"
                on:click={async () => {
                    if (browser) {
                        await fetchData();

                        window.history.pushState({}, "", `?page=1&search=${encodeURIComponent(search)}`);
                    }
                }}
                
                disabled={!(search.trim() || hadSearchParam)}
            >
                Search
            </button>
        </div>

        <div
            class="w-full md:w-1/2 mt-4 space-y-2" 
        >
            {#if data.users?.length > 0}
                {#each data.users as user, index}
                    <div 
                        class="flex p-2 px-4 border rounded-md bg"
                    >
                        <p class="text-2xl my-auto mr-4">#{
                            hadSearchParam ? 
                                user.rank : 
                                index + 1 + (page - 1) * 10   
                        }</p>
                        {#if user.avatar_url}
                            <img src={user.avatar_url} alt={user.name} class="my-auto size-12 md:size-16 rounded-md" />
                        {:else}
                            <div class="my-auto size-12 md:size-16 rounded-md bg-blue-400 flex items-center justify-center text-white text-2xl font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        {/if}
                        <button class="text-2xl my-auto ml-4 truncate max-w-2/5 hover:underline" on:click={async () => { 
                            const history = await fetchMemberHistory(user.id);
                            popupData = { ...user, history };
                        }}>{user.name}</button>

                        <div class="ml-auto my-auto flex">
                            <p class="text-2xl text-right font-bold text-blue-600">{user.reputation}</p>
                            <span class="ml-2 text-xl my-auto opacity-70">pts</span>
                        </div>
                    </div>
                {/each}
            {:else}
                <p class="text-lg text-center my-4">No members found.</p>
            {/if}
        </div>

        <div class="flex mt-4 mb-16 bg border rounded-md px-2">
            <button 
                class="text-lg my-auto mr-4 disabled:opacity-80 bg-blue-400 px-2 rounded-md"
                on:click={async () => {
                    if (page > 1) {
                        page--;

                        await fetchData();
                        window.history.pushState({}, "", `?page=${page}&search=${encodeURIComponent(search)}`);
                    }
                }}
                disabled={page <= 1}
            >
                &lt; Back
            </button>
            <p class="text-xl my-2">{page} / {data.pages || 1}</p>
            <button 
                class="text-lg my-auto ml-4 disabled:opacity-80 bg-blue-400 px-2 rounded-md" 
                on:click={async () => {
                    if (page < data.pages!) {
                        page++;
                        
                        await fetchData();
                        window.history.pushState({}, "", `?page=${page}&search=${encodeURIComponent(search)}`);
                    }
                }}
                disabled={page >= data.pages!}
            >
                Next &gt;
            </button>
        </div>
    </div>
{/if}

{#if popupData}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2">
        <div class="flex flex-col p-2 px-4 border rounded-md bg w-full md:w-1/2 max-h-3/4">
            <h1 class="text-3xl flex items-center">
                {#if popupData.avatar_url}
                    <img src={popupData.avatar_url} alt={popupData.name} class="size-12 rounded-md mr-3" />
                {:else}
                    <div class="size-12 rounded-md bg-blue-400 flex items-center justify-center text-white text-xl font-bold mr-3">
                        {popupData.name.charAt(0).toUpperCase()}
                    </div>
                {/if}
                {popupData.name} 
                <button class="ml-auto text-3xl" on:click={() => { popupData = null }}>&times;</button>
            </h1>
            <p class="text-lg">Reputation: <span class="font-bold text-blue-600">{popupData.reputation} points</span></p>
            {#if popupData.github_username}
                <p class="text-lg">
                    GitHub: <a href="https://github.com/{popupData.github_username}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                        @{popupData.github_username}
                    </a>
                </p>
            {/if}

            <h2 class="text-2xl mt-4">Reputation History:</h2>

            <div class="border rounded-sm mt-2 max-h-96 overflow-y-auto">
                {#if popupData.history && popupData.history.length > 0}
                    <table class="w-full">
                        <thead>
                            <tr>
                                <th class="text-left py-1 px-2 border-r">Points</th>
                                <th class="text-left py-1 px-2 border-r">Category</th>
                                <th class="text-left py-1 px-2 border-r">Reason</th>
                                <th class="text-left py-1 px-2">Time</th>
                            </tr>
                        </thead>
                        <tbody class="md:text-lg">
                            {#each popupData.history as entry}
                                <tr>
                                    <td class={"px-2 border-r border-t font-bold " + (entry.points > 0 ? "text-green-700" : "text-red-700")}>
                                        {entry.points > 0 ? "+" : ""}{entry.points}
                                    </td>
                                    <td class="border border-b-0 px-2">
                                        {entry.category}
                                    </td>
                                    <td class="border border-b-0 px-2">
                                        {entry.reason}
                                    </td>
                                    <td class="border border-b-0 border-r-0 px-2">{generateTimeString(new Date(entry.created_at).getTime())}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {:else}
                    <p class="text-center py-4 opacity-70">No reputation history yet.</p>
                {/if}
            </div>
        </div>
    </div>
{/if}