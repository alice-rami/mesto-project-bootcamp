import './pages/index.css';
import {
  validationConfig,
  apiRequestConfig,
  profileSelectors,
  popupViewImageConfig,
  popupConfirmationConfig,
  formSelectors,
} from './components/constants.js';
import Api from './components/Api.js';
import Card from './components/Card.js';
import FormValidator from './components/FormValidator.js';
import UserInfo from './components/UserInfo.js';
import Section from './components/Section.js';
import PopupWithImage from './components/PopupWithImage.js';
import PopupWithForm from './components/PopupWithForm.js';
import PopupConfirmation from './components/PopupConfirmation';
import { handleSubmit } from './components/utils.js';

const api = new Api(apiRequestConfig);
const userInfo = new UserInfo(profileSelectors);

const renderItem = (item) => {
  const newCard = generateCard(item);
  cardsList.addItem(newCard);
};

const cardsList = new Section(renderItem, '.cards__list');

const handleProfileSubmit = (userData) => {
  const makeRequest = () => {
    return api.editUserData(userData).then((res) => {
      userInfo.setUserInfo(res);
    });
  };
  handleSubmit(makeRequest, popupEditProfile);
};

const handleEditAvatar = ({ avatar }) => {
  const makeRequest = () => {
    return api.updateAvatar(avatar).then((res) => {
      userInfo.setUserInfo(res);
    });
  };
  handleSubmit(makeRequest, popupEditAvatar);
};

const generateCard = (cardData) => {
  const newCardElement = new Card(
    cardData,
    'card__template',
    userInfo.getUserId(),
    handleLikeClick,
    handleCardClick,
    handleDeletionRequest
  );
  return newCardElement.createCardElement();
};

const cardAddSubmit = (cardData) => {
  const makeRequest = () => {
    return api.addNewCard(cardData).then((res) => {
      const cardElement = generateCard(res);
      cardsList.addItem(cardElement);
    });
  };
  handleSubmit(makeRequest, popupAddCard);
};

const handleDeletionRequest = (cardInstance) => {
  popupConfirmDeletion.setCardForDeletion(cardInstance);
  popupConfirmDeletion.open();
};

const handleDeletion = (cardInstance) => {
  const cardId = cardInstance.getCardId();
  api
    .deleteCard(cardId)
    .then(() => {
      cardInstance.removeCardElement(cardId);
      popupConfirmDeletion.close();
    })
    .catch(console.error);
};

const popupConfirmDeletion = new PopupConfirmation(
  popupConfirmationConfig,
  handleDeletion
);
popupConfirmDeletion.setEventListeners();

const popupViewImage = new PopupWithImage(popupViewImageConfig);
popupViewImage.setEventListeners();

const handleCardClick = (cardData) => {
  popupViewImage.open(cardData);
};

const handleLikeClick = (isLiked, cardInstance) => {
  const cardId = cardInstance.getCardId();
  (isLiked ? api.removeLike(cardId) : api.addLike(cardId))
    .then((res) => {
      cardInstance.setLikeButtonState(res.likes);
    })
    .catch(console.error);
};

Promise.all([api.loadUserData(), api.loadCardsData()])
  .then(([userData, cards]) => {
    userInfo.setUserInfo(userData);
    cardsList.renderItems(cards);
  })
  .catch(console.error);

// Создание экземпляров валидатора для форм

for (let item in formSelectors) {
  const form = formSelectors[item].form;
  const instance = new FormValidator(validationConfig, form);
  instance.enableValidation();
  formSelectors[item]['validatorInstance'] = instance;
}

// Создание экземпляров попапов с формами

const {
  editProfile: profile,
  editAvatar: avatar,
  addCard: add,
} = formSelectors;

const popupEditProfile = new PopupWithForm(
  profile.popupSelector,
  handleProfileSubmit
);
popupEditProfile.setEventListeners();

const popupEditAvatar = new PopupWithForm(
  avatar.popupSelector,
  handleEditAvatar
);
popupEditAvatar.setEventListeners();

const popupAddCard = new PopupWithForm(add.popupSelector, cardAddSubmit);
popupAddCard.setEventListeners();

// Создание слушателей для кнопок

profile.openButton.addEventListener('click', () => {
  popupEditProfile.setInputValues(userInfo.getUserInfo());
  profile.validatorInstance.resetFormValidator();
  popupEditProfile.open();
});

add.openButton.addEventListener('click', () => {
  add.validatorInstance.resetFormValidator();
  popupAddCard.open();
});

avatar.openButton.addEventListener('click', () => {
  avatar.validatorInstance.resetFormValidator();
  popupEditAvatar.open();
});
