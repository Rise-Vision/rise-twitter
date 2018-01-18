import { WebComponent } from 'web-component';

@WebComponent('rise-twitter', {
  template: require('./rise-twitter.html'),
  shadowDOM: true
})

export default class RiseTwitter extends HTMLElement {
  constructor() {
    super();

    this._createListenersForRisePlaylistItemEvents();
    console.log('RiseTwitter');
  }

  _createListenersForRisePlaylistItemEvents() {
    const risePlaylistItem = document.getElementsByTagName("rise-playlist-item")[0];

    if (risePlaylistItem) {

      risePlaylistItem.addEventListener("configure", event => {
        this.screenName = event.detail.screenName;
      });

      risePlaylistItem.addEventListener("play", () => {
        this._play();
      });

      risePlaylistItem.addEventListener("pause", () => {
        this._pause();
      });

      risePlaylistItem.addEventListener("stop", () => {
        this._stop();
      });
    }
  }

  _play() {

  }

  _pause() {

  }

  _stop() {

  }
}
