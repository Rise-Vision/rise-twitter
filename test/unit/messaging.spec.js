import Messaging from "../../src/messaging";
import Tweet from "../../src/tweet";
import {LocalMessaging} from 'common-component';
import Settings from "../../src/config/settings";
import Logger from "../../src/logger";

let messaging = null;
let tweet = null;
let componentId = "componentIdTest";
let localMessaging = null;
let settings = null;
let logger = null;
describe("Twitter Component Messaging - Unit", () => {
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
    tweet = new Tweet();
    localMessaging = new LocalMessaging();
    settings = new Settings();
    logger = new Logger();
    messaging = new Messaging(tweet, componentId, localMessaging, settings, logger);

    tweet.updateTweets = jest.genMockFn();
    localMessaging.broadcastMessage = jest.genMockFn();
  });

  it("should have messaging defined", () => {
    expect(messaging).toBeDefined();
    expect(messaging).toBeDefined();
  });

  it("should call tweet update when reciving an update message", () => {
    const tweets = [{id: 1234, text: "blabla"}, {id: 4568, text: "blabla2"}];
    const message = {
      "from": "twitter-module",
      "topic": "twitter-update",
      "status": "Current",
      "data": {
        "component_id": componentId,
        "tweets": JSON.stringify(tweets)
      }
    }

    messaging._handleMessage(message);

    expect(tweet.updateTweets).toHaveBeenCalledWith(tweets);
  });

  it("should not call tweet update when reciving an update message with different component id", () => {
    const tweets = [{id: 1234, text: "blabla"}, {id: 4568, text: "blabla2"}];
    const message = {
      "from": "twitter-module",
      "topic": "twitter-update",
      "status": "Current",
      "data": {
        "component_id": "anotherId",
        "tweets": JSON.stringify(tweets)
      }
    }

    messaging._handleMessage(message);

    expect(tweet.updateTweets).not.toHaveBeenCalled();
  });

  it("should not call tweet update when reciving an non twitter-update message", () => {
    const message = {
      "from": "logging-module",
      "topic": "log",
      "data": {}
    }

    messaging._handleMessage(message);

    expect(tweet.updateTweets).not.toHaveBeenCalled();
  });

  it("should call send message with twitter-watch topic and component settings", () => {
    const message = {
      "topic": "twitter-watch",
      "data": {
        "component_id": "componentIdTest",
        "screen_name": "screenNameTest",
        "hashtag": "hashtagTest",
      }
    }

    messaging.sendComponentSettings("screenNameTest", "hashtagTest");

    expect(localMessaging.broadcastMessage).toHaveBeenCalledWith(message);
  });

  it("should call send message with twitter-watch topic and component settings with only hashtag", () => {
    const message = {
      "topic": "twitter-watch",
      "data": {
        "component_id": "componentIdTest",
        "screen_name": "",
        "hashtag": "hashtagTest",
      }
    }

    messaging.sendComponentSettings("", "hashtagTest");

    expect(localMessaging.broadcastMessage).toHaveBeenCalledWith(message);
  });

  it("should call send message with twitter-watch topic and component settings with only screen name", () => {
    const message = {
      "topic": "twitter-watch",
      "data": {
        "component_id": "componentIdTest",
        "screen_name": "screenNameTest",
        "hashtag": "",
      }
    }

    messaging.sendComponentSettings("screenNameTest");

    expect(localMessaging.broadcastMessage).toHaveBeenCalledWith(message);
  });
});
