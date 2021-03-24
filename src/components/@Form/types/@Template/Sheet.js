import React, { Component } from 'react';
import core from 'core';

import { ContextMenu } from "@blueprintjs/core";

import Paper from '@material-ui/core/Paper';
import Draggable from 'libs/Draggable';

import Element from './Element';
import Menu from 'components/Menu';

import elemets from 'components/@Elements';
import getDefaultParamsElement from 'components/@Elements/default';

const method2 = window.document.body.style.zoom === undefined;

const styles = {
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    // perspective: 1000,
    // WebkitPerspective: 1000,
  },
  sheet: {
    transformOrigin: '0 0',
    position: 'absolute',
    borderRadius: 0,
    backgroundSize: '50px 50px',
    overflow: 'hidden',
    background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==) center center',
    // backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQogPGxpbmUgeDE9IjEwMCIgeTE9IjAiIHgyPSIxMDAiIHkyPSIxMDAiIHN0cm9rZT0iIzc1NzU3NSIgLz4NCiA8bGluZSB4MT0iMCIgeTE9IjEwMCIgeDI9IjEwMCIgeTI9IjEwMCIgc3Ryb2tlPSIjNzU3NTc1IiAvPg0KPC9zdmc+')",
  },
  hiddenZone: {
    position: 'relative',
    width: '100%',
    height: '100%',
    zIndex: 9999,
    outline: '2px solid rgba(255, 255, 255, 0.8)',
  },
  mousebox: {
    display: 'none',
    position: 'absolute',
    background: 'rgba(33, 150, 243, 0.2)',
    zIndex: 11000,
    border: '1px solid #90caf9',
  }
}


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getAllElementsByGroup(list, elements) {
  return list
    .reduce((p, c) => {
      if (elements[c].type === 'group') {
        return {
          ...p,
          [c]: { ...elements[c] },
          ...getAllElementsByGroup(elements[c].elements, elements)
        };
      }
      return {
        ...p,
        [c]: { ...elements[c] },
      };
    }, {});
}

function cloneNewStructElements(list, elements, targetElements, state) {
  const l = [];
  const e = {};
  const o = {};


  function group(newId, oldId, check) {
    const gl = [];
    elements[oldId].elements
      .forEach(cid => {
        const mergeElements = { ...targetElements, ...e }
        const id = getIdElement(0, elements[cid].type, mergeElements);
        e[id] = { ...elements[cid], groupId: newId };
        o[id] = cid;
        gl.push(id)
        if (elements[cid].type === 'group') {
          group(id, cid);
        }
      });
      e[newId].elements = gl;
  }

  list.forEach(key => {
    const mergeElements = { ...targetElements, ...e }
    const id = mergeElements[key] === undefined ? key : getIdElement(0, targetElements[key].type, mergeElements);

    l.push(id);
    e[id] = { ...elements[key] };
    o[id] = key;

    if (elements[key].type === 'group') {
      group(id, key);
    }

  });
  return { list: l, elements: e, old: o }
}

function getIdElement(index, prefix, elements) {
  if (elements[`${prefix}_${index + 1}`] === undefined) {
    return `${prefix}_${index + 1}`;
  }
  return getIdElement(index + 1, prefix, elements);
}


class Sheet extends Component {
  state = { move: false }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    core.cache.functions = {};
    this.dragSelectContainer = null;
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyUp = (e) => {
    if (e.keyCode == '32') {
      document.body.style.cursor = 'auto';
      this.setState({ move: false });
    }
  }
  
  handleKeyDown = (e) => {
    if (this.state.move === false && e.keyCode == '32') {
      document.body.style.cursor = 'grab'
      this.setState({ move: true });
    }
  }

