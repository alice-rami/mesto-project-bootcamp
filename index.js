const initialCards = [
    {
        name: 'Архыз',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg'
    },
    {
      name: 'Челябинская область',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg'
    },
    {
      name: 'Иваново',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg'
    },
    {
        name: 'Камчатка',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg'
    },
    {
        name: 'Холмогорский район',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg'
    },
    {
        name: 'Байкал',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
    }
];

// Лайк

const handleLike = evt => {
    evt.target.classList.toggle('card__like-button_active');
}


// Удаление карточки

const removeCard = evt => {
    evt.target.closest('.card').remove();
}

// Просмотр фото

const cardViewPopupElement = document.querySelector('.popup_type_view-image');
const targetImageElement = cardViewPopupElement.querySelector('.large-image');
const targetImageTitleElement = cardViewPopupElement.querySelector('.large-image__title');

const viewImage = evt => {
    const image = evt.target;
    targetImageElement.src = image.src;
    targetImageElement.alt = image.alt;
    targetImageTitleElement.textContent = image.alt;
    cardViewPopupElement.classList.add('popup_opened', 'popup_effect_fade-in');
}


// Создание карточки

const cardTemplate = document.getElementById('card__template').content;
const cardsList = document.querySelector('.cards__list');

const createCard = (name, link) => {
    const newCard = cardTemplate.querySelector('.card').cloneNode(true);
    const newCardImage = newCard.querySelector('.card__image');
    newCardImage.src = link;
    newCardImage.alt = name;
    newCardImage.addEventListener('click', viewImage);
    newCard.querySelector('.card__title').textContent = name;
    cardsList.prepend(newCard);
    newCard.querySelector('.card__like-button').addEventListener('click', handleLike);
    newCard.querySelector('.card__remove-button').addEventListener('click', removeCard);
}

initialCards.forEach(item => {
    createCard(item.name, item.link);
});


// Добавление слушателей кнопкам для лайка

const likeButtonsList = Array.from(cardsList.querySelectorAll('.card__like-button'));
likeButtonsList.forEach(item => item.addEventListener('click', handleLike));


// Добавление слушателей кнопкам для удаления

const removeButtonsList = Array.from(cardsList.querySelectorAll('.card__remove-button'));
removeButtonsList.forEach(item => {
    item.addEventListener('click', removeCard);
});


// Добавление слушателей изображениям для просмотра

const imagesList = Array.from(cardsList.querySelectorAll('.card__image'));
imagesList.forEach(item => {
    item.addEventListener('click', viewImage);
});


// Закрытие попапа

const closePopup = evt => {
    evt.target.closest('.popup').classList.add('popup_effect_fade-out');
    setTimeout(() => {
        evt.target.closest('.popup').classList.remove('popup_opened', 'popup_effect_fade-out', 'popup_effect_fade-in');
    }, 2000);
}

const popupCloseButtonsList = Array.from(document.querySelectorAll('.popup__close-icon'));
popupCloseButtonsList.forEach(item => item.addEventListener('click', closePopup));


// Редактирование профиля

const profileElement = document.querySelector('.profile');
const profilePopupElement = document.querySelector('.popup_type_profile');

const profileEditButtonElement = profileElement.querySelector('.profile__edit-button');

const profileNameElement = profileElement.querySelector('.profile__name');
const profileAboutElement = profileElement.querySelector('.profile__about');

const profileFormElement = profilePopupElement.querySelector('.form');
const profileNameInput = profileFormElement.querySelector('#profile-name');
const profileAboutInput = profileFormElement.querySelector('#profile-about');

const openProfilePopup = () => {
    profilePopupElement.classList.add('popup_opened', 'popup_effect_fade-in');
    profileNameInput.value = profileNameElement.textContent;
    profileAboutInput.value = profileAboutElement.textContent;
}

profileEditButtonElement.addEventListener('click', openProfilePopup);

const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    profileNameElement.textContent = profileNameInput.value;
    profileAboutElement.textContent = profileAboutInput.value;
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);
profileFormElement.addEventListener('submit', closePopup); 


// Добавление карточки

const cardAddButtonElement = document.querySelector('.profile__add-button');
const cardAddPopupElement = document.querySelector('.popup_type_add-card');
const cardAddFormElement = cardAddPopupElement.querySelector('.form');

const openCardAddPopup = () => {
    cardAddPopupElement.classList.add('popup_opened', 'popup_effect_fade-in');
}

cardAddButtonElement.addEventListener('click', openCardAddPopup);

const handleCardAddFormSubmit = (evt) => {
    evt.preventDefault();
    const cardTitleInput = document.getElementById('place-title');
    const cardLinkInput = document.getElementById('place-link');
    createCard(cardTitleInput.value, cardLinkInput.value);
}

cardAddFormElement.addEventListener('submit', handleCardAddFormSubmit);
cardAddFormElement.addEventListener('submit', closePopup);


