const cache = 100;
const refreshRate = 60;

const categories = {
  'all': 'sss',
  'bikes': 'bia',
  'boats': 'boo',
  'cars': 'cta',
  'cellPhones': 'moa',
  'computers': 'sya',
  'electronics': 'ela',
  'free': 'zip',
  'furniture': 'fua',
  'general': 'foa',
  'motorcycles': 'mca',
  'rvs': 'rva',
  'tickets': 'tia',
  'tools': 'tla',
  'trailers': 'tra',
}

const params = {
  'query': 'query',
  'searchTitle': 'srchType',
  'hasImage': 'hasPic',
  'postedToday': 'postedToday',
  'distance': 'search_distance',
  'zipCode': 'postal',
  'minPrice': 'min_price',
  'maxPrice': 'max_price',
}

module.exports = {
  cache,
  refreshRate,
  categories,
  params,
}
