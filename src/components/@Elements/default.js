const BLOCK = {
  borderSize: { value: 1 },
  borderRadius: { value: 0 },
  borderStyle: { value: { id: 'solid', title: 'Solid' } },
  borderColor: { value: 'rgba(0,0,0,1)' } ,
  backgroundColor: { 
    type: 'fill', 
    value: 'transparent', 
    fill: 'transparent',
    angle: 90,
    shape: 'circle',
    positionX: 50,
    positionY: 50,
    extent: 'closest-side',
    palette: [{ offset: '0.00', color: '#4A90E2', opacity: 1 }, { offset: '1.00', color: '#9013FE', opacity: 1 }]
  },
  rotate: { value: 0 },
  animation: {},
  flipH: { value: false },
  flipV: { value: false },
  boxShadow: { active: false, value: '2px 2px 4px 0px #000000' },
  zIndex: { value: 100 },
  opacity: { value: 100 },
  overflow: { value: true },
}

const RECTANGLE = {
  borderSize: { value: 1 },
  borderRadius: { value: 0 },
  borderStyle: { value: { id: 'solid', title: 'Solid' } } ,
  borderColor: { value: 'rgba(0,0,0,1)' },
  backgroundColor: { 
    type: 'fill', 
    value: 'transparent', 
    fill: 'transparent',
    angle: 90,
    shape: 'circle',
    positionX: 50,
    positionY: 50,
    extent: 'closest-side',
    palette: [{ offset: '0.00', color: '#4A90E2', opacity: 1 }, { offset: '1.00', color: '#9013FE', opacity: 1 }]
  },
  rotate: { value: 0 },
  animation: {},
  flipH: { value: false },
  flipV: { value: false },
  boxShadow: { active: false, value: '2px 2px 4px 0px #000000' },
  zIndex: { value: 100 },
  opacity: { value: 100 },
  overflow: { value: true },
}

const CIRCLE = {
  borderSize: { value: 1 },
  borderRadius: { value: 100 },
  borderStyle: { value: { id: 'solid', title: 'Solid' } } ,
  borderColor: { value: 'rgba(0,0,0,1)' },
  backgroundColor: { 
    type: 'fill', 
    value: 'transparent', 
    fill: 'transparent',
    angle: 90,
    shape: 'circle',
    positionX: 50,
    positionY: 50,
    extent: 'closest-side',
    palette: [{ offset: '0.00', color: '#4A90E2', opacity: 1 }, { offset: '1.00', color: '#9013FE', opacity: 1 }]
  },
  rotate: { value: 0 },
  animation: {},
  flipH: { value: false },
  flipV: { value: false },
  boxShadow: { active: false, value: '2px 2px 4px 0px #000000' },
  zIndex: { value: 100 },
  opacity: { value: 100 },
  overflow: { value: true },
}

const TEXT = {
  text: { value: 'Text 1'},
  textSize: { value: 14 },
  textBold: { value: 0 },
  textItalic: { value: 0 },
  textFontFamily: { value: { id: 'Arial', title: 'Arial' } },
  textAlignH: { value: { id: 'center', title: 'Center' } },
  textAlignV: { value: { id: 'center', title: 'Center' } },
  textRotate: { value: 0 },
  textColor: { value: 'rgba(0,0,0,1)' },
  borderSize: { value: 1 },
  borderRadius: { value: 0 },
  borderStyle: { value: { id: 'solid', title: 'Solid' } },
  borderColor: { value: 'rgba(0,255,0,1)' },
  backgroundColor: { 
    type: 'fill', 
    value: 'transparent', 
    fill: 'transparent',
    angle: 90,
    shape: 'circle',
    positionX: 50,
    positionY: 50,
    extent: 'closest-side',
    palette: [{ offset: '0.00', color: '#4A90E2', opacity: 1 }, { offset: '1.00', color: '#9013FE', opacity: 1 }]
  },
  rotate: { value: 0 },
  animation: {},
  flipH: { value: false },
  flipV: { value: false },
  boxShadow: { active: false, value: '2px 2px 4px 0px #000000' },
  zIndex: { value: 100 },
  opacity: { value: 100 },
  overflow: { value: true },
}

