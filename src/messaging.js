export default class Messaging {
  constructor(tweet, componentId, localMessaging, settings, logger) {
    this.tweet = tweet;
    this.componentId = componentId;

    this.localMessaging = localMessaging;
    this.settings = settings;
    this.logger = logger;

    this._bindReceiveMessagesHandler();
  }

  _bindReceiveMessagesHandler() {
    this.localMessaging.receiveMessages((message) => { this._handleMessage(message) });
  }

  _handleMessage(message) {
    console.log('Received a new message from LMS', message);
    if (!message || !message.topic) {
      return;
    }

    switch (message.topic.toUpperCase()) {
      case 'TWITTER-UPDATE':
        return this._handleTwitterUpdate(message);
      case 'LICENSING-UPDATE':
        return this._handleLicensingUpdate(message);
    }
  }

  _handleTwitterUpdate(message) {
    if (message && message.data && message.data.component_id === this.componentId && message.status) {
      if (message.status.toUpperCase() === 'CURRENT') {
        this.tweet.updateTweets(JSON.parse(message.data.tweets));
      } else if (message.status.toUpperCase() === 'STREAM') {
        this.tweet.updateStreamedTweets(JSON.parse(message.data.tweets));
      }
    } else {
      this.logger.error('Error: Invalid TWITTER-UPDATE message');
    }
  }

  _handleLicensingUpdate(message) {
    if (message && message.data && message.data.is_authorized !== null && message.data.user_friendly_status) {
      console.log(`Authorization status changed - ${message.data.user_friendly_status}`);
      this.settings.setAuthorization(message.data.is_authorized);
      console.log(this.settings.getIsAuthorized());
    } else {
      this.logger.error('Error: Invalid LICENSING-UPDATE message');
    }
  }

  isConnected() {
    return this.localMessaging.canConnect();
  }

  // eslint-disable-next-line
  sendComponentSettings(screen_name = '', hashtag = '') {
    console.log('sending component settings', this.isConnected());
    this.localMessaging.broadcastMessage({topic: 'twitter-watch', data: {component_id: this.componentId, screen_name, hashtag}});
  }
}
