import CommonRPPLicensing from 'common-component/player-professional-licensing';

export default class Licensing {
  constructor(localMessaging, logger, config, settings) {
    this.localMessaging = localMessaging;
    this.logger = logger;
    this.config = config;
    this.settings = settings;

    this.commonLicensing = new CommonRPPLicensing(this.localMessaging, this.logger, this.handleAuthorizationEvents.bind(this), this.config);
  }

  requestLicensingDataIfLicensingIsAvailable(message) {
    const clients = message.clients;
    const required = ['local-storage', 'licensing', 'twitter'];

    let running = required.every((val) => clients.includes(val));

    if (running && this.settings.getIsAuthorized() === null) {
      this.logger.evt('Requesting Licensing');
      this.settings.setRequiredModulesAvailable(true);
      this.commonLicensing.requestAuthorization();
    }
  }

  handleAuthorizationEvents(data) {
    if (!data || !data.event || typeof data.event !== 'string') {
      return;
    }

    switch (data.event.toUpperCase()) {
      case 'AUTHORIZED':
        this._handleAuthorizationUpdate(true);
        break;
      case 'UNAUTHORIZED':
        this._handleAuthorizationUpdate(false);
        break;
    }
  }

  _handleAuthorizationUpdate(status) {
    const userFriendlyStatus = status ? 'authorized' : 'unauthorized';
    console.log(`Authorization status updated - ${userFriendlyStatus}`);
    this.logger.evt(userFriendlyStatus);
    this.settings.setAuthorization(status);
  }
}
