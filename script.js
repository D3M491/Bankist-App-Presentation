'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// //How to select create and delete elements with js
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');

// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons); //Html colletction is different than nodelist . It updates automatically as we make some changes in it`

// document.getElementsByClassName('btn');

// //Creating and inserting elements
// //1).insertAdjacentHTML
// //2)CREATE ELEMENT : It's not on the dom , its simply an object we can use
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML = `We use cookies for improved functionality and analytics <button class  ="btn btn--close-cookie ">Got it!</button> `;

// //Last child of header , otherwise the first child would have been prepend
// header.append(message);
// //header.prepend(message); //We can't put it in two places , js will choose the last one DOM element is unique

// //CLONENODE : We can clone it to have in both places , using cloneNode( the true stands for passing all the child element or not )
// // header.prepend(message.cloneNode(true));

// //BEFORE AND AFTER , the element get placed directly before or after, outside the header and not in it as a child
// header.before(message);
// header.append(message);

// //DELETE ELEMENTS USING REMOVE
// document
//   .querySelector('.btn--close-cookie')
//   //New way
//   .addEventListener('click', () => message.remove());
// //Old way
// //message.parentElement.removeChild())

// //Styles
// //These are inline styles
// message.style.backgroundColor = '#37384d';
// message.style.width = ' 120%';

// //This selection works only on the styles we created inline manually
// console.log(message.style.backgroundColor);
// console.log(message.style.color); //Empty string

// //Way to get the other styles
// console.log(getComputedStyle(message).height);

// message.style.height =
//   //We need to use parseFloat because this is a floating number ( not integer )
//   Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
// console.log(getComputedStyle(message).height);

// //SET PROPERTY ON THE ROOT , first value is the property name , second is the value
// document.documentElement.style.setProperty('--color-primary', 'white');

// //ATTRIBUTES
// const logo = document.querySelector('.nav__logo');
// //We can call the attributes on an element
// console.log(logo.src);
// console.log(logo.className);

// //I can set also an attribute
// logo.alt = 'Beautiful minimalist logo';
// console.log(logo.alt);

// //Setting non standard attribute
// logo.setAttribute('company', 'Google');

// console.log(logo.designer); //Undefined , i can call only the standard attributes of the img el
// console.log(logo.getAttribute('designer')); //I can however select the non standard attribute
// console.log(logo.getAttribute('company'));

// //To get the src path explicit we need to get the attribute on it
// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href); //Whole link
// console.log(link.getAttribute('href')); //Only the text of the link

// //Data attributes , dataset then camelCase on the other words (Attribute is => data-version-number = "3.0")
// console.log(logo.dataset.versionNumber); //Used for storing data into user interface

// //Classes
// logo.classList.add('c', 'i'); //I can also pass multiple classes
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c');

// logo.className = 'Jonas'; //Don't use , it overwrite all existing class

//#region Scroll animation
//Button that will trigger the scroll animation
const btnScrollTo = document.querySelector('.btn--scroll-to');
//Target section
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');

btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  //With getBoundingClientRect() we get some coordinates of the target section
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  const s2coords = section2.getBoundingClientRect();
  console.log(s2coords);
  //the method is viewport dependent
  // console.log(e.target.getBoundingClientRect());
  //Window coordinates
  console.log('Window coordinates (X/Y)', window.pageXOffset, pageYOffset);
  console.log('Viewport coordinates xy', s1coords.left, s1coords.top);
  // console.log(
  //   'heigth/width ',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth,
  // );

  //Scrolling
  //First we use scrollTo then we pass left and top . Left and Top . We need to get the document left and top and not the viewport ones . Current position + current scroll

  //First way without smoothness
  // window.scrollTo(
  //   s2coords.left + window.pageXOffset,
  //   s2coords.top + window.pageYOffset,
  // );

  //Second way with smoothness
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //New easiest way!!!
  section2.scrollIntoView({ behavior: 'smooth' });
});
//#endregion

//Events
const h1 = document.querySelector('h1');
const alertH1 = function (e) {
  alert('add event listener : Great you are reading the heading');
  h1.removeEventListener('mouseenter', alertH1); //Removed the event listener
};

h1.addEventListener('mouseenter', alertH1);

//On mouse enter shortcut but its old!! With event listener i can add multiple functions
// h1.onmouseenter = function (e) {
//   alert('add event listener : Great you are reading the heading');
// };
