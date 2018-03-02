export default class Settings {
  constructor() {
    this.numTweetsToDisplay = 25;
    this.isAuthorized = null;
  }

  setAuthorization(status) {
    this.isAuthorized = status;
  }

  getIsAuthorized() {
    return this.isAuthorized;
  }
}
