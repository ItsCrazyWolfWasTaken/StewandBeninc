// Load navbar.html into each page
document.addEventListener("DOMContentLoaded", () => {
    fetch("/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
            attachNavbarEvents(); // Reattach event listeners after inserting the HTML
        });
});

function attachNavbarEvents() {
    const menuIcon = document.querySelector('.menuIcon');
    const nav = document.querySelector('.overlay-menu');

    menuIcon.addEventListener('click', () => {
        if (nav.style.transform !== 'translateX(0%)') {
            nav.style.transform = 'translateX(0%)';
            nav.style.transition = 'transform 0.2s ease-out';
        } else {
            nav.style.transform = 'translateX(-100%)';
            nav.style.transition = 'transform 0.2s ease-out';
        }
    });

    // Toggle Menu Icon
    const toggleIcon = document.querySelector('.menuIcon');

    toggleIcon.addEventListener('click', () => {
        if (toggleIcon.className !== 'menuIcon toggle') {
            toggleIcon.className += ' toggle';
        } else {
            toggleIcon.className = 'menuIcon';
        }
    });
}
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const depth = window.location.pathname.split("/").length - 2;
        const relativePath = depth > 0 ? "../".repeat(depth) : "";
        
        const response = await fetch(`${relativePath}navbar.html`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.text();
        document.body.insertAdjacentHTML("afterbegin", data);

        highlightActiveLink(); // Call function to add "here" class
    } catch (error) {
        console.error("Failed to fetch navbar:", error);
    }
});

function highlightActiveLink() {
    const path = window.location.pathname.toLowerCase();

    // Select navbar links
    const dictionaryLink = document.querySelector('a[href="../dictionary.html"]');
    const studyingLink = document.querySelector('.top-menu > span > a'); // Correct way to target Studying
    const gamesLink = document.querySelector('a[href="../Games/games.html"]');

    // Apply "here" class based on path
    if (path.includes("/studyguides/") && studyingLink) {
        studyingLink.classList.add("here");
    } else if (path.endsWith("dictionary.html") && dictionaryLink) {
        dictionaryLink.classList.add("here");
    } else if (path.includes("/games/") && gamesLink) {
        gamesLink.classList.add("here");
    }
}

