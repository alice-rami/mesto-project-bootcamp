import { openPopup } from "./modal.js";

const cardTemplate = document.getElementById('card__template').content.querySelector('.card');
const cardViewPopupElement = document.querySelector('.popup_type_view-image');
const targetImageElement = cardViewPopupElement.querySelector('.view-template__image');
const targetImageTitleElement = cardViewPopupElement.querySelector('.view-template__title');

const handleLikeButton = likeButtonElement => {
    likeButtonElement.classList.toggle('card__like-button_active');
}

const removeCard = cardElement => {
    cardElement.remove();
}

const viewImage = cardData => {
    targetImageElement.src = cardData.link;
    targetImageElement.alt = cardData.name;
    targetImageTitleElement.textContent = cardData.name;
    openPopup(cardViewPopupElement);
}

export const createCard = (cardData) => {
    const newCard = cardTemplate.cloneNode(true);
    const newCardImage = newCard.querySelector('.card__image');
    const newCardLikeButton = newCard.querySelector('.card__like-button');
    newCardImage.src = cardData.link;
    newCardImage.alt = cardData.name;
    newCardImage.addEventListener('click', () => viewImage(cardData));
    newCard.querySelector('.card__title').textContent = cardData.name;
    newCard.querySelector('.card__likes-count').textContent = cardData.likes.length;
    newCardLikeButton.addEventListener('click', () => handleLikeButton(newCardLikeButton));
    newCard.querySelector('.card__remove-button').addEventListener('click', () => removeCard(newCard));
    return newCard;
}