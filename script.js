// -------------------- COOKIE UTILITIES --------------------

/**
 * Retrieve the value of a cookie by name.
 * @param {string} name
 * @returns {string|null}
 */
function getCookie(name) {
    const nameEQ = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(";");
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
        date.setTime(date.getTime() + days * 86400000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
        encodeURIComponent(name) +
        "=" +
        encodeURIComponent(value) +
        expires +
        "; path=/";
}

// -------------------- PREFERENCE HANDLING --------------------

const root = document.documentElement;

/**
 * Apply saved preferences from cookies to the page.
 */
function applyPreferences() {
    const savedSize = getCookie("fontsize");
    const savedColor = getCookie("fontcolor");

    // Apply font size (ensure 'px' suffix)
    if (savedSize) {
        root.style.setProperty("--fontsize", savedSize);
    }
    // Apply font color
    if (savedColor) {
        root.style.setProperty("--fontcolor", savedColor);
    }

    // Update form fields (if DOM ready)
    const sizeInput = document.getElementById("fontsize");
    const colorInput = document.getElementById("fontcolor");

    if (sizeInput) sizeInput.value = parseInt(savedSize) || 16;
    if (colorInput) colorInput.value = savedColor || "#000000";
}

/**
 * Handle the form submission and save user preferences.
 */
function handleSave(event) {
    event.preventDefault();

    const size = document.getElementById("fontsize").value;
    const color = document.getElementById("fontcolor").value;

    // Save preferences as cookies (with px unit)
    setCookie("fontsize", size + "px", 30);
    setCookie("fontcolor", color, 30);

    // Apply immediately
    root.style.setProperty("--fontsize", size + "px");
    root.style.setProperty("--fontcolor", color);

    alert("✅ Preferences saved successfully!");
    console.log(`Saved fontsize=${size}px, color=${color}`);
}

// -------------------- INITIALIZATION --------------------

// Apply immediately (so it works even before DOM loads fully)
applyPreferences();

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("preference-form");
    if (form) form.addEventListener("submit", handleSave);
});
