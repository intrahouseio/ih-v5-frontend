import React, { PureComponent } from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Hammer from 'hammerjs';
import shortid from 'shortid';

import core from 'core';


const styles = {
  active: {
    position: 'absolute', 
    width: '100%', 
    height: '100%', 
    border: '1px solid #F44336',
    background: 'repeating-linear-gradient(45deg, rgba(239, 83, 80, 0.2), rgba(239, 83, 80, 0.2) 10px, rgba(239, 154, 154, 0.2) 10px, rgba(239, 154, 154, 0.2) 20px)',
    opacity: 0.7
  },
  admin: {
    width: '100%', 
    height: '100%', 
  },
  user: {
    width: '100%', 
    height: '100%',
  }
}


function getParams(item, props) {
  if (item.command === 'device') {
    return { did: item.did, prop: item.prop, layoutId: props.layoutId, containerId: props.containerId || null, elementId: props.id }
  }
  return { ...item.value, id: item.id, layoutId: props.layoutId, containerId: props.containerId || null, elementId: props.id };
}


class Action2 extends PureComponent {

  componentDidMount() {
    if (this.link) {
      
      this.mc = new Hammer.Manager(this.link);

      this.mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
      this.mc.add(new Hammer.Tap({ event: 'singletap', interval: this.props.item.doubleClickLeft === '' ? 100 : 200 }));
      this.mc.add(new Hammer.Press({ event: 'press', time: 400 }));
      this.mc.add(new Hammer.Press({ event: 'pressup' }));

      this.mc.get('doubletap').recognizeWith('singletap');
      this.mc.get('singletap').requireFailure('doubletap');
    
      this.mc.on('singletap', this.handleSingleTap);
      this.mc.on('doubletap', this.handleDoubleTap);
      this.mc.on('press', this.handleLongTap);
      this.mc.on('pressup', this.handlePress);
      
    }
  }

  handleAction = (props, event, actions) => {
    Object
    .keys(actions)
    .forEach(key => {
      actions[key]
        .forEach(item => {
          if (item.action === event && item.command) {
            const command = item.command;
            if (command === 'fullscreen' || command === 'refresh' || command === 'exit' || command === 'close' ) {
              if (command === 'close') {
                core.transfer.send('close_dialog_command');
              }
            } else {
              core.tunnel.command({
                uuid: shortid.generate(),
                method: 'action',
                type:'command',
                command: item.command,
                ...getParams(item, props)
              });
            }
          }
        });
    })
  }

  handleSingleTap = () => {
    const name = 'singleClickLeft';
    this.handleAction(this.props, name, this.props.item.actions);
  }

  handleDoubleTap = () => {
    const name = 'doubleClickLeft';
    this.handleAction(this.props, name, this.props.item.actions);
  }

  handleLongTap = () => {
    const name = 'longClickLeft';
    this.handleAction(this.props, name, this.props.item.actions);
  }

  handlePressDown = () => {
    const name = 'mouseDownLeft';
    this.handleAction(this.props, name, this.props.item.actions);
  }

  handlePressUp = () => {
    const name = 'mouseUpLeft';
    this.handleAction(this.props, name, this.props.item.actions);
  }

  handlePress = (e) => {
    if (e.isFinal) {
      this.handlePressUp(e);
    } else {
      this.handlePressDown(e);
    }
  }

  handleContextMenu = (e) => {
    e.preventDefault();
    
    const name = 'singleClickRight';
    this.handleAction(this.props, name, this.props.item.actions);
  }

  linked = (e) => {
    this.link = e;
  } 

  render() {
    if (this.props.mode === 'user') {
      return (
        <ButtonBase 
          ref={this.linked} 
          centerRipple 
          style={{ ...styles.user, color: this.props.item.colorRipple.value }}
          onContextMenu={this.handleContextMenu}
          onFocusVisible={() => {}}
        >
        </ButtonBase>
      )
    }
    if (this.props.mode === 'admin') {
      return (
        <div style={styles.admin} />
      )
    }
    return <div style={styles.active} />
  }
}


export default Action2;