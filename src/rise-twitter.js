import { WebComponent } from 'web-component';
import {LocalMessaging} from 'common-component';
import Messaging from './messaging';
import Tweet from './tweet';
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
    console.log('RiseTwitter', this.id);
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
    this.licensingAttempts = 0;

    this.config.setComponentId(this.id);
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

  _generateComponentId() {
    return `rise-twitter-` + Math.random().toString().substring(2);
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
      this.localMessaging = new LocalMessaging();
      console.log('this.localMessaging connected');
      this.logger = new Logger(this.config, this.localMessaging);
      this.eventHandler = new EventHandler(this.logger, this.playlistItem);
      this._validadeConfiguration();

      this.tweet = new Tweet(this.shadowRoot, this.logger, this.settings, this.eventHandler, this.state);
      this.messaging = new Messaging(this.tweet, this.id, this.localMessaging, this.config, this.settings, this.logger);
      this.eventHandler.emitReady();
      this.logger.playlistEvent('Configure Event', {configureObject: JSON.stringify(event.detail)});
    } else {
      this.tweet = new Tweet(this.shadowRoot, null, this.settings, this.eventHandler, this.state);
      this.isPreview = true;
      this.eventHandler.emitReady();
    }
  }

  _validadeConfiguration() {
    if (!this.id) {
      this.logger.error('Error: componnentId is missing');
      this.eventHandler.emitDone();
    }

    if (!this.screenName) {
      this.logger.error('Error: screenName is missing');
      this.eventHandler.emitDone();
    }
  }

  _handlePlay() {
    if (this.isPreview) {
      this._playInPreview();
    } else {
      if (this.settings.getIsAuthorized()) {
        console.log('_handlePlay authorized');
        this._play();
      } else {
        console.log('_handlePlay unauthorized');
        if (this.messaging.isConnected() && this.settings.getIsAuthorized() === null && this.licensingAttempts < 5) {
          this.licensingAttempts++;
          this.messaging.sendLicensingWatch();
        }
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
    console.log('_play IsAuthorized');
    if (this.tweet.getTweets() && this.tweet.getTweets().length > 0) {
      this.tweet.getTransition().start();
      return;
    }

    if (this.messaging.isConnected()) {
      console.log('_play is Connected');
      this.logger.playlistEvent('Play Event');
      if (this.currentNumberOfAttempts < this.config.totalNumberOfAttempts) {
        this.messaging.sendComponentSettings(this.screenName, this.hashtag);
        this.currentNumberOfAttempts++;
      } else {
        this._startAPausePeriodBetweenTweetRequests();
      }

      this._startWaitingForTweetsTimer();
    } else {
      console.log('_play NOT connected');
      this.logger.error('Error: componnent is not connected to LM');
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
    console.log('_pause');
    this.tweet.getTransition().pause();
  }

  _stop() {
    console.log('_stop');
    if (this.logger) { this.logger.playlistEvent('Stop Event'); };
    this._pause();
  }
}
