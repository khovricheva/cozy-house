const burgerMenuBtn = document.querySelector('.header__menu_burger');
const burgerMenu = document.querySelector('.header__mobile-menu');
const wrapper = document.querySelector('.wrapper');
const petsSlider = document.querySelector('.pets__slider');
const arrowRight = document.querySelector('.arrow_right');
const arrowLeft = document.querySelector('.arrow_left');
const popup = document.querySelector('.popup');

let cardBtns = [];
let pets = [];
let fullPetsList = [];
let cardsPerPage = 0;
let page = 0;

// toggle mobile menu
function toggleBurgerMenu() {
  burgerMenuBtn.classList.toggle('is-active');
  burgerMenu.classList.toggle('is-show');
  wrapper.classList.toggle('darkening');
  document.body.classList.toggle('hidden');
}

// close mobile menu on click another area
function closeBurgerMenu(event) {
  if (
    event.target.getBoundingClientRect().top === 0 &&
    event.target.getBoundingClientRect().left === 0
  ) {
    burgerMenuBtn.classList.remove('is-active');
    burgerMenu.classList.remove('is-show');
    wrapper.classList.remove('darkening');
    document.body.classList.remove('hidden');
  }
}

//sort pets list
function arrangeItems(list) {
  let unique8List = [];
  let length = list.length;

  for (let i = 0; i < length / 8; i++) {
    const uniqueStepList = [];

    for (j = 0; j < list.length; j++) {
      if (uniqueStepList.length >= 8) {
        break;
      }

      const isUnique = !uniqueStepList.some((item) => {
        return item.name === list[j].name;
      });

      if (isUnique) {
        uniqueStepList.push(list[j]);
        list.splice(j, 1);
        j--;
      }
    }

    unique8List = [...unique8List, ...uniqueStepList];
  }

  list = unique8List;

  list = getUnique6List(list);

  return list;
}

//get unique 6 elements
function getUnique6List(list) {
  const length = list.length;

  for (let i = 0; i < length / 6; i++) {
    const stepList = list.slice(i * 6, i * 6 + 6);

    for (let j = 0; j < 6; j++) {
      const duplicatedItem = stepList.find((item, index) => {
        return item.name === stepList[j].name && index !== j;
      });

      if (duplicatedItem !== undefined) {
        const index = i * 6 + j;
        const which8ofList = Math.trunc(index / 8);

        list.splice(which8ofList * 8, 0, list.splice(index, 1)[0]);

        getUnique6List(list);
      }
    }
  }

  return list;
}

//get full pets list
fetch('./pets.json')
  .then((response) => response.json())
  .then((list) => {
    pets = list;

    fullPetsList = (() => {
      let tempArr = [];

      for (let i = 0; i < 6; i++) {
        const newPets = pets;

        for (let j = pets.length; j > 0; j--) {
          let randindex = Math.floor(Math.random() * j);
          const randElem = newPets.splice(randindex, 1)[0];
          newPets.push(randElem);
        }

        tempArr = [...tempArr, ...newPets];
      }
      return tempArr;
    })();

    fullPetsList = arrangeItems(fullPetsList);

    createPets(fullPetsList, petsSlider, cardsPerPage, page);
  });

//create pets card
function createElements(petsList) {
  let layout = '';
  for (let i = 0; i < petsList.length; i++) {
    layout += `
    <div class="pets__card">
    <img
      class="card__photo"
      src="${petsList[i].img}"
      alt="pets-card"
    />
    <div class="card__title">${petsList[i].name}</div>
    <a class="card__btn" href="#">Learn more</a>
  </div>`;
  }
  return layout;
}

//fill slider
function createPets(fullPetsList, petsSlider, cardsPerPage, page) {
  if (innerWidth >= 1280) {
    cardsPerPage = 3;
  } else if (innerWidth <= 1279 && innerWidth >= 768) {
    cardsPerPage = 2;
  } else if (innerWidth <= 767) {
    cardsPerPage = 1;
  }

  let start = cardsPerPage * page;
  let end = start + cardsPerPage;
  let paginatedItems = fullPetsList.slice(start, end);

  petsSlider.innerHTML = createElements(paginatedItems);

  petsCards = document.querySelectorAll('.pets__card');
  petsCards.forEach((petsCard) => {
    petsCard.addEventListener('click', openPopup);
  });
}

