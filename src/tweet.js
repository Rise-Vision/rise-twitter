
export default class Tweet {
  constructor(shadowRoot) {
    this.shadowRoot = shadowRoot;
  }

  update(tweet) {
    const p = document.createElement('p');
    p.textContent = tweet.text;
    p.className = 'tweet';
    this.shadowRoot.querySelector('#twitter-component-template').appendChild(p);
  }
}
