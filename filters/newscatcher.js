const { AsyncArray, getSslDetails } = require('../helpers');

const filterArticle = async (article) => {
  return (
    article.title &&
    article.author &&
    article.summary &&
    article.clean_url &&
    article.topic &&
    article.media &&
    article.link &&
    article.rights &&
    (await getSslDetails(article.media)).valid &&
    (await getSslDetails(article.link)).valid
  );
};

const filterArticles = async (articles) => {
  try {
    return await new AsyncArray(articles).filterAsync(async (element) => await filterArticle(element));
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = {
  filterArticle,
  filterArticles,
};
