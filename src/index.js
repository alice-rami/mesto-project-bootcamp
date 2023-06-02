import './pages/index.css';
import { enableValidation } from "./components/validate.js";
import { createCardElement } from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";
import { addNewCard, deleteCard, editUserData, loadCardsData, loadUserData, updateAvatar } from './components/api.js';

// Переменные

export const settings = {
    formSelector: '.form',
    inputSelector: '.form__input',
    inputInvalidSelector: '.form__input_invalid',
    submitButtonSelector: '.form__submit-button',
}; 

let userId;
const loader = 'Сохранение...'

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

// Кнопка, попап и форма для изменения аватара
const avatarEditButton = profileElement.querySelector('.profile__avatar-edit-button');
const avatarPopupElement = document.querySelector('.popup_type_edit-avatar');
const avatarEditForm = document.forms['avatar-form'];
const avatarLinkInput = avatarEditForm.elements['avatar-link'];

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

// Сохранение...

const renderLoader = (isLoading, button, initialButtonText) => {
        isLoading ? button.textContent = loader : button.textContent = initialButtonText;
    }

const toggleLoader = (evt, isLoading) => {
        const submitButton = evt.submitter;
        const initialText = submitButton.textContent;
        renderLoader(isLoading, submitButton, initialText);
    }
    
// Изменение данных профиля

const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    const userData = {
        name: profileNameInput.value,
        about: profileAboutInput.value
    };

    toggleLoader(evt, true);
    
    editUserData(userData)
    .then(renderUserData)
    .catch(err => {
        console.log(err);
    })
    .finally(() => {
        closePopup(profilePopupElement);
        toggleLoader(evt, false);
    })
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

// Изменение аватара

const handleEditAvatar = evt => {
    evt.preventDefault();

    toggleLoader(evt, true);

    updateAvatar(avatarLinkInput.value)
    .then(res => {
        profileAvatarElement.src = res.avatar;
    })
    .catch(err => {
        console.log(err);
    })
    .finally(() => {
        closePopup(avatarPopupElement);
        toggleLoader(evt, false);
    })
    
}

avatarEditForm.addEventListener('submit', handleEditAvatar);

avatarEditButton.addEventListener('click', () => {
    avatarEditForm.reset();
    openPopup(avatarPopupElement);
});

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

    toggleLoader(evt, true);

    addNewCard(cardData)
    .then(res => {
        const newCard = createCard(res);
        cardsContainer.prepend(newCard);
    })
    .catch(err => {
        console.log(err);
    })
    .finally(() => {
        cardAddFormElement.reset();
        toggleLoader(evt, false);
        closePopup(cardAddPopupElement);
    })
}

cardAddFormElement.addEventListener('submit', handleCardAddFormSubmit);

// Включение валидации
    
enableValidation(settings);