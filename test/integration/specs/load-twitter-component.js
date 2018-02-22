const chai = require('chai');
global.expect = chai.expect;
chai.Should();
const commonConfig = require('common-display-module');
const simple = require("simple-mock");
const mock = simple.mock;
const ipc = require("node-ipc");
let localMessagingModule = require('local-messaging-module');
let testTweets = null;

describe('Twitter Component - Integration', () => {
  before(()=>{
    return localMessagingModule.start(ipc, "ls-test-did", "ls-test-mid");
  });
  beforeEach(()=>{
    testTweets = [ { created_at: 'Fri Jan 26 03:54:15 +0000 2018',
              id: 956737018452697100,
              text: 'let\'s see what happens when we include multiple links https://t.co/mkd9UQImGK https://t.co/APnwHc7cR4',
              entities: { hashtags: [], symbols: [], user_mentions: [],
                urls:
                  [{"url":"https://t.co/mkd9UQImGK",
                  "expanded_url":"http://www.google.com",
                  "display_url":"google.com",
                  "indices":[54,77]},
                  {"url":"https://t.co/APnwHc7cR4",
                  "expanded_url":"http://www.instagram.com",
                  "display_url":"instagram.com",
                  "indices":[78,101]}]},
              source: '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
              user:
               { id: 954121472225759200,
                 name: 'Rise Vision',
                 screen_name: 'RiseVisionUniversity',
                 profile_image_url: 'http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
               },
              retweet_count: 30,
              favorite_count: 15
              } ];

    mock(console, "log");
    mock(commonConfig, "getDisplaySettingsSync").returnWith({
      displayid: "ls-test-id", displayId: "ls-test-id"
    });
  });

  after(() => {
    localMessagingModule.stop();
    simple.restore();
  });

  afterEach(() => {
    commonConfig.disconnect();
  });

  it('should load component but not load invalid tweet', () => {
      browser.url('/');
      const invalidTestTweets = [{id: 1234, text: 'blabla'}];

      commonConfig.broadcastMessage({
        from: 'twitter-module',
        topic: 'twitter-update',
        status: 'current',
        through: 'ws',
        data: {
          'component_id': 'demoComponent',
          'tweets': JSON.stringify(invalidTestTweets)
        }
      });

      const screenNameSelector = 'rise-twitter .screen-name';

      const results = $$(screenNameSelector).filter(function (link) {
          return link;
      });

      expect(results.length).to.be.equal(0);
  });

  it('should load component and tweets', () => {
      browser.url('/');

      commonConfig.broadcastMessage({
        from: 'twitter-module',
        topic: 'twitter-update',
        status: 'Current',
        through: 'ws',
        data: {
          'component_id': 'demoComponent',
          'tweets': JSON.stringify(testTweets)
        }
      });

      const nameSelector = 'rise-twitter .display-name';
      browser.waitForText(nameSelector);
      browser.getText(nameSelector).should.be.equal(testTweets[0].user.name);

      const screenNameSelector = 'rise-twitter .screen-name';
      browser.waitForText(screenNameSelector);
      browser.getText(screenNameSelector).should.be.equal('@' + testTweets[0].user.screen_name);

      const textSelector = 'rise-twitter .tweet-text';
      browser.waitForText(textSelector);
      const testText = browser.getText(textSelector);
      (testTweets[0].text).should.contain(testText);

      const retweetsSelector = 'rise-twitter .tweet-retweets';
      browser.waitForText(retweetsSelector);
      browser.getText(retweetsSelector).should.be.equal(testTweets[0].retweet_count.toString());

      const favoritesSelector = 'rise-twitter .tweet-favorites';
      browser.waitForText(favoritesSelector);
      browser.getText(favoritesSelector).should.be.equal(testTweets[0].favorite_count.toString());
  });

  it('should default to 0 if retweet_count is undefined', () => {
      browser.url('/');

      delete testTweets[0]['retweet_count'];

      commonConfig.broadcastMessage({
        from: 'twitter-module',
        topic: 'twitter-update',
        status: 'CURRENT',
        through: 'ws',
        data: {
          'component_id': 'demoComponent',
          'tweets': JSON.stringify(testTweets)
        }
      });

      const retweetsSelector = 'rise-twitter .tweet-retweets';
      const expectedRetweets = 0;
      browser.waitForText(retweetsSelector);
      browser.getText(retweetsSelector).should.be.equal(expectedRetweets.toString());
  });

  it('should default to 0 if favorite_count is undefined', () => {
      browser.url('/');

      delete testTweets[0]['favorite_count'];

      commonConfig.broadcastMessage({
        from: 'twitter-module',
        topic: 'twitter-update',
        status: 'CURRENT',
        through: 'ws',
        data: {
          'component_id': 'demoComponent',
          'tweets': JSON.stringify(testTweets)
        }
      });

      const favoritesSelector = 'rise-twitter .tweet-favorites';
      const expectedFavorites = 0;
      browser.waitForText(favoritesSelector);
      browser.getText(favoritesSelector).should.be.equal(expectedFavorites.toString());
  });
  
  it('should inject streamed tweets', () => {
      browser.url('/');

      testTweets[0]['id'] = 111111111111;
      testTweets[0]['text'] = "this is an example streamed tweet";

      commonConfig.broadcastMessage({
        from: 'twitter-module',
        topic: 'twitter-update',
        status: 'Stream',
        through: 'ws',
        data: {
          'component_id': 'demoComponent',
          'tweets': JSON.stringify(testTweets)
        }
      });
      const textSelector = 'rise-twitter .tweet-111111111111 .tweet-text';
      const expectedText = "this is an example streamed tweet";
      browser.waitForText(textSelector);
      browser.getText(textSelector).should.be.equal(expectedText.toString());

      setTimeout(function() {
        const screenNameSelector = 'rise-twitter .tweet';
        const results = $$(screenNameSelector).filter(function (link) {
            return link;
        });
        expect(results.length).to.be.equal(25);
      }, 300);
  });
});
