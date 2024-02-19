import './pages/index.css';
import {
  apiRequestConfig,
  profileSelectors,
  popupViewImageConfig,
  popupConfirmationConfig,
  selectors,
  formNames,
} from './components/constants.js';
import Api from './components/Api.js';
import Card from './components/Card.js';
import UserInfo from './components/UserInfo.js';
import Section from './components/Section.js';
import PopupWithImage from './components/PopupWithImage.js';
import PopupConfirmation from './components/PopupConfirmation';
import {
  addButtonListeners,
  createPopupInstance,
  enableFormValidation,
  handleSubmit,
} from './components/utils.js';
import { formConfigBuilder } from './components/formConfigBuilder.js';

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
  handleSubmit(makeRequest, formConfigBuilder.profileForm.popupInstance);
};

const handleEditAvatar = ({ avatar }) => {
  const makeRequest = () => {
    return api.updateAvatar(avatar).then((res) => {
      userInfo.setUserInfo(res);
    });
  };
  handleSubmit(makeRequest, formConfigBuilder.avatarForm.popupInstance);
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
  handleSubmit(makeRequest, formConfigBuilder.addCardForm.popupInstance);
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

// Подготовка форм с валидацией

const formHandlers = {
  profileForm: handleProfileSubmit,
  avatarForm: handleEditAvatar,
  addCardForm: cardAddSubmit,
};
function prepareForms(formNames) {
  formNames.forEach((name) => {
    formConfigBuilder.setInitialFormData(
      name,
      selectors[name],
      formHandlers[name]
    );
    enableFormValidation(name);
    createPopupInstance(name);
    addButtonListeners(name);
  });
}
prepareForms(formNames);

formConfigBuilder.profileForm.popupInstance.setInputValues(
  userInfo.getUserInfo()
);