const IMAGE = {
  img: { value: 'lamp210.svg' },
  imgColor: { 
    type: 'fill', 
    value: 'transparent', 
    fill: 'transparent',
    angle: 90,
    shape: 'circle',
    positionX: 50,
    positionY: 50,
    extent: 'closest-side',
    palette: [{ offset: '0.00', color: '#4A90E2', opacity: 1 }, { offset: '1.00', color: '#9013FE', opacity: 1 }]
  },
  imgSize: { value: 0 },
  imgRotate: { value: 0 },
  borderSize: { value: 1 },
  borderRadius: { value: 0 },
  borderStyle: { value: { id: 'solid', title: 'Solid' } },
  borderColor: { value: 'rgba(0,0,255,1)' },
  backgroundColor: { 
    type: 'fill', 
    value: 'transparent', 
    fill: 'transparent',
    angle: 90,
    shape: 'circle',
    positionX: 50,
    positionY: 50,
    extent: 'closest-side',
    palette: [{ offset: '0.00', color: '#4A90E2', opacity: 1 }, { offset: '1.00', color: '#9013FE', opacity: 1 }]
  },
  rotate: { value: 0 },
  animation: {},
  flipH: { value: false },
  flipV: { value: false },
  boxShadow: { active: false, value: '2px 2px 4px 0px #000000' },
  zIndex: { value: 100 },
  opacity: { value: 100 },
  overflow: { value: true },
}

const TEXT_IMAGE = {
  text: { value: 'Text 1'},
  textSize: { value: 14 },
  textBold: { value: 0 },
  textItalic: { value: 0 },
  textFontFamily: { value: { id: 'Arial', title: 'Arial' } },
  textAlignH: { value: { id: 'center', title: 'Center' } },
  textAlignV: { value: { id: 'center', title: 'Center' } },
  textRotate: { value: 0 },
  textColor: { value: 'rgba(0,0,0,1)' },
  img: { value: 'lamp210.svg' },
  imgColor: { value: 'transparent' },
  imgSize: { value: 0 },
  imgRotate: { value: 0 },
  borderSize: { value: 1 },
  borderRadius: { value: 0 },
  borderStyle: { value: { id: 'solid', title: 'Solid' } },
  borderColor: { value: 'rgba(245,166,35,1)' },
  backgroundColor: { 
    type: 'fill', 
    value: 'transparent', 
    fill: 'transparent',
    angle: 90,
    shape: 'circle',
    positionX: 50,
    positionY: 50,
    extent: 'closest-side',
    palette: [{ offset: '0.00', color: '#4A90E2', opacity: 1 }, { offset: '1.00', color: '#9013FE', opacity: 1 }]
  },
  singleClickLeft: { value: 'TOGGLE' },
  doubleClickLeft: { value: '' },
  longClickLeft: { value: 'DEVICEMENU' },
  singleClickRight: { value: '' },
  doubleClickRight: { value: '' },
  longClickRight: { value: '' },
  mouseDown: { value: '' },
  mouseUp: { value: '' },
  rotate: { value: 0 },
  animation: {},
  flipH: { value: false },
  flipV: { value: false },
  boxShadow: { active: false, value: '2px 2px 4px 0px #000000' },
  zIndex: { value: 100 },
  opacity: { value: 100 },
  overflow: { value: true },
}

