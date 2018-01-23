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
      mock(commonConfig, "getDisplaySettingsSync").returnWith({
        displayid: "ls-test-id", displayId: "ls-test-id"
      });
    });

    after(() => {
      localMessagingModule.stop();
    });

    afterEach(() => {
      commonConfig.disconnect();
    });

    it('should load component and tweets', () => {
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

        const selector = 'rise-twitter #twitter-component-template';
        const expected = 'Rise Twitter Component';
        browser.waitForText(selector);
        browser.getText(selector).should.be.equal(expected);

        const tweetSelector = 'rise-twitter .tweet';
        const tweetExpectation1 = 'blabla';
        const tweetExpectation2 = 'blabla2';

        browser.waitForExist(tweetSelector);

        browser.elements(tweetSelector, (err, results)=>{
          browser.elementIdText(results.value[0].ELEMENT).should.be.equal(tweetExpectation);
          browser.elementIdText(results.value[1].ELEMENT).should.be.equal(tweetExpectation);
        });
    });
});
