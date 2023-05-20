const initialCards = [
    {
        name: 'Архыз',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg'
    },
    {
      name: 'Челябинская область',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg'
    },
    {
      name: 'Иваново',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg'
    },
    {
        name: 'Камчатка',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg'
    },
    {
        name: 'Холмогорский район',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg'
    },
    {
        name: 'Байкал',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
    }
];

// Создание карточки

const cardTemplate = document.getElementById('card__template').content;

const createCard = (name, link) => {
    const cardsList = document.querySelector('.cards__list');
    const newCard = cardTemplate.querySelector('.card').cloneNode(true);
    newCard.querySelector('.card__image').src = link;
    newCard.querySelector('.card__title').textContent = name;
    newCard.querySelector('.card__image').alt = name;
    cardsList.append(newCard);
}

initialCards.forEach(item => {
    createCard(item.name, item.link);
});

// Закрытие попапа

const closePopup = evt => {
    evt.target.closest('.popup').classList.remove('popup_opened');
}

const popupCloseButtonsList = Array.from(document.querySelectorAll('.popup__close-icon'));
popupCloseButtonsList.forEach(item => item.addEventListener('click', closePopup));

// Редактирование профиля

const profileElement = document.querySelector('.profile');
const profilePopupElement = document.querySelector('.popup_profile');

const profileEditButtonElement = profileElement.querySelector('.profile__edit-button');
const popupSubmitButtonElement = profilePopupElement.querySelector('.popup__submit-button');

const profileNameElement = profileElement.querySelector('.profile__name');
const profileAboutElement = profileElement.querySelector('.profile__about');

const profileFormElement = profilePopupElement.querySelector('.popup__form');
const profileNameInput = profileFormElement.querySelector('#profile__name');
const profileAboutInput = profileFormElement.querySelector('#profile__about');

const openProfilePopup = () => {
    profilePopupElement.classList.add('popup_opened');
    profileNameInput.value = profileNameElement.textContent;
    profileAboutInput.value = profileAboutElement.textContent;
}

profileEditButtonElement.addEventListener('click', openProfilePopup);

const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    profileNameElement.textContent = profileNameInput.value;
    profileAboutElement.textContent = profileAboutInput.value;
    closePopup();
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);
profileFormElement.addEventListener('submit', closePopup); 


// Добавление карточки

const cardAddButtonElement = document.querySelector('.profile__add-button');
const cardAddPopupElement = document.querySelector('.popup_add-card');
const cardAddFormElement = cardAddPopupElement.querySelector('.popup__form');

const openCardAddPopup = () => {
    cardAddPopupElement.classList.add('popup_opened');
}

cardAddButtonElement.addEventListener('click', openCardAddPopup);

const handleCardAddFormSubmit = (evt) => {
    evt.preventDefault();
    const cardTitleInput = document.getElementById('place__title');
    const cardLinkInput = document.getElementById('place__link');
    createCard(cardTitleInput.value, cardLinkInput.value);
    console.log(evt.target);
    console.log(evt.target.closest('.popup').classList);
    closePopup();
}

cardAddFormElement.addEventListener('submit', handleCardAddFormSubmit);
cardAddFormElement.addEventListener('submit', closePopup);



// Просмотр фото

// const cardViewPopupElement = document.querySelector('.popup_view-card');