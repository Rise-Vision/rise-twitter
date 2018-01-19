import RiseTwitter from "../../src/rise-twitter";

let component = null;
let risePlaylistItem = null;
describe("Twitter Component - Unit", () => {
  beforeAll(() => {
    risePlaylistItem = document.createElement("rise-playlist-item");
    document.getElementsByTagName("body")[0].appendChild(risePlaylistItem);
    component = new RiseTwitter();

    component._play = jest.genMockFn();
    component._pause = jest.genMockFn();
    component._stop = jest.genMockFn();
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

  it("should call play listener when play event is dispached", (done) => {
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
});
