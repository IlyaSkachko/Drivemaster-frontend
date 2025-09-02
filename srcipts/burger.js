const burger = document.getElementById('burger');
const menu = document.querySelector('.header-menu');

burger.addEventListener('click', () => {
    if (menu.style.display === 'flex') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'flex';
    }

    burger.classList.toggle('open');
});
