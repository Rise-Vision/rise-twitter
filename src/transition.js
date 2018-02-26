import $ from 'jquery';

export default class Transition {
  constructor(shadowRoot, logger, settings, eventHandler) {
    this.shadowRoot = shadowRoot;
    this.logger = logger;
    this.settings = settings;
    this.eventHandler = eventHandler;

    this._setTransitionConfig();
  }

  _setTransitionConfig() {
    // tweets divs
    this.tweets = null;

    // state
    this.currentTweetIndex = 0;
    this.transitionIntervalId = null;
    this.waitingForUpdate = false;
    this.waitingToStart = false;
    this.isPaused = false;

    // settings - future integration
    this.intervalTime = 10 * 1000;
    this.fadeTime = this.intervalTime * (3 / 20);
    this.numTweetsToDisplay = 25;
    this.numOfActualTweets = this._getTweets() ? this._getTweets().length : null;
  }

  _setTweets() {
    this.tweets = this.shadowRoot.querySelectorAll('.twitter-component-template .tweet');
    this.numOfActualTweets = this.shadowRoot.querySelectorAll('.twitter-component-template .tweet').length;
  }

  _getTweets() {
    return this.tweets;
  }

  _setCurrentTweetIndex(index) {
    this.currentTweetIndex = index;
  }

  _getCurrentTweetIndex() {
    return this.currentTweetIndex;
  }

  _isPaused() {
    return this.isPaused && this.transitionIntervalId !== null;
  }

  /*************************************
   * Transitions
   *************************************/
  _startTransition() {
    var currentTweetIndex = this._getCurrentTweetIndex();
    var previousTweetIndex = currentTweetIndex - 1;

    var currentTweet = this._getTweets()[currentTweetIndex];
    var previousTweet = this._getTweets()[previousTweetIndex];

    if (currentTweetIndex === this.numOfActualTweets) {
      this._finishedTransition();
    }
    $(previousTweet).fadeOut(this.fadeTime);
    $(currentTweet).fadeIn(this.fadeTime);
    this._setCurrentTweetIndex(currentTweetIndex + 1);
  }

  _clearTweets() {
    this._setCurrentTweetIndex(0);
    if (this._getTweets()) {
      for (var i = 0; i < this._getTweets().length; i++) {
        $(this._getTweets()[i]).hide();
      }
    }
  }

  _startTransitionTimer() {
    var that = this;

    if (this.transitionIntervalId === null) {
      that._startTransition();
      this.transitionIntervalId = setInterval(function() {
        that._startTransition();
      }, this.intervalTime);
    }
  }

  _stopTransitionTimer() {
    clearInterval(this.transitionIntervalId);
    this.transitionIntervalId = null;
  }

  _finishedTransition() {
    this.reset();
    this.eventHandler.emitDone();
  }

  /*************************************
   * Public Functions
   *************************************/
  start() {
    this._isPaused = false;

    if (this.transitionIntervalId === null) {
      this._setTweets();
      this._clearTweets();
    }

    if (this.tweets.length > 0) {
      this._startTransitionTimer();
    } else {
      this.waitingToStart = true;
    }
  }

  pause() {
    this._isPaused = true;
    this.waitingToStart = false;
    this._clearTweets();
    this._stopTransitionTimer();
  }

  stop() {
    this.reset();
  }

  reset() {
    this._clearTweets();
    this._stopTransitionTimer();
    this._isPaused = false;
    this.waitingToStart = false;
    this.waitingForUpdate = false;
    this.tweets = null;
    this.currentTweetIndex = 0;
    this.transitionIntervalId = null;
    this.numOfActualTweets = null;
  }
}
