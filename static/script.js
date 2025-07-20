
// Game data and state
const gameState = {
    canSpin: true,
    hasWatched: false,
    isSpinning: false,
    selectedOffer: null
};

// Recharge offers data
const rechargeOffers = [
    { operator: 'Jio', price: '₹299', validity: '28 Days', data: '1.5GB/Day', color: '#0066cc' },
    { operator: 'Jio', price: '₹399', validity: '56 Days', data: '2GB/Day', color: '#0066cc' },
    { operator: 'Jio', price: '₹599', validity: '84 Days', data: '2GB/Day', color: '#0066cc' },
    { operator: 'Airtel', price: '₹299', validity: '28 Days', data: '1.5GB/Day', color: '#ff0000' },
    { operator: 'Airtel', price: '₹349', validity: '28 Days', data: '2GB/Day', color: '#ff0000' },
    { operator: 'Airtel', price: '₹549', validity: '56 Days', data: '2GB/Day', color: '#ff0000' },
    { operator: 'Vi', price: '₹299', validity: '28 Days', data: '1.5GB/Day', color: '#660099' },
    { operator: 'Vi', price: '₹359', validity: '28 Days', data: '2GB/Day', color: '#660099' },
    { operator: 'Vi', price: '₹529', validity: '56 Days', data: '1.5GB/Day', color: '#660099' }
];

// Initialize the wheel
let wheel = null;
let ctx = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeWheel();
    setupEventListeners();
    displayUserName();
    generateRandomWinnerNumbers();
    setInterval(generateRandomWinnerNumbers, 5000);
});

function displayUserName() {
    const userName = localStorage.getItem('userName');
    const mainHeading = document.getElementById('mainHeading');
    
    if (userName && mainHeading) {
        mainHeading.innerHTML = `${userName}, Try Your Luck – Free Recharge`;
    }
}

function initializeWheel() {
    const canvas = document.getElementById('wheelCanvas');
    ctx = canvas.getContext('2d');
    
    // Wheel segments with operator names and better luck messages
    const segments = [
        { text: 'JIO', color: '#0066cc', textColor: '#fff', isOperator: true },
        { text: 'Better Luck', color: '#ff6b6b', textColor: '#fff', isOperator: false },
        { text: 'AIRTEL', color: '#ff0000', textColor: '#fff', isOperator: true },
        { text: 'Next Time', color: '#4ecdc4', textColor: '#fff', isOperator: false },
        { text: 'VI', color: '#660099', textColor: '#fff', isOperator: true },
        { text: 'Better Luck', color: '#45b7d1', textColor: '#fff', isOperator: false },
        { text: 'AIRTEL', color: '#ff0000', textColor: '#fff', isOperator: true },
        { text: 'Next Time', color: '#f9ca24', textColor: '#333', isOperator: false }
    ];
    
    drawWheel(segments);
}

function drawWheel(segments) {
    const canvas = document.getElementById('wheelCanvas');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 140;
    
    segments.forEach((segment, index) => {
        const startAngle = (index * 2 * Math.PI) / segments.length;
        const endAngle = ((index + 1) * 2 * Math.PI) / segments.length;
        
        // Create gradient for each segment
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        if (segment.isOperator) {
            gradient.addColorStop(0, segment.color);
            gradient.addColorStop(1, darkenColor(segment.color, 0.3));
        } else {
            gradient.addColorStop(0, lightenColor(segment.color, 0.2));
            gradient.addColorStop(1, segment.color);
        }
        
        // Draw segment with gradient
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add golden border for operator segments
        if (segment.isOperator) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
        } else {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
        }
        ctx.stroke();
        
        // Draw text with shadow effect
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + (endAngle - startAngle) / 2);
        
        // Text shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.font = segment.isOperator ? 'bold 16px Arial' : 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(segment.text, radius / 1.5 + 1, 6);
        
        // Main text
        ctx.fillStyle = segment.textColor;
        ctx.fillText(segment.text, radius / 1.5, 5);
        
        // Add sparkle effect for operator segments
        if (segment.isOperator) {
            ctx.fillStyle = '#FFD700';
            ctx.font = '12px Arial';
            ctx.fillText('★', radius / 1.5 + 25, -10);
            ctx.fillText('★', radius / 1.5 - 25, 15);
        }
        
        ctx.restore();
    });
    
    // Draw center circle with attractive design
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50);
    centerGradient.addColorStop(0, '#FFD700');
    centerGradient.addColorStop(0.7, '#FFA500');
    centerGradient.addColorStop(1, '#FF8C00');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Add center decoration with spinning icon
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎰', centerX, centerY + 8);
}

