const {
  getBase,
  populateURL,
  getSource,
  getFirstItem,
  newItem,
  sendSlackMessage
} = require('./utils');
const { refreshRate } = require('./constants');

const patio = {
  city: 'sfbay',
  category: 'furniture',
  parameters: {
    query: 'patio',
    maxPrice: 120,
    hasImage: true,
    searchTitle: true,
    postedToday: true
  }
};

const checkCraigslist = async ({ city, category, parameters }) => {
  const base = getBase(city, category);
  const url = populateURL(base, parameters);
  const source = await getSource(url);
  const item = await getFirstItem(source);

  if (newItem(item.link)) {
    sendSlackMessage(item);
  }
}

(async () => {
  setInterval(async () => {
    await checkCraigslist(patio);
  }, refreshRate);
})().catch(e => {
  console.log(e)
});
