'use strict';

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
const menuIcon = document.querySelector('.nav__menu-icon');
const h1 = document.querySelector('h1');
ù;
//Mobile menu logic
const toggleMobileMenu = function () {
  //Keeps it green while menu is open
  menuIcon.classList.toggle('nav__menu-open');

  //Show modal
  document.querySelector('.nav__links').classList.toggle('show');

  //Show overlay
  overlay.classList.toggle('hidden');
};

menuIcon.addEventListener('click', function (e) {
  e.preventDefault();
  toggleMobileMenu();
});

//todo fix closing menu on modal x press
overlay.addEventListener('click', () => {
  toggleMobileMenu();
  closeModal();
});

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

//Effetto navigazione sticky
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

//Slider
const slider = function () {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  //Slider attuale
  let curSlide = 0;
  //Definisci il limite di slide
  const maxSlide = slides.length - 1;

  //Functions
  //Crea un pulsante dot per ogni slide
  const createDots = function () {
    slides.forEach((s, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',

        `<button class="dots__dot dots__dot--active" data-slide="${i}">
      </button>`,
      );
    });
  };

  //Effetto dot attivo
  const activateDots = function (slide) {
    //Seleziona tutti i dot e rimuovi classe active
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });

    //Seleziona utilizzando il parametro slide , il dot attivo
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  //Logica slider
  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      //Sottrai l'index alla current slide ( voglio ottenere questo : 0% , 100% , 200%)
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
  };

  //Prossima slide
  const nextSlide = function () {
    //Se siamo all'ultima slide , riportami alla prima
    if (curSlide === maxSlide) {
      curSlide = 0;
      //Altrimenti continua ad andare avanti
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  };

  //Inizializzazione
  const init = function () {
    goToSlide(0);
    createDots();
    activateDots(0);
  };

  init();

  btnRight.addEventListener('click', nextSlide);

  //Slide precedente
  const prevSlide = function () {
    //Se siamo alla prima slide , riportami all'ultima
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  };
  btnLeft.addEventListener('click', prevSlide);

  //Cambia slide con le frecce
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  //Event listener dei dot
  dotContainer.addEventListener('click', function (e) {
    //Event delegation , cerca gli elementi con la classe dot
    if (e.target.classList.contains('dots__dot')) {
      //Ottieni il numero di slide
      const slide = Number(e.target.dataset.slide);
      //Vai a slide che corrisponde al dot cliccato
      goToSlide(slide);
      //Attiva il dot corrente
      activateDots(slide);
    }
  });
};

slider();
