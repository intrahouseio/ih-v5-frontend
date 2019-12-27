import shortid from 'shortid';

import { 
  GRAPH_SET_DATA, 
  GRAPH_SET_POSITION_LAYOUT, 
  GRAPH_SET_POSITION_CONTAINER,
  GRAPH_SET_POSITION_GROUP_CONTAINER,
  GRAPH_SET_RESIZE_GROUP_CONTAINER,
  GRAPH_SET_SETTINGS_CONTAINER,

  GRAPH_ADD_CONTAINER,
  GRAPH_SELECT_ONE_CONTAINER,
  GRAPH_SELECT_MULTI_CONTAINERS,
  GRAPH_SELECT_BLOCK,
  GRAPH_CLEAR_ALL_SELECTS,

  GRAPH_SET_GROUP,
  GRAPH_UNSET_GROUP,
} from './constants';


export function setData(data) {
  return {
    type: GRAPH_SET_DATA,
    data,
  };
}

export function setPositionLayout(x, y) {
  return {
    type: GRAPH_SET_POSITION_LAYOUT,
    x,
    y,
  };
}

export function setPositionContainer(itemid, x, y) {
  return {
    type: GRAPH_SET_POSITION_CONTAINER,
    itemid,
    x,
    y,
  };
}

export function setSettingsContainer(itemid, settings) {
  return {
    type: GRAPH_SET_SETTINGS_CONTAINER,
    itemid,
    settings,
  };
}


export function addContainer(position, data) {
  if (Array.isArray(data) && data.length !== 0) {
    let rx = data[0].settings.x - position.nx;
    let ry = data[0].settings.y - position.ny;
    return {
      type: GRAPH_ADD_CONTAINER,
      data: data.reduce((p, n) => {
        const id = shortid.generate();
        return {
          ...p,
          [id]: {
            ...n,
            settings: {
              ...n.settings,
              id: id,
              x: n.settings.x - rx,
              y: n.settings.y - ry,
            }
          },
        }
      }, {}),
    };
  }
  const id = shortid.generate();
  return {
    type: GRAPH_ADD_CONTAINER,
    data: {
      [id]: {
        ...data,
        settings: {
          ...data.settings,
          id: id,
          x: position.nx,
          y: position.ny,
        }
      }
    },
  };
}

export function selectOneContainer(itemid) {
  return {
    type: GRAPH_SELECT_ONE_CONTAINER,
    itemid,
    selecttype: 'one',
  };
}

export function selectMultiContainers(itemid, items, map) {
  const selects = {
    ...items,
    [itemid]: true,
  }
  
  let x = map[itemid].settings.x;
  let y = map[itemid].settings.y;
  let w = 0
  let h = 0;

  Object
    .keys(selects)
    .forEach(key => {
      const item = map[key];
      if (x > item.settings.x) {
        x = item.settings.x;
      }
      if (y > item.settings.y) {
        y = item.settings.y;
      }
      if (w < item.settings.x + item.settings.w) {
        w = (item.settings.x + item.settings.w);
      }
      if (h < item.settings.y + item.settings.h) {
        h = (item.settings.y + item.settings.h);
      }
    });
 
  return {
    type: GRAPH_SELECT_MULTI_CONTAINERS,
    itemid,
    selecttype: 'multi',
    selects: items,
    group: {
      enabled: true,
      x, y, w: w - x, h: h - y,
    }
  };
}

export function setPositionGroupContainer(data, select, map) {
  const dx = data.x - select.group.x;
  const dy = data.y - select.group.y;
  const temp = Object
    .keys(map)
    .reduce((p, c) => {
      if (select.data[c]) {
        return { 
          ...p, 
          [c]: {
            settings: { 
              ...map[c].settings,
              x: map[c].settings.x + dx,
              y: map[c].settings.y + dy,
            },
          } 
        };
      }
      return { ...p, [c]: map[c] };
    }, {});
  return {
    type: GRAPH_SET_POSITION_GROUP_CONTAINER,
    x: data.x,
    y: data.y,
    map: temp,
  };
}

export function setResizeGroupContainer(e, position, selects, map) {
  const lgp = selects.group;

  const h = position.w / lgp.w;
  const v = position.h / lgp.h; 

  const temp = Object
  .keys(map)
  .reduce((p, c) => {
    if (selects.data[c]) {
      const s = map[c].settings;
      return { 
        ...p, 
        [c]: {
          settings: { 
            ...map[c].settings,
            x: position.x + ((s.x - lgp.x) * h),
            y: position.y + ((s.y - lgp.y) * v),
            w: (s.x + s.w) * h - (s.x * h),
            h: (s.y + s.h) * v - (s.y * v),
          },
        } 
      };
    }
    return { ...p, [c]: map[c] };
  }, {});
  return {
    type: GRAPH_SET_RESIZE_GROUP_CONTAINER,
    position,
    map: temp,
  };
}

export function selectBlock(value) {
  return {
    type: GRAPH_SELECT_BLOCK,
    value,
  };
}

export function clearAllSelects() {
  return {
    type: GRAPH_CLEAR_ALL_SELECTS,
  };
}

export function setGroup(group, data) {
  console.log(group, data);
  return {
    type: GRAPH_SET_GROUP,
  };
}

export function unsetGroup() {
  return {
    type: GRAPH_UNSET_GROUP,
  };
}


export default {
  setData,
  setPositionLayout,
  setPositionContainer,
  setPositionGroupContainer,
  setResizeGroupContainer,
  setSettingsContainer,
  addContainer,
  selectOneContainer,
  selectMultiContainers,
  selectBlock,
  clearAllSelects,
  setGroup,
  unsetGroup,
}