  handleMouseUpBody = (e) => {
    if (!(e.ctrlKey || e.metaKey)) {
      if (e.button === 0) {
        if (this.mbstart) {
          this.lastDragEventTime = Date.now();
          
          const temp = [];
    
          const s = this.props.settings.scale.value;
          
          const x = (this.mbx - (this.props.settings.x.value * s)) / s;
          const y = (this.mby - (this.props.settings.y.value * s)) / s;
          const w = x + (this.mbw / s);
          const h = y + (this.mbh / s);
  
          this.props.list.forEach(key => {
            const item = this.props.elements[key]
  
            const a = x <= item.x.value;
            const b = y <= item.y.value;
            const c = w >= (item.x.value + item.w.value)
            const d = h >= (item.y.value + item.h.value)
  
     
            if (this.props.selectToolbar === 'events') {
              if (a && b && c && d && item.type === 'action') {
                temp.push(key)
              }
            } else {
              if (a && b && c && d && item.type !== 'action') {
                temp.push(key)
              }
            }
          });
          if (temp.length) {
            if (temp.length === 1) {
              core.actions.template
                .select(this.props.id, this.props.prop, temp[0]);
            } else {
              const data = { 
                x: { value: Infinity }, 
                y: { value: Infinity }, 
                w: { value: 0 }, 
                h: { value: 0 }, 
                zIndex: { value: 0 } 
              };
                temp
                  .forEach(key => {
                    const element = this.props.elements[key];
                    data.x.value = Math.min(data.x.value, element.x.value);
                    data.y.value = Math.min(data.y.value, element.y.value); 
                    data.w.value = Math.max(data.w.value, element.x.value + element.w.value); 
                    data.h.value = Math.max(data.h.value, element.y.value + element.h.value); 
                    data.zIndex.value = Math.max(data.zIndex.value, element.zIndex.value); 
                  });
              data.w.value = data.w.value - data.x.value;
              data.h.value = data.h.value - data.y.value;
              core.actions.template
                .selectMB(
                  this.props.id, this.props.prop,
                  temp.reduce((p, c) => ({ ...p, [c]: true }), {}), data
                );
            }
          }
        } else {
          this.handleClickBody();
        }
    
        this.body.removeEventListener('mousemove', this.handleMouseMove);
    
        this.mousebox.style.display  = 'none';
        this.mousebox.style.top = 0 + 'px';
        this.mousebox.style.left = 0 + 'px';
        this.mousebox.style.height = 0 + 'px';
        this.mousebox.style.width = 0 + 'px';
    
        this.mbstart = false;
    
        this.mbx = 0;
        this.mby = 0;
        this.mbw = 0;
        this.mbh = 0;
      }
    }
  }

  handleMouseDown = (e) => {
    if (!(e.ctrlKey || e.metaKey)) {
      if (e.button === 0) {
        if (!this.state.move) {
          const offset = this.body.getBoundingClientRect();
        
          this.mbinitx = e.pageX - offset.left;
          this.mbinity = e.pageY - offset.top;
          
          this.body.addEventListener('mousemove', this.handleMouseMove)
        }
      }
    }
  }

  handleMouseMove = (e) => {
    const offset = this.body.getBoundingClientRect();
    
    const px = e.pageX - offset.left;
    const py = e.pageY - offset.top;
    
    this.mbx = this.mbinitx < px ? this.mbinitx : px;
    this.mby = this.mbinity < py ? this.mbinity : py;
    this.mbw = this.mbinitx < px ? px - this.mbinitx : this.mbinitx - px;
    this.mbh = this.mbinity < py ? py - this.mbinity : this.mbinity - py;

    if (!this.mbstart && (this.mbw > 8 || this.mbh > 8)) {
      this.mbstart = true
      this.mousebox.style.display  = 'block';
      this.mousebox.style.top = this.mbinity + 'px';
      this.mousebox.style.left = this.mbinitx + 'px';
      this.mousebox.style.height = 0 + 'px';
      this.mousebox.style.width = 0 + 'px';
    }

    if (this.mbstart) {
      this.mousebox.style.top = this.mby + 'px';
      this.mousebox.style.left = this.mbx + 'px';
      this.mousebox.style.height = this.mbh + 'px';
      this.mousebox.style.width = this.mbw + 'px';
    }
  }

  handleMouseUpContainer = (e) => {

  }

  handleMouseDownContainer = (e) => {

  }

  handleMouseWhellContainer = (e) => {
    if (e.ctrlKey || e.metaKey) {
      const isTouchPad = e.nativeEvent.wheelDeltaY ? 
      e.nativeEvent.wheelDeltaY === -3 * e.nativeEvent.deltaY : e.nativeEvent.deltaMode === 0;
  
      const offset = this.container.getBoundingClientRect();
  
      let x = this.props.settings.x.value;
      let y = this.props.settings.y.value;
      let s = this.props.settings.scale.value;
  
      const px = e.pageX - offset.left;
      const py = e.pageY - offset.top;
  
      const tx = (px - (x * s)) / s;
      const ty = (py - (y * s)) / s;
  
      if (isTouchPad) {
        if (e.deltaY > 0) {
          s -= (e.deltaY * 1 / 450)
        } else {
          s += (e.deltaY * -1 / 450)
        }
      } else {
        s += Math.max(-1, Math.min(1, e.deltaY)) * -0.1 * s;
      } 
  
      s = Math.round(s * 1e2 ) / 1e2;
  
      if (s > 8) {
        s = 8;
      }
      if (s < 0.1 ) {
        s = 0.1;
      }
    
      x = Math.round((-tx * s + px) / s)
      y = Math.round((-ty * s + py) / s)
  
      core.actions.template
        .settings(
          this.props.id, this.props.prop,
          { x: { value: x }, y: { value: y }, scale: { value: s } }
        );
    }
  }

