[![CircleCI](https://circleci.com/gh/Rise-Vision/rise-twitter/tree/master.svg?style=svg)](https://circleci.com/gh/Rise-Vision/rise-twitter/tree/master)

# rise-twitter

> Rise Vision Twitter Component.

> The Twitter component is encased in a wrapper component which makes up the widget.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# build for staging with minification
npm run build-stage

# build for production with minification
npm run build-prod
```

## Test Scripts

``` bash
# run unit tests
npm run test-unit

# run integration tests
npm run test-integration

# run all tests
npm run test
```

## Run Locally
First, clone every individual Player Module (i.e. [Twitter Module](https://github.com/Rise-Vision/twitter-module)) and start them.
``` bash
# at localhost:3000
npm run start
```

## Manual Testing
As Twitter Component needs [Twitter Module](https://github.com/Rise-Vision/twitter-module) to run, we need [Rise Player](https://github.com/Rise-Vision/rise-player) or a simulated Rise Player to manually test. It is not recommended that you clone, install and run every individual module (i.e. Twitter Module, Licensing Module, Local Storage Module) and run Twitter Component Locally.

Instead, manually test using an actual display or use a simulated display via software similar to VirtualBox. Here are the testing steps:

1. Build Twitter Component for production
``` bash
npm run build-prod
```

2. Upload the resulting files in the dist folder to a server and make all files public in a folder called "rise-twitter"

3. Clone [Rise Playlist](https://github.com/Rise-Vision/rise-playlist) and build
```
git clone https://github.com/Rise-Vision/rise-playlist.git
npm install
npm run build
```

4. Upload the resulting files in the dist folder to the same server and make all the files public in a folder called "rise-player" so that the file structure is as such:

```
- rise-twitter
- rise-player
```

5. Create a presentation and add an instance of Twitter Widget.

6. Click on "View HTML" and navigate to the placeholder with the Twitter Widget and replace URL in objectData attribute to the rise-twitter-widget.html file mentioned in step 2.

7. Save and publish your presentation and set your display or simulated display to show the presentation.

8. Start Player on your display or simulated display.

## Deploying to Staging

Merging to master automatically deploys to staging

## Deploying to Stable

Pull Master branch into Stable branch
```
git pull origin master
```

## Submitting Issues
If you encounter problems or find defects we really want to hear about them. If you could take the time to add them as issues to this Repository it would be most appreciated. When reporting issues, please use the following format where applicable:

**Reproduction Steps**

1. did this
2. then that
3. followed by this (screenshots / video captures always help)

**Expected Results**

What you expected to happen.

**Actual Results**

What actually happened. (screenshots / video captures always help)

## Contributing
All contributions are greatly appreciated and welcome! If you would first like to sound out your contribution ideas, please post your thoughts to our [community](https://help.risevision.com/hc/en-us/community/topics), otherwise submit a pull request and we will do our best to incorporate it. Please be sure to submit corresponding E2E and unit tests where appropriate.

### Languages
If you would like to translate the user interface for this product to another language, please refer to the [common-i18n](https://github.com/Rise-Vision/common-i18n) repository.

## Resources
If you have any questions or problems, please don't hesitate to join our lively and responsive community at https://help.risevision.com/hc/en-us/community/topics.
