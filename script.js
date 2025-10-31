// ==============================
// 🌐 APP LOGIC (Runs in Browser)
// ==============================

// --- Cookie Utilities ---
function setCookie(name, value, days = 7) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

// --- Apply styles from cookies ---
function applyStyles() {
  const fontSize = getCookie("fontsize");
  const fontColor = getCookie("fontcolor");

  if (fontSize) document.body.style.fontSize = fontSize + "px";
  if (fontColor) document.body.style.color = fontColor;
}

// --- On Page Load ---
window.addEventListener("load", () => {
  applyStyles();

  const form = document.getElementById("settingsForm");
  const fontSizeInput = document.getElementById("fontsize");
  const fontColorInput = document.getElementById("fontcolor");

  if (!form || !fontSizeInput || !fontColorInput) return;

  // Save cookies on form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const size = fontSizeInput.value;
    const color = fontColorInput.value;
    setCookie("fontsize", size);
    setCookie("fontcolor", color);
    applyStyles();
  });

  // Real-time updates
  fontSizeInput.addEventListener("change", (e) => {
    setCookie("fontsize", e.target.value);
    applyStyles();
  });

  fontColorInput.addEventListener("change", (e) => {
    setCookie("fontcolor", e.target.value);
    applyStyles();
  });
});

// ==============================
// 🧪 CYPRESS TEST (Runs in Cypress Only)
// ==============================
if (typeof describe !== "undefined") {
  describe("Font customization test", () => {
    const baseUrl = "http://localhost:3000"; // Change if your server runs elsewhere

    it("should save and apply font size and color from cookies", () => {
      cy.visit(baseUrl + "/main.html");

      // Update font size and color
      cy.get("#fontsize").clear().type("18").trigger("change");
      cy.get("#fontcolor").invoke("val", "#ff0000").trigger("change");

      // Submit the form
      cy.get('input[type="submit"]').click();

      // Ensure cookies are created
      cy.getCookie("fontcolor").should("exist");
      cy.getCookie("fontsize").should("exist");

      // Reload to test persistence
      cy.reload();

      // Wait for cookie reapplication
      cy.wait(500);

      // Validate applied CSS
      cy.get("body")
        .should("have.css", "font-size")
        .and("match", /18px|18\.0px/);

      cy.get("body").should("have.css", "color", "rgb(255, 0, 0)");
    });
  });
}