// Helper functions for color manipulation
function darkenColor(color, factor) {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - factor));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - factor));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - factor));
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
}

function lightenColor(color, factor) {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + (255 * factor));
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + (255 * factor));
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + (255 * factor));
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
}

function setupEventListeners() {
    // Spin button click
    document.getElementById('spinBtn').addEventListener('click', startSpin);
    
    // Modal event listeners
    document.getElementById('skipAdBtn').addEventListener('click', closeVideoAd);
    document.getElementById('getScratchCard').addEventListener('click', showScratchCard);
    document.getElementById('claimOffer').addEventListener('click', redirectToOffer);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function startSpin() {
    if (!gameState.canSpin || gameState.isSpinning) return;
    
    // Show video ad first
    showVideoAd();
}

function showVideoAd() {
    const modal = document.getElementById('videoAdModal');
    const skipBtn = document.getElementById('skipAdBtn');
    const timer = document.getElementById('timer');
    
    modal.style.display = 'block';
    skipBtn.disabled = true;
    
    let timeLeft = 30;
    timer.textContent = timeLeft;
    
    const countdown = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            skipBtn.disabled = false;
            skipBtn.textContent = 'Continue to Spin';
        }
    }, 1000);
}

function closeVideoAd() {
    document.getElementById('videoAdModal').style.display = 'none';
    gameState.hasWatched = true;
    performSpin();
}

function performSpin() {
    const canvas = document.getElementById('wheelCanvas');
    const spinBtn = document.getElementById('spinBtn');
    
    gameState.isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.textContent = 'SPINNING...';
    
    // Add glowing effect to wheel
    canvas.classList.add('wheel-glow');
    
    // Create dramatic spinning effect
    canvas.style.transform = 'rotate(0deg)';
    canvas.style.transition = 'transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    // Start spinning after a brief moment
    setTimeout(() => {
        canvas.style.transform = 'rotate(1800deg)'; // 5 full rotations
    }, 100);
    
    // Show result after spin animation
    setTimeout(() => {
        canvas.style.transition = 'none';
        canvas.style.transform = 'rotate(0deg)';
        canvas.classList.remove('wheel-glow');
        
        showSpinResult();
        
        spinBtn.disabled = false;
        spinBtn.textContent = 'SPIN NOW!';
        gameState.isSpinning = false;
    }, 4200);
}

function showSpinResult() {
    const modal = document.getElementById('resultModal');
    modal.style.display = 'block';
}

function showScratchCard() {
    document.getElementById('resultModal').style.display = 'none';
    
    const modal = document.getElementById('scratchModal');
    modal.style.display = 'block';
    
    // Get random operator and offer
    const operators = ['Jio', 'Airtel', 'Vi'];
    const randomOperator = operators[Math.floor(Math.random() * operators.length)];
    const operatorOffers = rechargeOffers.filter(offer => offer.operator === randomOperator);
    const randomOffer = operatorOffers[Math.floor(Math.random() * operatorOffers.length)];
    
    // Store selected offer for later use
    gameState.selectedOffer = randomOffer;
    
    // Update scratch card content
    document.getElementById('operatorName').textContent = randomOffer.operator;
    document.getElementById('rechargePrice').textContent = randomOffer.price;
    document.getElementById('validity').textContent = randomOffer.validity;
    document.getElementById('dataOffer').textContent = randomOffer.data;
    
    const operatorLogo = document.getElementById('operatorLogo');
    operatorLogo.textContent = randomOffer.operator.charAt(0);
    operatorLogo.className = `operator-logo ${randomOffer.operator.toLowerCase()}`;
    
    // Initialize scratch card
    initializeScratchCard();
}

