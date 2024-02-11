export default class Api {
    constructor({baseUrl, headers}) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }
    
    _createRequest(endpoint, options) {
        return fetch(`${this._baseUrl}/${endpoint}`, options)
        .then(this._checkResponse);
    }
    
    loadUserData() {
        return this._createRequest('users/me', {
            headers: this._headers
        });
    }
    
    loadCardsData() {
        return this._createRequest('cards', {
            headers: this._headers
        });
    }
    
    editUserData(userData) {
        return this._createRequest('users/me', {
            headers: this._headers,
            method: 'PATCH',
            body: JSON.stringify({
                name: userData.name,
                about: userData.about
            })
        });
    }
    
    addNewCard(cardData) {
        return this._createRequest('cards', {
            headers: this._headers,
            method: 'POST',
            body: JSON.stringify({
                name: cardData.name,
                link: cardData.link
            })
        });
    }
    
    deleteCard(cardId) {
        return this._createRequest(`cards/${cardId}`, {
            headers: this._headers,
            method: 'DELETE',
            body: JSON.stringify({
                _id: cardId
            })
        });
    }
    
    addLike(cardId) {
        return this._createRequest(`cards/likes/${cardId}`, {
            headers: this._headers,
            method: 'PUT',
            body: JSON.stringify({
                _id: cardId
            })
        });
    }
    
    removeLike(cardId) {
        return this._createRequest(`cards/likes/${cardId}`, {
            headers: this._headers,
            method: 'DELETE',
            body: JSON.stringify({
                _id: cardId
            })
        });
    }
    
    updateAvatar(newAvatarLink) {
        return this._createRequest('users/me/avatar', {
            headers: this._headers,
            method: 'PATCH',
            body: JSON.stringify({
                avatar: newAvatarLink
            })
        });
    }
}