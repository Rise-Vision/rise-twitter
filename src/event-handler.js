export default class EventHandler {
  constructor(logger) {
    this.logger = logger;
    this.risePlaylistItem = document.getElementsByTagName('rise-playlist-item')[0];
  }

  setRisePlaylistItem(risePlaylistItem) {
    this.risePlaylistItem = risePlaylistItem;
  }

  getRisePlaylistItem() {
    return this.risePlaylistItem;
  }

  /*************************************
   * Emits Events to Wrapper
   *************************************/
  emitReady() {
    if (this.getRisePlaylistItem()) {
      this.logger.playlistEvent('Ready Event');
      this.getRisePlaylistItem().callReady();
    }
  }

  emitDone() {
    if (this.getRisePlaylistItem()) {
      this.logger.playlistEvent('Done Event');
      this.getRisePlaylistItem().callDone();
    }
  }
}