function initializeScratchCard() {
    const canvas = document.getElementById('scratchCanvas');
    const ctx = canvas.getContext('2d');
    
    // Create scratch surface
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add scratch text
    ctx.fillStyle = '#808080';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch Here!', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '14px Arial';
    ctx.fillText('to reveal your offer', canvas.width / 2, canvas.height / 2 + 15);
    
    // Add scratch functionality
    let isScratching = false;
    
    function scratch(e) {
        if (!isScratching) return;
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Mouse events
    canvas.addEventListener('mousedown', (e) => {
        isScratching = true;
        scratch(e);
    });
    
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', () => isScratching = false);
    
    // Touch events
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isScratching = true;
        scratch(e);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        scratch(e);
    });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        isScratching = false;
    });
    
    // Prevent context menu on canvas
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

function redirectToOffer() {
    // Close scratch modal
    document.getElementById('scratchModal').style.display = 'none';
    
    // Get the selected operator from game state
    const operator = gameState.selectedOffer.operator;
    
    // Official website URLs for each operator
    const officialWebsites = {
        'Jio': 'https://www.jio.com/selfcare/plans',
        'Airtel': 'https://www.airtel.in/recharge',
        'Vi': 'https://www.vi.in/recharge'
    };
    
    const officialUrl = officialWebsites[operator];
    
    // Show confirmation
    const confirmMessage = `🎉 Congratulations! 🎉\n\nYou have won ${operator} ${gameState.selectedOffer.price} recharge!\n\nDo you want to go to the official website?`;
    
    if (confirm(confirmMessage)) {
        window.open(officialUrl, '_blank');
    }
    
    // Reset game state for next play
    gameState.canSpin = true;
    gameState.hasWatched = false;
    gameState.selectedOffer = null;
}

// Generate random winner numbers
function generateRandomWinnerNumbers() {
    const winnersDisplay = document.querySelector('.numbers-display');
    if (!winnersDisplay) return;
    
    // Clear existing numbers
    winnersDisplay.innerHTML = '';
    
    // Generate 20 random winner entries
    for (let i = 0; i < 20; i++) {
        const winnerDiv = document.createElement('div');
        winnerDiv.className = 'winner-number';
        
        // Generate random starting digit (6-9)
        const startDigit = Math.floor(Math.random() * 4) + 6;
        
        // Generate random number
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        
        // Generate random middle digits
        const middleDigits = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        
        // Generate random last 2 digits
        const lastDigits = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        
        // Format phone number
        const phoneNumber = `${startDigit}${randomNumber.toString().padStart(3, '0')}××××${lastDigits}`;
        
        // Random recharge amounts
        const amounts = ['₹299', '₹399', '₹599', '₹349', '₹549', '₹529', '₹359'];
        const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
        
        winnerDiv.innerHTML = `
            <span class="congratulation">🎉 Congrats</span>
            <span class="phone">${phoneNumber}</span>
            <span class="amount">${randomAmount}</span>
        `;
        
        winnersDisplay.appendChild(winnerDiv);
    }
}

// Add banner ad interactions
document.addEventListener('DOMContentLoaded', function() {
    const banners = document.querySelectorAll('.ad-banner');
    banners.forEach(banner => {
        banner.addEventListener('click', function() {
            alert('Advertisement clicked! This would redirect to the advertiser\'s page.');
        });
        
        banner.style.cursor = 'pointer';
    });
    
    // Side ad interactions
    const sideAds = document.querySelectorAll('.side-ad');
    sideAds.forEach(ad => {
        ad.addEventListener('click', function() {
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
            alert('Side Ad clicked! Redirecting to special offers...');
        });
    });
});
