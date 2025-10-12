const menuBtn = document.getElementById('menuToggle');
const menu = document.getElementById('myMenu');
const body = document.body;

menuBtn.addEventListener('click', function() {
    menu.classList.toggle('open');
    body.classList.toggle('menu-aberto');
});