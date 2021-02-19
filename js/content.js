const OTTER_SEARCH_WRAPPER_CLASS_NAME = 'otter-search-wrapper';
const OTTER_SEARCH_MASK_CLASS_NAME = 'otter-search-mask';
const OTTER_SEARCH_INPUT_CLASS_NAME = 'otter-search-input-inner';
const OTTER_SEARCH_ACTIVE_CLASS_NAME = 'visible';

function render(options, parent, svgType) {
  const { tag, attributes, children } = options;
  const isSVG = tag === 'svg' || svgType;
  const _dom =
    isSVG
      ? document.createElementNS('http://www.w3.org/2000/svg', tag)
      : document.createElement(tag);

  for (let attribute in attributes) {
    _dom.setAttribute(attribute, attributes[attribute]);
  }

  children && children.forEach(child => render(child, _dom, isSVG));
  parent.appendChild(_dom);
}

document.addEventListener('DOMContentLoaded', () => {
  render(
    {
      tag: 'div',
      attributes: { class: OTTER_SEARCH_WRAPPER_CLASS_NAME },
      children: [
        {
          tag: 'div',
          attributes: { class: OTTER_SEARCH_MASK_CLASS_NAME }
        },
        {
          tag: 'div',
          attributes: { class: 'otter-search-inner' },
          children: [
            {
              tag: 'svg',
              attributes: {
                'enable-background': 'new 0 0 64 64',
                height: '64px',
                id: 'spotlight-search-icon',
                version: '1.1',
                viewBox: '0 0 64 64',
                width: '64px',
                'xml:space': 'preserve',
                'xmlns:xlink': 'http://www.w3.org/1999/xlink'
              },
              children: [
                {
                  tag: 'g',
                  attributes: {},
                  children: [
                    {
                      tag: 'circle',
                      attributes: {
                        cx: '32',
                        cy: '25',
                        fill: 'none',
                        r: '16',
                        stroke: '#4D4D4D',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        'stroke-miterlimit': '10',
                        'stroke-width': '2'
                      }
                    },
                    {
                      tag: 'line',
                      attributes: {
                        fill: 'none',
                        stroke: '#4D4D4D',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        'stroke-miterlimit': '10',
                        'stroke-width': '4',
                        x1: '40.9',
                        x2: '46',
                        y1: '44.1',
                        y2: '55'
                      }
                    },
                    {
                      tag: 'line',
                      attributes: {
                        cx: '32',
                        cy: '25',
                        fill: 'none',
                        r: '16',
                        stroke: '#4D4D4D',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        'stroke-miterlimit': '10',
                        'stroke-width': '2'
                      }
                    },
                    {
                      tag: 'path',
                      attributes: {
                        d: 'M36.2,13.7c2.7,1,4.9,2.9,6.3,5.3',
                        fill: 'none',
                        stroke: '#4D4D4D',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        'stroke-miterlimit': '10'
                      }
                    },
                  ]
                }
              ],
            },
            {
              tag: 'div',
              attributes: { class: 'otter-search-input' },
              children: [
                {
                  tag: 'input',
                  attributes: {
                    class: OTTER_SEARCH_INPUT_CLASS_NAME,
                    placeholder: 'Otter Search'
                  }
                }
              ],
            }
          ]
        }
      ],
    },
    document.body,
  );
  document.querySelector(`.${OTTER_SEARCH_MASK_CLASS_NAME}`).onclick = function() {
    this.parentElement.classList.remove(OTTER_SEARCH_ACTIVE_CLASS_NAME);
  };
});

document.addEventListener('keydown', event => {
  const { metaKey, shiftKey, key } = event;

  if ((metaKey && shiftKey && key === 's') || key === 'Enter') {
    const otterSearch = document.querySelector(`.${OTTER_SEARCH_WRAPPER_CLASS_NAME}`);

    switch (key) {
      case 's':
        otterSearch.classList.toggle(OTTER_SEARCH_ACTIVE_CLASS_NAME);
        otterSearch.classList.contains(OTTER_SEARCH_ACTIVE_CLASS_NAME)
          && document.querySelector(`.${OTTER_SEARCH_INPUT_CLASS_NAME}`).focus();
        break;

      case 'Enter':
        if (otterSearch.classList.contains(OTTER_SEARCH_ACTIVE_CLASS_NAME)) {
          const input = document.querySelector(`.${OTTER_SEARCH_INPUT_CLASS_NAME}`);
          const { value } = input;
  
          if (value && value.trim()) {
            chrome.runtime.sendMessage({ keyword: value });
            input.value = '';
            otterSearch.classList.remove(OTTER_SEARCH_ACTIVE_CLASS_NAME);
          }
        }
        break;
  
      default:
        break;
    }
  }
});

chrome.runtime.onMessage.addListener(({ type }) => {
  switch (type) {
    case MESSAGE_TYPES.SHOW_OTTER_SEARCH:
      document.querySelector(`.${OTTER_SEARCH_WRAPPER_CLASS_NAME}`).classList.add(OTTER_SEARCH_ACTIVE_CLASS_NAME);
      document.querySelector(`.${OTTER_SEARCH_INPUT_CLASS_NAME}`).focus();
      break;

    default:
      break;
  }
});
