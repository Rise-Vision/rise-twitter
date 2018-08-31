import CommonRPPLicensing from 'common-component/player-professional-licensing';

export default class Licensing {
  constructor(localMessaging, logger, config, settings) {
    this.settings = settings;
    this.commonLicensing = new CommonRPPLicensing(localMessaging, logger, config);
  }

  requestLicensingDataIfLicensingIsAvailable(message) {
    const clients = message.clients;
    const required = ['local-storage', 'licensing', 'twitter'];

    let running = required.every((val) => clients.includes(val));

    if (this.settings.getRequiredModulesAvailable()) { return; }

    if (running) {
      console.log('Requesting Licensing');
      this.settings.setRequiredModulesAvailable(true);
      this.commonLicensing.requestAuthorization();
    }
  }
}
