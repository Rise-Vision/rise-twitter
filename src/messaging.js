import {lmsAddress} from './config';

export default class Messaging {
  constructor(tweet) {
    this.tweet = tweet;
  }

  _handleOpenConnection() {
    console.log('Connection is alive and kicking');
  }

  _handleMessage(data) {
    console.log('Received a new message from LMS', data);
    if (data.topic === 'twitter-update') {
      this.tweet.update(data.message);
    }
  }

  _handleError(error) {
    console.error('An error happen with connection to LMS', error.stack);
  }

  _handleEnd() {
    console.log('Connection closed with LMS');
  }

  _sendMessage(message) {
    if (!this.primus) return console.log('There is no connection with LMS');
    this.primus.write(message);
  }

  _sendDiconnectionMessage(component_id) {
    this._sendMessage({topic: 'twitter-disconnect', data: {component_id}});
  }

  connectToLMS() {
    // eslint-disable-next-line
    this.primus = Primus.connect(lmsAddress);

    this.primus.on('open', this._handleConnection);

    this.primus.on('data', this._handleMessage);

    this.primus.on('error', this._handleMessage);

    this.primus.on('end', this._handleEnd);
  }

  disconnectFromLMS(component_id) {
    this._sendDiconnectionMessage(component_id);
    this.primus.end();
  }

  // eslint-disable-next-line
  sendComponentSettings(component_id, screen_name, hashtag) {
    this._sendMessage({topic: 'twitter-watch', data: {component_id, screen_name, hashtag}});
  }
}
