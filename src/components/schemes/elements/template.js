import background from './background';
import border from './border';
import decoration from './decoration';

const template = {
  main: [
    ...background, 
    ...border, 
    ...decoration
  ],
  move: [
    { 
      title: 'Позиция', 
      prop: 'position', 
      type: 'divider',
    },
    { 
      title: 'X', 
      prop: 'x', 
      type: 'number',
    },
    { 
      title: 'Y', 
      prop: 'y', 
      type: 'number',
    },
    { 
      title: 'Ширина', 
      prop: 'w', 
      type: 'number',
    },
    { 
      title: 'Высота', 
      prop: 'h', 
      type: 'number',
    },
    { 
      title: 'Положение элемента', 
      prop: 'zIndex', 
      type: 'number',
      min: -100,
      max: 5000,
    },
    { 
      title: 'Преобразовать', 
      prop: 'transform', 
      type: 'divider',
    },
    { 
      title: 'Отразить по горизонтале', 
      prop: 'flipH', 
      type: 'cb',
    },
    { 
      title: 'Отразить по вертикали', 
      prop: 'flipV', 
      type: 'cb',
    },
    { 
      title: 'Обрезать', 
      prop: 'overflow', 
      type: 'cb',
    },
    { 
      title: 'Повернуть', 
      prop: 'rotate', 
      type: 'number',
      step: 10,
      min: 0,
      max: 360,
    },
  ],
}


export default template;