import { initialCards } from "./initialCards.js";
import { enableValidation, disableButton } from "./validate.js";

// Переменные

// Шаблон для создания карточки, поля формы и контейнер для добавления карточек
const cardTemplate = document.getElementById('card__template').content.querySelector('.card');
const cardTitleInput = document.getElementById('place-title');
const cardLinkInput = document.getElementById('place-link');
const cardsContainer = document.querySelector('.cards__list');

// Кнопка, попап и форма для добавления карточки
const cardAddButtonElement = document.querySelector('.profile__add-button');
const cardAddPopupElement = document.querySelector('.popup_type_add-card');
const cardAddFormElement = cardAddPopupElement.querySelector('.form');

// Попап и поля контейнера для просмотра фото
const cardViewPopupElement = document.querySelector('.popup_type_view-image');
const targetImageElement = cardViewPopupElement.querySelector('.view-template__image');
const targetImageTitleElement = cardViewPopupElement.querySelector('.view-template__title');

// Поля профиля и кнопка редактирования профиля
const profileElement = document.querySelector('.profile');
const profileNameElement = profileElement.querySelector('.profile__name');
const profileAboutElement = profileElement.querySelector('.profile__about');
const profileEditButtonElement = profileElement.querySelector('.profile__edit-button');

// Попап и форма для редактирования профиля
const profilePopupElement = document.querySelector('.popup_type_profile');
const profileFormElement = profilePopupElement.querySelector('.form');
const profileNameInput = profileFormElement.querySelector('#profile-name');
const profileAboutInput = profileFormElement.querySelector('#profile-about');

// Списки для добавления слушателей
const popupCloseButtonsList = Array.from(document.querySelectorAll('.popup__close-icon'));
const popupsList = document.querySelectorAll('.popup');

// Функции и добавление слушателей

const handleLikeButton = likeButtonElement => {
    likeButtonElement.classList.toggle('card__like-button_active');
}

const removeCard = cardElement => {
    cardElement.remove();
}

const openPopup = popup => {
    popup.classList.add('popup_opened');
}

cardAddButtonElement.addEventListener('click', () => {
    openPopup(cardAddPopupElement);
    cardAddFormElement.reset();
});

const viewImage = cardData => {
    targetImageElement.src = cardData.link;
    targetImageElement.alt = cardData.name;
    targetImageTitleElement.textContent = cardData.name;
    openPopup(cardViewPopupElement);
}

const createCard = (cardData) => {
    const newCard = cardTemplate.cloneNode(true);
    const newCardImage = newCard.querySelector('.card__image');
    const newCardLikeButton = newCard.querySelector('.card__like-button');
    newCardImage.src = cardData.link;
    newCardImage.alt = cardData.name;
    newCardImage.addEventListener('click', () => viewImage(cardData));
    newCard.querySelector('.card__title').textContent = cardData.name;
    newCardLikeButton.addEventListener('click', () => handleLikeButton(newCardLikeButton));
    newCard.querySelector('.card__remove-button').addEventListener('click', () => removeCard(newCard));
    return newCard;
}

initialCards.forEach(item => {
    const newCard = createCard(item);
    cardsContainer.append(newCard);
});

const closePopup = popup => {
    popup.classList.remove('popup_opened');
}

popupCloseButtonsList.forEach(item => item.addEventListener('click', () => closePopup(item.closest('.popup'))));

const handleCardAddFormSubmit = (evt) => {
    evt.preventDefault();
    const cardData = {
        name: cardTitleInput.value, 
        link: cardLinkInput.value
    };
    const newCard = createCard(cardData);
    cardsContainer.prepend(newCard);
    cardAddFormElement.reset();
    disableButton(evt.submitter);
    closePopup(cardAddPopupElement);
}

cardAddFormElement.addEventListener('submit', handleCardAddFormSubmit);

const openProfilePopup = () => {
    profileNameInput.value = profileNameElement.textContent;
    profileAboutInput.value = profileAboutElement.textContent;
    openPopup(profilePopupElement);
}

profileEditButtonElement.addEventListener('click', openProfilePopup);

const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    profileNameElement.textContent = profileNameInput.value;
    profileAboutElement.textContent = profileAboutInput.value;
    closePopup(profilePopupElement);
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);


// Закрытие попапа по клику на оверлей

const closeByClickOnOverlay = (evt) => {
    console.log(evt.target);
    if (evt.target.classList.contains('popup')) {
        closePopup(evt.target);
    }
}

popupsList.forEach(popupElement => {
    popupElement.addEventListener('mousedown', closeByClickOnOverlay);
});


// Валидация

export const settings = {
    formSelector: '.form',
    inputSelector: '.form__input',
    submitButtonSelector: '.form__submit-button'
}; 

enableValidation(settings);