import { api } from "../index.js";
// import { addLike, removeLike } from "./Api.js";
import { openPopup } from "./modal.js";

const cardTemplate = document.getElementById('card__template').content.querySelector('.card');
const cardViewPopupElement = document.querySelector('.popup_type_view-image');
const targetImageElement = cardViewPopupElement.querySelector('.view-template__image');
const targetImageTitleElement = cardViewPopupElement.querySelector('.view-template__title');

const updateLikesCount = (likesCount, likesCountElement) => {
    likesCountElement.textContent = likesCount;
}

const handleLikeButton = (likeButtonElement, cardId, likesCountElement) => {
    let isLiked = likeButtonElement.classList.contains('card__like-button_active');
    // TODO: убрать из Card!!!
    (isLiked ? api.removeLike(cardId) : api.addLike(cardId))
        .then(res => {
            updateLikesCount(res.likes.length, likesCountElement);
            likeButtonElement.classList.toggle('card__like-button_active');
        })
        .catch(err => {
            console.log(err);
        })
}

const viewImage = cardData => {
    targetImageElement.src = cardData.link;
    targetImageElement.alt = cardData.name;
    targetImageTitleElement.textContent = cardData.name;
    openPopup(cardViewPopupElement);
}

const createCardElement = (cardData, userId, requestDeletion) => {
    const newCard = cardTemplate.cloneNode(true);
    const newCardImage = newCard.querySelector('.card__image');
    const newCardTitle = newCard.querySelector('.card__title');
    const newCardLikeButton = newCard.querySelector('.card__like-button');
    const newCardRemoveButton = newCard.querySelector('.card__remove-button');
    const likesCountElement = newCard.querySelector('.card__likes-count');
    newCardImage.src = cardData.link;
    newCardImage.alt = cardData.name;
    newCardTitle.textContent = cardData.name;
    likesCountElement.textContent = cardData.likes.length;
    
    newCardImage.addEventListener('click', () => viewImage(cardData));
    
    newCardLikeButton.addEventListener('click', () => {
        handleLikeButton(newCardLikeButton, cardData._id, likesCountElement)
    });

    cardData.likes.forEach(user => {
        if(user._id === userId) {
            newCardLikeButton.classList.add('card__like-button_active');
            return;
        }
    });
    
    if (cardData.owner._id === userId) {
        newCardRemoveButton.classList.add('card__remove-button_active');
        newCardRemoveButton.addEventListener('click', () => {
            requestDeletion(cardData._id, newCard)
        });
    }
    return newCard;
}

export { createCardElement };