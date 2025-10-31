// --- 1. Cookie Management Utility Functions ---

/**
 * Reads a specific cookie value.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string | null} The cookie value, or null if not found.
 */
function getCookie(name) {
    const nameEQ = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(';');
    
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length)); 
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
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

// --- 2. Preference Application and Saving ---

const root = document.documentElement; // Get the :root element for CSS variables

// These variables will be defined inside the DOMContentLoaded handler
let form, fontsizeInput, fontcolorInput;


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
        root.style.setProperty('--fontsize', savedSize + 'px'); 
        // Only update input if it exists (which it will after DOMContentLoaded)
        if (fontsizeInput) { 
            fontsizeInput.value = savedSize; 
        }
    }

    // Apply font color if cookie exists
    if (savedColor) {
        root.style.setProperty('--fontcolor', savedColor);
        // Only update input if it exists
        if (fontcolorInput) {
            fontcolorInput.value = savedColor;
        }
    }
}


/**
 * 3️⃣ Saving User Preferences
 * Handles the form submission to save preferences to cookies.
 * @param {Event} event - The form submission event.
 */
function handleSave(event) {
    event.preventDefault(); // Prevent the default form submission (page reload)

    const size = fontsizeInput.value;
    const color = fontcolorInput.value;

    // 1. Save preferences to cookies
    setCookie('fontsize', size, 30);
    setCookie('fontcolor', color, 30);

    // 2. Apply the changes immediately to the page 
    root.style.setProperty('--fontsize', size + 'px');
    root.style.setProperty('--fontcolor', color);

    console.log(`Preferences saved: Size=${size}px, Color=${color}`);
    alert('Preferences saved successfully! Try reloading the page.');
}


// --- 3. Initialization ---

// 4️⃣ Execute the necessary setup code AFTER the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    // 1. Get DOM elements here, where they are guaranteed to exist
    form = document.getElementById('preference-form');
    fontsizeInput = document.getElementById('fontsize');
    fontcolorInput = document.getElementById('fontcolor');

    // 2. Apply saved preferences
    // NOTE: applyPreferences() is also called below the handler to set CSS variables early.
    // We call it again here just to update the form inputs which are now available.
    applyPreferences(); 
    
    // 3. Attach event listener (Line 110 fixed!)
    if (form) {
        form.addEventListener('submit', handleSave);
    }
});

// CRUCIAL STEP: Call applyPreferences() outside the DOMContentLoaded listener
// This ensures the CSS variables are set as early as possible (the original reason for moving the script to the head) 
// to prevent the font-size check failure upon reload.
// This call relies ONLY on document.documentElement (root) and getCookie, which are always available.
applyPreferences();