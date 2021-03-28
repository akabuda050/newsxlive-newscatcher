var mobiledoc = {
  version: '0.3.0',
  markups: ['B'],
  atoms: [],
  cards: [],
  sections: [
    [1, 'P', [ // array of markers
      // marker
      [0,            // marker type 0 (standard text)
        [0],          // open markups (by index)
        0,            // close count
        'hello world'
      ]
    ]
    ]
  ]
}

const Renderer = require('mobiledoc-dom-renderer/dist/commonjs/mobiledoc-dom-renderer')
const SimpleDOM = require('simple-dom')

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
var serializer = new SimpleDOM.HTMLSerializer([])
var html = serializer.serializeChildren(rendered.result)
console.log(html)