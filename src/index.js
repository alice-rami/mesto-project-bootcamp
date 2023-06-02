import './pages/index.css';
import { enableValidation } from "./components/validate.js";
import { createCardElement } from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";
import { addNewCard, deleteCard, editUserData, loadCardsData, loadUserData } from './components/api.js';

// Переменные

export const settings = {
    formSelector: '.form',
    inputSelector: '.form__input',
    inputInvalidSelector: '.form__input_invalid',
    submitButtonSelector: '.form__submit-button',
}; 

let userId;

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

// Функции и добавление слушателей

// Загрузка информации о пользователе с сервера
const renderUserData = res => {
    profileNameElement.textContent = res.name;
    profileAboutElement.textContent = res.about;
    profileAvatarElement.src = res.avatar;
    userId = res._id;
}

// Загрузка карточек с сервера

const renderCardsData = () => {
  loadCardsData()
    .then(res => {
        res.forEach(item => {
            const newCard = createCard(item);
             cardsContainer.append(newCard);
            })
        })
    .catch(err => {
            console.log(err)
    })
}

loadUserData()
    .then(renderUserData)
    .then(renderCardsData)
    .catch(err => {
        console.log(err);
    });

const openProfilePopup = () => {
    profileFormElement.reset();
    profileNameInput.value = profileNameElement.textContent;
    profileAboutInput.value = profileAboutElement.textContent;
    openPopup(profilePopupElement);
}

profileEditButtonElement.addEventListener('click', openProfilePopup);

// Изменение данных профиля

const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    const userData = {
        name: profileNameInput.value,
        about: profileAboutInput.value
    };
    editUserData(userData)
    .then(renderUserData)
    .catch(err => {
        console.log(err);
    })
    closePopup(profilePopupElement);
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);


const handleDeleteCard = (cardId, deleteCardElement) => {
    deleteCard(cardId)
    .then(() => {
        deleteCardElement();
    })
    .catch(err => {
        console.log(err);
    })
}

const createCard = res => {
    const newCard = createCardElement(res, userId, handleDeleteCard);
    return newCard;
}

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
    addNewCard(cardData)
    .then(res => {
        const newCard = createCard(res);
        cardsContainer.prepend(newCard);
    })
    .catch(err => {
        console.log(err);
    })
    cardAddFormElement.reset();
    closePopup(cardAddPopupElement);
}

cardAddFormElement.addEventListener('submit', handleCardAddFormSubmit);



// Включение валидации
    
enableValidation(settings);