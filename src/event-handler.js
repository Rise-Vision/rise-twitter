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
      console.log('emitReady');
      this.getRisePlaylistItem().callReady();
    }
  }

  emitDone() {
    if (this.getRisePlaylistItem()) {
      if (this.logger) { this.logger.playlistEvent('Done Event'); }
      console.log('emitDone');
      this.getRisePlaylistItem().callDone();
    }
  }

  emitReadyForEvents() {
    if (this.getRisePlaylistItem()) {
      if (this.logger) { this.logger.playlistEvent('Ready for Events'); }
      console.log('emitReadyForEvents');
      this.getRisePlaylistItem().callRSParamGet();
    }
  }
}
