export default class Card {
  constructor(
    cardData,
    templateSelector,
    userId,
    handleLikeClick,
    handleCardClick,
    handleDeletionRequest
  ) {
    this._name = cardData.name;
    this._link = cardData.link;
    this._cardId = cardData._id;
    this._likes = cardData.likes;
    this._cardOwnerId = cardData.owner._id;
    this._selector = templateSelector;
    this._userId = userId;
    this._handleCardClick = handleCardClick;
    this._handleLikeClick = handleLikeClick;
    this._handleDeletionRequest = handleDeletionRequest;
  }

  _getCardTemplate() {
    return document
      .getElementById(this._selector)
      .content.querySelector('.card')
      .cloneNode(true);
  }

  _getCardData() {
    return { name: this._name, link: this._link };
  }

  getCardId() {
    return this._cardId;
  }

  setLikeButtonState(likesArray) {
    this._likes = likesArray;
    this._isLiked = this._likes.some((user) => user._id === this._userId);
    this._elementLikeButton.classList.toggle(
      'card__like-button_active',
      this._isLiked
    );
    this._elementLikesCount.textContent = this._likes.length;
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

    this._elementLikeButton.addEventListener('click', () =>
      this._handleLikeButton(this)
    );

    if (this._isOwnCard) {
      this._elementRemoveButton.addEventListener('click', () =>
        this._handleDeletionRequest(this)
      );
    }
  }

  _handleLikeButton() {
    this._handleLikeClick(this._isLiked, this);
  }

  removeCardElement() {
    this._element.remove();
  }

  createCardElement() {
    this._element = this._getCardTemplate();
    this._elementImage = this._element.querySelector('.card__image');
    this._elementTitle = this._element.querySelector('.card__title');
    this._elementLikesCount = this._element.querySelector('.card__likes-count');
    this._elementLikeButton = this._element.querySelector('.card__like-button');
    this._elementRemoveButton = this._element.querySelector(
      '.card__remove-button'
    );
    this._elementImage.src = this._link;
    this._elementImage.alt = this._name;
    this._elementTitle.textContent = this._name;
    this._elementLikesCount.textContent = this._likes.length;
    this.setLikeButtonState(this._likes);
    this._setRemoveButtonState();
    this._setEventListeners();

    return this._element;
  }
}
