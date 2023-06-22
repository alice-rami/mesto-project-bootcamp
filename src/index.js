import './pages/index.css';
import { settings, apiRequestConfig, profileSelectors, cardsContainer, cardAddButtonElement, cardAddPopupElement, cardAddFormElement, cardTitleInput, cardLinkInput, confirmPopupElement, confirmForm, profileNameElement,profileAboutElement, profileAvatarElement, profileEditButtonElement, profilePopupElement, profileFormElement, profileNameInput, profileAboutInput, avatarEditButton, avatarPopupElement, avatarEditForm, avatarLinkInput, popupsList, popupCloseButtonsList, cardViewPopupElement, targetImageElement, targetImageTitleElement, loadingText } from "./components/constants.js";
import { renderLoading } from './components/utils.js';
import Api from "./components/Api.js";
import Card from './components/Card.js';
import FormValidator from './components/FormValidator.js';
import UserInfo from './components/UserInfo.js';
import Section from './components/Section.js';
import PopupWithImage from './components/PopupWithImage.js';
import PopupWithForm from './components/PopupWithForm.js';
import PopupConfirmation from './components/PopupConfirmation';

// Переменные
let userId;
let cardsList;

// создании экз класса
const api = new Api(apiRequestConfig);

const userInfo = new UserInfo(profileSelectors, {});

const popupViewImage = new PopupWithImage('.popup_type_view-image', '.view-template__title', '.view-template__image');
popupViewImage.setEventListeners();

const handleSubmit = (request, popup, evt) => {
    evt.preventDefault();
    const submitButton = evt.submitter;
    submitButton.textContent = loadingText;
    request()
    .then(() => {
        popup.close();
    })
    .catch(console.error)
    .finally(() => {
        submitButton.textContent = popup.getFormButtonText();
    });
}

const handleProfileSubmit = (evt, userData) => {
    const makeRequest = () => {
        return api.editUserData(userData).then((res) => userInfo.setUserInfo(userInfo.updateUserInfo(res)));
    }
    handleSubmit(makeRequest, popupEditProfile, evt);
}

const handleEditAvatar = (evt, {avatar}) => {
    const makeRequest = () => {
        return api.updateAvatar(avatar).then((res) => userInfo.setUserInfo(userInfo.updateUserInfo(res)));
    }
    handleSubmit(makeRequest, popupEditAvatar, evt);
}

const generateCard = (cardData) => {
    const newCardElement = new Card(cardData, 'card__template', userId, handleLikeClick, handleCardClick, handleDeletionRequest);
    return newCardElement.createCardElement();
};

const cardAddSubmit = (evt, cardData) => {
    const makeRequest = () => {     
        return api.addNewCard(cardData).then((res) => {
            const cardElement = generateCard(res);
            cardsList.addItem(cardElement)
        });
    }
    handleSubmit(makeRequest, popupAddCard, evt);
}

const handleDeletion = (evt) => {
    evt.preventDefault();
    const {id, element} = cardsList.getCardForDeletion();
    api.deleteCard(id)
    .then(() => {
        element.remove();
        cardsList.setCardForDeletion('', '');
        console.log(cardsList.getCardForDeletion());
        popupConfirmDeletion.close();
        })
        .catch(console.error)
    }

const handleDeletionRequest = (cardId, cardElement) => {
    cardsList.setCardForDeletion(cardId, cardElement);
    popupConfirmDeletion.open();
}

const popupEditProfile = new PopupWithForm('.popup_type_profile-form', profileFormElement, handleProfileSubmit);
popupEditProfile.setEventListeners();

const popupEditAvatar = new PopupWithForm('.popup_type_avatar-form', avatarEditForm, handleEditAvatar);
popupEditAvatar.setEventListeners();

const popupAddCard = new PopupWithForm('.popup_type_place-form', cardAddFormElement, cardAddSubmit);
popupAddCard.setEventListeners();

const popupConfirmDeletion = new PopupConfirmation('.popup_type_confirm-deletion-form', confirmForm, handleDeletion);
popupConfirmDeletion.setEventListeners();

const handleCardClick = (cardData) => {
    popupViewImage.open(cardData);
}

const handleLikeClick = (isLiked, cardId) => {
    return isLiked ? api.removeLike(cardId) : api.addLike(cardId);
}

Promise.all([api.loadUserData(), api.loadCardsData()])
.then(([userData, cards]) => {
    userInfo.getUserInfo(userData);
    userInfo.setUserInfo(userData);
    userId = userData._id;
    cardsList = new Section({
        items: cards,
        renderer: (item) => {
            const newCard = generateCard(item);
            cardsList.addItem(newCard);
            }
        },
        '.cards__list');
    cardsList.renderItems();
})
.catch(console.error);

// Изменение данных профиля

profileEditButtonElement.addEventListener('click', () => {
    // popupEditProfile.setInputValues(userInfo.getUserInfo());
    profileNameInput.value = profileNameElement.textContent;
    profileAboutInput.value = profileAboutElement.textContent;
    popupEditProfile.open();
});

avatarEditButton.addEventListener('click', () => {
    avatarEditForm.reset();
    popupEditAvatar.open();
});

cardAddButtonElement.addEventListener('click', () => {
    cardAddFormElement.reset();
    popupAddCard.open();
});

// Включение валидации
// enableValidation(settings);

// const handleProfileSubmit = (evt, userData) => {
//     const makeRequest = () => {
//         return api.editUserData(userData).then((res) => {
//             userInfo.setUserInfo(userInfo.updateUserInfo(res));
//         })
//     }
//     handleSubmit(makeRequest, evt);
// }

// const handleEditAvatar = (evt, {avatar}) => {
//     const makeRequest = () => {
//         return api.updateAvatar(avatar).then((res) => {
//             userInfo.setUserInfo(userInfo.updateUserInfo(res));
//         })
//     }
//     handleSubmit(makeRequest, evt);
// }

// const handleSubmit = (request, evt, loadingText = 'Сохранение...') => {
//     evt.preventDefault();
//     const submitButton = evt.submitter;
//     const initialText = submitButton.textContent;
//     renderLoading(true, submitButton, initialText, loadingText);

//     request()
//     .then(() => {
//         evt.target.reset();
//         evt.target.closest('.popup').close();
//     })
//     .catch(console.error)
//     .finally(() => {
//         renderLoading(false, submitButton, initialText);
//     });
// }