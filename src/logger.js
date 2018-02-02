import Config from './config/config';
import ExternalLogger from 'common-component/external-logger';

export default class Logger {
  constructor() {
    this.config = new Config();
    this.externalLogger = new ExternalLogger(this.config.bqProjectName, this.config.bqDataset, this.config.failedEntryFile, this.config.bqTable, this.config.componentName);
  }

  playlistEvent(eventDetails, data) {
    this.external('Playlist Event', eventDetails);
  }

  error(eventDetails, data) {
    console.log(eventDetails);
    this.external('Error', eventDetails);
  }

  external(evt, eventDetails, data) {
    this.externalLogger.log(evt, this._constructDetails(eventDetails, data = {}));
  }

  _constructDetails(eventDetails, data) {
    return Object.assign({
      'event_details': eventDetails,
      'display_id': this.config.displayId || 'preview',
      'company_id': this.config.companyId || 'unknown',
      'version': this.config.componentVersion || 'unknown'
    }, data);
  }
}
