// Night Mode Toggle Functionality
const nightModeToggle = document.getElementById('nightModeToggle');
const toggleIcon = document.querySelector('.toggle-icon');
const body = document.body;

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    toggleIcon.textContent = '☀️';
}

nightModeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        toggleIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        toggleIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
});

// CPP Evaluation Function
function evaluateCPP(cpp, network) {
    const benchmarks = {
        'American Express MR': { 
            excellent: 4.0, good: 3.0, average: 2.0, poor: 0,
            tpg: 2.0
        },
        'Chase UR': { 
            excellent: 4.0, good: 3.0, average: 2.05, poor: 0,
            tpg: 2.05
        },
        'Bilt Rewards': { 
            excellent: 4.0, good: 3.2, average: 2.2, poor: 0,
            tpg: 2.2
        },
        'Capital One Miles': { 
            excellent: 4.0, good: 2.85, average: 1.85, poor: 0,
            tpg: 1.85
        },
        'Citi ThankYou': { 
            excellent: 4.0, good: 2.90, average: 1.9, poor: 0,
            tpg: 1.9
        }
    };
    
    const networkBenchmarks = benchmarks[network] || { excellent: 4.0, good: 3.0, average: 2.0, poor: 0, tpg: 2.0 };
    
    let rating, color, icon, message, tips, boxColor;
    
    if (cpp >= networkBenchmarks.excellent) {
        rating = 'Excellent';
        color = '#10b981';
        boxColor = 'excellent';
        icon = '🌟';
        message = 'Outstanding value! This is a fantastic redemption.';
        tips = 'Consider booking immediately. This is well above average value for this program.';
    } else if (cpp >= networkBenchmarks.good) {
        rating = 'Good';
        color = '#10b981';
        boxColor = 'good';
        icon = '👍';
        message = 'Good value! This is a solid redemption.';
        tips = 'This is above average value for this program.';
    } else if (cpp >= networkBenchmarks.average) {
        rating = 'Average';
        color = '#f59e0b';
        boxColor = 'fair';
        icon = '⚖️';
        message = 'Average value. Consider if this fits your travel needs.';
        tips = 'This is around average value. Better redemptions may be available at a different time.';
    } else {
        rating = 'Poor';
        color = '#ef4444';
        boxColor = 'poor';
        icon = '⚠️';
        message = 'Poor value. Consider other redemption options.';
        tips = 'This is below average value. Look for better redemptions or consider cash.';
    }
    
    return {
        html: `
            <div class="evaluation-content">
                <div class="evaluation-header">
                    <span class="evaluation-icon">${icon}</span>
                    <span class="evaluation-rating" style="color: ${color}">${rating} Value</span>
                </div>
                <div class="evaluation-message">${message}</div>
                <div class="evaluation-tips">💡 ${tips}</div>
                <div class="evaluation-benchmark">
                    <small>TPG ${network} valuation as of September 2025: ${networkBenchmarks.tpg}¢ per point</small>
                </div>
            </div>
        `,
        boxColor: boxColor
    };
}

// Calculator Form Functionality
document.getElementById('calculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const points = parseFloat(document.getElementById('points').value);
    const value = parseFloat(document.getElementById('value').value);
    const fees = parseFloat(document.getElementById('fees').value);
    // const description = document.getElementById('description').value;
    const description = '';
    const pointNetwork = document.querySelector('input[name="point_network"]:checked').value;
    
    if (points <= 0 || value <= 0 || fees <= 0) {
        alert('Please enter valid positive numbers for points, value, and fees.');
        return;
    }
    
    const centPerPoint = ((value - fees) / points) * 100;
    const resultElement = document.getElementById('result');
    const resultValueElement = document.getElementById('resultValue');
    const resultDescriptionElement = document.getElementById('resultDescription');
    const evaluationElement = document.getElementById('evaluation');
    
    resultValueElement.textContent = `${centPerPoint.toFixed(2)} cents per point`;
    
    if (description) {
        resultDescriptionElement.textContent = `For: ${description}`;
    } else {
        resultDescriptionElement.textContent = '';
    }
    
    // CPP Evaluation
    const evaluation = evaluateCPP(centPerPoint, pointNetwork);
    evaluationElement.innerHTML = evaluation.html;
    
    // Apply color-coded styling to result box
    resultElement.className = 'result show';
    resultElement.classList.add(evaluation.boxColor);
    
    resultElement.classList.add('show');
});

// Add some interactivity
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        const result = document.getElementById('result');
        if (result.classList.contains('show')) {
            result.classList.remove('show');
        }
    });
});
