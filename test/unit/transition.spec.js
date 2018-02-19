import RiseTwitter from "../../src/rise-twitter";
import Tweet from "../../src/tweet";
import Config from "../../src/config/config";
import Settings from "../../src/config/settings";
import Logger from "../../src/logger";
import Messaging from "../../src/messaging";
import {LocalMessaging} from 'common-component';

let component = null;
let risePlaylistItem = null;
let messaging = null;
let tweet = null;
let componentId = "componentIdTest";
let config = null;
let settings = null;
let logger = null;
let localMessaging = null;
let transition = null;

describe("Transition - Unit", () => {
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
    settings = new Settings();
    logger = new Logger(config);

    tweet = new Tweet(shadowRoot, logger, settings);
    transition = tweet.getTransition();

    localMessaging = new LocalMessaging();
    messaging = new Messaging(tweet, componentId, localMessaging, logger);

    logger.error = jest.genMockFn();
    tweet.shadowRoot.querySelector = jest.genMockFn();
    tweet.shadowRoot.querySelectorAll = jest.genMockFn();
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should create instance of transition class", () => {
    expect(transition).toBeDefined();
    expect(transition.logger).toBeDefined();
    expect(transition.currentTweetIndex).toBeDefined();
  });

  it("should set config values for transition", () => {
    transition._setTransitionConfig();

    expect(transition.currentTweetIndex).toBeDefined();
    expect(transition.isPaused).toBeDefined();
    expect(transition.numTweetsToDisplay).toBeDefined();
  });
});