  handleMouseWhellContainer2 = (e) => {
    if (e.ctrlKey || e.metaKey) {
      const isTouchPad = e.nativeEvent.wheelDeltaY ? 
      e.nativeEvent.wheelDeltaY === -3 * e.nativeEvent.deltaY : e.nativeEvent.deltaMode === 0;
  
      const offset = this.container.getBoundingClientRect();
  
      let x = this.props.settings.x.value;
      let y = this.props.settings.y.value;
      let s = this.props.settings.scale.value;
  
      const px = e.pageX - offset.left;
      const py = e.pageY - offset.top;
  
      const tx = (px - x) / s;
      const ty = (py - y) / s;
  
      if (isTouchPad) {
        if (e.deltaY > 0) {
          s -= (e.deltaY * 1 / 450)
        } else {
          s += (e.deltaY * -1 / 450)
        }
      } else {
        s += Math.max(-1, Math.min(1, e.deltaY)) * -0.1 * s;
      }
  
      s = Math.round(s * 1e2 ) / 1e2;
      
      if (s > 8) {
        s = 8;
      }
      if (s < 0.1 ) {
        s = 0.1;
      }
  
      x = -tx * s + px
      y = -ty * s + py
  
      core.actions.template
        .settings(
          this.props.id, this.props.prop,
          { x: { value: x }, y: { value: y }, scale: { value: s } }
        );
    }
  }

  handleClickSheet = (e) => {

  }

  handleMoveSheet = (e) => {
 
  }

  handleStopMoveSheet = (e, data) => {
    if (
      data.x !== this.props.settings.x.value || 
      data.y !== this.props.settings.y.value
    ) {
      core.actions.template
        .settings(
          this.props.id, this.props.prop,
          { x: { value: data.x }, y: { value: data.y } }
        );
      this.props.save();
    }

  }

  handleStartMoveElement = (e, elementId, data) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleAddElement = (e, type) => {
    this.lastDragEventTime = Date.now()

    const elementId = getIdElement(0, type, this.props.elements);
    const rect = this.sheet.getBoundingClientRect();
    
    const x = method2 ? (e.clientX - rect.left) / this.props.settings.scale.value :  (e.pageX - (rect.left * this.props.settings.scale.value)) / this.props.settings.scale.value;
    const y = method2 ? (e.clientY - rect.top) / this.props.settings.scale.value : (e.pageY - (rect.top * this.props.settings.scale.value)) / this.props.settings.scale.value;
    
    const defaultData = getDefaultParamsElement(type);

    const data = {
      type,
      x: { value: Math.round(x * 1e2 ) / 1e2 }, 
      y: { value: Math.round(y * 1e2 ) / 1e2 },
      w: { value: 60 }, h: { value: 60 },
      w2: { value: 60 }, h2: { value: 60 },
      ...defaultData
    }

    const masterData = {
      x: { value: Math.round(x * 1e2 ) / 1e2 }, 
      y: { value: Math.round(y * 1e2 ) / 1e2 },
      w: { value: 60 }, h: { value: 60 },
      w2: { value: 60 }, h2: { value: 60 },
      ...defaultData,
    }
    
    core.actions.template
      .addElement(
        this.props.id, this.props.prop,
        elementId, data, masterData,
      );
    this.props.save();
  }

