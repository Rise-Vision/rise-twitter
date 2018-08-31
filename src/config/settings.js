export default class Settings {
  constructor() {
    this.numTweetsToDisplay = 25;
    this.isAuthorized = null;
    this.twitterModuleStatus = null;
    this.requiredModulesAvailable = false;
  }

  setTwitterModuleStatus(status) {
    this.twitterModuleStatus = status;
  }

  getTwitterModuleStatus() {
    return this.twitterModuleStatus;
  }

  setAuthorization(status) {
    this.isAuthorized = status;
  }

  getIsAuthorized() {
    return this.isAuthorized;
  }

  setRequiredModulesAvailable(status) {
    this.requiredModulesAvailable = status;
  }

  getRequiredModulesAvailable() {
    return this.requiredModulesAvailable;
  }
}
