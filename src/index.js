import './pages/index.css';
import {
  validationConfig,
  apiRequestConfig,
  profileSelectors,
  loadingText,
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

const api = new Api(apiRequestConfig);
const userInfo = new UserInfo(profileSelectors);

const renderItem = (item) => {
  const newCard = generateCard(item);
  cardsList.addItem(newCard);
};

const cardsList = new Section(renderItem, '.cards__list');

const handleSubmit = (request, popupInstance) => {
  popupInstance.toggleButtonText(true, loadingText);
  request()
    .then(() => {
      popupInstance.close();
    })
    .catch(console.error)
    .finally(() => {
      popupInstance.toggleButtonText(false, loadingText);
    });
};

const handleProfileSubmit = (userData, popupInstance) => {
  const makeRequest = () => {
    return api.editUserData(userData).then((res) => {
      userInfo.setUserInfo(res);
    });
  };
  handleSubmit(makeRequest, popupInstance);
};

const handleEditAvatar = ({ avatar }, popupInstance) => {
  const makeRequest = () => {
    return api.updateAvatar(avatar).then((res) => {
      userInfo.setUserInfo(res);
    });
  };
  handleSubmit(makeRequest, popupInstance);
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

const cardAddSubmit = (cardData, popupInstance) => {
  const makeRequest = () => {
    return api.addNewCard(cardData).then((res) => {
      const cardElement = generateCard(res);
      cardsList.addItem(cardElement);
    });
  };
  handleSubmit(makeRequest, popupInstance);
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
    userInfo.setUserId(userData._id);
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
  profile.form,
  handleProfileSubmit
);
formSelectors.editProfile.popupInstance = popupEditProfile;
popupEditProfile.setEventListeners();

const popupEditAvatar = new PopupWithForm(
  avatar.popupSelector,
  avatar.form,
  handleEditAvatar
);
formSelectors.editAvatar.popupInstance = popupEditAvatar;
popupEditAvatar.setEventListeners();

const popupAddCard = new PopupWithForm(
  add.popupSelector,
  add.form,
  cardAddSubmit
);
formSelectors.addCard.popupInstance = popupAddCard;
popupAddCard.setEventListeners();

// Создание слушателей для кнопок

for (let item in formSelectors) {
  formSelectors[item].openButton.addEventListener('click', () => {
    if (formSelectors[item].formSelector === 'profile-form') {
      formSelectors[item].popupInstance.setInputValues(userInfo.getUserInfo());
    }
    formSelectors[item].validatorInstance.resetFormValidator();
    formSelectors[item].popupInstance.open();
  });
}
