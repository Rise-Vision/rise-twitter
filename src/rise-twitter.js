import { WebComponent } from 'web-component';
import {LocalMessaging} from 'common-component';
import Messaging from './messaging';
import Tweet from './tweet';
import Logger from './logger';
import Settings from './config/settings';
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
    const risePlaylistItem = document.getElementsByTagName('rise-playlist-item')[0];

    if (risePlaylistItem) {
      risePlaylistItem.addEventListener('configure', event => {
        this._handleConfigure(event);
      });

      risePlaylistItem.addEventListener('play', () => {
        this._handlePlay();
      });

      risePlaylistItem.addEventListener('pause', () => {
        this._pause();
      });

      risePlaylistItem.addEventListener('stop', () => {
        this._stop();
        this.logger.playlistEvent('Stop Event');
      });
    } else {
      console.log('rise-playlist-item not found');
    }
  }

  _handleConfigure(event) {
    if (event.detail && event.detail.displayId !== 'preview') {
      this.localMessaging = new LocalMessaging();
      this.logger = new Logger();
      this.tweet = new Tweet(this.shadowRoot, this.logger, this.settings, $('.css-path').data('path'));
      this.messaging = new Messaging(this.tweet, this.id, this.localMessaging, this.settings, this.logger);
      this.screenName = event.detail.screenName;

      this.logger.playlistEvent('Configure Event', {configureObject: JSON.stringify(event.detail)});
    } else {
      this.tweet = new Tweet(this.shadowRoot, null, this.settings, $('.css-path').data('path'));
      this.isPreview = true;
    }
  }

  _handlePlay() {
    if (this.isPreview) {
      this._playPreview();
    } else {
      if (this.settings.getIsAuthorized()) {
        this._play();
      } else {
        // emit done if unauthorized
        this._done();
      }
    }
  }

  _playPreview() {
    this.tweet.displayFillerTweets();
  }

  _play() {
    if (this.messaging.isConnected()) {
      this.logger.playlistEvent('Play Event');
      this.messaging.sendComponentSettings(this.screenName, this.hashtag);
    } else {
      this.logger.error('Error: componnent is not connected to LM');
      this.tweet.handleError();
    }
  }

  _pause() {
  }

  _stop() {
    this._pause();
  }

  _done() {
  }
}
