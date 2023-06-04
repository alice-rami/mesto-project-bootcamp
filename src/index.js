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

// Попап и форма для подтверждения удаления карточки
const confirmPopupElement = document.querySelector('.popup_type_confirm-deletion');
const confirmForm = document.forms['confirm-deletion-form'];
const confirmPopupCloseButton = confirmPopupElement.querySelector('.popup__close-icon');

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
    
// Сохранение...  
const showLoader = (evt) => {
    evt.submitter.textContent = loader;
}
    
const restoreButtonText = (evt, buttonText) => {
    evt.submitter.textContent = buttonText;
}
    
// Изменение данных профиля
const openProfilePopup = () => {
        profileFormElement.reset();
        profileNameInput.value = profileNameElement.textContent;
        profileAboutInput.value = profileAboutElement.textContent;
        openPopup(profilePopupElement);
}

profileEditButtonElement.addEventListener('click', openProfilePopup);
    
const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    const userData = {
        name: profileNameInput.value,
        about: profileAboutInput.value
    };

    const buttonText = evt.submitter.textContent;
    showLoader(evt);
    
    editUserData(userData)
    .then(renderUserData)
    .catch(err => {
        console.log(err);
    })
    .finally(() => {
        closePopup(profilePopupElement);
        restoreButtonText(evt, buttonText);
    })
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

// Изменение аватара
const handleEditAvatar = evt => {
    evt.preventDefault();

    const buttonText = evt.submitter.textContent;
    showLoader(evt);

    updateAvatar(avatarLinkInput.value)
    .then(res => {
        profileAvatarElement.src = res.avatar;
    })
    .catch(err => {
        console.log(err);
    })
    .finally(() => {
        closePopup(avatarPopupElement);
        restoreButtonText(evt, buttonText);
    })
}

avatarEditForm.addEventListener('submit', handleEditAvatar);

avatarEditButton.addEventListener('click', () => {
    avatarEditForm.reset();
    openPopup(avatarPopupElement);
});

// Подтверждение удаления карточки
const checkConfirmation = (isConfirmed, cardId) => {
    return new Promise((resolve, reject) => {
        if(isConfirmed) {
            resolve(deleteCard(cardId));
        } else {
            reject('Удаление отменено');
        }
    })
}

const handleConfirmation = (cardId, deleteCardElement) => {
    openPopup(confirmPopupElement);

    const checkAction = evt => {
        let result;
        if (evt.type === 'click' || (evt.type === 'keydown' && evt.key === 'Escape') || (evt.type === 'mousedown' && evt.target.classList.contains('popup'))) {
            result = false;
        }
        if (evt.type === 'submit') {
            evt.preventDefault();
            result = true;
        }
        if (result !== undefined) {
            checkConfirmation(result, cardId)
            .then(() => {
                deleteCardElement();
                closePopup(confirmPopupElement);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                document.removeEventListener('keydown', checkAction); 
                confirmPopupElement.removeEventListener('mousedown', checkAction);
                confirmPopupCloseButton.removeEventListener('click', checkAction);
                confirmForm.removeEventListener('submit', checkAction);
            })
        }
    }
    
    document.addEventListener('keydown', checkAction); 
    confirmPopupElement.addEventListener('mousedown', checkAction);
    confirmPopupCloseButton.addEventListener('click', checkAction);
    confirmForm.addEventListener('submit', checkAction);
}

// Создание и добавление карточки
const createCard = res => {
    const newCard = createCardElement(res, userId, handleConfirmation);
    return newCard;
}

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

    const buttonText = evt.submitter.textContent;
    showLoader(evt);

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
        restoreButtonText(evt, buttonText);
        closePopup(cardAddPopupElement);
    })
}

cardAddFormElement.addEventListener('submit', handleCardAddFormSubmit);

// Включение валидации
enableValidation(settings);