// ==============================
// 🌐 APP LOGIC
// ==============================

// Cookie utilities
function setCookie(name, value, days = 30) {
  const date = new Date();
  date.setTime(date.getTime() + days*24*60*60*1000);
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; expires=${date.toUTCString()}`;
}

function getCookie(name) {
  const nameEQ = encodeURIComponent(name) + "=";
  const cookies = document.cookie.split(";");
  for (let c of cookies) {
    c = c.trim();
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}

// Apply saved preferences
function applyPreferences() {
  const size = getCookie("fontsize");
  const color = getCookie("fontcolor");
  if (size) document.documentElement.style.setProperty("--fontsize", size + "px");
  if (color) document.documentElement.style.setProperty("--fontcolor", color);
}

// Apply as early as possible
applyPreferences();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("preference-form");
  const sizeInput = document.getElementById("fontsize");
  const colorInput = document.getElementById("fontcolor");

  if (!form || !sizeInput || !colorInput) return;

  // Initialize inputs from cookies
  if (getCookie("fontsize")) sizeInput.value = getCookie("fontsize");
  if (getCookie("fontcolor")) colorInput.value = getCookie("fontcolor");

  // Save on submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const size = sizeInput.value;
    const color = colorInput.value;

    setCookie("fontsize", size, 30);
    setCookie("fontcolor", color, 30);

    document.documentElement.style.setProperty("--fontsize", size + "px");
    document.documentElement.style.setProperty("--fontcolor", color);
  });

  // Real-time updates
  sizeInput.addEventListener("input", (e) => {
    setCookie("fontsize", e.target.value, 30);
    document.documentElement.style.setProperty("--fontsize", e.target.value + "px");
  });

  colorInput.addEventListener("input", (e) => {
    setCookie("fontcolor", e.target.value, 30);
    document.documentElement.style.setProperty("--fontcolor", e.target.value);
  });
});

// ==============================
// 🧪 CYPRESS TEST
// ==============================
if (typeof describe !== "undefined") {
  describe("Font customization test", () => {
    const baseUrl = "http://localhost:3000";

    it("should save and apply font size and color from cookies", () => {
      cy.visit(baseUrl + "/main.html");

      // Set font size and color
      cy.get("#fontsize").clear().type("18").trigger("input");
      cy.get("#fontcolor").invoke("val", "#ff0000").trigger("input");

      // Click Save
      cy.get("input[type='submit']").click();

      // Wait to ensure cookies are written
      cy.wait(300);

      // Verify cookies exist
      cy.getCookie("fontsize").should("exist");
      cy.getCookie("fontcolor").should("exist");

      // Reload page
      cy.reload();
      cy.wait(500);

      // Verify CSS
      cy.get("body")
        .should("have.css", "font-size")
        .and("match", /18px|18\.0px/);

      cy.get("body").should("have.css", "color", "rgb(255, 0, 0)");
    });
  });
}
