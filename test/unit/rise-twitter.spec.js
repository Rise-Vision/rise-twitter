import RiseTwitter from "../../src/rise-twitter";

describe("Example test", () => {
  it("works", () => {
    expect(RiseTwitter).toBeDefined();

    const component = new RiseTwitter();
    expect(component).toBeDefined();
  });
});
