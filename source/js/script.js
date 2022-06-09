const toggler = document.querySelector('.toggler');
const siteNav = document.querySelector('.page-header__site-nav');
const userNav = document.querySelector('.page-header__user-nav');

toggler.addEventListener('click', () => {
  toggler.classList.toggle('toggler--active');
  siteNav.classList.toggle('page-header__site-nav--active');
  userNav.classList.toggle('page-header__user-nav--active');
});

class Slider {
  constructor() {
    this.sliderElements = document.querySelectorAll('.slider__item');
    this.sliderControlLeft = document.querySelector('.slider__button-back');
    this.sliderControlRight = document.querySelector('.slider__button-forward');
    this.elementsCount = this.sliderElements.length;
    this.currentElement = 0;
    this.prevElement = 0;
  }

  inint() {
    this._setHandlers();
    this._initSliderItems();
    this._checkControls();
  }

  _initSliderItems() {
    this.sliderElements.forEach((element)=>{
      element.classList.remove('slider__item--active');
    })
    console.log(this.currentElement);
    this.sliderElements[this.currentElement].classList.add('slider__item--active');
  }

  _checkControls() {
    if (!this.currentElement) {
      this.sliderControlLeft.disabled = true;
    } else {
      this.sliderControlLeft.disabled = false;
    }

    if (this.currentElement===this.elementsCount-1) {
      this.sliderControlRight.disabled = true;
    } else {
      this.sliderControlRight.disabled = false;
    }
  }

  _changeSlide() {
    this.sliderElements[this.prevElement].classList.remove('slider__item--active');
    this.sliderElements[this.currentElement].classList.add('slider__item--active');
  }

  _setHandlers() {
    this.sliderControlLeft.addEventListener('click', () => {
      if (!this.currentElement) {
        return;
      }
      this.prevElement = this.currentElement;
      this.currentElement--;
      this._changeSlide();
      this._checkControls();
    });

    this.sliderControlRight.addEventListener('click', () => {
      if (this.currentElement===this.elementsCount-1) {
        return;
      }
      this.prevElement = this.currentElement;
      this.currentElement++;
      this._changeSlide();
      this._checkControls();
    });
  }
}

const slider = new Slider();

slider.inint();
