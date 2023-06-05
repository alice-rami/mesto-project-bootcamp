import './pages/index.css';
import { settings, cardsContainer, cardAddButtonElement, cardAddPopupElement, cardAddFormElement, cardTitleInput, cardLinkInput, confirmPopupElement, confirmForm, confirmPopupCloseButton, profileElement, profileNameElement,profileAboutElement, profileAvatarElement, profileEditButtonElement, profilePopupElement, profileFormElement, profileNameInput, profileAboutInput, avatarEditButton, avatarPopupElement, avatarEditForm, avatarLinkInput, popupsList, popupCloseButtonsList } from "./components/constants.js";
import { enableValidation } from "./components/validate.js";
import { createCardElement } from "./components/card.js";
import { openPopup, closePopup, closeByClickOnOverlay } from "./components/modal.js";
import { addNewCard, deleteCard, editUserData, loadCardsData, loadUserData, updateAvatar } from './components/api.js';
import { showLoader, restoreButtonText } from './components/utils.js';

// Переменные

let userId;

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
    .catch(console.error)
}

loadUserData()
    .then(renderUserData)
    .then(renderCardsData)
    .catch(console.error);
    
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
    .then(res => {
        renderUserData(res);
        closePopup(profilePopupElement);
    })
    .catch(console.error)
    .finally(() => {
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
        renderUserData(res);
        closePopup(avatarPopupElement);
    })
    .catch(console.error)
    .finally(() => {
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
            .catch(console.error)
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
        closePopup(cardAddPopupElement);
    })
    .catch(console.error)
    .finally(() => {
        restoreButtonText(evt, buttonText);
    })
}

cardAddFormElement.addEventListener('submit', handleCardAddFormSubmit);

// Включение валидации
enableValidation(settings);

//
popupCloseButtonsList.forEach(item => {
    item.addEventListener('click', () => closePopup(item.closest('.popup')))
});

popupsList.forEach(popupElement => {
    popupElement.addEventListener('mousedown', closeByClickOnOverlay);
});