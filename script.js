// -------------------- COOKIE UTILITIES --------------------

/**
 * Retrieve the value of a cookie by name.
 * @param {string} name
 * @returns {string|null}
 */
function getCookie(name) {
    const nameEQ = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
        c = c.trim();
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length));
        }
    }
    return null;
}

/**
 * Set a cookie with name, value, and expiration (in days).
 * @param {string} name
 * @param {string} value
 * @param {number} days
 */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 86400000)); // 24h * 60m * 60s * 1000ms
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

// -------------------- PREFERENCE HANDLING --------------------

const root = document.documentElement;

/**
 * Apply saved preferences from cookies to the page.
 */
function applyPreferences() {
    const savedSize = getCookie("fontsize");
    const savedColor = getCookie("fontcolor");

    if (savedSize) root.style.setProperty("--fontsize", savedSize + "px");
    if (savedColor) root.style.setProperty("--fontcolor", savedColor);

    // Update form fields if they exist (after DOM is ready)
    if (document.getElementById("fontsize")) {
        document.getElementById("fontsize").value = savedSize || 16;
    }
    if (document.getElementById("fontcolor")) {
        document.getElementById("fontcolor").value = savedColor || "#000000";
    }
}

/**
 * Handle the form submission and save user preferences.
 */
function handleSave(event) {
    event.preventDefault();

    const size = document.getElementById("fontsize").value;
    const color = document.getElementById("fontcolor").value;

    setCookie("fontsize", size, 30);
    setCookie("fontcolor", color, 30);

    // Apply changes immediately
    root.style.setProperty("--fontsize", size + "px");
    root.style.setProperty("--fontcolor", color);

    alert("✅ Preferences saved successfully! Reload the page to verify persistence.");
    console.log(`Saved: fontsize=${size}px, fontcolor=${color}`);
}

// -------------------- INITIALIZATION --------------------

// Apply immediately (so visual flash doesn’t occur)
applyPreferences();

// Initialize after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("preference-form");
    form.addEventListener("submit", handleSave);
});
