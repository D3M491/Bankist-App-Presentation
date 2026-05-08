'use strict';

///////////////////////////////////////
// Pannello modale

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

//Btn che fa scattare l'animazione
const btnScrollTo = document.querySelector('.btn--scroll-to');
//Sezioni target
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
//Titolo h1
const h1 = document.querySelector('h1');

//Pannello modale apertura e chiusura
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

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

//Chiusura con esc
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Animazione di scroll
btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  //Ottieni le coordinate della section1
  const s1coords = section1.getBoundingClientRect();

  //Scrolling
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Navigazione pagina con event delegation
// 1) Aggiungi event listener ad un elemento padre
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // 2) Determina quale elemento ha originato l'evento
  //Matching strategy : controlla se l'elemento target ha la classe che mi interessa
  if (e.target.classList.contains('nav__link')) {
    //Ottieni il link
    const id = e.target.getAttribute('href');
    //Aggiungi uno smooth scroll a quell'id
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Componente a schede
//Controlla qual e il target cliccato cercando il .operations__tab piu vicino
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab'); //Btn
  //Guard clause: se otteniamo null non e un click valido, quindi termina la funzione
  if (!clicked) return;
  //Rimuovi la classe prima di aggiungerla
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Aggiungi la tab
  clicked.classList.add('operations__tab--active');

  //Attiva l'area contenuto usando il dataset e aggiungendo la classe
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`) //Con questo ottengo il valore numerico
    .classList.add('operations__content--active');
});

//Animazione fade del menu. Non serve passare l'opacita negli argomenti
const handleHover = function (e) {
  //I link non hanno elementi figli, quindi non serve usare closest
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    //Saliamo per cercare l'elemento con quella classe. Non posso usare closest per cercare .nav__links
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    // logo.style.opacity = this;
  }
};

//Passa un argomento nell'handler
//Bind crea una funzione copia separata passando un argomento . L'evento e è implicito , viene passato automaticamente dal browser come primo parametro
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////////Effetto navigazione sticky
//VERSIONE NON OTTIMALE
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', function (e) {
//   //Quando applicare la classe sticky?
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//Intersection Observer API: osserva i cambiamenti dell'oggetto target
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   //Root e l'elemento che il target (section1) sta intersecando
//   root: null, //Puoi selezionare un elemento o usare null per osservare l'intera viewport
//   //Percentuale di intersezione a cui vengono chiamate le callback
//   threshold: [0, 0.2], //Al 10% di visibilita del contenuto target , scatta la callback
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

//VERSIONE CORRETTA CON INTERSECTION OBSERVER
const header = document.querySelector('.header');
//Calcola l altezza del nav dinamicamente
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  //Solo se l'entry non sta piu intercettando aggiungi la sticky (intercetta subito perche vede subito l'header)
  if (!entry.isIntersecting) nav.classList.add('sticky');
  //Quando l'entry sta intercettando rimuovi la sticky
  else nav.classList.remove('sticky');
};
const headerObs = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  //Box alto quanto il nav applicato alla fine dell header
  rootMargin: `-${navHeight}px`,
});
headerObs.observe(header);

//Mostra le sezioni
const allSection = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  //Applica la logica a tutti gli observer
  entries.forEach(entry => {
    //Se non sta intercettando ,termina la funzione
    if (!entry.isIntersecting) return;
    //Rimuovi la classe
    entry.target.classList.remove('section--hidden');
    //Rimuovi l'observer ,  non serve piu
    observer.unobserve(entry.target);
  });
};
const sectionObs = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(section => {
  sectionObs.observe(section);
  section.classList.add('section--hidden');
});

//Caricamento lazy
//Seleziona le img con attributo data-src
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  //Sostituire src lazy con data-src
  entry.target.src = entry.target.dataset.src;
  //Attendi che abbia caricato prima di rimuovere la classe lazy
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  //Non osservare piu
  observer.unobserve(entry.target);
};
const imgObs = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  //Le immagini vengono visualizzate prima
  rootMargin: ' 200px',
});

//Osservando tutte le img
imgTargets.forEach(img => {
  imgObs.observe(img);
});

//Demo opening
//Appena clicchi su button si apre la demo version nella stessa pagina e non in full screen
const bntOpenDemo = document.querySelectorAll('.features__demo-btn');
// const btnCloseDemo = document.querySelectorAll('.features__demo-close-btn');

bntOpenDemo.forEach(btn => {
  btn.addEventListener('click', function () {
    btn.parentElement.insertAdjacentHTML(
      'afterbegin',
      ` 
    <div class="features__demo-modal">                                           
      <iframe src="https://d3m491.github.io/Bankist-App/" class="demo-iframe"></iframe>
      <button class="btn features__demo-close-btn">
            <svg class="demo__close-btn-svg">
              <use href="img/icons.svg#circle-x"></use>
            </svg>
      </button>
    </div>`,
    );
    overlay.classList.remove('hidden');
    //Crea button di chiusura
    const btnCloseDemo = document.querySelector('.features__demo-close-btn');
    btnCloseDemo.addEventListener('click', function (e) {
      closeDemo(btn);
    });
    //Chiusura cliccando fuori dal modale
    overlay.addEventListener('click', closeDemo.bind(null, btn));
  });
});

const closeDemo = function (btn) {
  btn.parentElement.querySelector('.features__demo-modal').remove();
  overlay.classList.add('hidden');
};

// btnCloseDemo.forEach(btn => {
//   btn.addEventListener('click', function (e) {
//     // e.preventDefault();
//     console.log('test');
//     console.log(btn.parentElement.querySelector('.features__demo-modal'));

//     if (e.target === 'Escape') {
//       btn.parentElement.querySelector('.features__demo-modal').remove();
//     }
//   });
// });
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
