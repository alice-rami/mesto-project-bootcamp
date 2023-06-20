import './pages/index.css';
import { settings, cardsContainer, cardAddButtonElement, cardAddPopupElement, cardAddFormElement, cardTitleInput, cardLinkInput, confirmPopupElement, confirmForm, profileNameElement,profileAboutElement, profileAvatarElement, profileEditButtonElement, profilePopupElement, profileFormElement, profileNameInput, profileAboutInput, avatarEditButton, avatarPopupElement, avatarEditForm, avatarLinkInput, popupsList, popupCloseButtonsList, cardViewPopupElement, targetImageElement, targetImageTitleElement } from "./components/constants.js";
import { openPopup, closePopup, closeByClickOnOverlay } from "./components/modal.js";
import { renderLoading } from './components/utils.js';
import Api from "./components/Api.js";
import Card from './components/Card1.js';
import FormValidator from './components/FormValidator.js';
import UserInfo from './components/UserInfo.js';
import Section from './components/Section.js';

// Переменные

let userId;
const cardForDeletion = {};


// создании экз класса
const api = new Api({
    baseUrl: 'https://nomoreparties.co/v1/wbf-cohort-9',
    headers: {
        authorization: 'c1d6c920-f67e-42f9-9dd3-963993549d9b',
        'Content-Type': 'application/json'
    }
});

const handleCardClick = ({name, link}) => {
    targetImageElement.src = link;
    targetImageElement.alt = name;
    targetImageTitleElement.textContent = name;
    openPopup(cardViewPopupElement);
}

const handleLikeClick = (isLiked, cardId) => {
    return isLiked ? api.removeLike(cardId) : api.addLike(cardId);
}

// Функции и добавление слушателей

// Загрузка информации о пользователе и карточках с сервера

// const userInfo = new UserInfo({name: '.profile__name', about: '.profile__about', avatar: '.profile__avatar'}, userData, api.editUserData);

const renderUserData = res => {
    profileNameElement.textContent = res.name;
    profileAboutElement.textContent = res.about;
    profileAvatarElement.src = res.avatar;
    userId = res._id;
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
    renderUserData(userData);
    cardsList.setItems(cards);
    cardsList.renderItems();
})
.catch(console.error);




// const formsList = Array.from(document.forms)
// formsList.forEach(formElement => {
//     const validator = new FormValidator(settings, formElement);
//     validator.enableValidation();
// });

// Универсальная функция обработки сабмита

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

// Изменение данных профиля
const openProfilePopup = () => {
    profileNameInput.value = profileNameElement.textContent;
    profileAboutInput.value = profileAboutElement.textContent;
    openPopup(profilePopupElement);
}

profileEditButtonElement.addEventListener('click', openProfilePopup);

const handleProfileSubmit = evt => {
    const makeRequest = () => {
        const userData = {
            name: profileNameInput.value,
            about: profileAboutInput.value
        };
        return api.editUserData(userData).then(renderUserData);
    }
    handleSubmit(makeRequest, evt);
}

profileFormElement.addEventListener('submit', handleProfileSubmit);

// Изменение аватара
const handleEditAvatar = evt => {
    const makeRequest = () => {
        return api.updateAvatar(avatarLinkInput.value).then(renderUserData);
    }
    handleSubmit(makeRequest, evt);
}

avatarEditForm.addEventListener('submit', handleEditAvatar);

avatarEditButton.addEventListener('click', () => {
    avatarEditForm.reset();
    openPopup(avatarPopupElement);
});

// Подтверждение удаления карточки
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

confirmForm.addEventListener('submit', handleDeletion);

// Создание и добавление карточки
const createCard = res => {
    const newCard = createCardElement(res, userId, requestDeletion);
    return newCard;
}

cardAddButtonElement.addEventListener('click', () => {
    cardAddFormElement.reset();
    openPopup(cardAddPopupElement);
});

const cardAddSubmit = evt => {
    const makeRequest = () => {
        const cardData = {
            name: cardTitleInput.value, 
            link: cardLinkInput.value
        };
        
        return api.addNewCard(cardData).then((res) => {
            const cardElement = generateCard(res);
            cardsList.addItem(cardElement)
        });
    }
    handleSubmit(makeRequest, evt);
}

cardAddFormElement.addEventListener('submit', cardAddSubmit);

// Включение валидации
// enableValidation(settings);

popupCloseButtonsList.forEach(item => {
    item.addEventListener('click', () => closePopup(item.closest('.popup')))
});

popupsList.forEach(popupElement => {
    popupElement.addEventListener('mousedown', closeByClickOnOverlay);
});
