import { WebComponent } from 'web-component';
import LocalMessaging from 'common-component/local-messaging';
import Messaging from './messaging';
import Tweet from './tweet';
import Licensing from './licensing';
import Logger from './logger';
import Config from './config/config';
import Settings from './config/settings';
import State from './state';
import EventHandler from './event-handler';

@WebComponent('rise-twitter', {
  template: require('./rise-twitter.html'),
  styles: require('./static/css/main.scss'),
  shadowDOM: true
})

export default class RiseTwitter extends HTMLElement {
  constructor() {
    super();
    this.isPreview = false;
    this.className = 'innerComponent';
    this.waitingForTweets = null;
    this.pauseRequestingTweetsTimer = null;
    this.currentNumberOfAttempts = 0;
  }

  connectedCallback() {
    console.log('RiseTwitter', this.shadowRoot);
    this.playlistItem = this.parentElement;
    this.settings = new Settings();
    this.state = new State();
    this.config = new Config();
    this.eventHandler = new EventHandler(null, this.playlistItem);

    this._createListenersForRisePlaylistItemEvents();
  }

  getMessaging() {
    return this.messaging;
  }

  getTweet() {
    return this.tweet;
  }

  getEventHandler() {
    return this.eventHandler;
  }

  get screenName() {
    return this.getAttribute('screen-name');
  }

  set screenName(screenName) {
    this.setAttribute('screen-name', screenName);
  }

  get hashtag() {
    return this.getAttribute('hashtag');
  }

  set hashtag(hashtag) {
    this.setAttribute('hashtag', hashtag);
  }

  _createListenersForRisePlaylistItemEvents() {
    console.log('_createListenersForRisePlaylistItemEvents', this.playlistItem);
    if (this.playlistItem && this.playlistItem.tagName === 'RISE-PLAYLIST-ITEM') {
      console.log('_createListenersForRisePlaylistItemEvents - addEventListener');
      this.playlistItem.addEventListener('configure', event => {
        this._handleConfigure(event);
      });

      this.playlistItem.addEventListener('play', () => {
        this._handlePlay();
      });

      this.playlistItem.addEventListener('pause', () => {
        this._pause();
      });

      this.playlistItem.addEventListener('stop', () => {
        this._stop();
      });

      this.eventHandler.emitReadyForEvents();
    } else {
      console.log('rise-playlist-item not found');
      this.eventHandler.emitDone();
    }
  }

  _handleConfigure(event) {
    this.config.setDisplayId(event.detail.displayId);
    this.config.setCompanyId(event.detail.companyId);
    console.log('_handleConfigure', event);
    if (event.detail && event.detail.displayId !== 'preview') {
      this.screenName = event.detail.screenName;
      this.id = event.detail.componentId;
      this.config.setComponentId(this.id);
      console.log('CONFIGURE - RiseTwitter', this.config.componentId);

      this.localMessaging = new LocalMessaging();
      console.log('Local Messaging connected');
      this.logger = new Logger(this.config, this.localMessaging);
      this.eventHandler = new EventHandler(this.logger, this.playlistItem);
      this._validateConfiguration();

      this.tweet = new Tweet(this.shadowRoot, this.logger, this.settings, this.eventHandler, this.state);
      this.eventHandler.emitReady();
      this.logger.playlistEvent('Configure Event', {configureObject: JSON.stringify(event.detail)});
      this.licensing = new Licensing(this.localMessaging, this.logger, this.config, this.settings);
      console.log('Licensing Connected');
      this.messaging = new Messaging(this.tweet, this.localMessaging, this.config, this.settings, this.logger, this.licensing);

      // make initial client list request which kicks off Twitter Widget functionality
      this.messaging.requestModuleClientList();
    } else {
      this.tweet = new Tweet(this.shadowRoot, null, this.settings, this.eventHandler, this.state);
      this.isPreview = true;
      this.eventHandler.emitReady();
    }
  }

  _validateConfiguration() {
    if (!this.id) {
      this.logger.error('Error: componnentId is missing');
      this.eventHandler.emitDone();
    }

    if (!this.screenName) {
      this.logger.warning('screen_name is missing');
      this.eventHandler.emitDone();
    }
  }

  _handlePlay() {
    if (this.isPreview) {
      this._playInPreview();
    } else {
      if (this.settings.getIsAuthorized()) {
        console.log('_handlePlay - authorized');
        this._play();
      } else {
        console.log('_handlePlay - unauthorized');
        this.messaging.requestModuleClientList();
        this.eventHandler.emitDone();
      }
    }
  }

  _playInPreview() {
    this.state.setIsPaused(false);

    console.log('_play in Preview');
    if (this.tweet.getTweets() && this.tweet.getTweets().length > 0) {
      this.tweet.getTransition().start();
    } else {
      this.tweet.displayFillerTweets();
    }
  }

  _play() {
    this.state.setIsPaused(false);

    // play tweets if existing in DOM
    if (this.tweet.getTweets() && this.tweet.getTweets().length > 0) {
      this.tweet.getTransition().start();
      return;
    }

    // if Twitter credentials unauthenticated play filler tweets
    if (this.settings.getTwitterModuleStatus() === null || !this.settings.getTwitterModuleStatus()) {
      this.logger.error('Twitter Credentials unauthenticated');
      this.tweet.handleError();
    }

    if (this.settings.getRequiredModulesAvailable()) {
      console.log('LMS is Connected and required modules avaliable');
      this.logger.playlistEvent('Play Event');
      if (this.currentNumberOfAttempts < this.config.totalNumberOfAttempts) {
        this.messaging.sendComponentSettings(this.screenName, this.hashtag);
        this.currentNumberOfAttempts++;
      } else {
        this._startAPausePeriodBetweenTweetRequests();
      }

      this._startWaitingForTweetsTimer();
    } else {
      this.logger.error('Error: componnent is not connected to required modules');
      this.tweet.handleError();
    }
  }

  _startAPausePeriodBetweenTweetRequests() {
    if (this.pauseRequestingTweetsTimer === null) {
      this.pauseRequestingTweetsTimer = setTimeout(() => {
        this.currentNumberOfAttempts = 0;
        this.pauseRequestingTweetsTimer = null;
      }, this.config.waitingForRequestingTweetsTime);
    }
  }

  _startWaitingForTweetsTimer() {
    this.waitingForTweets = setTimeout(() => {
      clearTimeout(this.waitingForTweets);
      if (this.tweet.getTweets().length === 0) {
        this.eventHandler.emitDone();
      }
    }, this.config.waitingForTweetsTime);
  }

  _pause() {
    this.state.setIsPaused(true);
    this.tweet.getTransition().pause();
  }

  _stop() {
    if (this.logger) { this.logger.playlistEvent('Stop Event'); };
    this._pause();
  }
}
