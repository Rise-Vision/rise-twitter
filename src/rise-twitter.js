import { WebComponent } from 'web-component';
import {LocalMessaging} from 'common-component';
import Messaging from './messaging';
import Tweet from './tweet';
import Logger from './logger';
import Config from './config/config';
import Settings from './config/settings';
import EventHandler from './event-handler';
import $ from 'jquery';

@WebComponent('rise-twitter', {
  template: require('./rise-twitter.html'),
  shadowDOM: true
})

export default class RiseTwitter extends HTMLElement {
  constructor() {
    super();
    this.isPreview = false;
    this.id = this.id || this._generateComponentId();
    console.log('RiseTwitter', this.id);
  }

  connectedCallback() {
    console.log('RiseTwitter', this.shadowRoot);
    this.settings = new Settings();
    this.config = new Config();

    this._createListenersForRisePlaylistItemEvents();
  }

  getMessaging() {
    return this.messaging;
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
    const playlistItem = document.getElementsByTagName('rise-playlist-item')[0];

    if (playlistItem) {
      playlistItem.addEventListener('configure', event => {
        this._handleConfigure(event);
      });

      playlistItem.addEventListener('play', () => {
        this._handlePlay();
      });

      playlistItem.addEventListener('pause', () => {
        this._pause();
      });

      playlistItem.addEventListener('stop', () => {
        this._stop();
        this.logger.playlistEvent('Stop Event');
      });
    } else {
      console.log('rise-playlist-item not found');
      this.eventHandler.emitDone();
    }
  }

  _handleConfigure(event) {
    this.config.setDisplayId(event.detail.displayId);
    this.config.setCompanyId(event.detail.companyId);

    if (event.detail && event.detail.displayId !== 'preview') {
      this.localMessaging = new LocalMessaging();
      this.logger = new Logger(this.config);
      this.eventHandler = new EventHandler(this.logger);
      this.tweet = new Tweet(this.shadowRoot, this.logger, this.settings, this.eventHandler, $('.css-path').data('path'));
      this.messaging = new Messaging(this.tweet, this.id, this.localMessaging, this.settings, this.logger);
      this.screenName = event.detail.screenName;
      this.eventHandler.emitReady();

      this.logger.playlistEvent('Configure Event', {configureObject: JSON.stringify(event.detail)});
    } else {
      this.eventHandler = new EventHandler(null);
      this.tweet = new Tweet(this.shadowRoot, null, this.settings, this.eventHandler, $('.css-path').data('path'));
      this.isPreview = true;
      this.eventHandler.emitReady();
    }
  }

  _handlePlay() {
    if (this.isPreview) {
      this._playPreview();
    } else {
      if (this.settings.getIsAuthorized()) {
        this._play();
      } else {
        this.eventHandler.emitDone();
      }
    }
  }

  _playPreview() {
    this.tweet.displayFillerTweets();
    this._play();
  }

  _play() {
    if (this.tweet.getTransition()._isPaused()) {
      this.tweet.getTransition().start();
      return;
    }

    if (this.messaging.isConnected()) {
      this.logger.playlistEvent('Play Event');
      this.messaging.sendComponentSettings(this.screenName, this.hashtag);
    } else {
      this.logger.error('Error: componnent is not connected to LM');
      this.tweet.handleError();
    }
  }

  _pause() {
    this.tweet.getTransition().pause();
  }

  _stop() {
    this._pause();
  }
}
