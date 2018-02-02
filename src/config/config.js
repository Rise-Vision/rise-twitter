export default class Config {
  constructor() {
    this.componentName = 'rise-twitter';
    this.bqProjectName = 'client-side-events';
    this.bqDataset = 'Component_Events';
    this.bqTable = 'rise-twitter-events';
    this.failedEntryFile = 'rise-twitter-failed.log';
    this.displayId = '';
    this.companyId = '';
    this.componentVersion = '';
  }

  setDisplayId(displayId) {
    this.displayId = displayId;
  }

  setCompanyId(companyId) {
    this.companyId = companyId;
  }

  setComponentVersion(version) {
    this.componentVersion = version;
  }
}