/**
 * @file script.js
 * @description Client-side logic for the Cent Per Point Calculator.
 * @authors David Sklow, Alexander Lopez
 */

/**
 * Handles the night mode toggle button click.
 * Toggles dark mode on the body, updates the toggle icon,
 * and persists the user's preference to localStorage.
 */
const onNightModeToggleClick = () => {
    const toggleIcon = document.querySelector('.toggle-icon');
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        toggleIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        toggleIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

/**
 * Initialises the theme on page load.
 * Reads the saved theme from localStorage and applies dark mode
 * and the correct toggle icon if the stored preference is 'dark'.
 */
const initTheme = () => {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.toggle-icon').textContent = '☀️';
    }
}

/**
 * Evaluates the cents-per-point (CPP) value of a redemption.
 * Compares the calculated CPP against network-specific benchmarks
 * and returns an HTML string and a CSS class name for the result box.
 *
 * @param {number} cpp     - The calculated cents-per-point value.
 * @param {string} network - The loyalty program name (e.g. 'Chase UR').
 * @returns {{ html: string, boxColor: string }} Evaluation result containing
 *   rendered HTML and a colour class ('excellent', 'good', 'fair', or 'poor').
 */
const evaluateCPP = (cpp, network) => {
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
        },
        'Wells Fargo Rewards': {
            excellent: 3.0, good: 2.0, average: 1.65, poor: 0,
            tpg: 1.65
        },
        'Other': {
            excellent: 2.5, good: 1.5, average: 1.2, poor: 0,
            tpg: 1.2
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
        html: '<div class="evaluation-content">' +
                  '<div class="evaluation-header">' +
                      '<span class="evaluation-icon">' + icon + '</span>' +
                      '<span class="evaluation-rating" style="color: ' + color + '">' + rating + ' Value</span>' +
                  '</div>' +
                  '<div class="evaluation-message">' + message + '</div>' +
                  '<div class="evaluation-tips">💡 ' + tips + '</div>' +
                  '<div class="evaluation-benchmark">' +
                      '<small>TPG ' + network + ' valuation as of February 2026: ' + networkBenchmarks.tpg + '¢ per point</small>' +
                  '</div>' +
              '</div>',
        boxColor: boxColor
    };
}

/**
 * Handles the calculator form submission.
 * Reads points, fees, cash value, and point network from the form,
 * calculates the CPP, evaluates the result, and renders it to the DOM.
 *
 * @param {SubmitEvent} e - The form submit event.
 */
const onCalculatorFormSubmit = (e) => {
    e.preventDefault();

    const points = parseFloat(document.getElementById('points').value);
    const value = parseFloat(document.getElementById('value').value);
    const fees = parseFloat(document.getElementById('fees').value);
    const description = '';
    const pointNetwork = document.querySelector('input[name="point_network"]:checked').value;

    if (points <= 0 || value <= 0) {
        alert('Please enter positive non-zero vaules for points and equivalent value.');
    }

    if (fees < 0) {
        alert('Please enter a positive value for associated fees.');
    }

    const centPerPoint = ((value - fees) / points) * 100;
    const resultElement = document.getElementById('result');
    const resultValueElement = document.getElementById('resultValue');
    const resultDescriptionElement = document.getElementById('resultDescription');
    const evaluationElement = document.getElementById('evaluation');

    resultValueElement.textContent = centPerPoint.toFixed(2) + ' cents per point';
    resultDescriptionElement.textContent = description ? 'For: ' + description : '';

    const evaluation = evaluateCPP(centPerPoint, pointNetwork);
    evaluationElement.innerHTML = evaluation.html;

    resultElement.className = 'result show';
    resultElement.classList.add(evaluation.boxColor);
}

/**
 * Handles input changes on any form field.
 * Hides the result box when the user modifies an input,
 * prompting them to recalculate.
 */
const onInputChange = () => {
    const result = document.getElementById('result');
    if (result.classList.contains('show')) {
        result.classList.remove('show');
    }
}

/**
 * Entry point — runs after the page has fully loaded.
 * Initialises the theme and binds all event handlers to their
 * respective DOM elements.
 */
window.onload = () => {
    initTheme();

    document.getElementById('nightModeToggle').addEventListener('click', onNightModeToggleClick);
    document.getElementById('calculatorForm').addEventListener('submit', onCalculatorFormSubmit);

    const inputs = document.querySelectorAll('input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', onInputChange);
    }
};
