const request = require('request')
const { cache, categories, params } = require('./constants')
const { webhook } = require('./config')

let previous = [];

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
  const id = 'test';
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
  const callback = (error, res, body) => console.log('Tried to send Slack message:', res.statusCode, error ? error : body);
  request.post(body, callback);
}

module.exports = {
  getBase,
  populateURL,
  getSource,
  getFirstItem,
  newItem,
  sendSlackMessage,
};
