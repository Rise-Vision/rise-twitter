import { WebComponent } from 'web-component';
import {LocalMessaging} from 'common-component';
import Messaging from './messaging';
import Tweet from './tweet';
import $ from 'jquery';

@WebComponent('rise-twitter', {
  template: require('./rise-twitter.html'),
  shadowDOM: true
})

export default class RiseTwitter extends HTMLElement {
  constructor() {
    super();

    this.id = this.id || this._generateComponentId();
    console.log('RiseTwitter', this.id);
  }

  connectedCallback() {
    console.log('RiseTwitter', this.shadowRoot);
    this.tweet = new Tweet(this.shadowRoot, $('.css-path').data('path'));
    this.localMessaging = new LocalMessaging();
    this.messaging = new Messaging(this.tweet, this.id, this.localMessaging);

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
        this.screenName = event.detail.screenName;
      });

      risePlaylistItem.addEventListener('play', () => {
        this._play();
      });

      risePlaylistItem.addEventListener('pause', () => {
        this._pause();
      });

      risePlaylistItem.addEventListener('stop', () => {
        this._stop();
      });
    } else {
      console.log('rise-playlist-item not found');
    }
  }

  _play() {
    if (this.messaging.isConnected()) {
      this.messaging.sendComponentSettings(this.screenName, this.hashtag);
    } else {
      console.log('Error: componnent is not connected to LM');
      this.tweet.handleError();
    }
  }

  _pause() {
  }

  _stop() {
    this._pause();
  }
}
