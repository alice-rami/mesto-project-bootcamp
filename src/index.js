import './pages/index.css';
import { initialCards } from "./components/initialCards.js";
import { enableValidation } from "./components/validate.js";
import { createCard } from "./components/card.js";
import { openPopup, closePopup, closeByClickOnOverlay } from "./components/modal.js";
import { loadUserData } from './components/api.js';

// Переменные

export const settings = {
    formSelector: '.form',
    inputSelector: '.form__input',
    inputInvalidSelector: '.form__input_invalid',
    submitButtonSelector: '.form__submit-button',
}; 

// Контейнер для создания карточки

const cardsContainer = document.querySelector('.cards__list');

// Кнопка, попап и форма и поля для добавления карточки
const cardAddButtonElement = document.querySelector('.profile__add-button');
const cardAddPopupElement = document.querySelector('.popup_type_add-card');
const cardAddFormElement = document.forms['place-form'];
const cardTitleInput = cardAddFormElement.elements['place-title'];
const cardLinkInput = cardAddFormElement.elements['place-link'];

// Поля профиля и кнопка редактирования профиля
const profileElement = document.querySelector('.profile');
const profileNameElement = profileElement.querySelector('.profile__name');
const profileAboutElement = profileElement.querySelector('.profile__about');
const profileAvatarElement = profileElement.querySelector('.profile__avatar');
const profileEditButtonElement = profileElement.querySelector('.profile__edit-button');

// Попап и форма для редактирования профиля
const profilePopupElement = document.querySelector('.popup_type_profile');
const profileFormElement = document.forms['profile-form'];
const profileNameInput = profileFormElement.elements['profile-name'];
const profileAboutInput = profileFormElement.elements['profile-about'];

// Списки для добавления слушателей
const popupCloseButtonsList = Array.from(document.querySelectorAll('.popup__close-icon'));
const popupsList = document.querySelectorAll('.popup');

// Создание карточек из исходного массива
initialCards.forEach(item => {
    const newCard = createCard(item);
    cardsContainer.append(newCard);
});

// Функции и добавление слушателей

popupCloseButtonsList.forEach(item => {
    item.addEventListener('click', () => closePopup(item.closest('.popup')))
});

cardAddButtonElement.addEventListener('click', () => {
    cardAddFormElement.reset();
    openPopup(cardAddPopupElement);
});

const handleCardAddFormSubmit = (evt) => {
    evt.preventDefault();
    const cardData = {
        name: cardTitleInput.value, 
        link: cardLinkInput.value
    };
    const newCard = createCard(cardData);
    cardsContainer.prepend(newCard);
    cardAddFormElement.reset();
    closePopup(cardAddPopupElement);
}

cardAddFormElement.addEventListener('submit', handleCardAddFormSubmit);

// Загрузка информации о пользователе с сервера

const renderUserData = () => {
    loadUserData()
    .then(res => {
        profileNameElement.textContent = res.name;
        profileAboutElement.textContent = res.about;
        profileAvatarElement.src = res.avatar;
       })
    .catch(err => {
        console.log(err);
    })
}

renderUserData();

const openProfilePopup = () => {
    profileFormElement.reset();
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

popupsList.forEach(popupElement => {
    popupElement.addEventListener('mousedown', closeByClickOnOverlay);
});

enableValidation(settings);