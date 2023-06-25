import './pages/index.css';
import { validationConfig, apiRequestConfig, profileSelectors, confirmForm, loadingText, popupViewImageConfig, formSelectors } from "./components/constants.js";
import Api from "./components/Api1.js";
import Card from './components/Card.js';
import FormValidator from './components/FormValidator.js';
import UserInfo from './components/UserInfo.js';
import Section from './components/Section.js';
import PopupWithImage from './components/PopupWithImage.js';
import PopupWithForm from './components/PopupWithForm.js';
import PopupConfirmation from './components/PopupConfirmation';

const api = new Api(apiRequestConfig);
const userInfo = new UserInfo(profileSelectors);

const renderItems = items => {
    items.forEach(item => {
        const newCard = generateCard(item);
        cardsList.addItem(newCard);
    });
}

const cardsList = new Section(renderItems, '.cards__list');

const handleSubmit = (request, popupInstance, evt) => {
    evt.preventDefault();
    popupInstance.toggleButtonText(true, loadingText);
    request()
    .then(() => {
        popupInstance.close();
    })
    .catch(console.error)
    .finally(() => {
        popupInstance.toggleButtonText(false, loadingText);
    });
}

const handleProfileSubmit = (evt, userData, popupInstance) => {
    const makeRequest = () => {
        return api.editUserData(userData).then((res) => {
            userInfo.setUserInfo(res);
        });
    }
    handleSubmit(makeRequest, popupInstance, evt);
}

const handleEditAvatar = (evt, {avatar}, popupInstance) => {
    const makeRequest = () => {
        return api.updateAvatar(avatar).then((res) => {
            userInfo.setUserInfo(res);
        });
    }
    handleSubmit(makeRequest, popupInstance, evt);
}

const generateCard = (cardData) => {
    const newCardElement = new Card(cardData, 'card__template', userInfo.getUserId(), handleLikeClick, handleCardClick, handleDeletionRequest);
    return newCardElement.createCardElement();
};

const cardAddSubmit = (evt, cardData, popupInstance) => {
    const makeRequest = () => {     
        return api.addNewCard(cardData).then((res) => {
            const cardElement = generateCard(res);
            cardsList.addItem(cardElement)
        });
    }
    handleSubmit(makeRequest, popupInstance, evt);
}

const handleDeletionRequest = (cardId, cardInstance) => {
    popupConfirmDeletion.open(cardId, cardInstance);
}

const handleDeletion = (evt, cardId, cardInstance) => {
    evt.preventDefault();
    api.deleteCard(cardId)
    .then(() => {
        cardInstance.removeCardElement(cardId);
        popupConfirmDeletion.close();
        })
        .catch(console.error)
    }

const popupConfirmationConfig = {
    selector: '.popup_type_confirm-deletion-form',
    form: confirmForm, 
    handleFormSubmit: handleDeletion
}

const popupConfirmDeletion = new PopupConfirmation(popupConfirmationConfig);
popupConfirmDeletion.setEventListeners();

const popupViewImage = new PopupWithImage(popupViewImageConfig);
popupViewImage.setEventListeners();

const handleCardClick = (cardData) => {
    popupViewImage.open(cardData);
}

const handleLikeClick = (isLiked, cardId, cardInstance) => {
    (isLiked ? api.removeLike(cardId) : api.addLike(cardId))
    .then(res => {
        const likesElement = cardInstance.getLikeCountElement();
        likesElement.textContent = res.likes.length;
        cardInstance.setLikesData(res.likes);
        cardInstance.setLikeButtonState();
        })
    .catch(console.error)
}

Promise.all([api.loadUserData(), api.loadCardsData()])
.then(([userData, cards]) => {
    userInfo.setUserInfo(userData);
    userInfo.setUserId(userData._id);
    cardsList.renderItems(cards);
})
.catch(console.error);

// Создание экземпляров валидатора для форм

for (let item in formSelectors) {
    const form = formSelectors[item].form;
    const instance = new FormValidator(validationConfig, form);
    instance.enableValidation();
    formSelectors[item]['validatorInstance'] = instance;
}

// Создание экземпляров попапов с формами

const {editProfile: profile, editAvatar : avatar, addCard: add } = formSelectors;

const popupEditProfile = new PopupWithForm(profile.popupSelector, profile.form, handleProfileSubmit);
formSelectors.editProfile.popupInstance = popupEditProfile;
popupEditProfile.setEventListeners();

const popupEditAvatar = new PopupWithForm(avatar.popupSelector, avatar.form, handleEditAvatar);
formSelectors.editAvatar.popupInstance = popupEditAvatar;
popupEditAvatar.setEventListeners();

const popupAddCard = new PopupWithForm(add.popupSelector, add.form, cardAddSubmit);
formSelectors.addCard.popupInstance = popupAddCard;
popupAddCard.setEventListeners();

// Создание слушателей для кнопок

for (let item in formSelectors) {
    formSelectors[item].openButton.addEventListener('click', () => {
        if (formSelectors[item].formSelector === 'profile-form') {
            formSelectors[item].popupInstance.setInputValues(userInfo.getUserInfo()); 
        }
        formSelectors[item].validatorInstance.resetFormValidator();
        formSelectors[item].popupInstance.open();
    })
}