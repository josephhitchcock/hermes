const { checkCraigslist } = require('./utils');
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

const search = async () => {
  setInterval(async () => {
    await checkCraigslist(patio)
      .catch(e => console.log(e));
  }, refreshRate * 1000);
}

search().catch(e => console.log(e));