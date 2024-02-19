export const formConfigBuilder = {
  avatarForm: {},
  profileForm: {},
  addCardForm: {},
  setInitialFormData(formName, formSelector, handleSubmit) {
    this[formName] = {
      ...this[formName],
      formSelector,
      formElement: document.forms[formSelector],
      popupSelector: `.popup_type_${formSelector}`,
      openButton: document.querySelector(`[name=${formSelector}-button]`),
      handleSubmit,
    };
  },
  addValidatorInstance(formName, instance) {
    this[formName].validatorInstance = instance;
  },
  addPopupInstance(formName, instance) {
    this[formName].popupInstance = instance;
  },
};
