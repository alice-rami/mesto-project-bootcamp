import './pages/index.css';
import { settings, cardsContainer, cardAddButtonElement, cardAddPopupElement, cardAddFormElement, cardTitleInput, cardLinkInput, confirmPopupElement, confirmForm, confirmPopupCloseButton, profileElement, profileNameElement,profileAboutElement, profileAvatarElement, profileEditButtonElement, profilePopupElement, profileFormElement, profileNameInput, profileAboutInput, avatarEditButton, avatarPopupElement, avatarEditForm, avatarLinkInput, popupsList, popupCloseButtonsList } from "./components/constants.js";
import { enableValidation } from "./components/validate.js";
import { createCardElement } from "./components/card.js";
import { openPopup, closePopup, closeByClickOnOverlay } from "./components/modal.js";
import { addNewCard, deleteCard, editUserData, loadCardsData, loadUserData, updateAvatar } from './components/api.js';

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

// Создание и отображение карточки
const renderCard = card => {
    const newCard = createCard(card);
    cardsContainer.prepend(newCard);
};

Promise.all([loadUserData(), loadCardsData()])
    .then(([userData, cards]) => {
        renderUserData(userData);
        cards.forEach(renderCard);
    })
    .catch(console.error);

// Сохранение...
const renderLoading = (isLoading, button, buttonText='Сохранить', loadingText='Сохранение...') => {
    button.textContent = isLoading ? loadingText : buttonText;
}

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
        return editUserData(userData).then(renderUserData);
    }
    handleSubmit(makeRequest, evt);
}

profileFormElement.addEventListener('submit', handleProfileSubmit);

// Изменение аватара
const handleEditAvatar = evt => {
    const makeRequest = () => {
        return updateAvatar(avatarLinkInput.value).then(renderUserData);
    }
    handleSubmit(makeRequest, evt);
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

const cardAddSubmit = evt => {
    const makeRequest = () => {
        const cardData = {
            name: cardTitleInput.value, 
            link: cardLinkInput.value
        };
        return addNewCard(cardData).then(renderCard);
    }
    handleSubmit(makeRequest, evt);
}

cardAddFormElement.addEventListener('submit', cardAddSubmit);

// Включение валидации
enableValidation(settings);

popupCloseButtonsList.forEach(item => {
    item.addEventListener('click', () => closePopup(item.closest('.popup')))
});

popupsList.forEach(popupElement => {
    popupElement.addEventListener('mousedown', closeByClickOnOverlay);
});