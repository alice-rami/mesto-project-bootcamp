export default class UserInfo {
    constructor({nameSelector, aboutSelector, avatarSelector}, userData) {
        this._nameElement = document.querySelector(nameSelector);
        this._aboutElement = document.querySelector(aboutSelector);
        this._avatarElement = document.querySelector(avatarSelector);
        this._userId = userData._id;
        this._userData = userData;
    }

    getUserId() {
        return this._userId;
    }

    getUserInfo() {
        return this._userData;
    }

    updateUserInfo({name, about, avatar, _id}) {
        this._userData.name = name;
        this._userData.about = about;
        this._userData.avatar = avatar;
        this._userData._id = _id;
        return this._userData;
    }

    setUserInfo({name, about, avatar} = this.getUserInfo()) {       
        this._nameElement.textContent = name;
        this._aboutElement.textContent = about;
        this._avatarElement.src = avatar;
    }
}