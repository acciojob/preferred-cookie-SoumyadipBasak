// ==============================
// 🌐 APP LOGIC (Runs in Browser)
// ==============================

// --- Cookie utilities ---
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

// --- Apply preferences to page ---
function applyPreferences() {
  const size = getCookie("fontsize");
  const color = getCookie("fontcolor");

  if (size) document.documentElement.style.setProperty("--fontsize", size + "px");
  if (color) document.documentElement.style.setProperty("--fontcolor", color);
}

// Apply preferences as early as possible
applyPreferences();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("preference-form");
  const sizeInput = document.getElementById("fontsize");
  const colorInput = document.getElementById("fontcolor");

  if (!form || !sizeInput || !colorInput) return;

  // Update input values from cookies
  if (getCookie("fontsize")) sizeInput.value = getCookie("fontsize");
  if (getCookie("fontcolor")) colorInput.value = getCookie("fontcolor");

  // Save preferences on submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const size = sizeInput.value;
    const color = colorInput.value;
    setCookie("fontsize", size, 30);
    setCookie("fontcolor", color, 30);

    document.documentElement.style.setProperty("--fontsize", size + "px");
    document.documentElement.style.setProperty("--fontcolor", color);

    alert("Preferences saved!");
  });

  // Real-time updates
  sizeInput.addEventListener("change", (e) => {
    setCookie("fontsize", e.target.value, 30);
    document.documentElement.style.setProperty("--fontsize", e.target.value + "px");
  });

  colorInput.addEventListener("change", (e) => {
    setCookie("fontcolor", e.target.value, 30);
    document.documentElement.style.setProperty("--fontcolor", e.target.value);
  });
});

// ==============================
// 🧪 CYPRESS TEST (Runs Only in Cypress)
// ==============================
if (typeof describe !== "undefined") {
  describe("Font customization test", () => {
    const baseUrl = "http://localhost:3000"; // adjust if needed

    it("should save and apply font size and color from cookies", () => {
      cy.visit(baseUrl + "/main.html");

      cy.get("#fontsize").clear().type("18").trigger("change");
      cy.get("#fontcolor").invoke("val", "#ff0000").trigger("input");

      cy.get("input[type='submit']").click();

      // Check cookies exist
      cy.getCookie("fontsize").should("exist");
      cy.getCookie("fontcolor").should("exist");

      cy.reload();
      cy.wait(500); // wait for JS to reapply cookies

      cy.get("body")
        .should("have.css", "font-size")
        .and("match", /18px|18\.0px/);

      cy.get("body").should("have.css", "color", "rgb(255, 0, 0)");
    });
  });
}
