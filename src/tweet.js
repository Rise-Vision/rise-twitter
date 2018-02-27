/* eslint-disable */
import Transition from '../src/transition.js';
import tweetTemplate from '../src/static/template/tweet-template.html';
import fillerTweetsJSON from '../src/static/data/filler-tweets.json';
import $ from 'jquery';

export default class Tweet {
  constructor(shadowRoot, logger, settings, eventHandler, state) {
    this.shadowRoot = shadowRoot;
    this.logger = logger;
    this.settings = settings;
    this.eventHandler = eventHandler;
    this.state = state;
    this.transition = new Transition(this.logger, this.settings, this.eventHandler);
  }

  getTransition() {
    return this.transition;
  }

  updateTweets(tweets) {
    console.log('Displaying updated Tweets', tweets);

    var promises = [];
    if (this._areValidTweets(tweets)) {
      this._clearTweets();
      for (var tweetPosition in tweets) {
        var tweet = tweets[tweetPosition];
        promises.push(this._displayTweet(tweet, 'append'));
      }
      Promise.all(promises)
        .then(() => {
          this.getTransition().setTweets(this.getTweets());
          if(!this.state.getIsPaused) {
            this.getTransition().start();
          }
        })
        .catch((error) => {
          console.log('error displaying tweets', error);
          if (this.logger) {this.logger.error(`Invalid Tweets`);}
          this.eventHandler.emitDone();
        });
    } else {
      if (this.logger) {this.logger.error(`Invalid Tweets`);}
      this.eventHandler.emitDone();
    }
  }

  getTweets() {
    return this.shadowRoot.querySelectorAll('.twitter-component-template .tweet');
  }

  updateStreamedTweets(tweets) {
      var promises = [];
      if (this._areValidTweets(tweets)) {
        for (var tweetPosition in tweets) {
          var tweet = tweets[tweetPosition];
          promises.push(this._displayTweet(tweet, 'prepend'));
        }
        Promise.all(promises)
          .then(() => {
            this._removeOldTweets();
            this.getTransition().setTweets(this.getTweets());
          })
          .catch((error) => {
            console.log(error, 'Unable to remove outdated tweets');
          });
      } else {
        console.log('Invalid Streamed Tweets - not added to displayed tweets');
      }
    }

  handleError() {
    this._clearTweets();
    this.displayFillerTweets();
  }

  setTheme(settings) {
    switch (settings.theme) {
      case 'dark':
        this.shadowRoot.querySelector('.twitter-component-template').removeClass('theme-light');
        this.shadowRoot.querySelector('.twitter-component-template').addClass('theme-dark');
        break;
      default:
        this.shadowRoot.querySelector('.twitter-component-template').removeClass('theme-dark');
        this.shadowRoot.querySelector('.twitter-component-template').addClass('theme-light');
    }
  }

  /*************************************
   * Validation
   *************************************/
  _areValidTweets(tweets) {
    if (!tweets || $.isEmptyObject(tweets)) {
      return false;
    }

    for (var tweetPosition in tweets) {
      var tweet = tweets[tweetPosition];
      if (!this._isValidTweet(tweet)) {
        return false;
      }
    }
    return true;
  }

  _isValidTweet(tweet) {
    if (!tweet || $.isEmptyObject(tweet) || !tweet.id) {
      return false;
    }
    if (!tweet.user || !tweet.user.name || !tweet.user.screen_name || !tweet.user.profile_image_url) {
      return false;
    }
    if (!tweet.text || !tweet.created_at || !tweet.entities) {
      return false;
    }

    return true;
  }

  /*************************************
   * Load Templates
   *************************************/
  _clearTweets() {
    this.shadowRoot.querySelector('.twitter-component-template').innerHTML = '';
  }

  displayFillerTweets() {
    this.updateTweets(fillerTweetsJSON);
  }

