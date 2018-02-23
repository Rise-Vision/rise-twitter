export default class EventHandler {
  constructor(logger, risePlaylistItem) {
    this.logger = logger;
    this.risePlaylistItem = risePlaylistItem;
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
      if (this.logger) { this.logger.playlistEvent('Ready Event'); }
      this.getRisePlaylistItem().callReady();
    }
  }

  emitDone() {
    if (this.getRisePlaylistItem()) {
      if (this.logger) { this.logger.playlistEvent('Done Event'); }
      this.getRisePlaylistItem().callDone();
    }
  }

  emitReadyForEvents() {
    if (this.getRisePlaylistItem()) {
      if (this.logger) { this.logger.playlistEvent('Ready for Events'); }
      this.getRisePlaylistItem().callRSParamGet();
    }
  }
}