const BUTTON = {
  text: { value: 'Button 1'},
  textSize: { value: 14 },
  textBold: { value: 0 },
  textItalic: { value: 0 },
  textFontFamily: { value: { id: 'Arial', title: 'Arial' } },
  textAlignH: { value: { id: 'center', title: 'Center' } },
  textAlignV: { value: { id: 'center', title: 'Center' } },
  textRotate: { value: 0 },
  textColor: { value: 'rgba(0,0,0,1)' },
  img: { value: 'lamp210.svg' },
  imgColor: { value: 'transparent' },
  imgSize: { value: 0 },
  imgRotate: { value: 0 },
  borderSize: { value: 1 },
  borderRadius: { value: 0 },
  borderStyle: { value: { id: 'solid', title: 'Solid' } },
  borderColor: { value: 'rgba(139,87,42,1)' },
  backgroundColor: { 
    type: 'fill', 
    value: 'transparent', 
    fill: 'transparent',
    angle: 90,
    shape: 'circle',
    positionX: 50,
    positionY: 50,
    extent: 'closest-side',
    palette: [{ offset: '0.00', color: '#4A90E2', opacity: 1 }, { offset: '1.00', color: '#9013FE', opacity: 1 }]
  },
  rotate: { value: 0 },
  animation: {},
  flipH: { value: false },
  flipV: { value: false },
  boxShadow: { active: false, value: '2px 2px 4px 0px #000000' },
  zIndex: { value: 100 },
  opacity: { value: 100 },
  overflow: { value: true },
  colorRipple: { value: 'rgba(255,255,255,1)' },
  colorHover: { value: 'rgba(0,0,0,0.2)' },
  actions: {
    left: [
      { action: 'singleClickLeft', value: {} },
      { action: 'doubleClickLeft', value: {} },
      { action: 'longClickLeft', value: {} },
      { action: 'mouseDownLeft', value: {} },
      { action: 'mouseUpLeft', value: {} },
    ],
    right: [
      { action: 'singleClickRight', value: {} },
    ]
  },
}

const ACTION = {
  colorHover: { value: 'rgba(0,0,0,0.2)' },
  colorRipple: { value: 'rgba(255,255,255,1)' },
  singleClickLeft: { value: 'TOGGLE' },
  doubleClickLeft: { value: '' },
  longClickLeft: { value: 'DEVICEMENU' },
  singleClickRight: { value: '' },
  doubleClickRight: { value: '' },
  longClickRight: { value: '' },
  mouseDownLeft: { value: '' },
  mouseUpLeft: { value: '' },
  mouseDownLeft: { value: '' },
  mouseUpLeft: { value: '' },
  zIndex: { value: 10000 },
}

const ACTION2 = {
  colorRipple: { value: 'rgba(255,255,255,1)' },
  colorHover: { value: 'rgba(0,0,0,0.2)' },
  zIndex: { value: 10000 },
  actions: {
    left: [
      { action: 'singleClickLeft', value: {} },
      { action: 'doubleClickLeft', value: {} },
      { action: 'longClickLeft', value: {} },
      { action: 'mouseDownLeft', value: {} },
      { action: 'mouseUpLeft', value: {} },
    ],
    right: [
      { action: 'singleClickRight', value: {} },
    ]
  },
}

const GROUP = {
  zIndex: { value: 100 },
  opacity: { value: 100 },
  overflow: { value: true },
}

const TEMPLATE = {
  animation: {},
  zIndex: { value: 100 },
  opacity: { value: 100 },
  overflow: { value: true },
}

const EXPAND = {
  zIndex: { value: 10000 },
}

const DEVICELOG = {
  ...BLOCK,
  widget: true,
  expand: { value: true },
  widgetlinks: {
    link: { }
  },
  data: [],
}


function getDefaultParams(type) {
  switch (type) {
    case 'rectangle':
      return RECTANGLE;
    case 'circle':
      return CIRCLE
    case 'text':
      return TEXT;
    case 'image':
      return IMAGE;
    case 'button':
      return BUTTON;
    case 'text_image':
      return TEXT_IMAGE;
    case 'group':
      return GROUP;
    case 'container':
    case 'template':
      return TEMPLATE
    case 'action':
      return ACTION;
    case 'action2':
      return ACTION2;
    case 'expand':
      return EXPAND;
    case 'devicelog':
      return DEVICELOG;
    default:
      return BLOCK;
  }
}


export default getDefaultParams;