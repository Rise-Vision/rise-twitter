import RiseTwitter from "../../src/rise-twitter";
import Tweet from "../../src/tweet";
import Logger from "../../src/logger";
import Licensing from "../../src/licensing";
import Config from "../../src/config/config";
import Settings from "../../src/config/settings";
import Messaging from "../../src/messaging";
import {LocalMessaging} from 'common-component';

let component = null;
let risePlaylistItem = null;
let messaging = null;
let config = null;
let settings = null;
let tweet = null;
let componentId = "componentIdTest";
let logger = null;
let localMessaging = null;
let licensing = null;

describe("Tweet - Unit", () => {
  beforeAll(() => {
    top.RiseVision = {};
    top.RiseVision.Viewer = {};
    top.RiseVision.Viewer.LocalMessaging = {
      write: (message) => {},
      receiveMessages: (handler) => {},
      canConnect: () => {return true;},
    };
  });

  beforeEach(() => {
    const shadowRoot = {};
    shadowRoot.appendChild = jest.genMockFn();

    config = new Config();
    config.setComponentId(componentId);

    settings = new Settings();

    localMessaging = new LocalMessaging();
    logger = new Logger(config, localMessaging);

    tweet = new Tweet(shadowRoot, logger);

    licensing = new Licensing(localMessaging, logger, config, settings);

    messaging = new Messaging(tweet, localMessaging, config, settings, logger, licensing);

    licensing.commonLicensing.requestAuthorization = jest.genMockFn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should request licensing if necessary modules avaliable", () => {
    const message = {clients: ['local-storage', 'licensing', 'twitter']};

    licensing.requestLicensingDataIfLicensingIsAvailable(message);

    expect(licensing.commonLicensing.requestAuthorization).toHaveBeenCalled();
  });

  it("should not request licensing if necessary modules not avaliable", () => {
    const message = {"clients": ["local-storage", "licensing"]};

    licensing.requestLicensingDataIfLicensingIsAvailable(message);

    expect(licensing.commonLicensing.requestAuthorization).not.toHaveBeenCalled();
  });

  it("should not request licensing if licensing has already been fetched", () => {
    const message = {clients: ['local-storage', 'licensing', 'twitter']};
    settings.setRequiredModulesAvailable(true);
    settings.setAuthorization(true);

    licensing.requestLicensingDataIfLicensingIsAvailable(message);

    expect(licensing.commonLicensing.requestAuthorization).not.toHaveBeenCalled();
  });
});
