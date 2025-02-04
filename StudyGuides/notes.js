document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = document.querySelectorAll(".dropdown");

    // biome-ignore lint/complexity/noForEach: <explanation>
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", function() {
            this.classList.toggle("active");
        });
    });
});
