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

