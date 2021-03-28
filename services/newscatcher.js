const config = require('../config');
const axios = require('axios');
const randomWords = require('random-words');
const { randomIntFromInterval } = require('../helpers');
const { filterArticles } = require('../filters/newscatcher');

const fetchNews = async () => {
  let [month, date, year] = new Date().toLocaleDateString('en-US').split('/');
  let topics = [
    'news',
    'sport',
    'tech',
    'world',
    'finance',
    'business',
    'economics',
    'entertainment',
    'beauty',
    'travel',
    'music',
    'food',
    'science',
  ];
  let params = {
    q: randomWords(),
    topic: topics[Math.floor(Math.random() * topics.length)],
    lang: 'en',
    sort_by: 'date',
    page_size: 3,
    page: randomIntFromInterval(1, 20),
    media: 'True',
  };
  if (config.services.newscatcher.fetchTodaysOnly === 'true') {
    params.from = `${year}/${month}/${date}`;
  }
  const options = {
    method: 'GET',
    url: config.services.newscatcher.rapidApiUrl,
    params: params,
    headers: {
      'x-rapidapi-key': config.services.newscatcher.rapidApiKEy,
      'x-rapidapi-host': config.services.newscatcher.rapidApiHost,
    },
  };
  try {
    const response = await axios.request(options);
    console.log(response && response.data || 'There is no response!');
    if (response && response.data && response.data.articles) {
      return await filterArticles(response.data.articles);
    }
    return [];
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = {
  fetchNews,
};
