export default class Card {
    constructor(cardData, templateSelector, userId, handleLikeClick, handleCardClick, requestDeletion) {
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
        this._requestDeletion = requestDeletion;
    }
    
    _getCardElement() {
        const cardElement = document.getElementById(this._selector).content.querySelector('.card').cloneNode(true);
        return cardElement;
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
            this._viewImage()
        });
        
        this._elementLikeButton.addEventListener('click', () => {
            this._handleLikeButton();
        });

        if (this._isOwnCard) {
            this._elementRemoveButton.addEventListener('click', () => {
                this._requestDeletion(this._cardId, this._element)
            });
        }
    }

    _handleLikeButton() {
        console.log('after click before request: ', this._isLiked);
        this._handleLikeClick(this._isLiked, this._cardId)
            .then(res => {
                this._likes = res.likes;
                this._likesCount = res.likes.length;
                this._elementLikesCount.textContent = this._likesCount;
                this._setLikeButtonState();
                console.log('after request: ', this._isLiked);
            })
            .catch(err => {
                console.log(err);
            })
    }
    
    _viewImage() {
        this._handleCardClick({name: this._name, link: this._link});
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
        console.log('init: ', this._isLiked);
        this._setRemoveButtonState();       
        this._setEventListeners();
        
        return this._element;
    }

}