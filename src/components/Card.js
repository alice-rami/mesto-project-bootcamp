export default class Card {
    constructor(cardData, templateSelector, userId, handleLikeClick, handleCardClick, handleDeletionRequest) {
        this._name = cardData.name;
        this._link = cardData.link;
        this._cardId = cardData._id;
        this._likes = cardData.likes;
        this._likesCount = cardData.likes.length;
        this._cardOwnerId = cardData.owner._id;
        this._selector = templateSelector;
        this._userId = userId;
        this._handleCardClick = handleCardClick;
        this._handleLikeClick = handleLikeClick;
        this._handleDeletionRequest = handleDeletionRequest;
    }
    
    _getCardElement() {
        const cardElement = document.getElementById(this._selector).content.querySelector('.card').cloneNode(true);
        return cardElement;
    }

    _getCardData() {
        return {name: this._name, link: this._link};
    }

    _setLikeButtonState() {
        this._isLiked = this._likes.some(user => user._id === this._userId);
        this._elementLikeButton.classList.toggle('card__like-button_active', this._isLiked);
    }

    _setRemoveButtonState() {
        this._isOwnCard = this._cardOwnerId === this._userId;
        if (this._isOwnCard) {
            this._elementRemoveButton.classList.add('card__remove-button_active');
        }
    }
    
    _setEventListeners() {
        this._elementImage.addEventListener('click', () => {
            this._handleCardClick(this._getCardData());
        });
        
        this._elementLikeButton.addEventListener('click', () => {
            this._handleLikeButton();
        });

        if (this._isOwnCard) {
            this._elementRemoveButton.addEventListener('click', () => {
                this._handleDeletionRequest(this._cardId, this._element)
            });
        }
    }

    _handleLikeButton() {
        this._handleLikeClick(this._isLiked, this._cardId)
            .then(res => {
                this._likes = res.likes;
                this._likesCount = res.likes.length;
                this._elementLikesCount.textContent = this._likesCount;
                this._setLikeButtonState();
            })
            .catch(err => {
                console.log(err);
            })
    }
    
    
    createCardElement() {
        this._element = this._getCardElement();
        this._elementImage = this._element.querySelector('.card__image');
        this._elementTitle = this._element.querySelector('.card__title')
        this._elementLikesCount = this._element.querySelector('.card__likes-count');
        this._elementLikeButton = this._element.querySelector('.card__like-button');
        this._elementRemoveButton = this._element.querySelector('.card__remove-button');
        this._elementImage.src = this._link;
        this._elementImage.alt = this._name;
        this._elementTitle.textContent = this._name;
        this._elementLikesCount.textContent = this._likesCount;
        this._setLikeButtonState();
        this._setRemoveButtonState();       
        this._setEventListeners();
        
        return this._element;
    }

}