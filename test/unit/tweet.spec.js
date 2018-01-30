import RiseTwitter from "../../src/rise-twitter";
import Tweet from "../../src/tweet";

let component = null;
let risePlaylistItem = null;
let messaging = null;
let tweet = null;
describe("Tweet - Unit", () => {
    beforeEach(() => {
      const shadowRoot = {};
      shadowRoot.appendChild = jest.genMockFn();

      tweet = new Tweet(shadowRoot);

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

    it("should display filler tweets if update tweets are invalid", () => {
      tweet._areValidTweets = jest.genMockFn();
      tweet._clearTweets = jest.genMockFn();
      tweet._displayFillerTweets = jest.genMockFn();

      tweet.update({});

      expect(tweet._areValidTweets).toHaveBeenCalled();
      expect(console.log).toBeCalledWith('Invalid Tweets - displaying filler tweets', JSON.stringify({}));
      expect(tweet._clearTweets).toHaveBeenCalled();
      expect(tweet._displayFillerTweets).toHaveBeenCalled();
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
