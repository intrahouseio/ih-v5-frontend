import React, { Component } from 'react';

import { transform } from './tools';


class Log extends Component {
  render(props = this.props) {
    return (
      <div 
        style={{
          position: 'absolute', 
          width: '100%', 
          height: '100%', 
          background: props.item.backgroundColor.value,
          border: `${props.item.borderSize.value}px ${props.item.borderStyle.value.id} ${props.item.borderColor.value}`,
          borderRadius: (Math.min(props.item.w.value, props.item.h.value) / 2 / 100) * props.item.borderRadius.value,
          opacity: props.item.opacity.value / 100,
          boxShadow: props.item.boxShadow.active ? props.item.boxShadow.value : 'unset',
          transform: transform(props.item),
          overflow: props.item.overflow && props.item.overflow.value ? 'hidden' : 'unset',
          visibility: props.item.visible && props.item.visible.value == false ? 'hidden' : 'unset',
        }}
      >
        LOG
      </div>
    );
  }
}


export default Log;