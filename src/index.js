import './pages/index.css';
import { validationConfig, apiRequestConfig, profileSelectors, confirmForm, loadingText, popupOpenButtonsConfig, popupViewImageConfig } from "./components/constants.js";
import Api from "./components/Api.js";
import Card from './components/Card.js';
import FormValidator from './components/FormValidator.js';
import UserInfo from './components/UserInfo.js';
import Section from './components/Section.js';
import PopupWithImage from './components/PopupWithImage.js';
import PopupWithForm from './components/PopupWithForm.js';
import PopupConfirmation from './components/PopupConfirmation';

let userId;
let cardsList;

const api = new Api(apiRequestConfig);
const userInfo = new UserInfo(profileSelectors, {});

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
    const newCardElement = new Card(cardData, 'card__template', userId, handleLikeClick, handleCardClick, handleDeletionRequest);
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
    cardsList.setCardForDeletion(cardId, cardElement);
    popupConfirmDeletion.open();
}

const handleDeletion = (evt) => {
    evt.preventDefault();
    const {id, element} = cardsList.getCardForDeletion();
    api.deleteCard(id)
    .then(() => {
        element.remove();
        cardsList.setCardForDeletion('', '');
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

const handleLikeClick = (isLiked, cardId) => {
    return isLiked ? api.removeLike(cardId) : api.addLike(cardId);
}

Promise.all([api.loadUserData(), api.loadCardsData()])
.then(([userData, cards]) => {
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

const formHandlers = {
    'profile-form': handleProfileSubmit,
    'avatar-form': handleEditAvatar,
    'place-form': cardAddSubmit
}

document.querySelectorAll('[novalidate]').forEach(form => {
    const instance = new FormValidator(validationConfig, form);
    instance.enableValidation();

    const formName = form.getAttribute('name');
    const popupInstance = new PopupWithForm(`.popup_type_${formName}`, form, formHandlers[formName]);
    popupInstance.setEventListeners();
    
    popupOpenButtonsConfig[formName].addEventListener('click', () => {
        if (formName === 'profile-form') {
            popupInstance.setInputValues(userInfo.getUserInfo()); 
        }
        popupInstance.open();
    })
})