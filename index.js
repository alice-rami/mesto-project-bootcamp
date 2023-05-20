const profileElement = document.querySelector('.profile');
const profilePopupElement = document.querySelector('.popup_profile');
// const cardAddPopupElement = document.querySelector('.popup_add-card');
// const cardViewPopupElement = document.querySelector('.popup_view-card');

const profileEditButtonElement = profileElement.querySelector('.profile__edit-button');
const popupSubmitButtonElement = profilePopupElement.querySelector('.popup__submit-button');
// const popupCardAddButtonElement = profileElement.querySelector('.profile__add-button');


const profileNameElement = profileElement.querySelector('.profile__name');
const profileAboutElement = profileElement.querySelector('.profile__about');

const profileFormElement = profilePopupElement.querySelector('.popup__form');
const profileNameInput = profileFormElement.querySelector('#profile__name');
const profileAboutInput = profileFormElement.querySelector('#profile__about');

const openProfilePopup = () => {
    profilePopupElement.classList.add('popup_opened');
    profileNameInput.value = profileNameElement.textContent;
    profileAboutInput.value = profileAboutElement.textContent;
}

profileEditButtonElement.addEventListener('click', openProfilePopup);

const openCardAddPopup = () => {
    cardAddPopupElement.classList.add('popup_opened');
}

// popupCardAddButtonElement.addEventListener('click', openCardAddPopup);

// Закрытие попапа

const closePopup = (event) => {
    event.target.closest('.popup').classList.remove('popup_opened');
}

const popupCloseButtonsList = Array.from(document.querySelectorAll('.popup__close-icon'));
popupCloseButtonsList.forEach(item => item.addEventListener('click', closePopup));

// Обработка отправки формы 

const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    profileNameElement.textContent = profileNameInput.value;
    profileAboutElement.textContent = profileAboutInput.value;
    closePopup();
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);