// Common JavaScript functions

// Load footer with error handling
function loadFooter() {
  const footerContainer = document.getElementById("footer-container");
  if (!footerContainer) return;

  fetch("../components/footer.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load footer");
      }
      return response.text();
    })
    .then((html) => {
      footerContainer.innerHTML = html;
    })
    .catch((error) => {
      console.error("Error loading footer:", error);
      footerContainer.innerHTML = `
                <footer class="footer">
                    <div class="footer-bottom">
                        <p>&copy; 2024 Movifi. All rights reserved.</p>
                    </div>
                </footer>
            `;
    });
}

// Initialize common functionality
document.addEventListener("DOMContentLoaded", function () {
  loadFooter();
});
