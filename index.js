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

// Лайк

const handleLike = evt => {
    evt.target.classList.toggle('card__like-button_active');
}


// Создание карточки

const cardTemplate = document.getElementById('card__template').content;
const cardsList = document.querySelector('.cards__list');

const createCard = (name, link) => {
    const newCard = cardTemplate.querySelector('.card').cloneNode(true);
    newCard.querySelector('.card__image').src = link;
    newCard.querySelector('.card__title').textContent = name;
    newCard.querySelector('.card__image').alt = name;
    cardsList.prepend(newCard);
    newCard.querySelector('.card__like-button').addEventListener('click', handleLike);
}

initialCards.forEach(item => {
    createCard(item.name, item.link);
});


// Добавление слушателей кнопкам для лайка

const likeButtonsList = Array.from(cardsList.querySelectorAll('.card__like-button'));
likeButtonsList.forEach(item => item.addEventListener('click', handleLike));


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

const profileNameElement = profileElement.querySelector('.profile__name');
const profileAboutElement = profileElement.querySelector('.profile__about');

const profileFormElement = profilePopupElement.querySelector('.form');
const profileNameInput = profileFormElement.querySelector('#profile-name');
const profileAboutInput = profileFormElement.querySelector('#profile-about');

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
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);
profileFormElement.addEventListener('submit', closePopup); 


// Добавление карточки

const cardAddButtonElement = document.querySelector('.profile__add-button');
const cardAddPopupElement = document.querySelector('.popup_add-card');
const cardAddFormElement = cardAddPopupElement.querySelector('.form');

const openCardAddPopup = () => {
    cardAddPopupElement.classList.add('popup_opened');
}

cardAddButtonElement.addEventListener('click', openCardAddPopup);

const handleCardAddFormSubmit = (evt) => {
    evt.preventDefault();
    const cardTitleInput = document.getElementById('place-title');
    const cardLinkInput = document.getElementById('place-link');
    createCard(cardTitleInput.value, cardLinkInput.value);
}

cardAddFormElement.addEventListener('submit', handleCardAddFormSubmit);
cardAddFormElement.addEventListener('submit', closePopup);



// Просмотр фото

// const cardViewPopupElement = document.querySelector('.popup_view-card');