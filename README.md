# Hacker News Node App
This is a basic application running on Node Js which displays results from hacker news. I have used the [Algoila](https://hn.algolia.com/api) API to get data, and although the API is a bit slow, the results are authentic.

## Installation 
To install the app, pull the repository and do the following
* Go to the directory and run `npm install`
* Run `node server.js` to start the app. If you have nodemon installed, then you may also run `nodemon server.js`
* Head over to `localhost:3000` to see the working app.

## Working
Here is how the app works - 
* I am using Node's `request-promise` module to make calls. API calls are made to get the relevant data. For example, different calls are made to get data for the top stories, stories posted in the past 24 hrs and the all time top rated stories.
* Once the data is received, response is sent to the client side where it is rendered to the HTML.
* Search query is posted to the node server, where again an API call is made to search for the given key word.
* On selecting a checkbox, the url is stored in local storage and on the next session the same links are displayed under the bookmarks tab. Since I am using local storage, the bookmarks are valid only for one browser session. 