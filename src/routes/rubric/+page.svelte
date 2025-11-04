<script lang="ts">
    import { onMount } from 'svelte';

    interface RubricCategory {
        name: string;
        items: {
            action: string;
            points: number;
            description?: string;
        }[];
    }

    const rubric: RubricCategory[] = [
        {
            name: "🚀 Project Contributions",
            items: [
                { action: "Create a new open source project", points: 100, description: "Start a new meaningful open source project" },
                { action: "Major feature contribution", points: 50, description: "Add a significant feature to an existing project" },
                { action: "Bug fix or minor feature", points: 25, description: "Fix bugs or add small improvements" },
                { action: "Documentation improvement", points: 15, description: "Improve project documentation or README" },
                { action: "Code review", points: 10, description: "Review and provide feedback on pull requests" },
            ]
        },
        {
            name: "📚 Learning & Sharing",
            items: [
                { action: "Write a technical blog post", points: 30, description: "Share knowledge through writing" },
                { action: "Create a tutorial or guide", points: 40, description: "Help others learn with detailed tutorials" },
                { action: "Give a presentation/talk", points: 50, description: "Present at meetups or conferences" },
                { action: "Host a workshop", points: 60, description: "Teach others through hands-on workshops" },
                { action: "Answer community questions", points: 5, description: "Help others in forums or chat" },
            ]
        },
        {
            name: "🤝 Community Engagement",
            items: [
                { action: "Attend a club meeting", points: 10, description: "Regular participation in club activities" },
                { action: "Help organize an event", points: 40, description: "Contribute to event planning and execution" },
                { action: "Mentor a club member", points: 30, description: "Guide and support fellow members" },
                { action: "Recruit new members", points: 20, description: "Help grow the community" },
                { action: "Collaborate on a project", points: 35, description: "Work together with other members" },
            ]
        },
        {
            name: "🏆 Achievements",
            items: [
                { action: "Win a hackathon", points: 100, description: "First place in a hackathon" },
                { action: "Hackathon participation", points: 40, description: "Participate and submit a project" },
                { action: "Complete a significant challenge", points: 50, description: "Finish a difficult technical challenge" },
                { action: "Project reaches 100 stars", points: 75, description: "Your project gains significant traction" },
                { action: "Contribute to major OS project", points: 80, description: "Contribute to well-known projects" },
            ]
        },
        {
            name: "💡 Innovation & Leadership",
            items: [
                { action: "Lead a club project", points: 60, description: "Take ownership of a club initiative" },
                { action: "Propose and implement new idea", points: 45, description: "Bring new ideas to life" },
                { action: "Create learning resources", points: 35, description: "Develop materials for the community" },
                { action: "Improve club infrastructure", points: 50, description: "Enhance club tools and systems" },
            ]
        },
        {
            name: "⚡ Bonus & Special",
            items: [
                { action: "Consistent monthly activity", points: 25, description: "Active participation throughout the month" },
                { action: "Exceptional contribution", points: 150, description: "Outstanding work deserving special recognition" },
                { action: "Help with club admin tasks", points: 20, description: "Support club operations" },
            ]
        }
    ];

    let totalPossible = 0;
    onMount(() => {
        totalPossible = rubric.reduce((sum, category) => 
            sum + category.items.reduce((catSum, item) => catSum + item.points, 0), 0
        );
    });
</script>

<svelte:head>
    <title>Reputation Rubric | Open Source Club</title>
</svelte:head>

<div class="flex flex-col items-center px-4 pb-16">
    <h1 class="text-4xl md:text-6xl mt-16 brown">Reputation Rubric</h1>
    
    <div class="flex md:text-lg mb-8">
        <a href="/" class="opacity-70 font-bold!">← Back to Leaderboard</a>
    </div>

    <div class="max-w-4xl w-full">
        <div class="bg border rounded-lg p-6 mb-6">
            <h2 class="text-2xl brown mb-3">How It Works</h2>
            <p class="text-lg mb-3">
                The <strong>Reputation System</strong> rewards active participation and contributions 
                to our open source community. Earn points by contributing code, sharing knowledge, 
                helping others, and engaging with the club.
            </p>
            <p class="text-lg">
                Your reputation reflects your impact and dedication to the community. Points are 
                awarded by club organizers based on the rubric below. Keep contributing and watch 
                your reputation grow! 🚀
            </p>
        </div>

        {#each rubric as category}
            <div class="bg border rounded-lg p-6 mb-4">
                <h3 class="text-2xl brown mb-4">{category.name}</h3>
                
                <div class="space-y-2">
                    {#each category.items as item}
                        <div class="border rounded-md p-4 bg-white/30">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-lg font-bold">{item.action}</span>
                                <span class="text-2xl text-blue-600 font-bold">+{item.points}</span>
                            </div>
                            {#if item.description}
                                <p class="text-sm opacity-80">{item.description}</p>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        {/each}

        <div class="bg border rounded-lg p-6 mt-8">
            <h3 class="text-2xl brown mb-3">📌 Important Notes</h3>
            <ul class="list-disc list-inside space-y-2 text-lg">
                <li>Points are awarded by club organizers after verification</li>
                <li>Quality over quantity - focus on meaningful contributions</li>
                <li>Multiple contributions can earn you more points</li>
                <li>Exceptional work may receive bonus points beyond the rubric</li>
                <li>Points can be deducted for violations of community guidelines</li>
            </ul>
        </div>

        <div class="bg border rounded-lg p-6 mt-4 text-center">
            <p class="text-xl brown">
                Ready to start earning reputation?
            </p>
            <a href="/" class="inline-block mt-3 bg-blue-400 px-6 py-2 rounded-md text-lg hover:bg-blue-500 transition-colors">
                View Leaderboard
            </a>
        </div>
    </div>
</div>

<style>
    .brown {
        color: #4a2d24;
    }
</style>
