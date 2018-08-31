import RiseTwitter from "../../src/rise-twitter";
import Tweet from "../../src/tweet";
import EventHandler from "../../src/event-handler";

let component = null;
let risePlaylistItem = null;
let messaging = null;
let tweet = null;
let eventHandler = null;
describe("Twitter Component - Unit", () => {
  describe("Test event listeners", () => {
    beforeAll(() => {
      top.RiseVision = {};
      top.RiseVision.Viewer = {};
      top.RiseVision.Viewer.LocalMessaging = {
        write: (message) => {},
        receiveMessages: (handler) => {},
        canConnect: () => {return true;}
      };

      eventHandler = new EventHandler();
      eventHandler.emitReady = jest.genMockFn();
      eventHandler.emitDone = jest.genMockFn();

      risePlaylistItem = document.createElement("rise-playlist-item");
      risePlaylistItem.callReady = jest.genMockFn();
      risePlaylistItem.callDone = jest.genMockFn();
      risePlaylistItem.callRSParamGet = jest.genMockFn();

      document.getElementsByTagName("body")[0].appendChild(risePlaylistItem);
      component = new RiseTwitter();
      risePlaylistItem.appendChild(component);
      tweet = new Tweet;
      component.eventHandler = eventHandler;
      component.shadowRoot = {};
      component.shadowRoot.appendChild = jest.genMockFn();
      component.connectedCallback();

      component._play = jest.genMockFn();
      component._playInPreview = jest.genMockFn();
      component._pause = jest.genMockFn();
      component._stop = jest.genMockFn();
    });

    beforeEach(() => {
      component.settings.setAuthorization(true);
      component.settings.setTwitterModuleStatus(true);
      component.settings.setRequiredModulesAvailable(true);
      component.isPreview = false;
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should have component defined", () => {
      expect(RiseTwitter).toBeDefined();
      expect(component).toBeDefined();
    });

    it("should call configure listener when configure event is dispached", (done) => {
      jest.useFakeTimers();

      const event = new CustomEvent("configure", {
        detail: {
          screenName: "test"
        }
      });

      risePlaylistItem.dispatchEvent(event);

      setTimeout(()=>{
        expect(component.screenName).toEqual("test");
        done();
      }, 1000);

      jest.runAllTimers();
    });

    it("should not play listener when play event is dispached when unauthorized", (done) => {
      jest.useFakeTimers();

      component.settings.setAuthorization(false);

      const event = new CustomEvent("play");

      risePlaylistItem.dispatchEvent(event);

      setTimeout(()=>{
        expect(component._play).not.toHaveBeenCalled();
        done();
      }, 1000);

      jest.runAllTimers();
    });

    it("should call play listener when play event is dispached when authorized", (done) => {
      jest.useFakeTimers();

      const event = new CustomEvent("play");

      risePlaylistItem.dispatchEvent(event);

      setTimeout(()=>{
        expect(component._play).toHaveBeenCalled();
        done();
      }, 1000);

      jest.runAllTimers();
    });

    it("should call playPreview listener when play event is dispached when in preview", (done) => {
      jest.useFakeTimers();
      component.isPreview = true;
      const event = new CustomEvent("play");

      risePlaylistItem.dispatchEvent(event);

      setTimeout(()=>{
        expect(component._playInPreview).toHaveBeenCalled();
        done();
      }, 1000);

      jest.runAllTimers();
    });

    it("should call pause listener when pause event is dispached", (done) => {
      jest.useFakeTimers();

      const event = new CustomEvent("pause");

      risePlaylistItem.dispatchEvent(event);

      setTimeout(()=>{
        expect(component._pause).toHaveBeenCalled();
        done();
      }, 1000);

      jest.runAllTimers();
    });

    it("should call stop listener when stop event is dispached", (done) => {
      jest.useFakeTimers();

      const event = new CustomEvent("stop");

      risePlaylistItem.dispatchEvent(event);

      setTimeout(()=>{
        expect(component._stop).toHaveBeenCalled();
        done();
      }, 1000);

      jest.runAllTimers();
    });

  })

  describe("Test play", () => {
    beforeEach(() => {
      risePlaylistItem = document.createElement("rise-playlist-item");
      document.getElementsByTagName("body")[0].appendChild(risePlaylistItem);
      component = new RiseTwitter();
      component.shadowRoot = {};
      component.shadowRoot.appendChild = jest.genMockFn();
      component.shadowRoot.querySelectorAll = jest.genMockFn();
      component.connectedCallback();

      component.id = "componentIdTest";
      component.hashtag = "hashtagTest";

      component._handleConfigure({detail:{displayId: "xxxxxx", screenName: "screenNameTest"}})

      messaging = component.getMessaging();
      tweet = component.getTweet();
      tweet.getTweets = jest.fn();
      tweet.handleError = jest.fn();

      eventHandler = component.getEventHandler();
      eventHandler.emitDone = jest.genMockFn();
      messaging.sendComponentSettings = jest.genMockFn();

      tweet.getTweets.mockReturnValue(new Array());

      component.settings.setAuthorization(true);
      component.settings.setTwitterModuleStatus(true);
      component.settings.setRequiredModulesAvailable(true);
    })

    it("should not send component settings when play event is dispached when modules are not avaliable", (done) => {
      jest.useFakeTimers();

      component.settings.setRequiredModulesAvailable(false);

      const event = new CustomEvent("play");

      risePlaylistItem.dispatchEvent(event);

      setTimeout(()=>{
        expect(messaging.sendComponentSettings).not.toHaveBeenCalled();
        done();
      }, 1000);

      jest.runAllTimers();
    });

    it("should not send component settings when play event is dispached when twitter is not READY", (done) => {
      jest.useFakeTimers();

      component.settings.setTwitterModuleStatus(false);

      const event = new CustomEvent("play");

      risePlaylistItem.dispatchEvent(event);

      setTimeout(()=>{
        expect(messaging.sendComponentSettings).not.toHaveBeenCalled();
        done();
      }, 1000);

      jest.runAllTimers();
    });

    it("should call component connect and send component settings if connection is open when play is called", () => {
      component._startWaitingForTweetsTimer = jest.genMockFn();

      component._play();

      expect(messaging.sendComponentSettings).toHaveBeenCalledWith("screenNameTest", "hashtagTest");
      expect(component._startWaitingForTweetsTimer).toHaveBeenCalled();

    });

    it("should call _startAPausePeriodBetweenTweetRequests after calling play 5 times and no tweets have returned", () => {
      component._startAPausePeriodBetweenTweetRequests = jest.genMockFn();

      component._play();
      component._play();
      component._play();
      component._play();
      component._play();
      component._play();

      expect(messaging.sendComponentSettings).toHaveBeenCalledTimes(5);
      expect(component._startAPausePeriodBetweenTweetRequests).toHaveBeenCalled();

    });

    it("should call setTimeout with an hour timer", () => {
      jest.useFakeTimers();
      component._startAPausePeriodBetweenTweetRequests();

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 60*60*1000);

    });

    it("should call setTimeout one time even though the start functions has been called multiple times", () => {
      jest.useFakeTimers();
      component._startAPausePeriodBetweenTweetRequests();
      component._startAPausePeriodBetweenTweetRequests();

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 60*60*1000);

    });

    describe("Test play startWaitingForTweetsTimer", () => {
      beforeEach(() => {
        tweet.getTweets.mockReturnValue(new Array());
      });

      it("should call setTimeout when calling _startWaitingForTweetsTimer", () => {
        jest.useFakeTimers();
        component._startWaitingForTweetsTimer();

        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5000);

      });

      it("should call emitDone when calling _startWaitingForTweetsTimer and getTweets has length 0", () => {

        jest.useFakeTimers();

        component._startWaitingForTweetsTimer();

        jest.runAllTimers();

        expect(eventHandler.emitDone).toHaveBeenCalled();

      });

      it("should not call emitDone when calling _startWaitingForTweetsTimer and getTweets has length greater than 0", () => {
        tweet.getTweets.mockReturnValue([1,2,3]);
        jest.useFakeTimers();

        component._startWaitingForTweetsTimer();

        jest.runAllTimers();

        expect(eventHandler.emitDone).not.toHaveBeenCalled();

      });
    });

    it("should not send component settings if connection is closed when play is called", () => {
      top.RiseVision = {};
      top.RiseVision.Viewer = {};
      top.RiseVision.Viewer.LocalMessaging = {
        write: (message) => {},
        receiveMessages: (handler) => {},
        canConnect: () => {return false;}
      };
      component = new RiseTwitter();
      component._play = jest.genMockFn();
      component.isPreview = false;
      component._play();

      expect(messaging.sendComponentSettings).not.toHaveBeenCalled();

    });
  });

  describe("Test stop", () => {
    beforeAll(() => {
      risePlaylistItem = document.createElement("rise-playlist-item");
      document.getElementsByTagName("body")[0].appendChild(risePlaylistItem);
      component = new RiseTwitter();
      component.shadowRoot = {};
      component.shadowRoot.appendChild = jest.genMockFn();
      component.connectedCallback();
      component.isPreview = false;
      component._pause = jest.genMockFn();
    })

    it("should call pause when stop is called", () => {
      component._stop();

      expect(component._pause).toHaveBeenCalled();
    });
  });
});
