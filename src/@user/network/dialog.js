import core from 'core';
import css from 'css';

import { createValueFunc, options } from 'components/tools';

function preparationData(data) {

  const dialogPosition = data.settings.position.value.id;

  let count = 0;
  let step = 0;
  let last = 0;

  const itemsX = {};
  const itemsY = {};
  const expands = {};

  const delta = document.body.clientHeight - data.settings.h.value;

  if (dialogPosition !== 'center') {
    Object
    .keys(data.elements)
    .forEach(id => {
      const item = data.elements[id];
      if (itemsY[item.y.value] === undefined) {
        itemsY[item.y.value] = [];
      }
      if (item.type === 'expand') {
        itemsY[item.y.value].push(item.type);
        count++;
        expands[count] = id;
      } else {
        itemsY[item.y.value].push(id);
      }
    });

    Object
    .keys(itemsY)
    .forEach(id => {
      if (itemsY[id].includes('expand')) {
        step++;
      }
      if (step) {
        itemsY[id].forEach(id => {
          if (id !== 'expand') {
            const offset = delta * (step / count)
            data.elements[id].y.value = data.elements[id].y.value + offset;
          } else {
            if (expands[step] !== undefined) {
              const offset = delta * (step / count);
              data.elements[expands[step]].y.value = data.elements[expands[step]].y.value + offset;
            }
          }
        })
      }
    })
  }

  if (dialogPosition === 'right' || dialogPosition === 'left') {
    data.settings.fitH.value = true;
    data.settings.fitW.value = false;

    data.settings.alignW.value.id = 'center';
    data.settings.alignH.value.id = 'flex-start'

    data.settings.scrollY.value = true;
  }

  if (dialogPosition === 'top' || dialogPosition === 'bottom') {
    data.settings.fitH.value = false;
    data.settings.fitW.value = true;

    data.settings.alignW.value.id = 'flex-start';
    data.settings.alignH.value.id = 'center'

    data.settings.scrollX.value = true;
  }

  // --------------------------
    const key = 'dialog';
    
    Object
    .keys(data.elements)
    .forEach(id => {
      Object
      .keys(data.elements[id])
      .forEach(propId => {
        const item = data.elements[id][propId];
        // animation
        if (
          propId === 'animation' &&
          item.active &&
          item.keyframes &&
          item.value
        ) {
          const values = item.value.split(' ');
          const old_id = values[0];
          const _id = `${key}_${values[0]}_${id}`;

          values[0] = _id;
          data.elements[id][propId].value = values.join(' ');
          if (item.enabled) {
            data.elements[id][propId].func = item.func.replace(old_id, _id)                 
          }
          
          const styles = css.parse(item.keyframes);

          try {
            styles.stylesheet.rules
              .forEach(item => {
                item.name = `${key}_${item.name}_${id}`
                if (item.type === 'keyframes') {
                  const style = css.stringify({
                    stylesheet: {
                      rules: [item]
                    },
                    type: 'stylesheet',
                  });
                  try {
                    document.styleSheets[0].insertRule(style, document.styleSheets[0].cssRules.length);
                  } catch {
                  }
                }
              })
          } catch {
            console.warn('Animation not work, wrong css styles!')
          }
        } // animation

        // bind
        if (item.enabled) {
          try {
            data.elements[id][propId].func = createValueFunc(item.func).body;
            if (!item.template && data.static[item.did] && data.static[item.did][item.prop] !== undefined) {
              const context = { parent: data.static[item.did] || {} };

              if (propId === 'w2' || propId === 'h2') {
                const prop1 = propId === 'w2' ? 'x': 'y';
                const prop2 = propId === 'w2' ? 'w': 'h';

                const v = data.elements[id][propId].func(data.static[item.did][item.prop], {}, context)
                const curentValue = v;
                const delta = curentValue - data.elements[id][prop2].value;
  

                data.elements[id][prop1].value = data.elements[id][prop1].value - delta;
                data.elements[id][prop2].value =  v;
                data.elements[id][propId].value = v;
              } else {
                data.elements[id][propId].value = data.elements[id][propId].func(data.static[item.did][item.prop], {}, context)
              }
            } else {
              const context = { parent: data.static[item.prop] || {} };
              if (propId === 'w2' || propId === 'h2') {
                const prop1 = propId === 'w2' ? 'x': 'y';
                const prop2 = propId === 'w2' ? 'w': 'h';
                const v = data.elements[id][propId].func(data.static[item.prop][item.prop], {}, context)
                const curentValue = v;
                const delta = curentValue - data.elements[id][prop2].value;

                data.elements[id][prop1].value = data.elements[id][prop1].value - delta;
                data.elements[id][prop2].value = v;
                data.elements[id][propId].value = v;
              } else {
                data.elements[id][propId].value = data.elements[id][propId].func(data.static[item.prop][item.prop], {}, context)
              }
            }
          } catch {

          }
        }  // bind
      })
      // widget data
      if (data.elements[id].widget && data.widgets[id] !== undefined) {
        data.elements[id].data = data.widgets[id];
      } // widget data
    });

  // ----------------

  return data;
}

core.network.request('applayout_dialog', (send, context) => {
  send([
    { api: 'dialog', ...context.params },
    { api: 'dialog', ...context.params, static: 1 },
    { api: 'dialog', ...context.params, widgetdata: 1 }
  ]);
})


core.network.response('applayout_dialog', (answer, res, context) => {
  answer(preparationData({
    ...res[0].data,
    static: res[1].data,
    widgets: res[2].data,
  }));
})