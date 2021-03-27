const prepareLightMobileDoc = (article) => {
  return JSON.stringify({
    version: '0.3.1',
    atoms: [['soft-return', '', {}]],
    cards: [
      ['hr', {}],
      ['hr', {}],
    ],
    markups: [['a', ['href', article.link]]],
    sections: [
      [1, 'p', [[0, [], 0, `By ${article.author}`]]],
      [10, 0],
      [1, 'p', [[0, [], 0, article.summary]]],
      [10, 1],
      [
        1,
        'p',
        [
          [0, [], 0, 'More on: '],
          [0, [0], 1, article.clean_url],
          [1, [], 0, 0],
          [0, [], 0, `Rights: ${article.rights}`],
        ],
      ],
    ],
    ghostVersion: '4.0',
  });
};

module.exports = {
  prepareLightMobileDoc,
};
