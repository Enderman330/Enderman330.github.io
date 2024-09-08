// Elements
const cookie = document.getElementById('cookie');
const pointsDisplay = document.getElementById('points');
const notification = document.getElementById('notification');
const resetBtn = document.getElementById('reset');
const usernameInput = document.getElementById('username');
const startGameBtn = document.getElementById('start-game');
const usernameSection = document.getElementById('username-section');
const clickerSection = document.getElementById('clicker-section');

// Game state
let points = parseInt(localStorage.getItem('points')) || 0;
pointsDisplay.textContent = `${points} Points`;
let lastClickTime = 0;
const clickCooldown = 50; // 50ms click limit
let username = "";

// Webhook URL (replace with your actual webhook URL)
const discordWebhookUrl = 'https://discord.com/api/webhooks/1282265590265811026/Y3elSqffJ8SY1OXdDkk0xb2PYKgj8AlxTJ3et5plypA_XSskXtutdodW20xtVIklpE9Q';

// Click speed control
cookie.addEventListener('click', () => {
    const currentTime = Date.now();
    if (currentTime - lastClickTime >= clickCooldown) {
        points += 1;
        pointsDisplay.textContent = `${points} Points`;
        localStorage.setItem('points', points); // Store points in local storage
        notification.textContent = ''; // Clear notification
        checkMilestone(points);
        lastClickTime = currentTime;
    } else {
        notification.textContent = 'Too fast! Slow down.';
    }
});

// Check milestones and send to Discord webhook
function checkMilestone(points) {
    if ([100, 1000, 10000, 100000].includes(points)) {
        sendToDiscord(points);
    }
}

// Send message to Discord
function sendToDiscord(points) {
    const message = {
        content: `User ${username} has reached ${points} points! 🎉`
    };

    fetch(discordWebhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
    .then(response => {
        if (response.ok) {
            console.log('Milestone sent to Discord successfully!');
        } else {
            console.error('Failed to send milestone to Discord');
        }
    });
}

// Start game
startGameBtn.addEventListener('click', () => {
    username = usernameInput.value.trim();

    if (username) {
        localStorage.setItem('username', username); // Save username in local storage
        usernameSection.classList.add('hidden');
        clickerSection.classList.remove('hidden');
    } else {
        alert("Please enter a username!");
    }
});

// Reset button event
resetBtn.addEventListener('click', () => {
    points = 0;
    localStorage.setItem('points', points);
    pointsDisplay.textContent = `${points} Points`;
    notification.textContent = '';
});

// On page load, if points and username are stored, load them
window.addEventListener('load', () => {
    username = localStorage.getItem('username') || "";
    if (username) {
        usernameSection.classList.add('hidden');
        clickerSection.classList.remove('hidden');
    }

    points = parseInt(localStorage.getItem('points')) || 0;
    pointsDisplay.textContent = `${points} Points`;
});
