import { WebComponent } from 'web-component';
import Messaging from './messaging';
import Tweet from './tweet';

@WebComponent('rise-twitter', {
  template: require('./rise-twitter.html'),
  shadowDOM: true
})

export default class RiseTwitter extends HTMLElement {
  constructor() {
    super();

    this.id = this.id || this._generateComponentId();

    this.tweet = new Tweet(this.shadowRoot);
    this.messaging = new Messaging(this.tweet);

    this._createListenersForRisePlaylistItemEvents();

    console.log('RiseTwitter', this.id);
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
    this.messaging.connectToLMS();
    this.messaging.sendComponentSettings(this.id, this.screenName, this.hashtag);
  }

  _pause() {
    this.messaging.disconnectFromLMS();
  }

  _stop() {
    this.pause();
  }
}
