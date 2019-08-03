const request = require('request')
const { cache, categories, params } = require('./constants')
const { webhook } = require('./config')

let previous = [];

const getCurrentTime = () => {
  return '[' + new Date().toUTCString() + ']';
}

const getBase = (city, category) => {
  return `https://${city}.craigslist.org/search/${categories[category]}?`
}

const populateURL = (base, parameters) => {
  let url = base;
  Object.entries(parameters).map(([key, value]) => {
    let param = '';
    switch (key) {
      case 'searchTitle':
        param = value ? 'T' : 'F'; break;
      case 'hasImage':
        param = Number(value); break;
      case 'postedToday':
        param = Number(value); break;
      default:
        param = value;
    }
    url = url.concat(`${params[key]}=${param}&`);
  })
  return url;
}

const getSource = async url => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject(error)
      }
      else {
        resolve(body)
      }
    })
  })
}

const getSubstring = (string, { start, end }, debug) => {
  const indexStart = string.indexOf(start) + start.length;
  const indexEnd = indexStart + string.substring(indexStart).indexOf(end);
  if (debug) console.log(indexStart, indexEnd)
  return string.substring(indexStart, indexEnd);
}

const getFirstItem = async source => {
  const firstItemPreview = getSubstring(source, { start: '<li class="result-row"', end: '</li>' });
  const link = getSubstring(firstItemPreview, { start: '<a href="', end: '"' });
  const firstItem = await getSource(link)

  const title = getSubstring(firstItem, { start: '<span id="titletextonly">', end: '</span>' });
  const location = getSubstring(firstItem, { start: '<small>', end: '</small>' });
  const image = getSubstring(firstItem, { start: '<img src="', end: '"' });

  return { link, title, location, image }
}

const newItem = link => {
  if (previous.includes(link)) {
    previous = previous.filter(item => item !== link);
    previous.push(link);
    return false;
  }
  previous.push(link);
  if (previous.length > cache) {
    previous.shift();
  }
  return true;
}

const sendSlackMessage = ({ title, link, location, image }) => {
  if (!webhook) {
    return console.log('No webhook configured, see config.js');
  }
  const formattedTitle = !location.includes('</a>') ?
    title + location : title
  const attachments = [
    {
      "fallback": formattedTitle,
      "color": "#36a64f",
      "pretext": "A new item has been posted",
      "title": formattedTitle,
      "title_link": link,
      "image_url": image,
    }
  ];
  const body = {
    headers: { 'Content-type' : 'application/json' },
    url: webhook,
    form: { payload: JSON.stringify({ attachments }) }
  };
  const callback = (error, res, body) => {
    if (error) {
      console.log(getCurrentTime(), 'Failed to send Slack message:', error);
    }
    else {
      console.log(getCurrentTime(), 'Sent Slack message:', formattedTitle)
    }
  };
  request.post(body, callback);
}

const checkCraigslist = async ({ city, category, parameters }) => {
  const base = getBase(city, category);
  const url = populateURL(base, parameters);
  const source = await getSource(url);
  const item = await getFirstItem(source);

  if (newItem(item.link)) {
    sendSlackMessage(item);
  }
  else {
    console.log(getCurrentTime(), 'No new items');
  }
}

module.exports = {
  checkCraigslist,
};