  _displayTweet(tweet, placement) {
    return this._constructBaseDiv(tweet)
      .then((finalDiv) => {
        this._injectTweet(finalDiv, placement);
      })
      .then(() => {
        this._updateData(tweet);
      })
      .catch((error) => {
        if (this.logger) {this.logger.error(`Could not display tweets - ${error}`);}
        this.eventHandler.emitDone();
      });
  }

  _constructBaseDiv(tweet) {
    return new Promise((resolve, reject) => {
      const div = document.createElement('div');
      div.innerHTML = tweetTemplate.trim();
      div.className = 'tweet ' + 'tweet-' + tweet.id;
      resolve(div);
    });
  }

  _injectTweet(div, placement) {
    if (!placement || placement.toUpperCase() == 'APPEND') {
      this.shadowRoot.querySelector('.twitter-component-template').appendChild(div);
    } else {
      this.shadowRoot.querySelector('.twitter-component-template').prepend(div);
    }
  }

  _removeOldTweets() {
    const tweetDivs = this.shadowRoot.querySelectorAll('.twitter-component-template .tweet');
    const numToRemove = tweetDivs.length - this.settings.numTweetsToDisplay;

    let tweet = null;
    if (numToRemove && numToRemove > 0){
      for (var i = tweetDivs.length - 1 ; i > (tweetDivs.length - 1 - numToRemove); i--) {
        tweet = tweetDivs[i];
        $(tweet).remove();
      }
    }
  }

  /*************************************
   * Update Data
   *************************************/
  _updateData(tweet) {
    return new Promise((resolve, reject) => {
      try {
        const selector = '.tweet-' + tweet.id;
        this._updateHeader(selector, tweet.user);
        this._updateBody(selector, tweet);
        this._updateStats(selector, tweet);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  _updateHeader(selector, userData) {
    const div = this.shadowRoot.querySelector(selector);
    const profileImage = document.createElement('img');
    profileImage.className = 'profile-image';
    profileImage.setAttribute('src', userData.profile_image_url);
    div.querySelector('.meta').appendChild(profileImage);

    div.querySelector('.display-name').append(userData.name);
    div.querySelector('.screen-name').append('@' + userData.screen_name);
  }

  _updateBody(selector, tweetData) {
    const div = this.shadowRoot.querySelector(selector);

    this._updateDate(div, tweetData);

    const tweetText = tweetData.text;

    if (tweetText.Length > 140) {
      div.querySelector('.tweet-text-container').addClass('long-tweet');
    }

    if (tweetData.entities.urls && tweetData.entities.urls.length > 0 && tweetData.entities.urls[0]) {
      this._updateLinks(div, tweetData);
    } else {
      div.querySelector('span.tweet-text').innerHTML = decodeURI(tweetText);
    }
  }

  _updateStats(selector, tweetData) {
    const div = this.shadowRoot.querySelector(selector);

    div.querySelector('.tweet-retweets').append(tweetData.retweet_count || '0');
    div.querySelector('.tweet-favorites').append(tweetData.favorite_count || '0');
  }

  _updateDate(div, tweetData) {
    const date = ((new Date(tweetData.created_at)).toString()).split(' ');
    div.querySelector('.tweet-time').append(date[1] + ' ' + date[2] + ', ' + date[3]);
  }

  _updateLinks(div, tweetData) {
    let textWithoutLinks = tweetData.text;

    for (const urlIndex in tweetData.entities.urls) {
      const url = tweetData.entities.urls[urlIndex].url;
      textWithoutLinks = textWithoutLinks.replace(url, '');
    }
    div.querySelector('span.tweet-text').innerHTML = decodeURI(textWithoutLinks);

    for (const urlIndex in tweetData.entities.urls) {
      const url = tweetData.entities.urls[urlIndex].url;
      const urlSpan = document.createElement('span');

      urlSpan.innerHTML = ' ' + url;
      urlSpan.className = 'embedded-link';
      div.querySelector('.tweet-text-container').append(urlSpan);
    }
  }
}
