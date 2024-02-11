import { loadingText } from './constants';

export const handleSubmit = (request, popupInstance) => {
  popupInstance.toggleButtonText(true, loadingText);
  request()
    .then(() => {
      popupInstance.close();
    })
    .catch(console.error)
    .finally(() => {
      popupInstance.toggleButtonText(false);
    });
};
