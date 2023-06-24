import './pages/index.css';
import { validationConfig, apiRequestConfig, profileSelectors, confirmForm, loadingText, formsToValidate, popupViewImageConfig, popupOpenButtonsConfig, cardAddButton, profileEditButton, avatarEditButton, profileForm, avatarForm, placeForm } from "./components/constants.js";
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

const handleProfileSubmit = (evt, userData, popup) => {
    const makeRequest = () => {
        return api.editUserData(userData).then((res) => {
            userInfo.setUserInfo(res);
        });
    }
    handleSubmit(makeRequest, popup, evt);
}

const handleEditAvatar = (evt, {avatar}, popup) => {
    const makeRequest = () => {
        return api.updateAvatar(avatar).then((res) => {
            userInfo.setUserInfo(res);
        });
    }
    handleSubmit(makeRequest, popup, evt);
}

const generateCard = (cardData) => {
    const newCardElement = new Card(cardData, 'card__template', userInfo.getUserId(), handleLikeClick, handleCardClick, handleDeletionRequest);
    return newCardElement.createCardElement();
};

const cardAddSubmit = (evt, cardData, popup) => {
    const makeRequest = () => {     
        return api.addNewCard(cardData).then((res) => {
            const cardElement = generateCard(res);
            cardsList.addItem(cardElement)
        });
    }
    handleSubmit(makeRequest, popup, evt);
}

const handleDeletionRequest = (cardId, cardElement) => {
    popupConfirmDeletion.open(cardId, cardElement);
}

const handleDeletion = (evt, {cardId, cardElement}) => {
    evt.preventDefault();
    api.deleteCard(cardId)
    .then(() => {
        cardElement.remove();
        // popupConfirmDeletion.setCardForDeletion('', '');
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

profileEditButton.addEventListener('click', () => {
    formValidators.get('profile-form').resetFormValidator();
    popupEditProfile.open();
})

const popupEditAvatar = new PopupWithForm(editAvatar);
popupEditAvatar.setEventListeners();

avatarEditButton.addEventListener('click', () => {
    formValidators.get('avatar-form').resetFormValidator();
    popupEditAvatar.open();
})

const popupAddCard = new PopupWithForm(addCard);
popupAddCard.setEventListeners();

cardAddButton.addEventListener('click', () => {
    formValidators.get('place-form').resetFormValidator();
    popupAddCard.open();
})