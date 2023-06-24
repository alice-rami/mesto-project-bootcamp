import './pages/index.css';
import { validationConfig, apiRequestConfig, profileSelectors, confirmForm, loadingText, formsToValidate, popupViewImageConfig, cardAddButton, profileEditButton, avatarEditButton, profileForm, avatarForm, placeForm } from "./components/constants.js";
import Api from "./components/Api.js";
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
    .catch(err => {
        console.log(err);
        })
}

Promise.all([api.loadUserData(), api.loadCardsData()])
.then(([userData, cards]) => {
    console.log(userData)
    userInfo.setUserInfo(userData);
    userInfo.setUserId(userData._id);
    cardsList.renderItems(cards);
})
.catch(console.error);

const formValidators = new Map();
formsToValidate.forEach(form => {
    const instance = new FormValidator(validationConfig, form);
    instance.enableValidation();
    formValidators.set(form.getAttribute('name'), instance);
});


const popupsWithFormsConfig = {
    editProfile: {
        selector: '.popup_type_profile-form',
        form: profileForm,
        handleFormSubmit: handleProfileSubmit,
    },
     editAvatar: {
        selector: '.popup_type_avatar-form',
        form: avatarForm,
        handleFormSubmit: handleEditAvatar,
    },
     addCard: {
        selector: '.popup_type_place-form',
        form: placeForm,
        handleFormSubmit: cardAddSubmit,
    }
}

const { editProfile, editAvatar, addCard } = popupsWithFormsConfig;

const popupEditProfile = new PopupWithForm(editProfile);
popupEditProfile.setEventListeners();

const popupEditAvatar = new PopupWithForm(editAvatar);
popupEditAvatar.setEventListeners();

const popupAddCard = new PopupWithForm(addCard);
popupAddCard.setEventListeners();


const popupOpenButtonsConfig = new Map(
    [[profileEditButton, {selector: 'profile-form', popupInstance: popupEditProfile}],
    [avatarEditButton, {selector: 'avatar-form', popupInstance: popupEditAvatar}],
    [cardAddButton, {selector: 'place-form', popupInstance: popupAddCard}]
]);

const setButtonEventListeners = (value, key) => {
    key.addEventListener('click', () => {
        if (value.selector === 'profile-form') {
            value.popupInstance.setInputValues(userInfo.getUserInfo()); 
        }
        formValidators.get(value.selector).resetFormValidator();
        value.popupInstance.open();
  });
}
  
popupOpenButtonsConfig.forEach(setButtonEventListeners);

// profileEditButton.addEventListener('click', () => {
//     formValidators.get('profile-form').resetFormValidator();
//     popupEditProfile.open();
// })

// avatarEditButton.addEventListener('click', () => {
//     formValidators.get('avatar-form').resetFormValidator();
//     popupEditAvatar.open();
// })

// cardAddButton.addEventListener('click', () => {
//     formValidators.get('place-form').resetFormValidator();
//     popupAddCard.open();
// })