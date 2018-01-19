const chai = require('chai');
global.expect = chai.expect;
chai.Should();

describe('Twitter Component - Integration', () => {
    it('should load component', () => {
        browser.url('/');

        const selector = 'rise-twitter #twitter-component-template';
        const expected = "Rise Twitter Component";
        browser.waitForText(selector);
        browser.getText(selector).should.be.equal(expected);
    });
});
