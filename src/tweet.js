import tweetTemplate from '../src/static/template/tweet-template.html';
import fillerTweetsJSON from '../src/static/data/filler-tweets.json';

export default class Tweet {
  constructor(shadowRoot) {
    this.shadowRoot = shadowRoot;
  }

  handleError() {
    this._clearTweets();
    this._displayFillerTweets();
  }

  update(tweets) {
    // check if all tweets are valid and display tweets if so.
    for (var tweetPosition in tweets) {
      var tweet = tweets[tweetPosition];
      if (this._isValidTweet(tweet)) {
        this._clearTweets();
        this._displayTweet(tweet);
      } else {
        console.log('Invalid Tweets - displaying filler tweets', tweet);
        this.handleError();
      }
    }
    /*
- make this a promise chain. promiseAll then runTweets after
    this._runTweets();
    */
  }

  setTheme(settings) {
    switch (settings.theme) {
      case 'dark' :
        this.shadowRoot.querySelector('.twitter-component-template').removeClass('theme-light');
        this.shadowRoot.querySelector('.twitter-component-template').addClass('theme-dark');
        break;
      default :
        this.shadowRoot.querySelector('.twitter-component-template').removeClass('theme-dark');
        this.shadowRoot.querySelector('.twitter-component-template').addClass('theme-light');
    }
  }

/*************************************
 * Play Tweets
 *************************************/
  _runTweets() {
    const tweetDivs = document.querySelectorAll('.twitter-component-template .tweet');
    console.log(tweetDivs);

    /*
add `display: none` to all tweet classes
add `position: absolute` to all tweet classes

    lastDiv = null;
    - iterate over divs
      if (lastDiv)
        fadeout lastDiv
      fade in current
      lastDiv = current;
    hold for X seconds
    -
    */
  }

/*************************************
 * Load Templates
 *************************************/
  _isValidTweet(tweet) {
    if (!tweet || !tweet.id) { return false; }
    if (!tweet.user.name || !tweet.user.screen_name || !tweet.user.profile_image_url) { return false; }
    if (!tweet.text || !tweet.created_at || !tweet.entities) { return false; }

    return true;
  }

  _clearTweets() {
    this.shadowRoot.querySelector('.twitter-component-template').innerHTML = '';
  }

  _displayFillerTweets() {
    this.update(fillerTweetsJSON);
  }

  _displayTweet(tweet) {
    return this._constructBaseDiv(tweet)
    .then((finalDiv) => {
      this._injectTweet(finalDiv);
    })
    .then(() => {
      this._updateData(tweet);
    })
    .catch((error) => {
      console.log(error);
      this.handleError();
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

  _injectTweet(div) {
    this.shadowRoot.querySelector('.twitter-component-template').appendChild(div);
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

    div.querySelector('.profile-image').setAttribute('src', userData.profile_image_url);
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

    div.querySelector('.tweet-retweets').append(tweetData.retweet_count || 0);
    div.querySelector('.tweet-likes').append(tweetData.favourites_count || 0);
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
