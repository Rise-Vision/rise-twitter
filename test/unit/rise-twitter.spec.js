import RiseTwitter from "../../src/rise-twitter";
import Tweet from "../../src/tweet";

let component = null;
let risePlaylistItem = null;
let messaging = null;
let tweet = null;
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

      risePlaylistItem = document.createElement("rise-playlist-item");
      document.getElementsByTagName("body")[0].appendChild(risePlaylistItem);
      component = new RiseTwitter();
      component.shadowRoot = {};
      component.shadowRoot.appendChild = jest.genMockFn();
      component.connectedCallback();

      component._play = jest.genMockFn();
      component._pause = jest.genMockFn();
      component._stop = jest.genMockFn();
    });

    beforeEach(() => {
      component.settings.setAuthorization(true);
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
      component.connectedCallback();

      component.id = "componentIdTest";
      component.screenName = "screenNameTest";
      component.hashtag = "hashtagTest";

      messaging = component.getMessaging();

      messaging.sendComponentSettings = jest.genMockFn();
    })

    it("should call component connect and send component settings if connection is closed when play is called", () => {
      component._play();

      expect(messaging.sendComponentSettings).toHaveBeenCalledWith("screenNameTest", "hashtagTest");

    });

    it("should not send component settings if connection is not open when play is called", () => {
      top.RiseVision = {};
      top.RiseVision.Viewer = {};
      top.RiseVision.Viewer.LocalMessaging = {
        write: (message) => {},
        receiveMessages: (handler) => {},
        canConnect: () => {return false;}
      };
      component = new RiseTwitter();
      component._play = jest.genMockFn();
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

      component._pause = jest.genMockFn();
    })

    it("should call pause when stop is called", () => {
      component._stop();

      expect(component._pause).toHaveBeenCalled();

    });
  });
});
