import Messaging from "../../src/messaging";
import Tweet from "../../src/tweet";

let messaging = null;
let tweet = null;
let componentId = "componentIdTest";
describe("Twitter Component Messaging - Unit", () => {
  beforeEach(() => {
    tweet = new Tweet();
    messaging = new Messaging(tweet, componentId);

    tweet.update = jest.genMockFn();
    messaging._sendMessage = jest.genMockFn();
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

    expect(tweet.update).toHaveBeenCalledWith(tweets);
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

    expect(tweet.update).not.toHaveBeenCalled();
  });

  it("should not call tweet update when reciving an non twitter-update message", () => {
    const message = {
      "from": "logging-module",
      "topic": "log",
      "data": {}
    }

    messaging._handleMessage(message);

    expect(tweet.update).not.toHaveBeenCalled();
  });

  it("should call send message with twitter-watch topic and component settings", () => {
    const message = {
      "from": "ws-client",
      "topic": "twitter-watch",
      "data": {
        "component_id": "componentIdTest",
        "screen_name": "screenNameTest",
        "hashtag": "hashtagTest",
      }
    }

    messaging.sendComponentSettings("screenNameTest", "hashtagTest");

    expect(messaging._sendMessage).toHaveBeenCalledWith(message);
  });

  it("should call send message with twitter-watch topic and component settings with only hashtag", () => {
    const message = {
      "from": "ws-client",
      "topic": "twitter-watch",
      "data": {
        "component_id": "componentIdTest",
        "screen_name": "",
        "hashtag": "hashtagTest",
      }
    }

    messaging.sendComponentSettings("", "hashtagTest");

    expect(messaging._sendMessage).toHaveBeenCalledWith(message);
  });

  it("should call send message with twitter-watch topic and component settings with only screen name", () => {
    const message = {
      "from": "ws-client",
      "topic": "twitter-watch",
      "data": {
        "component_id": "componentIdTest",
        "screen_name": "screenNameTest",
        "hashtag": "",
      }
    }

    messaging.sendComponentSettings("screenNameTest");

    expect(messaging._sendMessage).toHaveBeenCalledWith(message);
  });
});