  handleClickCopyElements = () => {
    const list = [];
    const store = core.store.getState().apppage.data[this.props.id][this.props.prop];
    let x = Infinity, y = Infinity, w = 0, h = 0;
    const elements = Object
      .keys(this.props.selects)
      .reduce((p, c) => {
        list.push(c);
        x = Math.min(x, this.props.elements[c].x);
        y = Math.min(y, this.props.elements[c].y); 
        w = Math.max(w, this.props.elements[c].x + this.props.elements[c].w); 
        h = Math.max(h, this.props.elements[c].y + this.props.elements[c].h); 
        if (this.props.elements[c].type === 'group') {
          const childs = getAllElementsByGroup(this.props.elements[c].elements, this.props.elements);
          return { ...p, ...childs, [c]: { ...this.props.elements[c] } }
        }
        return { ...p, [c]: { ...this.props.elements[c] } }
      }, {})
    const buffer = { list, elements, offsetX: x, offsetY: y, state: store.state };
    core.buffer = { class: 'template', type: null, data: buffer  };
  }

  handleClickPasteElements = (e) => {
    this.lastDragEventTime = Date.now()

    const store = core.store.getState().apppage.data[this.props.id][this.props.prop];
    const rect = this.sheet.getBoundingClientRect();
    const x = (e.pageX - (rect.left * this.props.settings.scale)) / this.props.settings.scale // (e.clientX - rect.left) / this.props.settings.scale;
    const y = (e.pageY - (rect.top * this.props.settings.scale)) / this.props.settings.scale  // (e.clientY - rect.top) / this.props.settings.scale;

    const masterData = {}

    const clone = cloneNewStructElements(core.buffer.data.list, core.buffer.data.elements, this.props.elements, core.buffer.data.state);
    const elements = Object
      .keys(clone.elements)
      .reduce((p, c) => {
        const defaultData = getDefaultParamsElement(clone.elements[c].type);
        masterData[c] = Object
          .keys(defaultData)
          .reduce((p2, c2) => {
            if (clone.elements[c][c2] !== undefined) {
              return { ...p2, [c2]: clone.elements[c][c2] }
            }
            return { ...p2, [c2]: defaultData[c2] }
          }, {})
        if (clone.list.includes(c)) {
          return { 
            ...p, 
            [c]: {
              ...clone.elements[c],
              x: x + (clone.elements[c].x - core.buffer.data.offsetX),
              y: y + (clone.elements[c].y - core.buffer.data.offsetY),
            }  
          }
        }
        return { ...p, [c]: clone.elements[c] }
      }, {})

    core.actions.template
      .pasteElement(
        this.props.id, this.props.prop,
        clone.list, elements, core.buffer.data.state, masterData, 
      );
    
  }

  handleDeleteElement = () => {
    core.actions.template
      .deleteElement(this.props.id, this.props.prop);
    this.props.save();
  }

  handleMoveElement = (e, elementId, data) => {

  }

  handleStopMoveElement = (e, elementId, data) => {
    e.preventDefault();
    e.stopPropagation();

    this.lastDragEventTime = Date.now()
    
    if (
      data.x !== this.props.elements[elementId].x.value || 
      data.y !== this.props.elements[elementId].y.value
    ) {
      const stateId = this.props.selectState;
      const toolbar = this.props.selectToolbar;
      
      if (toolbar === 'tree' || toolbar === 'events') {
       core.actions.template
         .moveElementMaster(
           this.props.id, this.props.prop,
           elementId, { 
             x: { ...this.props.elements[elementId].x, value: data.x }, 
             y: { ...this.props.elements[elementId].y, value: data.y } 
            }
         );
      }
   
      if (toolbar === 'vars' && stateId !== 'master') {
       core.actions.template
         .moveElementState(
           this.props.id, this.props.prop,
           elementId, { x: { value: data.x }, y: { value: data.y } }
         );
      }
      this.props.save();
    }
  }

  handleChangeSizeElement = (e, elementId, position, type) => {
    e.preventDefault();
    e.stopPropagation();

    const stateId = this.props.selectState;
    const toolbar = this.props.selectToolbar;
    const element = this.props.elements[elementId];

    if (toolbar === 'tree' || toolbar === 'events') {
      core.actions.template
        .moveElementMaster(
          this.props.id, this.props.prop,
          elementId, position
        );
     }
  
     if (toolbar === 'vars' && stateId !== 'master') {
      core.actions.template
        .moveElementState(
          this.props.id, this.props.prop,
          elementId, position
        );
     }

    this.props.save();
    /* if (element.type === 'group') {
      const childs = getAllElementsByGroup(element.elements, this.props.elements);
      core.actions.template
        .resizeGroupElement(
          this.props.id, this.props.prop,
          elementId, position, childs,
        );
    } */
  }

