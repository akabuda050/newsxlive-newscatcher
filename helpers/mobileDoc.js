const Renderer = require('mobiledoc-dom-renderer/dist/commonjs/mobiledoc-dom-renderer')
const SimpleDOM = require('simple-dom')

const prepareLightMobileDoc = (article) => {
  return JSON.stringify({
    version: '0.3.1',
    atoms: [
      ['soft-return', '', {}],
      ['soft-return', '', {}],
    ],
    cards: [['hr', {}]],
    markups: [['a', ['href', article.link]]],
    sections: [
      [1, 'p', [[0, [], 0, article.summary]]],
      [10, 0],
      [
        1,
        'blockquote',
        [
          [0, [], 0, `By ${article.author}`],
          [1, [], 0, 0],
          [0, [], 0, 'More on: '],
          [0, [0], 1, article.clean_url],
          [1, [], 0, 1],
          [0, [], 0, `Rights: ${article.rights}`],
        ],
      ],
    ],
  })
}

const renderMobileDoc = (mobiledoc) => {
  const dom = new SimpleDOM.Document()

  const renderer = new Renderer.default({
    dom: dom,
    atoms: [
      {
        name: 'soft-return',
        type: 'dom',
        render ({ payload, env: { dom: dom } }) {
          return dom.createElement('span')
        }
      }
    ],
    cards: [
      {
        name: 'hr',
        type: 'dom',
        render ({ payload, env: { dom: dom } }) {
          return dom.createElement('hr')
        }
      }
    ]
  })

  const rendered = renderer.render(mobiledoc)
  const serializer = new SimpleDOM.HTMLSerializer([])
  return serializer.serializeChildren(rendered.result)
}

module.exports = {
  renderMobileDoc,
  prepareLightMobileDoc,
}
