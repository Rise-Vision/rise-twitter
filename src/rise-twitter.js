import { WebComponent } from 'web-component';

@WebComponent('rise-twitter', {
  template: require('./rise-twitter.html'),
  shadowDOM: true
})

export default class RiseTwitter extends HTMLElement {
  constructor() {
    super();
    console.log('RiseTwitter');
  }
}
