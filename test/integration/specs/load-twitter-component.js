const chai = require('chai');
global.expect = chai.expect;
chai.Should();
const commonConfig = require('common-display-module');
const simple = require("simple-mock");
const mock = simple.mock;
const ipc = require("node-ipc");
let localMessagingModule = require('local-messaging-module');

describe('Twitter Component - Integration', () => {
    before(()=>{
      return localMessagingModule.start(ipc, "ls-test-did", "ls-test-mid");
    });
    beforeEach(()=>{
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
        const tweets = [{id: 1234, text: 'blabla'}, {id: 4568, text: 'blabla2'}];

        commonConfig.broadcastMessage({
          from: 'twitter-module',
          topic: 'twitter-update',
          status: 'CURRENT',
          through: 'ws',
          data: {
            'component_id': 'demoComponent',
            'tweets': JSON.stringify(tweets)
          }
        });

        const selector = 'rise-twitter .twitter-component-template';
        browser.waitForExist(selector);

        browser.elements(selector, (err, results)=>{
          browser.elementIdText(results.value[0].ELEMENT).should.be.equal('');
        });
    });

    it('should load component and tweets', () => {
        browser.url('/');

        const tweets = [ { created_at: 'Fri Jan 26 03:54:15 +0000 2018',
          id: 956737018452697100,
          id_str: '956737018452697089',
          text: 'let\'s see what happens when we include multiple links https://t.co/mkd9UQImGK https://t.co/APnwHc7cR4',
          truncated: false,
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
          in_reply_to_status_id: null,
          in_reply_to_status_id_str: null,
          in_reply_to_user_id: null,
          in_reply_to_user_id_str: null,
          in_reply_to_screen_name: null,
          user:
           { id: 954121472225759200,
             id_str: '954121472225759232',
             name: 'Rise Vision',
             screen_name: 'RiseVisionUniversity',
             location: '',
             description: '',
             url: null,
             entities: [Object],
             protected: false,
             followers_count: 0,
             friends_count: 0,
             listed_count: 0,
             created_at: 'Thu Jan 15 22:41:00 +0000 2018',
             favourites_count: 0,
             utc_offset: null,
             time_zone: null,
             geo_enabled: false,
             verified: false,
             statuses_count: 5,
             lang: 'en',
             contributors_enabled: false,
             is_translator: false,
             is_translation_enabled: false,
             profile_background_color: 'F5F8FA',
             profile_background_image_url: null,
             profile_background_image_url_https: null,
             profile_background_tile: false,
             profile_image_url: 'http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
             profile_image_url_https: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
             profile_link_color: '1DA1F2',
             profile_sidebar_border_color: 'C0DEED',
             profile_sidebar_fill_color: 'DDEEF6',
             profile_text_color: '333333',
             profile_use_background_image: true,
             has_extended_profile: false,
             default_profile: true,
             default_profile_image: true,
             following: false,
             follow_request_sent: false,
             notifications: false,
             translator_type: 'none' },
          geo: null,
          coordinates: null,
          place: null,
          contributors: null,
          is_quote_status: false,
          retweet_count: 0,
          favorite_count: 0,
          favorited: false,
          retweeted: false,
          possibly_sensitive: false,
          lang: 'en' } ];

        commonConfig.broadcastMessage({
          from: 'twitter-module',
          topic: 'twitter-update',
          status: 'CURRENT',
          through: 'ws',
          data: {
            'component_id': 'demoComponent',
            'tweets': JSON.stringify(tweets)
          }
        });

        const nameSelector = 'rise-twitter .display-name';
        browser.waitForText(nameSelector);
        browser.getText(nameSelector).should.be.equal(tweets[0].user.name);

        const screenNameSelector = 'rise-twitter .screen-name';
        browser.waitForText(screenNameSelector);
        browser.getText(screenNameSelector).should.be.equal('@' + tweets[0].user.screen_name);

        const textSelector = 'rise-twitter .tweet-text';
        browser.waitForText(textSelector);
        const testText = browser.getText(textSelector);
        (tweets[0].text).should.contain(testText);
    });
});
