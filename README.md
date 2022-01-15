# hermes
A tool to get notifications for new Craigslist postings

## Requirements
* `Node 7.6+` for async/await functionality

## Setup
* Clone the master branch of the repo
* Update `config.js` with a Slack webhook
* Modify search object as desired
* Run `node search.js` to be notified of new items

## Creating a Slack webhook
See [this documentation by Slack](https://api.slack.com/incoming-webhooks) for a helpful guide on webhooks. Once you add one to a channel and copy the webhook URL, paste that into `config.js` and you're set!

## Search support
A search object has the following attributes:
* `city`: The site to search, see [here](https://www.craigslist.org/about/sites) for options, then extract from `[city].craigslist.org`.
* `category`: The category to search in for sale postings, extracted from `[city].craigslist.org/search/[category]`. See [constants.js](https://github.com/josephhitchcock/craigslist-notifications/blob/master/constants.js#L4) for some readable mappings.
* `parameters`: An object that contains the search options that can be encoded into a query parameter, with support for the following options:
  * `query`: A **string** indicating the search
  * `searchTitle`: A **boolean** indicating to only search titles
  * `hasImage`: A **boolean** indicating that the listing must have an image
  * `postedToday`: A **boolean** indicating that the listing must have been posted today
  * `distance`: An **string** indicating the search radius from `zipCode`
  * `zipCode`: An **string** indicating the zip code to search in
  * `minPrice`: An **string** indicating the minimum price
  * `maxPrice`: An **string** indicating the maximum price

## Additional configuration
* The `refreshRate` in [constants.js](https://github.com/josephhitchcock/craigslist-notifications/blob/master/constants.js#L2) indicates how often (in seconds) the search will be polled for new items.
* The `cache` in [constants.js](https://github.com/josephhitchcock/craigslist-notifications/blob/master/constants.js#L1) indicates the number of posting IDs to save, in order to prevent previously seen postings that were updated from sending another notification.
