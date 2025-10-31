// --- 1. Cookie Management Utility Functions (Provided) ---

/**
 * Reads a specific cookie value.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string | null} The cookie value, or null if not found.
 */
function getCookie(name) {
    // Escape the name to use it in the regex
    const nameEQ = name + "=";
    // Split all cookies into an array
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        // Remove leading spaces
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        // Check if this is the target cookie
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

/**
 * Sets a cookie with a specific name and value.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value to store.
 * @param {number} days - The number of days until the cookie expires.
 */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // Set the cookie (valid for 30 days)
    document.cookie = name + "=" + value + expires + "; path=/";
}

// --- 2. Preference Application and Saving ---

const root = document.documentElement; // Get the :root element for CSS variables
const form = document.getElementById('preference-form');
const fontsizeInput = document.getElementById('fontsize');
const fontcolorInput = document.getElementById('fontcolor');


/**
 * 4️⃣ Automatically Apply Preferences on Page Load
 * Reads cookies and applies the preferences to CSS variables.
 * Also updates the form inputs to reflect the saved state.
 */
function applyPreferences() {
    const savedSize = getCookie('fontsize');
    const savedColor = getCookie('fontcolor');

    // Apply font size if cookie exists
    if (savedSize) {
        // Set the CSS variable (needs 'px' unit)
        root.style.setProperty('--fontsize', savedSize + 'px'); 
        // Update the form input to show the saved value
        fontsizeInput.value = savedSize; 
        console.log(`Applying saved font size: ${savedSize}px`);
    }

    // Apply font color if cookie exists
    if (savedColor) {
        // Set the CSS variable
        root.style.setProperty('--fontcolor', savedColor);
        // Update the form input to show the saved value
        fontcolorInput.value = savedColor;
        console.log(`Applying saved font color: ${savedColor}`);
    }
}


/**
 * 3️⃣ Saving User Preferences
 * Handles the form submission to save preferences to cookies.
 * @param {Event} event - The form submission event.
 */
function handleSave(event) {
    event.preventDefault(); // Prevent the default form submission (page reload)

    // Get validated values from inputs
    const size = fontsizeInput.value;
    const color = fontcolorInput.value;
    
    // The requirement specifies the cookies should store:
    // fontsize: value (in px) -> size (e.g., "20")
    // fontcolor: value (in hex) -> color (e.g., "#ff0000")

    // 1. Save preferences to cookies (valid for 30 days for persistence)
    setCookie('fontsize', size, 30);
    setCookie('fontcolor', color, 30);

    // 2. Apply the changes immediately to the page for good UX
    root.style.setProperty('--fontsize', size + 'px');
    root.style.setProperty('--fontcolor', color);

    console.log(`Preferences saved: Size=${size}px, Color=${color}`);
    alert('Preferences saved successfully! Try reloading the page.');
}


// --- 3. Initialization ---

// 4️⃣ On Page Load: Apply any existing cookies first
// This ensures that saved preferences are applied immediately when the page loads.
applyPreferences(); 

// Attach event listener to the form submission
form.addEventListener('submit', handleSave);