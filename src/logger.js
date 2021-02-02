/* eslint no-return-assign: "off" */

import ExternalLogger from 'common-component/external-logger';

export default class Logger {
  constructor(config, localMessaging) {
    this.config = config;
    this.localMessaging = localMessaging;
    this.externalLogger = new ExternalLogger(this.localMessaging, this.config.bqProjectName, this.config.bqDataset, this.config.failedEntryFile, this.config.bqTable, this.config.componentName, this.config.componentId);
  }

  getLocalMessaging() {
    return this.localMessaging;
  }

  canConnectToLMS() {
    return this.getLocalMessaging().canConnect();
  }

  playlistEvent(eventDetails) {
    this._external('Playlist Event', eventDetails, null, { severity: 'info' });
  }

  evt(evt, eventDetails) {
    this._external(evt, eventDetails, null, { severity: 'info' });
  }

  warning(eventDetails, data) {
    console.log(eventDetails);
    this._external('warning', eventDetails, data, { severity: 'warning' });
  }

  error(eventDetails, data, errorCode) {
    console.log(eventDetails);
    this._external('Error', eventDetails, data, { severity: 'error', errorCode });
  }

  startEndpointHeartbeats() {
    this.externalLogger.startEndpointHeartbeats('widget-twitter', this.config.componentVersion);
  }

  _external(evt, eventDetails, data, endpointParams) {
    if (this.getLocalMessaging() && this.canConnectToLMS()) {
      this.externalLogger.log(evt, this._constructDetails(eventDetails, data = {}), endpointParams);
    }
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
