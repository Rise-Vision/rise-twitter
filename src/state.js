export default class State {
  constructor() {
    this.isPaused = true;
  }

  setIsPaused(status) {
    this.isPaused = status;
  }

  getIsPaused() {
    return this.isPaused;
  }
}
