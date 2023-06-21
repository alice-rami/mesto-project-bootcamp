import './pages/index.css';
import { settings, apiRequestConfig, profileSelectors, cardsContainer, cardAddButtonElement, cardAddPopupElement, cardAddFormElement, cardTitleInput, cardLinkInput, confirmPopupElement, confirmForm, profileNameElement,profileAboutElement, profileAvatarElement, profileEditButtonElement, profilePopupElement, profileFormElement, profileNameInput, profileAboutInput, avatarEditButton, avatarPopupElement, avatarEditForm, avatarLinkInput, popupsList, popupCloseButtonsList, cardViewPopupElement, targetImageElement, targetImageTitleElement } from "./components/constants.js";
import { openPopup, closePopup, closeByClickOnOverlay } from "./components/modal.js";
import { renderLoading } from './components/utils.js';
import Api from "./components/Api.js";
import Card from './components/Card.js';
import FormValidator from './components/FormValidator.js';
import UserInfo from './components/UserInfo.js';
import Section from './components/Section.js';
import PopupWithImage from './components/PopupWithImage.js';
import Popup from './components/Popup';
import PopupWithForm from './components/PopupWithForm.js';

// Переменные
let userId;
const cardForDeletion = {};


// создании экз класса
const api = new Api(apiRequestConfig);

const userInfo = new UserInfo(profileSelectors, {});

const popupViewImage = new PopupWithImage('.popup_type_view-image', '.view-template__title', '.view-template__image');
popupViewImage.setEventListeners();

const handleSubmit = (request, evt, loadingText = 'Сохранение...') => {
    evt.preventDefault();
    const submitButton = evt.submitter;
    const initialText = submitButton.textContent;
    renderLoading(true, submitButton, initialText, loadingText);

    request()
    .then(() => {
        evt.target.reset();
        closePopup(evt.target.closest('.popup'));
    })
    .catch(console.error)
    .finally(() => {
        renderLoading(false, submitButton, initialText);
    });
}

const handleProfileSubmit = (evt, userData) => {
    console.log(userData);
    const makeRequest = () => {
        return api.editUserData(userData).then((res) => {
            userInfo.setUserInfo(userInfo.getUserInfo(res));
        })
    }
    handleSubmit(makeRequest, evt);
}

const handleEditAvatar = (evt, {avatar}) => {
    const makeRequest = () => {
        return api.updateAvatar(avatar).then((res) => {
            userInfo.setUserInfo(userInfo.getUserInfo(res));
        })
    }
    handleSubmit(makeRequest, evt);
}

const cardAddSubmit = (evt, cardData) => {
    const makeRequest = () => {     
        return api.addNewCard(cardData).then((res) => {
            const cardElement = generateCard(res);
            cardsList.addItem(cardElement)
        });
    }
    handleSubmit(makeRequest, evt);
}

const checkConfirmation = (isConfirmed) => {
    return new Promise((resolve, reject) => {
        if(isConfirmed) {
            resolve(api.deleteCard(cardForDeletion.id));
        } else {
            reject('Удаление отменено');
        }
    })
}

const handleDeletion = (evt) => {
    evt.preventDefault();
    checkConfirmation(true)
        .then(() => {
            cardForDeletion.element.remove();
            closePopup(confirmPopupElement);
        })
        .catch(console.error)
    }

const popupProfileForm = new PopupWithForm('.popup_type_profile-form', 'profile-form', handleProfileSubmit);
popupProfileForm.setEventListeners();

const popupAvatarForm = new PopupWithForm('.popup_type_avatar-form', 'avatar-form', handleEditAvatar);
popupAvatarForm.setEventListeners();

const popupPlaceForm = new PopupWithForm('.popup_type_place-form', 'place-form', cardAddSubmit);
popupPlaceForm.setEventListeners();

const popupConfirmDeletionForm = new PopupWithForm('.popup_type_confirm-deletion-form', 'confirm-deletion-form', handleDeletion);
popupConfirmDeletionForm.setEventListeners();

const handleCardClick = (cardData) => {
    popupViewImage.open(cardData);
}

const handleLikeClick = (isLiked, cardId) => {
    return isLiked ? api.removeLike(cardId) : api.addLike(cardId);
}

const requestDeletion = (cardId, cardElement) => {
    openPopup(confirmPopupElement);
    cardForDeletion.id = cardId;
    cardForDeletion.element = cardElement;
}

const generateCard = (cardData) => {
    const newCardElement = new Card(cardData, 'card__template', userId, handleLikeClick, handleCardClick, requestDeletion);
    return newCardElement.createCardElement();
};

const cardsList = new Section({
    items: [],
    renderer: (item) => {
        const newCard = generateCard(item);
        cardsList.addItem(newCard);
        }
    },
    '.cards__list');

Promise.all([api.loadUserData(), api.loadCardsData()])
.then(([userData, cards]) => {
    userInfo.getUserInfo(userData);
    userInfo.setUserInfo(userData);
    cardsList.setItems(cards);
    cardsList.renderItems();
})
.catch(console.error);

// Изменение данных профиля
const openProfilePopup = () => {
    profileNameInput.value = profileNameElement.textContent;
    profileAboutInput.value = profileAboutElement.textContent;
    openPopup(profilePopupElement);
}

profileEditButtonElement.addEventListener('click', openProfilePopup);

avatarEditButton.addEventListener('click', () => {
    avatarEditForm.reset();
    openPopup(avatarPopupElement);
});

cardAddButtonElement.addEventListener('click', () => {
    cardAddFormElement.reset();
    openPopup(cardAddPopupElement);
});

// Включение валидации
// enableValidation(settings);

popupCloseButtonsList.forEach(item => {
    item.addEventListener('click', () => closePopup(item.closest('.popup')))
});

popupsList.forEach(popupElement => {
    popupElement.addEventListener('mousedown', closeByClickOnOverlay);
});