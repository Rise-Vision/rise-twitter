export default class Messaging {
  constructor(tweet, localMessaging, config, settings, logger, licensing) {
    this.tweet = tweet;
    this.localMessaging = localMessaging;
    this.config = config;
    this.settings = settings;
    this.logger = logger;
    this.licensing = licensing;

    this.componentId = this.config.componentId;

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
      case 'CLIENT-LIST':
        return this._handleClientListUpdate(message);
      case 'TWITTER-STATUS-UPDATE':
        return this._handleTwitterStatusUpdate(message);
      case 'TWITTER-UPDATE':
        return this._handleTwitterUpdate(message);
    }
  }

  _handleClientListUpdate(message) {
    return Promise.all([
      this.licensing.requestLicensingDataIfLicensingIsAvailable(message),
      this.requestTwitterStatusRequest(message)
    ]);
  }

  _handleTwitterStatusUpdate(message) {
    if (message && message.status !== null) {
      console.log(`Twitter Module ${message.userFriendlyStatus} to accept data requests`);
      this.logger.evt(`Twitter Module ${message.userFriendlyStatus} to accept data requests`);
      this.settings.setTwitterModuleStatus(message.status);
    }
  }

  _handleTwitterUpdate(message) {
    if (message && message.data && message.data.component_id === this.componentId && message.status) {
      if (message.status.toUpperCase() === 'CURRENT') {
        this.tweet.updateTweets(JSON.parse(message.data.tweets));
      } else if (message.status.toUpperCase() === 'STREAM') {
        this.tweet.updateStreamedTweets(JSON.parse(message.data.tweets));
      }
    }
  }

  requestModuleClientList() {
    console.log('Requesting client list');
    this.localMessaging.getModuleClientList();
  }

  isConnected() {
    return this.localMessaging.canConnect();
  }

  sendLicensingWatch() {
    this.localMessaging.broadcastMessage({topic: 'licensing-watch', data: {component_name: this.config.componentName, component_id: this.componentId}});
  }

  requestTwitterStatusRequest(message) {
    let running = message.clients.includes('twitter');

    if (running && this.settings.getTwitterModuleStatus() === null) {
      console.log('Requesting Twitter Credentials Status from Twitter Module');
      this.localMessaging.broadcastMessage({topic: 'twitter-status-request'});
    }
  }

  // eslint-disable-next-line
  sendComponentSettings(screen_name = '', hashtag = '') {
    console.log('Requesting Twitter Data from Twitter Module');
    this.localMessaging.broadcastMessage({topic: 'twitter-watch', data: {component_name: this.config.componentName, component_id: this.componentId, screen_name, hashtag}});
  }
}
