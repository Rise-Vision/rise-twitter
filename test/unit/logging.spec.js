import RiseTwitter from "../../src/rise-twitter";
import Tweet from "../../src/tweet";
import Logger from "../../src/logger";
import Config from "../../src/config/config";
import Messaging from "../../src/messaging";
import {LocalMessaging} from 'common-component';

let component = null;
let risePlaylistItem = null;
let messaging = null;
let config = null;
let tweet = null;
let componentId = "componentIdTest";
let logger = null;
let localMessaging = null;

describe("Tweet - Unit", () => {
  beforeAll(() => {
    top.RiseVision = {};
    top.RiseVision.Viewer = {};
    top.RiseVision.Viewer.LocalMessaging = {
      write: (message) => {},
      receiveMessages: (handler) => {},
      canConnect: () => {return true;}
    };
  });

  beforeEach(() => {
    const shadowRoot = {};
    shadowRoot.appendChild = jest.genMockFn();

    config = new Config();
    localMessaging = new LocalMessaging();
    logger = new Logger(config, localMessaging);

    tweet = new Tweet(shadowRoot, logger);

    messaging = new Messaging(tweet, componentId, localMessaging, config, null, logger);

    logger.externalLogger.log = jest.genMockFn();
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should log external error message", () => {
    const expectedDetails = {"company_id": "unknown", "display_id": "preview", "event_details": "error message", "version": "unknown"};

    logger.error("error message");

    expect(logger.externalLogger.log).toHaveBeenCalledWith("Error", expectedDetails);
  });

  it("should log external playlistEvent message", () => {
    const expectedDetails = {"company_id": "unknown", "display_id": "preview", "event_details": "error message", "version": "unknown"};

    logger.playlistEvent("error message");

    expect(logger.externalLogger.log).toHaveBeenCalledWith("Playlist Event", expectedDetails);
  });

  it("should log standard external message", () => {
    const expectedDetails = {"company_id": "unknown", "display_id": "preview", "event_details": "error message", "version": "unknown"};

    logger._external("standard", "error message");

    expect(logger.externalLogger.log).toHaveBeenCalledWith("standard", expectedDetails);
  });
});
