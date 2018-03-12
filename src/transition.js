import $ from 'jquery';

export default class Transition {
  constructor(logger, settings, eventHandler) {
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
    this.isPaused = false;

    // settings - future integration
    this.intervalTime = 10 * 1000;
    this.fadeTime = this.intervalTime * (3 / 20);
    this.numTweetsToDisplay = 25;
    this.numOfActualTweets = this.getTweets() ? this.getTweets().length : null;
  }

  setTweets(tweets) {
    this.tweets = tweets;
    this.numOfActualTweets = this.tweets.length;
    this._clearTweets();
  }

  getTweets() {
    return this.tweets;
  }

  _setCurrentTweetIndex(index) {
    this.currentTweetIndex = index;
  }

  _getCurrentTweetIndex() {
    return this.currentTweetIndex;
  }

  isPausedFunction() {
    return this.isPaused;
  }

  /*************************************
   * Transitions
   *************************************/
  _startTransition() {
    var currentTweetIndex = this._getCurrentTweetIndex();
    var previousTweetIndex = currentTweetIndex - 1;

    var currentTweet = this.getTweets()[currentTweetIndex];
    var previousTweet = this.getTweets()[previousTweetIndex];

    if (currentTweetIndex === this.numOfActualTweets) {
      this._finishedTransition();
    } else {
      $(previousTweet).fadeOut(this.fadeTime);
      $(currentTweet).fadeIn(this.fadeTime);
      this._setCurrentTweetIndex(currentTweetIndex + 1);
    }
  }

  _clearTweets() {
    if (this.getTweets()) {
      for (var i = 0; i < this.getTweets().length; i++) {
        $(this.getTweets()[i]).hide();
      }
    }
  }

  _startTransitionTimer() {
    if (this.transitionIntervalId === null) {
      this.transitionIntervalId = setInterval(() => {
        this._startTransition();
      }, this.intervalTime);
      this._startTransition();
    }
  }

  _stopTransitionTimer() {
    clearInterval(this.transitionIntervalId);
    this.transitionIntervalId = null;
  }

  _finishedTransition() {
    this._clearTweets();
    this._stopTransitionTimer();
    this.isPaused = true;
    this.currentTweetIndex = 0;
    this.eventHandler.emitDone();
  }

  /*************************************
   * Public Functions
   *************************************/
  start() {
    if (this.numOfActualTweets > 0) {
      if (this._isPaused) {
        this._isPaused = false;
        this._startTransitionTimer();
      }  
    } else {
      this._finishedTransition();
    }
  }

  pause() {
    this._isPaused = true;
    this._stopTransitionTimer();
  }

  stop() {
    this.reset();
  }

  reset() {
    this._clearTweets();
    this._stopTransitionTimer();
    this._isPaused = false;
    this.tweets = null;
    this.currentTweetIndex = 0;
    this.numOfActualTweets = null;
  }
}
