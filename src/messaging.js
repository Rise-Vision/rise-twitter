import {lmsAddress} from './config';
import Primus from './primus';

export default class Messaging {
  constructor(tweet, componentId) {
    console.log('Messaging', componentId);

    this.tweet = tweet;
    this.componentId = componentId;
    this.isConnected = false;
  }

  _handleOpenConnection() {
    console.log('Connection is alive and kicking');
    this.isConnected = true;
  }

  _handleMessage(message) {
    console.log('Received a new message from LMS', message);

    if (message && message.topic === 'twitter-update' && message.data && message.data.component_id === this.componentId) {
      this.tweet.update(JSON.parse(message.data.tweets));
    }
  }

  _handleError(error) {
    console.error('An error happen with connection to LMS', error.stack);
  }

  _handleEnd() {
    console.log('Connection closed with LMS');
    this.isConnected = false;
  }

  _sendMessage(message) {
    if (!this.primus) return console.log('There is no connection with LMS');
    this.primus.write(message);
  }

  connectToLMS() {
    this.primus = Primus.connect(lmsAddress);

    this.primus.on('open', () => { this._handleOpenConnection(); });

    this.primus.on('data', message => { this._handleMessage(message); });

    this.primus.on('error', error => { this._handleError(error); });

    this.primus.on('end', () => { this._handleEnd(); });
  }

  disconnectFromLMS() {
    this.primus.end();
  }

  // eslint-disable-next-line
  sendComponentSettings(screen_name = "", hashtag = "") {
    this._sendMessage({from: 'ws-client', topic: 'twitter-watch', data: {component_id: this.componentId, screen_name, hashtag}});
  }
}
