// ─── State ───
let players = JSON.parse(localStorage.getItem("players") || "[]");
let games = JSON.parse(localStorage.getItem("games") || "[]");

let activeGameId = null;
let activePlayer = null;
let toastTimer = null;

// ─── Theme ───
function initTheme() {
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
    ).matches;
    const isDark =
        theme === "dark" || (!theme && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
    updateThemeIcons(isDark);
}

function toggleDarkMode() {
    const isDark =
        document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcons(isDark);
}

function updateThemeIcons(isDark) {
    document.getElementById("theme-icon-light").classList.toggle("hidden", !isDark);
    document.getElementById("theme-icon-dark").classList.toggle("hidden", isDark);
}

initTheme();

// ─── Toast ───
function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    const colors = {
        success:
            "bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200/50 dark:border-emerald-700/30 text-emerald-700 dark:text-emerald-300",
        error:
            "bg-red-50 dark:bg-red-900/40 border-red-200/50 dark:border-red-700/30 text-red-600 dark:text-red-300",
        info:
            "bg-stone-50 dark:bg-stone-800/60 border-stone-200/50 dark:border-stone-700/30 text-stone-600 dark:text-stone-300",
    };
    const icons = {
        success: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`,
        error: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>`,
        info: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    };

    toast.className = `pointer-events-auto animate-toast-in flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-sm font-medium shadow-lg backdrop-blur-md ${colors[type] || colors.info}`;
    toast.innerHTML =
        (icons[type] || icons.info) +
        `<span>${message}</span>`;
    container.appendChild(toast);

    clearTimeout(toastTimer);
    setTimeout(() => {
        toast.classList.remove("animate-toast-in");
        toast.classList.add("animate-toast-out");
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}

// ─── LocalStorage ───
function saveData() {
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("games", JSON.stringify(games));
}

// ─── Helpers ───
function getNextGameTitle() {
    const nums = games
        .map((g) => {
            const m = g.name.match(/Game (\d+)/);
            return m ? parseInt(m[1]) : 0;
        })
        .filter((n) => !isNaN(n));
    return `Game ${(nums.length ? Math.max(...nums) : 0) + 1}`;
}

// ─── Modals: New Game ───
function openAddGameModal() {
    document.getElementById("gameName").value = getNextGameTitle();
    renderPlayerSelection();
    document.getElementById("addGameModal").classList.remove("hidden");
    document.getElementById("addGameModal").classList.add("flex");
    setTimeout(() => document.getElementById("gameName")?.focus(), 100);
}

function closeAddGameModal() {
    document.getElementById("addGameModal").classList.add("hidden");
    document.getElementById("addGameModal").classList.remove("flex");
}

// ─── Modals: Add Player ───
function openAddPlayerModal() {
    renderPlayers();
    document.getElementById("addPlayerModal").classList.remove("hidden");
    document.getElementById("addPlayerModal").classList.add("flex");
    setTimeout(() => document.getElementById("playerInput")?.focus(), 100);
}

function openAddPlayerFromGameModal() {
    renderPlayers();
    document.getElementById("addGameModal").dataset.returnFocus = "true";
    document.getElementById("addPlayerModal").classList.remove("hidden");
    document.getElementById("addPlayerModal").classList.add("flex");
    setTimeout(() => document.getElementById("playerInput")?.focus(), 100);
}

function closeAddPlayerModal() {
    const returnToGame = document.getElementById("addGameModal").dataset.returnFocus === "true";
    document.getElementById("addGameModal").dataset.returnFocus = "";
    document.getElementById("addPlayerModal").classList.add("hidden");
    document.getElementById("addPlayerModal").classList.remove("flex");
    if (returnToGame) {
        renderPlayerSelection();
    }
}

function addPlayer() {
    const input = document.getElementById("playerInput");
    const name = input.value.trim();
    if (!name) return;

    if (players.includes(name)) {
        showToast("Player already exists", "error");
        return;
    }

    players.push(name);
    saveData();
    renderPlayers();
    renderPlayerSelection();
    input.value = "";
    input.focus();
    showToast(`"${name}" added ✨`);
}

function deletePlayer(player) {
    if (!confirm(`Remove ${player}?`)) return;
    players = players.filter((p) => p !== player);
    games.forEach((g) => {
        delete g.scores[player];
        g.players = g.players.filter((p) => p !== player);
    });
    saveData();
    renderPlayers();
    renderPlayerSelection();
    renderAll();
    showToast(`"${player}" removed`);
}

function renderPlayers() {
    const list = document.getElementById("playersList");
    const empty = document.getElementById("noPlayersMsg2");
    list.innerHTML = "";

    if (players.length === 0) {
        empty.classList.remove("hidden");
        return;
    }
    empty.classList.add("hidden");

    players.forEach((player) => {
        const div = document.createElement("div");
        div.className =
            "flex items-center justify-between group px-4 py-2.5 rounded-xl bg-white/40 dark:bg-stone-900/40 border border-stone-100 dark:border-stone-800/50";
        div.innerHTML = `
            <span class="text-sm font-medium text-stone-700 dark:text-stone-300">${player}</span>
            <button onclick="deletePlayer('${player}')"
                class="text-stone-300 dark:text-stone-600 hover:text-red-400 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm font-medium"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
        `;
        list.appendChild(div);
    });
}

function renderPlayerSelection() {
    const container = document.getElementById("playerSelection");
    const emptyMsg = document.getElementById("noPlayersMsg");
    container.innerHTML = "";

    if (players.length === 0) {
        emptyMsg.classList.remove("hidden");
        return;
    }
    emptyMsg.classList.add("hidden");

    players.forEach((player) => {
        const label = document.createElement("label");
        label.className =
            "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl cursor-pointer border border-stone-100 dark:border-stone-800/50 bg-white/30 dark:bg-stone-900/30 hover:bg-white/60 dark:hover:bg-stone-800/60 transition text-sm";
        label.innerHTML = `
            <input type="checkbox" value="${player}"
                class="w-4 h-4 rounded border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 focus:ring-stone-400"
                checked
            />
            <span class="font-medium text-stone-700 dark:text-stone-300">${player}</span>
        `;
        container.appendChild(label);
    });
}

// ─── Game ───
function createGame() {
    const name = document.getElementById("gameName").value.trim();
    if (!name) {
        showToast("Enter a game name", "error");
        return;
    }

    const selected = [
        ...document.querySelectorAll("#playerSelection input:checked"),
    ].map((el) => el.value);
    if (!selected.length) {
        showToast("Select at least one player", "error");
        return;
    }

    const scores = {};
    selected.forEach((p) => (scores[p] = 0));

    games.unshift({
        id: Date.now(),
        name,
        players: selected,
        scores,
        createdAt: new Date().toLocaleString(),
    });

    saveData();
    closeAddGameModal();
    renderAll();
    showToast(`"${name}" started 🎲`);
}

function deleteGame(id) {
    const game = games.find((g) => g.id === id);
    if (!game) return;
    if (!confirm(`Delete "${game.name}"?`)) return;
    games = games.filter((g) => g.id !== id);
    saveData();
    renderAll();
    showToast(`"${game.name}" deleted`);
}

function clearAllGames() {
    if (!games.length) return;
    const count = games.length;
    if (!confirm(`Delete all ${count} game${count !== 1 ? "s" : ""}? This cannot be undone.`)) return;
    games = [];
    saveData();
    renderAll();
    showToast(`All ${count} game${count !== 1 ? "s" : ""} cleared`);
}

// ─── Render ───
function renderAll() {
    renderCurrentGame();
    renderTotalScores();
    renderGamesHistory();
}

function renderCurrentGame() {
    const container = document.getElementById("currentGameScores");
    const nameSpan = document.getElementById("currentGameName");
    const badge = document.getElementById("currentGameBadge");

    if (!games.length) {
        container.innerHTML = `
            <div class="text-stone-400 dark:text-stone-500 text-center py-10 text-sm italic">
                <div class="mb-2 opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="inline-block"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
                No games yet
            </div>`;
        nameSpan.textContent = "Not started";
        document.getElementById("liveDot").style.opacity = "0";
        badge.className =
            "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full bg-stone-100/60 dark:bg-stone-800/60 text-stone-400 dark:text-stone-500";
        return;
    }

    const game = games[0];
    nameSpan.textContent = game.name;
    document.getElementById("liveDot").style.opacity = "1";
    badge.className =
        "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400";

    container.innerHTML = "";

    game.players.forEach((player, i) => {
        const score = game.scores[player] || 0;
        const div = document.createElement("div");
        div.className =
            "flex items-center justify-between group px-4 py-3.5 rounded-2xl bg-white/40 dark:bg-stone-900/30 border border-stone-100 dark:border-stone-800/40 hover:bg-white/60 dark:hover:bg-stone-800/40 transition-all duration-200";
        div.style.animationDelay = `${i * 0.05}s`;
        div.classList.add("fade-in-up");
        div.innerHTML = `
            <span class="font-semibold text-stone-800 dark:text-stone-200 text-sm">${player}</span>
            <div class="flex items-center gap-3">
                <span class="score-value text-xl font-bold text-stone-700 dark:text-stone-300" data-score="${score}">${score}</span>
                <button onclick="openModal(${game.id}, '${player}')"
                    class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-stone-800/10 dark:bg-stone-100/10 text-stone-600 dark:text-stone-400 hover:bg-stone-800/20 dark:hover:bg-stone-100/20 hover:text-stone-800 dark:hover:text-stone-200 transition">
                    + Edit
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderTotalScores() {
    const container = document.getElementById("totalScoreChart");
    const totals = {};

    players.forEach((p) => (totals[p] = 0));
    games.forEach((g) =>
        Object.entries(g.scores).forEach(([p, s]) => {
            if (totals[p] !== undefined) totals[p] += s;
        }),
    );

    const sorted = Object.entries(totals).sort(
        (a, b) => b[1] - a[1],
    );
    const maxScore = Math.max(...Object.values(totals), 1);

    container.innerHTML = "";

    if (sorted.length === 0) {
        container.innerHTML = `
            <div class="text-stone-400 dark:text-stone-500 text-center py-10 text-sm italic">
                <div class="mb-2 opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="inline-block"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                No scores yet
            </div>`;
        return;
    }

    sorted.forEach(([player, score]) => {
        const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
        const isWinner =
            score === maxScore && maxScore > 0 && sorted.length > 1;

        const div = document.createElement("div");
        div.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    ${player}
                    ${isWinner ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="text-amber-400" stroke="none"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>` : ""}
                </span>
                <span class="text-base font-bold text-stone-800 dark:text-stone-200 tabular-nums">${score}</span>
            </div>
            <div class="h-2 bg-stone-100 dark:bg-stone-800/60 rounded-full overflow-hidden">
                <div class="bar h-full rounded-full bg-gradient-to-r from-stone-400 to-stone-600 dark:from-stone-500 dark:to-stone-400" style="width: ${Math.max(pct, 2)}%"></div>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderGamesHistory() {
    const container = document.getElementById("gamesList");
    const countSpan = document.getElementById("gameCount");
    const clearBtn = document.getElementById("clearAllBtn");
    container.innerHTML = "";

    if (games.length === 0) {
        clearBtn.classList.add("hidden");
        countSpan.textContent = "";
        container.innerHTML = `
            <div class="col-span-full text-stone-400 dark:text-stone-500 italic text-center py-12 text-sm">
                <div class="mb-3 opacity-40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="inline-block"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                No game history yet
            </div>`;
        return;
    }

    clearBtn.classList.remove("hidden");
    countSpan.textContent = `${games.length} game${games.length !== 1 ? "s" : ""}`;

    games.forEach((game, index) => {
        const maxScore = Math.max(...Object.values(game.scores), 1);
        const actualMax = Math.max(...Object.values(game.scores));
        const isActive = index === 0;

        const card = document.createElement("div");
        card.className =
            "history-card glass rounded-2xl p-5 transition-all duration-200 hover:bg-white/80 dark:hover:bg-stone-800/60 flex flex-col";

        const scoresHtml = game.players
            .map((player) => {
                const score = game.scores[player] || 0;
                const pct = (score / maxScore) * 100;
                const isWinner =
                    score === actualMax && actualMax > 0;
                return `
                <div class="mb-2 last:mb-0">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1">
                            ${player}
                            ${isWinner ? `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="text-amber-400" stroke="none"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>` : ""}
                        </span>
                        <span class="text-xs font-bold text-stone-700 dark:text-stone-300 tabular-nums">${score}</span>
                    </div>
                    <div class="h-1 bg-stone-100 dark:bg-stone-800/60 rounded-full overflow-hidden">
                        <div class="bar h-full rounded-full bg-stone-400/60 dark:bg-stone-500/60" style="width: ${Math.max(pct, 2)}%"></div>
                    </div>
                </div>
            `;
            })
            .join("");

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="font-bold text-stone-800 dark:text-stone-200 text-sm">${game.name}</h3>
                    <p class="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5 font-medium">${game.createdAt}</p>
                </div>
                <button onclick="deleteGame(${game.id})"
                    class="text-stone-400 dark:text-stone-500 hover:text-red-500 dark:hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete game">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
            <div class="flex-1 space-y-1 mb-4">
                ${scoresHtml}
            </div>
            <div class="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/50">
                ${isActive
                    ? `<span class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <span class="live-dot w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                        Active
                    </span>`
                    : `<span class="text-[10px] font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">Finished</span>`
                }
                <span class="text-[10px] text-stone-400 dark:text-stone-500 font-medium">${game.players.length} ${game.players.length === 1 ? "player" : "players"}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// ─── Score ───
function openModal(gameId, player) {
    activeGameId = gameId;
    activePlayer = player;
    document.getElementById("activePlayerLabel").textContent =
        `Update score for ${player}`;
    document.getElementById("scoreInput").value = "";
    document.getElementById("scoreModal").classList.remove("hidden");
    document.getElementById("scoreModal").classList.add("flex");
    setTimeout(() => document.getElementById("scoreInput")?.focus(), 150);
}

function closeModal() {
    document.getElementById("scoreModal").classList.add("hidden");
    document.getElementById("scoreModal").classList.remove("flex");
}

function submitScore(addMode) {
    const raw = document.getElementById("scoreInput").value;
    const value = parseFloat(raw);
    if (isNaN(value)) {
        showToast("Enter a valid score", "error");
        return;
    }

    const game = games.find((g) => g.id === activeGameId);
    if (!game) return;

    if (addMode) {
        game.scores[activePlayer] =
            (game.scores[activePlayer] || 0) + value;
    } else {
        game.scores[activePlayer] = value;
    }

    saveData();
    renderAll();
    closeModal();
    const action = addMode ? "+" : "→";
    showToast(`${action} ${value} for ${activePlayer}`);
}

// ─── Info Modal ───
function openInfoModal() {
    document.getElementById("infoModal").classList.remove("hidden");
    document.getElementById("infoModal").classList.add("flex");
}

function closeInfoModal() {
    document.getElementById("infoModal").classList.add("hidden");
    document.getElementById("infoModal").classList.remove("flex");
}

// ─── Keyboard ───
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeAddGameModal();
        closeAddPlayerModal();
        closeModal();
        closeInfoModal();
    }
    if (e.key === "Enter") {
        const scoreModal = document.getElementById("scoreModal");
        if (
            !scoreModal.classList.contains("hidden") &&
            document.activeElement ===
                document.getElementById("scoreInput")
        ) {
            e.preventDefault();
            submitScore(true);
        }
    }
});

// ─── Init ───
renderAll();
