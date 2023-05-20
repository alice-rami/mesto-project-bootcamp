const profileElement = document.querySelector('.profile');
const profilePopupElement = document.querySelector('.popup');

const profileEditButtonElement = profileElement.querySelector('.profile__edit-button');
const popupCloseButtonElement = profilePopupElement.querySelector('.popup__close-icon');
const popupSubmitButtonElement = profilePopupElement.querySelector('.popup__submit-button');

const profileNameElement = profileElement.querySelector('.profile__name');
const profileAboutElement = profileElement.querySelector('.profile__about');

const profileFormElement = profilePopupElement.querySelector('.popup__form');
const profileNameInput = profileFormElement.querySelector('#profile__name');
const profileAboutInput = profileFormElement.querySelector('#profile__about');

const openPopup = () => {
    profilePopupElement.classList.add('popup_opened');
    profileNameInput.value = profileNameElement.textContent;
    profileAboutInput.value = profileAboutElement.textContent;
}

profileEditButtonElement.addEventListener('click', openPopup);

const closePopup = () => {
    profilePopupElement.classList.remove('popup_opened');
}

popupCloseButtonElement.addEventListener('click', closePopup);

const handleFormSubmit = (evt) => {
    evt.preventDefault();
    profileNameElement.textContent = profileNameInput.value;
    profileAboutElement.textContent = profileAboutInput.value;
    closePopup();
}

profileFormElement.addEventListener('submit', handleFormSubmit);