  handleClickElement = (e, elementId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.state.move) {
      if ((e.ctrlKey || e.metaKey) && this.props.selectType !== null && this.props.selectOne !== 'content') {
        if (this.props.selects[elementId] === undefined) {
          const data = { 
            x: { value: Infinity }, 
            y: { value: Infinity }, 
            w: { value: 0 }, 
            h: { value: 0 }, 
            zIndex: { value: 0 } 
          };
          Object
            .keys({ ...this.props.selects, [elementId]: true })
            .forEach(key => {
              const element = this.props.elements[key];
              data.x.value = Math.min(data.x.value, element.x.value);
              data.y.value = Math.min(data.y.value, element.y.value); 
              data.w.value = Math.max(data.w.value, element.x.value + element.w.value); 
              data.h.value = Math.max(data.h.value, element.y.value + element.h.value); 
              data.zIndex.value = Math.max(data.zIndex.value, element.zIndex.value); 
            });
          data.w.value = data.w.value - data.x.value;
          data.h.value = data.h.value - data.y.value;
          core.actions.template
            .selectSome(
              this.props.id, this.props.prop,
              elementId, data
            );
        }
      } else {
        core.actions.template
          .select(
            this.props.id, this.props.prop,
            elementId
          );
      }
    }
  }

  handleContextMenuElement = (e, elementId) => {
    e.preventDefault();
    e.stopPropagation();

    e.persist();
    const store = core.store.getState().apppage.data[this.props.id][this.props.prop];
    const toolbar = store.mode;

    const disabled = {
      '1': toolbar === 'vars',
      'isSelect': true, // (toolbar === 'vars' || toolbar === 'events') || Object.keys(this.props.selects).length === 0,
      'isPaste': true, // (toolbar === 'vars' || toolbar === 'events') || !(core.buffer.class === 'template'),
      '4': true, // (toolbar === 'vars' || toolbar === 'events') || Object.keys(this.props.selects).length === 0,
      '5': toolbar === 'vars' || Object.keys(this.props.selects).length === 0,
    }
    const pos = { left: e.clientX, top: e.clientY };
    const list = toolbar === 'events'? [
      { id: '0', title: 'Action Zone', click: () => this.handleAddElement(e, 'action') },
    ] : [
      { id: '0', title: 'Rectangle', click: () => this.handleAddElement(e, 'rectangle') },
      { id: '1', title: 'Circle', click: () => this.handleAddElement(e, 'circle') },
      { id: '2', title: 'Text', click: () => this.handleAddElement(e, 'text') },
      { id: '3', title: 'Image', click: () => this.handleAddElement(e, 'image') },
      { id: '4', title: 'Text & Image', click: () => this.handleAddElement(e, 'text_image') },
    ]
    const scheme = {
      main: [
        { id: '0', check: '1', title: 'Add Element', children: list },
        { id: '-', type: 'divider' },
        { id: '1', check: '4', title: 'Group', click: this.handleClickGroupElements },
        { id: '2', check: '4', title: 'Ungroup', click: () => this.handleClickUnGroupElement(elementId) },
        { id: '3', type: 'divider' },
        { id: '4', check: 'isSelect', title: 'Copy', click: this.handleClickCopyElements },
        { id: '5', check: 'isPaste', title: 'Paste', click: () => this.handleClickPasteElements(e) },
        { id: '6', type: 'divider' },
        { id: '7', check: '5', title: 'Delete', click: () => this.handleDeleteElement(elementId) }
      ]
    }

    ContextMenu.show(<Menu disabled={disabled} scheme={scheme} />, pos);
  }

  handleClickGroupElements = () => {
    if (this.props.selectType === 'some') {
      const list = [];
      const groupId = getIdElement(0, 'group', this.props.elements);
      let x = Infinity, y = Infinity, w = 0, h = 0;
      Object
        .keys(this.props.elements)
        .forEach(key => {
          if (this.props.selects[key]) {
            const element = this.props.elements[key];
            x.value = Math.min(x.value, element.x.value);
            y.value = Math.min(y.value, element.y.value); 
            w.value = Math.max(w.value, element.x.value + element.w.value); 
            h.value = Math.max(h.value, element.y.value + element.h.value); 
            list.push(key) 
          }
        });
      const defaultData = getDefaultParamsElement('group');
      const groupData = { 
        x, y, 
        w: w - x, 
        h: h - y, 
        type: 'group',
        elements: list,
        ...defaultData,
      };
      const masterData = {
        x, y, 
        w: w - x, 
        h: h - y, 
        ...defaultData,
      }
      core.actions.template
        .groupElements(
          this.props.id, this.props.prop,
          groupId, groupData, masterData,
        );
    }
  }

  handleClickUnGroupElement = (elementId) => {
    const list = [];
    const data = { x: Infinity, y: Infinity, w: 0, h: 0 };
    Object
      .keys(this.props.selects)
      .forEach(key => {
        const element = this.props.elements[key];
        data.x = Math.min(data.x, element.x);
        data.y = Math.min(data.y, element.y); 
        data.w = Math.max(data.w, element.x + element.w); 
        data.h = Math.max(data.h, element.y + element.h); 
        if (element.type === 'group') {
          list.push(key);
        }
      });
    data.w = data.w - data.x;
    data.h = data.h - data.y;

    core.actions.template
      .unGroupElements(
        this.props.id, this.props.prop,
        list, data,
      );
  }

  handleRenderElement = (elementId, item) => {
    if (item.type === 'group') {
      return (
        <div
          style={{
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            outline: item.groupId ? 'unset' : `1px dashed #6d7882`,
            opacity: item.opacity.value / 100,
            animation: item.animation && item.animation.active ? item.animation.value : 'unset',
            overflow: item.overflow && item.overflow.value ? 'hidden' : 'unset',
          }}
        >
          {item.elements.map(id => 
            <Element 
              key={id}
              id={id}
              isGroup
              move={this.state.move}
              grid={this.props.settings.grid.value}
              scale={this.props.settings.scale.value}
              item={this.props.elements[id]}
              select={this.props.selects[id]}
              selectType={this.props.selectType}  
              onStartMove={this.handleStartMoveElement}
              onMove={this.handleMoveElement}
              onStopMove={this.handleStopMoveElement}
              onChangeSize={this.handleChangeSizeElement}
              onClick={this.handleClickElement}
              onContextMenu={this.handleContextMenuElement} 
              onRenderElement={this.handleRenderElement}
            />
          )}
        </div>
      )
    }
    return elemets(item.type, { item })
  }

  handleStartMoveSelectContainer = (e, elementId, data) => {
    e.preventDefault();
    e.stopPropagation();
    
  }

  handleMoveSelectContainer = (e, elementId, data) => {
    if (!this.dragSelectContainer) {
      this.dragSelectContainer = true;
    }
    const x = Math.round(data.x / this.props.settings.grid.value) * this.props.settings.grid.value;
    const y = Math.round(data.y / this.props.settings.grid.value) * this.props.settings.grid.value;

    core.actions.container
      .moveSelectContainer(
        this.props.id, this.props.prop,
        { value: x }, { value: y }
      );
  }

  handleStopMoveSelectContainer = (e, elementId, data) => {
    core.actions.template
      .moveSelectContainer(
        this.props.id, this.props.prop,
        { value: data.x }, { value: data.y }
      );
    this.props.save();
  }

  handleClickBody = (e) => {
    if (!this.state.move) {
      const delta = Date.now() - this.lastDragEventTime;
      if (this.lastDragEventTime === undefined || delta > 300) {
        console.log('!')
        core.actions.template
        .clearSelects(this.props.id, this.props.prop);
      }
    }
  }

  handleClickSelectContainer = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (this.dragSelectContainer) {
      this.dragSelectContainer = null;
    } else {
      if ((e.ctrlKey || e.metaKey)) {
        const elements = window.document.elementsFromPoint(e.clientX, e.clientY);
        let elementId = null;
        
        elements.forEach(i => {
          const attribute = i.getAttribute('elementid');
         
          if (elementId === null && attribute && attribute !== 'select') {
            if (this.props.elements[attribute].groupId) {
              elementId = this.props.elements[attribute].groupId;
            } else {
              elementId = attribute;
            }
          }
        });
    
        if (elementId) {
          this.handleClickElement(e, elementId)
        }
      }
    }
  }

  handleChangeSizeSelectContainer = (e, elementId, position) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.dragSelectContainer) {
      this.dragSelectContainer = true;
    }

    const childs = getAllElementsByGroup(Object.keys(this.props.selects), this.props.elements)
    core.actions.template
      .resizeSelectContainer(
        this.props.id, this.props.prop,
        position, childs,
      );
    this.props.save();
  }

  handleRenderContentSelectContainer = () => {
    return null;
  }

  handleRenderSelectContainer = () => {
    if (this.props.selectType === 'some') {
      return (
        <Element 
          key="select"
          id="select"
          select
          stopevents={!this.state.move}
          move={this.state.move}
          grid={this.props.settings.grid.value}
          scale={this.props.settings.scale.value}
          item={this.props.selectContainer}
          onStartMove={this.handleStartMoveSelectContainer}
          onMove={this.handleMoveSelectContainer}
          onStopMove={this.handleStopMoveSelectContainer}
          onChangeSize={this.handleChangeSizeSelectContainer}
          onClick={this.handleClickSelectContainer}
          onContextMenu={this.handleContextMenuElement} 
          onRenderElement={this.handleRenderContentSelectContainer}
        />
      )
    }
    return null;
  }

  handleClicHiddenZone = (e) => {
    e.preventDefault();
    e.stopPropagation();

    core.actions.template
      .clearSelects(this.props.id, this.props.prop);
  }

  handleRenderHiddenZone = () => {
    if (this.props.selectToolbar === 'events') {
      const backgroundColor = this.props.settings.devBackgroundColor2 ? this.props.settings.devBackgroundColor2.value : 'rgba(255,255,255,0.8)';
      return <div  style={{ ...styles.hiddenZone, backgroundColor }} />
    }
    return null;
  }
  
  linkBody = (e) => {
    this.body = e;
  } 
  
  linkContainer = (e) => {
    this.container = e;
  } 

  linkSheet = (e) => {
    this.sheet = e;
  } 

  linkMousebox = (e) => {
    this.mousebox = e;
  }

  render({ selects, settings, list, elements } = this.props) {
    const type = settings.backgroundColor.type;
    const color = type === 'fill' ? '' : ', ' + settings.backgroundColor.value;
    const src =  settings.backgroundImage.value.indexOf('://') !== -1 ? settings.backgroundImage.value : '/images/' + settings.backgroundImage.value
    const devcolor = settings.devBackgroundColor ? settings.devBackgroundColor.value : 'rgba(0,0,0,0.25)';
    return (
      <div style={styles.root} ref={this.linkBody} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUpBody}>
        <div ref={this.linkMousebox} style={styles.mousebox} />
        <div 
          ref={this.linkContainer}
          style={styles.container}
          onMouseUp={this.handleMouseUpContainer}
          onMouseDown={this.handleMouseDownContainer}
          onWheel={method2 ? this.handleMouseWhellContainer2 : this.handleMouseWhellContainer}
        >
          <Draggable
            disabled={!this.state.move}
            grid={[1, 1]}
            transform={method2}
            scale={method2 ? 1 : settings.scale.value} 
            position={{ x: settings.x.value, y: settings.y.value, scale: settings.scale.value }}
            onDrag={this.handleMoveSheet}
            onStop={this.handleStopMoveSheet}
          >
            <Paper
              ref={this.linkSheet}
              elevation={2} 
              style={{ 
                ...styles.sheet, 
                width: settings.w.value, 
                height: settings.h.value,
                backgroundColor: devcolor,
              }}
              onClick={(e) => this.handleClickSheet(e)}
              onContextMenu={(e) => this.handleContextMenuElement(e, null)}
            >
              <div style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: settings.backgroundColor.value,
                backgroundImage:  `url(${encodeURI(src)})${color}`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
              }}>
                <div className="parent2" style={{ width: '100%', height: '100%', background: settings.overlayColor.value }}>
                  {list.map(id => 
                    <Element 
                      key={id}
                      id={id}
                      move={this.state.move}
                      grid={settings.grid.value}
                      scale={settings.scale.value}
                      item={elements[id]}
                      select={selects[id]}
                      selectToolbar={this.props.selectToolbar}
                      selectType={this.props.selectType} 
                      onStartMove={this.handleStartMoveElement}
                      onMove={this.handleMoveElement}
                      onStopMove={this.handleStopMoveElement}
                      onChangeSize={this.handleChangeSizeElement}
                      onClick={this.handleClickElement}
                      onContextMenu={this.handleContextMenuElement} 
                      onRenderElement={this.handleRenderElement}
                    />
                  )}
                  {this.handleRenderSelectContainer()}
                  {this.handleRenderHiddenZone()}
                </div>
              </div>
            </Paper>
          </Draggable>
        </div>
      </div>
    )
  }
}


export default Sheet