//add animation to pets container
function animationCard() {
  petsSlider.classList.add('animation');
  setTimeout(() => {
    petsSlider.classList.remove('animation');
  }, 500);
}

//turn previous slide
function turnPrevSlide() {
  animationCard();
  if (innerWidth >= 1280) {
    cardsPerPage = 3;
  } else if (innerWidth <= 1279 && innerWidth >= 768) {
    cardsPerPage = 2;
  } else if (innerWidth <= 767) {
    cardsPerPage = 1;
  }

  if (page === 0 && cardsPerPage === 3) {
    page = 16;
  } else if (page === 0 && cardsPerPage === 2) {
    page = 24;
  } else if (page === 0 && cardsPerPage === 1) {
    page = 48;
  }
  page--;

  createPets(fullPetsList, petsSlider, cardsPerPage, page);
}

//turn next slide
function turnNextSlide() {
  animationCard();
  page++;

  if (innerWidth >= 1280) {
    cardsPerPage = 3;
  } else if (innerWidth <= 1279 && innerWidth >= 768) {
    cardsPerPage = 2;
  } else if (innerWidth <= 767) {
    cardsPerPage = 1;
  }

  if (page === 16 && cardsPerPage === 3) {
    page = 0;
  } else if (page === 24 && cardsPerPage === 2) {
    page = 0;
  } else if (page === 48 && cardsPerPage === 1) {
    page = 0;
  }
  createPets(fullPetsList, petsSlider, cardsPerPage, page);
}

//listen to resize the window
window.addEventListener('resize', function () {
  createPets(fullPetsList, petsSlider, cardsPerPage, page);
});

//create popup layput
function createPopup(petData) {
  document.body.classList.add('hidden');
  popup.style.display = 'block';

  let layoutPopup = '';
  layoutPopup = `
    <div class="popup__content">
      <img src="${petData.img}" alt="popup-img" class="popup__img" />
      <div class="popup__information">
        <h3 class="popup__name">${petData.name}</h3>
        <div class="popup__type">${petData.type} - ${petData.breed} </div>
        <div class="popup__description">${petData.description}</div>
        <ul class="popup__list">
          <li class="popup__list__item">Age: 
            <span>${petData.age}</span>
          </li>
          <li class="popup__list__item">Inoculations: 
            <span>${petData.inoculations}</span>
          </li>
          <li class="popup__list__item">Diseases: 
            <span>${petData.diseases}</span>
          </li>
          <li class="popup__list__item">Parasites: 
            <span>${petData.parasites}</span>
          </li>
        </ul>
      </div>
      <button class="popup__btn">
      <img src="../../assets/icons/close.svg" alt="close-popup" class="popup__btn-img">
      </button>
    </div>`;
  popup.innerHTML = layoutPopup;
}

//open popup
function openPopup(event) {
  event.preventDefault();
  let cardTitle = '';

  if (event.target.classList[0] == 'pets__card') {
    cardTitle = event.target.childNodes[3];
  } else {
    cardTitle = event.target.parentNode.childNodes[3];
  }

  let petName = cardTitle.innerText;

  fetch('./pets.json')
    .then((response) => response.json())
    .then((petsData) => {
      let petData = petsData.filter((petInfo) => {
        return petInfo.name === petName;
      });
      createPopup(petData[0]);
    });
}

//close popup
function closePopup(event) {
  if (
    event.target.classList[0] === 'popup' ||
    event.target.classList[0] === 'popup__btn' ||
    event.target.classList[0] === 'popup__btn-img'
  ) {
    popup.style.display = 'none';
    document.body.classList.remove('hidden');
  }
}

//change style of popup button
function changePopupBtn(event) {
  let popupBtn = document.querySelector('.popup__btn');
  if (popupBtn) {
    if (popupBtn.classList.contains('activeBtn')) {
      popupBtn.classList.remove('activeBtn');
    } else if (event.target.getBoundingClientRect().top === 0) {
      popupBtn.classList.add('activeBtn');
    }
  }
}

//event listeners
burgerMenuBtn.addEventListener('click', toggleBurgerMenu);
arrowRight.addEventListener('click', turnNextSlide);
arrowLeft.addEventListener('click', turnPrevSlide);
document.addEventListener('click', closeBurgerMenu);
document.addEventListener('click', closePopup);
document.addEventListener('mouseover', changePopupBtn);
