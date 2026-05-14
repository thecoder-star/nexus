
const grid = document.getElementById('game-grid');
const search = document.getElementById('gameSearch');
const status = document.getElementById('status-text');

let allGames = [];

async function init() {
    try {
        // Checking for window.games from the CDN script
        if (window.games) {
            processData(window.games);
        } else {
            // Fallback: Fetch manually if global variable isn't set
            const res = await fetch('https://cdn.jsdelivr.net/gh/bubbls/ugs-singlefile@main/games.js');
            const text = await res.text();
            const clean = text.replace(/^(var|let|const)\s+\w+\s+=\s+/, '').replace(/;$/, '');
            processData(JSON.parse(clean));
        }
    } catch (e) {
        status.innerText = "Error loading system data.";
        console.error(e);
    }
}

function processData(data) {
    // Standardize structure
    if (Array.isArray(data)) allGames = data;
    else if (data.games) allGames = data.games;
    else allGames = Object.entries(data).map(([n, u]) => ({name: n, url: u}));

    render(allGames);
    status.style.display = 'none';
}

function render(list) {
    grid.innerHTML = '';
    list.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        
        const thumb = game.image || `https://placehold.co/400x400/1a1a1a/ffffff?text=${encodeURIComponent(game.name[0])}`;
        
        card.innerHTML = `
            <img src="${thumb}" loading="lazy">
            <h3>${game.name}</h3>
        `;

        card.onclick = () => {
            // "Apple style" launch: Simple, clean new tab
            window.open(game.url, '_blank');
        };

        grid.appendChild(card);
    });
}

// Search filtering logic
search.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allGames.filter(g => g.name.toLowerCase().includes(term));
    render(filtered);
});

window.onload = init;
