export default class Config {
  constructor() {
    this.componentName = 'rise-twitter';
    this.componentId = '';
    this.bqProjectName = 'client-side-events';
    this.bqDataset = 'Component_Events';
    this.bqTable = 'rise_twitter_events';
    this.failedEntryFile = 'rise-twitter-failed.log';
    this.displayId = '';
    this.companyId = '';
    this.componentVersion = '';
    this.waitingForTweetsTime = 5000;
    this.waitingForRequestingTweetsTime = 60 * 60 * 1000; // 1hour
    this.totalNumberOfAttempts = 5;
  }

  setDisplayId(displayId) {
    this.displayId = displayId;
  }

  setCompanyId(companyId) {
    this.companyId = companyId;
  }

  setComponentId(componentId) {
    this.componentId = componentId;
  }

  setComponentVersion(version) {
    this.componentVersion = version;
  }
}
