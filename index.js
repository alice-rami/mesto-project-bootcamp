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

// Переменные

// Шаблон для создания карточки и контейнер для добавления карточек
const cardTemplate = document.getElementById('card__template').content;
const cardsContainer = document.querySelector('.cards__list');

// Кнопка, попап и форма для добавления карточки
const cardAddButtonElement = document.querySelector('.profile__add-button');
const cardAddPopupElement = document.querySelector('.popup_type_add-card');
const cardAddFormElement = cardAddPopupElement.querySelector('.form');

// Попап и поля контейнера для просмотра фото
const cardViewPopupElement = document.querySelector('.popup_type_view-image');
const targetImageElement = cardViewPopupElement.querySelector('.view-template__image');
const targetImageTitleElement = cardViewPopupElement.querySelector('.view-template__title');

// Поля профиля и кнопка редактирования профиля
const profileElement = document.querySelector('.profile');
const profileNameElement = profileElement.querySelector('.profile__name');
const profileAboutElement = profileElement.querySelector('.profile__about');
const profileEditButtonElement = profileElement.querySelector('.profile__edit-button');

// Попап и форма для редактирования профиля
const profilePopupElement = document.querySelector('.popup_type_profile');
const profileFormElement = profilePopupElement.querySelector('.form');
const profileNameInput = profileFormElement.querySelector('#profile-name');
const profileAboutInput = profileFormElement.querySelector('#profile-about');

// Список для добавления слушателей
const popupCloseButtonsList = Array.from(document.querySelectorAll('.popup__close-icon'));


// Функции и добавление слушателей

const handleLikeButton = likeButtonElement => {
    likeButtonElement.classList.toggle('card__like-button_active');
}

const removeCard = cardElement => {
    cardElement.remove();
}

const openPopup = popup => {
    popup.classList.add('popup_opened', 'popup_effect_fade-in');
}

cardAddButtonElement.addEventListener('click', () => openPopup(cardAddPopupElement));

const viewImage = image => {
    targetImageElement.src = image.src;
    targetImageElement.alt = image.alt;
    targetImageTitleElement.textContent = image.alt;
    openPopup(cardViewPopupElement);
}

const createCard = (name, link) => {
    const newCard = cardTemplate.querySelector('.card').cloneNode(true);
    const newCardImage = newCard.querySelector('.card__image');
    const newCardLikeButton = newCard.querySelector('.card__like-button');
    newCardImage.src = link;
    newCardImage.alt = name;
    newCardImage.addEventListener('click', () => viewImage(newCardImage));
    newCard.querySelector('.card__title').textContent = name;
    newCardLikeButton.addEventListener('click', () => handleLikeButton(newCardLikeButton));
    newCard.querySelector('.card__remove-button').addEventListener('click', () => removeCard(newCard));
    return newCard;
}

initialCards.forEach(item => {
    const newCard = createCard(item.name, item.link);
    cardsContainer.append(newCard);
});

const closePopup = popup => {
    popup.classList.add('popup_effect_fade-out');
    setTimeout(() => {
        popup.classList.remove('popup_opened', 'popup_effect_fade-out', 'popup_effect_fade-in');
    }, 2000);
}

popupCloseButtonsList.forEach(item => item.addEventListener('click', () => closePopup(item.closest('.popup'))));

const handleCardAddFormSubmit = (evt) => {
    evt.preventDefault();
    const cardTitleInput = document.getElementById('place-title');
    const cardLinkInput = document.getElementById('place-link');
    const newCard = createCard(cardTitleInput.value, cardLinkInput.value);
    cardsContainer.prepend(newCard);
    cardAddFormElement.reset();
    closePopup(cardAddPopupElement);
}

cardAddFormElement.addEventListener('submit', handleCardAddFormSubmit);

const openProfilePopup = () => {
    profileNameInput.value = profileNameElement.textContent;
    profileAboutInput.value = profileAboutElement.textContent;
    openPopup(profilePopupElement);
}

profileEditButtonElement.addEventListener('click', openProfilePopup);

const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    profileNameElement.textContent = profileNameInput.value;
    profileAboutElement.textContent = profileAboutInput.value;
    closePopup(profilePopupElement);
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);