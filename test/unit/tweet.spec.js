import RiseTwitter from "../../src/rise-twitter";
import Tweet from "../../src/tweet";
import Config from "../../src/config/config";
import Logger from "../../src/logger";
import Messaging from "../../src/messaging";
import {LocalMessaging} from 'common-component';
import EventHandler from "../../src/event-handler";

let component = null;
let eventHandler = null;
let risePlaylistItem = null;
let messaging = null;
let tweet = null;
let componentId = "componentIdTest";
let config = null;
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

    eventHandler = new EventHandler();
    eventHandler.emitReady = jest.genMockFn();
    eventHandler.emitDone = jest.genMockFn();

    config = new Config();
    logger = new Logger(config);

    tweet = new Tweet(shadowRoot, logger, null, eventHandler);

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

  it("should clear tweets and display filler tweets", () => {
    tweet._clearTweets = jest.genMockFn();
    tweet._displayFillerTweets = jest.genMockFn();

    tweet.handleError();

    expect(tweet._clearTweets).toHaveBeenCalled();
    expect(tweet._displayFillerTweets).toHaveBeenCalled();
  });

  it("should emit done to playlist if update tweets are invalid", () => {
    tweet._areValidTweets = jest.genMockFn();
    tweet._clearTweets = jest.genMockFn();
    tweet._displayFillerTweets = jest.genMockFn();

    tweet.updateTweets({});

    expect(tweet._areValidTweets).toHaveBeenCalled();
    expect(eventHandler.emitDone).toHaveBeenCalled();
    expect(tweet._displayFillerTweets).not.toHaveBeenCalled();
  });

  it("should test validity", () => {
    tweet._isValidTweet = jest.genMockFn();

    tweet._areValidTweets({});
    expect(tweet._isValidTweet).not.toHaveBeenCalled();

    tweet._areValidTweets({test: 'testValue'});
    expect(tweet._isValidTweet).toHaveBeenCalled();
  });

  it("should clear tweets", () => {
    try {
      tweet._clearTweets();
    } catch (e) {
      expect(e.message).toBe("Cannot set property 'innerHTML' of undefined");
    }
  });

  it("should construct base div", () => {
    return expect(tweet._constructBaseDiv({id: `testing-id`}).then(data => typeof data)).resolves.toBe("object");
  });

  it("should update data for tweet", () => {
    tweet._updateHeader = jest.genMockFn();
    tweet._updateBody = jest.genMockFn();
    tweet._updateStats = jest.genMockFn();

    return expect(tweet._updateData({id: `testing-id`})).resolves.toEqual();
    expect(tweet._updateHeader).toHaveBeenCalled();
    expect(tweet._updateBody).toHaveBeenCalled();
    expect(tweet._updateStats).toHaveBeenCalled();
  });
});
