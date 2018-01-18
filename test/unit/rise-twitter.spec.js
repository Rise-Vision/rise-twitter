import RiseTwitter from "../../src/rise-twitter";

describe("Twitter Component - Unit", () => {
  it("should have component defined", () => {
    expect(RiseTwitter).toBeDefined();

    const component = new RiseTwitter();
    expect(component).toBeDefined();
  });

  it("should call configure listener when configure event is dispached", (done) => {
    jest.useFakeTimers();

    const risePlaylistItem = document.createElement("rise-playlist-item");
    document.getElementsByTagName("body")[0].appendChild(risePlaylistItem);
    const component = new RiseTwitter();

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
});
