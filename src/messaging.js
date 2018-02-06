export default class Messaging {
  constructor(tweet, componentId, localMessaging, logger) {
    this.tweet = tweet;
    this.componentId = componentId;

    this.localMessaging = localMessaging;
    this.logger = logger;
    this._bindReceiveMessagesHandler();
  }

  _bindReceiveMessagesHandler() {
    this.localMessaging.receiveMessages((message) => { this._handleMessage(message) });
  }

  _handleMessage(message) {
    console.log('Received a new message from LMS', message);

    if (message && message.topic === 'twitter-update' && message.data && message.data.component_id === this.componentId && message.status) {
      if (message.status.toUpperCase() === 'CURRENT') {
        this.tweet.updateTweets(JSON.parse(message.data.tweets));
      } else if (message.status.toUpperCase() === 'STREAM') {
        this.tweet.updateStreamedTweets(JSON.parse(message.data.tweets));
      }
    }
  }

  isConnected() {
    return this.localMessaging.canConnect();
  }

  // eslint-disable-next-line
  sendComponentSettings(screen_name = '', hashtag = '') {
    this.localMessaging.broadcastMessage({topic: 'twitter-watch', data: {component_id: this.componentId, screen_name, hashtag}});
  }
}
