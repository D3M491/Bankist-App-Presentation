'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
//Button that will trigger the scroll animation
const btnScrollTo = document.querySelector('.btn--scroll-to');
//Target section
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');

//#region Modal window
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
//#endregion

//#region Scroll animation
btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  //With getBoundingClientRect() we get some coordinates of the target section
  const s1coords = section1.getBoundingClientRect();

  //the method is viewport dependent
  // console.log(e.target.getBoundingClientRect());
  //Window coordinates
  // console.log('Window coordinates (X/Y)', window.pageXOffset, pageYOffset);
  // console.log('Viewport coordinates xy', s1coords.left, s1coords.top);
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
  section1.scrollIntoView({ behavior: 'smooth' });
});
//#endregion

//#region Page navigation
// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     //We select the href link for the target section
//     const id = this.getAttribute('href');
//     //Attach a scroll smooth to all id
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//With event delegation (bubbles up) .
// 1) Add event listener to common parent element
// 2) Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //What element originated the link?
  console.log(e.target);
  //Matching strategy : checking if the target clicked has the class nav__link
  if (e.target.classList.contains('nav__link')) {
    //We select the href link for the target section , this time te target is not this keyword
    const id = e.target.getAttribute('href');
    //Attach a scroll smooth to all id
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//#endregion

//#region------------DOM Traversing
const h1 = document.querySelector('h1');
//Going downwards : childs-
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'black';

//Going upwards : parents
console.log(h1.parentNode);
console.log(h1.parentElement);

//Closest receive a query string . Search for the closest element that as the specified class
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
//Going sideways
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);

//Spreading the html collection into an array , iteration and application of scale only to el that are not h1
// [...h1.parentElement.children].forEach(el => {
//   if (el !== h1) el.style.transform = 'scale(.5)';
// });
//#endregion--------------------------

//#region-------------Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//Checking which is the target clicked , searching for closest .operations__tab
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab'); //Btn
  //Guard clause : if we get null so no correct click , return the function
  if (!clicked) return;
  //Removing class before adding it
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Adding tab
  clicked.classList.add('operations__tab--active');

  //Activate content area using dataset ( we take it dinamically with template string ) and adding the class
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//TODO ask claude why we use datasets in html

//#region-----------------------------

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

//#region Events
// const h1 = document.querySelector('h1');
// const alertH1 = function (e) {
//   alert('add event listener : Great you are reading the heading');
//   // h1.removeEventListener('mouseenter', alertH1); //Removed the event listener
// };

// h1.addEventListener('mouseenter', alertH1);

// //On mouse enter shortcut but its old!! With event listener i can add multiple functions
// // h1.onmouseenter = function (e) {
// //   alert('add event listener : Great you are reading the heading');
// // };

// setTimeout(() => {
//   h1.removeEventListener('mouseenter', alertH1);
// }, 3000);

//#endregion

//#region Bubbling / Event propagation
// //Bubbling / Event propagation
// //rgb(255, 255 , 255)
// //Random numbers generator on a range (known formula)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// //Generation of three different numbers for composing the color
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// console.log(randomColor(0, 255));

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   //Current target is this
//   console.log('LInk', e.target, e.currentTarget);

//   //Stop propagation but not good idea!!
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Container', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('Nav', e.target, e.currentTarget);
//   },
//   true, //RARELY USED : With true , the nav appears on top , so the event search travel from the top , not from down , like in capturing phase
// );
//#endregion

//#region Event delegation

//#endregion
