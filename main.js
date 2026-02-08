// 1. Select DOM elements
const closeBtn = document.querySelector('#close-btn');
const hamburgerBtn = document.querySelector('#hamburger');
const coverDiv = document.querySelector('.cover');
const navMenu = document.querySelector('nav');
const header = document.querySelector('header');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const slideContainer = document.querySelector('.slide-container');
const slides = Array.from(slideContainer.children);
const sliderNav = document.querySelector('.slider-nav');
const dotsNav = document.querySelector('.dots-nav');
const dots = Array.from(dotsNav.children);
const textsToObserve = document.querySelectorAll('.text-observe');

// 2. Define constants and options
let slideWidth = slides[0].getBoundingClientRect().width;
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50;
let options = {
    rootMargin: '0px',
    threshold: 0.1
};

// 3. Functions

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;
    let swipeDistance = touchEndX - touchStartX;
    console.log(swipeDistance);
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            handlePrevSlide();
        } else {
            handleNextSlide();
        }
    }
    
    touchStartX = 0;
    touchEndX = 0;
}

function handleNextSlide() {
    let currentSlide = document.querySelector('.current-slide');
    let targetSlide = currentSlide.nextElementSibling;
    let currentDot = document.querySelector('.current-dot');
    let nextDot = currentDot.nextElementSibling;
   
    if (currentSlide === slides[slides.length-1]) {
        targetSlide = slides[0];
    }
    if (currentDot === dots[dots.length-1]) {
        nextDot = dots[0];
    }
    moveSlide(currentSlide, targetSlide);
    updateDots(currentDot, nextDot);
}

function handlePrevSlide() {
    let currentSlide = document.querySelector('.current-slide');
    let targetSlide = currentSlide.previousElementSibling;
    let currentDot = document.querySelector('.current-dot');
    let prevDot = currentDot.previousElementSibling;
    
    if (currentSlide === slides[0]) {
        targetSlide = slides[slides.length-1];
    }
    if (currentDot === dots[0]) {
        prevDot = dots[dots.length-1];
    }
    moveSlide(currentSlide, targetSlide);
    updateDots(currentDot, prevDot);
}

function updateDots(currentDot, targetDot) {
    currentDot.classList.remove('current-dot');
    targetDot.classList.add('current-dot');
}

function moveSlide(currentSlide, targetSlide) {
    let amountToMove = targetSlide.style.left;
    slideContainer.style.transform = 'translateX(-' + amountToMove + ')';
    
    currentSlide.classList.remove('current-slide');
    targetSlide.classList.add('current-slide');
}

function setSlideHeight() {
    const heights = slides.map(slide => slide.offsetHeight);
    const maxHeight = Math.max(...heights);
    slideContainer.style.height = maxHeight + 'px';
    console.log(maxHeight);
}

function setNavPosition() {
    const currentSlide = document.querySelector('.current-slide');
    const heroImage = currentSlide.querySelector('.hero-image-container img');
    const imageHeight = heroImage.offsetHeight;
    const navHeight = sliderNav.offsetHeight;
    
    if (window.innerWidth < 1000) {
        sliderNav.style.top = (imageHeight - navHeight) + 'px';
    } else {
        sliderNav.style.bottom = '';
        sliderNav.style.right = '';
        sliderNav.style.top = '';
    }
}

function setDotPosition() {
    const currentSlide = document.querySelector('.current-slide');
    const heroImage = currentSlide.querySelector('.hero-image-container img');
    const imageHeight = heroImage.offsetHeight;
    const dotsHeight = dotsNav.offsetHeight;
    
    if (window.innerWidth < 1000) {
        dotsNav.style.top = (imageHeight) + 'px';
    } else {
        sliderNav.style.bottom = '';
        sliderNav.style.right = '';
        sliderNav.style.top = '';
    }
}

// 4. Intersection Observer
const textObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            header.classList.add('observed');
        } else {
            header.classList.remove('observed');
        }
    });
}, options);

if (window.innerWidth < 1000) {
    textsToObserve.forEach(textToObserve => {
        textObserver.observe(textToObserve);
    });
}

// 5. Set up slides
slides.forEach((slide, index) => {
    slide.style.left = (index * slideWidth) + 'px';
});

// 6. Event listeners
slideContainer.addEventListener('touchstart', handleTouchStart, false);
slideContainer.addEventListener('touchend', handleTouchEnd, false);

nextBtn.addEventListener('click', handleNextSlide);
prevBtn.addEventListener('click', handlePrevSlide);

hamburgerBtn.addEventListener('click', function() {
    navMenu.classList.add('active');
    coverDiv.classList.add('active');
});

closeBtn.addEventListener('click', function() {
    navMenu.classList.remove('active');
    coverDiv.classList.remove('active');
});

window.addEventListener('load', function() {
    console.log("Page and all resources are fully loaded!");
    setSlideHeight();
    setNavPosition();
    setDotPosition();
});

window.addEventListener('resize', function() {
    setSlideHeight();
});