const toggler = document.querySelector('.toggler');
const siteNav = document.querySelector('.page-header__site-nav');
const userNav = document.querySelector('.page-header__user-nav');

toggler.addEventListener('click', ()=>{
  toggler.classList.toggle('toggler--active');
  siteNav.classList.toggle('page-header__site-nav--active')
  userNav.classList.toggle('page-header__user-nav--active')

})
