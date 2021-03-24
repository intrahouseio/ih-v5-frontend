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
  mousebox: {
    display: 'none',
    position: 'absolute',
    background: 'rgba(33, 150, 243, 0.2)',
    zIndex: 11000,
    border: '1px solid #90caf9',
  }
}

const LEFT = [
  'singleClickLeft', 'doubleClickLeft', 'longClickLeft',
  'mouseDownLeft', 'mouseUpLeft'
];

const RIGHT = [ 'singleClickRight' ];

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

function cloneNewStructElements(list, elements, targetElements) {
  const l = [];
  const e = {};

  function group(newId, oldId, check) {
    const gl = [];
    elements[oldId].elements
      .forEach(cid => {
        const mergeElements = { ...targetElements, ...e }
        const id = getIdElement(0, elements[cid].type, mergeElements);
        e[id] = { ...elements[cid], groupId: newId };
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

    if (elements[key].type === 'group') {
      group(id, key);
    }

  });
  return { list: l, elements: e }
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
  
      core.actions.container
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
  
      core.actions.container
        .settings(
          this.props.id, this.props.prop,
          { x: { value: x }, y: { value: y }, scale: { value: s } }
        );
    }
  }

  handleMoveSheet = (e) => {
 
  }

  handleStopMoveSheet = (e, data) => {
    if (
      data.x !== this.props.settings.x.value || 
      data.y !== this.props.settings.y.value
    ) {
      core.actions.container
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

  handleAddElement = (e, type, templateId, title) => {
    this.lastDragEventTime = Date.now()
    
    const elementId = getIdElement(0, type, this.props.elements);

    const rect = this.sheet.getBoundingClientRect();
    const x = method2 ? (e.clientX - rect.left) / this.props.settings.scale.value :  (e.pageX - (rect.left * this.props.settings.scale.value)) / this.props.settings.scale.value;
    const y = method2 ? (e.clientY - rect.top) / this.props.settings.scale.value : (e.pageY - (rect.top * this.props.settings.scale.value)) / this.props.settings.scale.value;
    
    const params = getDefaultParamsElement(type);

    const data = {
      type,
      x: { value: Math.round(x * 1e2 ) / 1e2 }, 
      y: { value: Math.round(y * 1e2 ) / 1e2 },
      w: { value: 60 }, h: { value: 60 },
      w2: { value: 60 }, h2: { value: 60 },
    }

    if (type === 'template') {
      core
        .request({ method: 'get_template', params: templateId })
        .ok(res => {
          data.links = {};
          data.templateId = templateId;
          data.title = title;
          data.w = { value: res.settings.w.value }; 
          data.h = { value: res.settings.h.value };
          data.w2 = { value: res.settings.w.value }; 
          data.h2 = { value: res.settings.h.value };
          data.actions = { type: 'multi' };

          Object
            .keys(res.elements)
            .forEach(key => {
              if (res.elements[key].type === 'action') {
                data.actions[key] = { left: [], right: [] }
                LEFT.forEach(i => {
                  if (res.elements[key][i] && res.elements[key][i].value !== '') {
                    data.actions[key].left.push({ action: i, value: {} })
                  }
                });
                RIGHT.forEach(i => {
                  if (res.elements[key][i] && res.elements[key][i].value !== '') {
                    data.actions[key].right.push({ action: i, value: {} })
                  }
                });
              }
            });
          core.actions.container
            .addTemplate(
              this.props.id, this.props.prop,
              elementId, { ...params, ...data }, templateId, res,
            );
          this.props.save();
        });
    } else {
      core.actions.container
        .addElement(
          this.props.id, this.props.prop,
          elementId, { ...params, ...data },
        );
      this.props.save();
    }
  }

  handleDeleteElement = () => {
    core.actions.container
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
      core.actions.container
        .editElement(
          this.props.id, this.props.prop,
          elementId, { 
            x: { ...this.props.elements[elementId].x, value: data.x }, 
            y: { ...this.props.elements[elementId].y, value: data.y } 
          }
        );
      this.props.save();
    }
  }

  handleChangeSizeElement = (e, elementId, position, type) => {
    e.preventDefault();
    e.stopPropagation();

    const element = this.props.elements[elementId];

    if (element.type === 'group') {
      const childs = getAllElementsByGroup(element.elements, this.props.elements);
      core.actions.container
        .resizeGroupElement(
          this.props.id, this.props.prop,
          elementId, position, childs,
        );
    } else {
      core.actions.container
        .editElement(
          this.props.id, this.props.prop,
          elementId, position
        );
    }
    this.props.save();
  }

  handleClickBody = () => {
    if (!this.state.move) {
      const delta = Date.now() - this.lastDragEventTime;
      if (this.lastDragEventTime === undefined || delta > 300) {
        core.actions.container
          .clearSelects(
            this.props.id, this.props.prop,
          );
      }
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
  
            if (a && b && c && d) {
              temp.push(key)
            }
          });
          if (temp.length) {
            if (temp.length === 1) {
              core.actions.container
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
              core.actions.container
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

  handleClickElement = (e, elementId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.state.move) {
      if ((e.ctrlKey || e.metaKey) && this.props.selectType !== null && this.props.selectOne !== 'content') {
        const selects = { ...this.props.selects };

        if (this.props.selects[elementId] === undefined) {
          selects[elementId] = true;
        } else {
          delete selects[elementId];
        }

        const selectsList = Object.keys(selects);
  
        if (selectsList.length === 0) {
          core.actions.container
            .clearSelects(this.props.id, this.props.prop);
        } else if (selectsList.length === 1) {
          core.actions.container
            .select(this.props.id, this.props.prop, selectsList[0]);
        } else {
          const data = { 
            x: { value: Infinity }, 
            y: { value: Infinity }, 
            w: { value: 0 }, 
            h: { value: 0 }, 
            zIndex: { value: 0 } 
          };
    
          selectsList
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
    
          core.actions.container
            .selectMB(this.props.id, this.props.prop, selects, data);
        }
      } else {
        core.actions.container
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

    const disabled = {
      isSelect: Object.keys(this.props.selects).length === 0 || this.props.selectOne === 'content',
      isPaste: !(core.buffer.class === 'container'),
      isTemplate: this.props.selectOne ? !(this.props.selectOne && this.props.elements[this.props.selectOne] && this.props.elements[this.props.selectOne] && this.props.elements[this.props.selectOne].type === 'template') : false,
      checkCopyStyle: !(this.props.selectType === 'one' && this.props.selectOne  !== 'content'),
      checkPasteStyle: !(core.styleBuffer && this.props.selectOne !== 'content' && Object.keys(this.props.selects).length !== 0),
    }

    const commands = {
      addTemplate: ({ popupid, title }) => this.handleAddElement(e, 'template', popupid, title), 
    };

    const pos = { left: e.clientX, top: e.clientY };
    const listElemnts = [
      { id: '0', title: 'Rectangle', click: () => this.handleAddElement(e, 'rectangle') },
      { id: '1', title: 'Circle', click: () => this.handleAddElement(e, 'circle') },
      { id: '2', title: 'Text', click: () => this.handleAddElement(e, 'text') },
      { id: '3', title: 'Image', click: () => this.handleAddElement(e, 'image') },
      { id: '4', title: 'Text & Image', click: () => this.handleAddElement(e, 'text_image') },
      { id: '5', title: 'Button', click: () => this.handleAddElement(e, 'button') },
      { id: '-', type: 'divider' },
      { id: '6', title: 'Slider', click: () => this.handleAddElement(e, 'slider') },
      { id: '7', title: 'Input', click: () => this.handleAddElement(e, 'input') },
      { id: '8', title: 'Checkbox', click: () => this.handleAddElement(e, 'checkbox') },
      { id: '9', title: 'Device Settings', click: () => this.handleAddElement(e, 'devicesettings') },
      { id: '10', title: 'Device Log', click: () => this.handleAddElement(e, 'devicelog') },
      { id: '11', title: 'Charts', 
        children: [
          { id: '1', title: 'Chart Line', click: () => this.handleAddElement(e, 'chart') },
          { id: '2', title: 'Chart Multiline', click: () => this.handleAddElement(e, 'chart_multi') },
        ]
      },
      { id: '12', title: 'Log', click: () => this.handleAddElement(e, 'log') },
    ]
  
    const scheme = {
      main: [
        { id: '1', title: 'Add Element', children: listElemnts },
        { id: '2', title: 'Add Template', type: 'remote', popupid: 'vistemplate', command: 'addTemplate' },
        { id: '3', type: 'divider' },      
        { id: '4', check: 'isSelect', title: 'Group', click: this.handleClickGroupElements },
        { id: '5', check: 'isSelect', title: 'Ungroup', click: () => this.handleClickUnGroupElement(elementId) },
        { id: '6', type: 'divider' },
        { id: '7', check: 'isSelect', title: 'Copy', click: this.handleClickCopyElements },
        { id: '8', check: 'isPaste', title: 'Paste', click: () => this.handleClickPasteElements(e) },
        { id: '9', type: 'divider' },
        { id: '10', check: 'checkCopyStyle', title: 'Copy Style', click: this.handleCopyStyle},
        { id: '11', check: 'checkPasteStyle', title: 'Paste Style', click: this.handlePasteStyle },
        { id: '12', type: 'divider' },
        { id: '13', check: 'isSelect', title: 'Delete', click: () => this.handleDeleteElement(elementId) },
        { id: '14', type: 'divider' },
        { id: '15', check: 'isTemplate', title: 'Edit Template', click: this.handleClickEditTemplate },
      ]
    }

    ContextMenu.show(<Menu disabled={disabled} commands={commands} scheme={scheme} />, pos);
  }

  handleCopyStyle = () => {
    const disabled = {
      actions: true, widgetlinks: true, data: true,
      widget: true, expand: true, data: true,
      control: true, label: true, text: true,
      img: true, x: true, y: true,
      w: true, h: true, w2: true, h2: true,
      type: true,
    }

    function cloneObject(i) {
      if ((!!i) && (i.constructor === Object)) {
        Object
          .keys(i)
          .reduce((p, c) => {
            return { ...p, [c]: cloneObject(i[c]) }
          }, {});
      }
      if (Array.isArray(i)) {
        return i.map(cloneObject);
      }
      return i;
    }

    const element = this.props.elements[this.props.selectOne];

    core.styleBuffer = Object
      .keys(element)
      .reduce((p, c) => {
        if (disabled[c] || element[c].enabled) {
          return p;
        } 
        return { ...p, [c]: cloneObject(element[c]) }
      }, {});
  }

  handlePasteStyle = () => {
    core.actions.container
      .pasteStyle(
        this.props.id, this.props.prop,
        core.styleBuffer,
      );
    this.props.save();
  }


  handleClickGroupElements = () => {
    if (this.props.selectType === 'some') {
      const list = [];
      const groupId = getIdElement(0, 'group', this.props.elements);
      let x = { value: Infinity }, y = { value: Infinity }, w = { value: 0 }, h = { value: 0 };
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
      const params = getDefaultParamsElement('group');
      const groupData = { 
        x, y, 
        w: { value: w.value - x.value }, 
        h: { value: h.value - y.value }, 
        type: 'group',
        elements: list,
        ...params,
      };
      core.actions.container
        .groupElements(
          this.props.id, this.props.prop,
          groupId, groupData,
        );
      this.props.save();
    }
  }

  handleClickUnGroupElement = (elementId) => {
    const list = [];
    const data = { 
      x: { value: Infinity }, 
      y: { value: Infinity }, 
      w: { value: 0 }, 
      h: { value: 0 },
      zIndex: {},
    };
    Object
      .keys(this.props.selects)
      .forEach(key => {
        const element = this.props.elements[key];
        data.x.value = Math.min(data.x.value, element.x.value);
        data.y.value = Math.min(data.y.value, element.y.value); 
        data.w.value = Math.max(data.w.value, element.x.value + element.w.value); 
        data.h.value = Math.max(data.h.value, element.y.value + element.h.value); 
        if (element.type === 'group') {
          list.push(key);
        }
      });
    data.w.value = data.w.value - data.x.value;
    data.h.value = data.h.value - data.y.value;
    core.actions.container
      .unGroupElements(
        this.props.id, this.props.prop,
        list, data,
      );
    this.props.save();
  }

  handleClickCopyElements = () => {
    const list = [];
    let x = Infinity, y = Infinity, w = 0, h = 0;
    const elements = Object
      .keys(this.props.selects)
      .reduce((p, c) => {
        list.push(c);
        x = Math.min(x, this.props.elements[c].x.value);
        y = Math.min(y, this.props.elements[c].y.value); 
        w = Math.max(w, this.props.elements[c].x.value + this.props.elements[c].w.value); 
        h = Math.max(h, this.props.elements[c].y.value + this.props.elements[c].h.value); 
        if (this.props.elements[c].type === 'group') {
          const childs = getAllElementsByGroup(this.props.elements[c].elements, this.props.elements);
          return { ...p, ...childs, [c]: { ...this.props.elements[c] } }
        }
        return { ...p, [c]: { ...this.props.elements[c] } }
      }, {})
      
    const buffer = { list, elements, offsetX: x, offsetY: y };
    core.buffer = { class: 'container', type: null, data: buffer  };
  }

  handleClickPasteElements = (e) => {
    this.lastDragEventTime = Date.now()

    const rect = this.sheet.getBoundingClientRect();
    const x = (e.pageX - (rect.left * this.props.settings.scale.value)) / this.props.settings.scale.value // (e.clientX - rect.left) / this.props.settings.scale.value;
    const y = (e.pageY - (rect.top * this.props.settings.scale.value)) / this.props.settings.scale.value  // (e.clientY - rect.top) / this.props.settings.scale.value;

    const clone = cloneNewStructElements(core.buffer.data.list, core.buffer.data.elements, this.props.elements);
    const elements = Object
      .keys(clone.elements)
      .reduce((p, c) => {
        if (clone.list.includes(c)) {
          return { 
            ...p, 
            [c]: {
              ...clone.elements[c],
              x: { value: x + (clone.elements[c].x.value - core.buffer.data.offsetX) },
              y: { value: y + (clone.elements[c].y.value - core.buffer.data.offsetY) },
            }  
          }
        }
        return { ...p, [c]: clone.elements[c] }
      }, {})
 
    core.actions.container
      .data(
        this.props.id, this.props.prop,
        { 
          list: this.props.list.concat(clone.list),
          elements: {
            ...this.props.elements,
            ...elements,
          },
        }
      );
      core.actions.dialog
      .data(
        this.props.id, this.props.prop,
        { 
          list: this.props.list.concat(clone.list),
          elements: {
            ...this.props.elements,
            ...elements,
          },
        }
      );
    if (clone.list.length) {
      if (clone.list.length > 1) {
        const selects = clone.list.slice(1).reduce((p, c) => ({ ...p, [c]: true }), {});
        const elementId = clone.list[0];
        const data = { 
          x: { value: Infinity }, 
          y: { value: Infinity }, 
          w: { value: 0 }, 
          h: { value: 0 }, 
          zIndex: { value: 0 } 
        };
        Object
          .keys({ ...selects, [elementId]: true })
          .forEach(key => {
            const element = elements[key];
            data.x.value = Math.min(data.x.value, element.x.value);
            data.y.value = Math.min(data.y.value, element.y.value); 
            data.w.value = Math.max(data.w.value, element.x.value + element.w.value); 
            data.h.value = Math.max(data.h.value, element.y.value + element.h.value); 
            data.zIndex.value = Math.max(data.zIndex.value, element.zIndex.value); 
          });
        data.w.value = data.w.value - data.x.value;
        data.h.value = data.h.value - data.y.value;
        core.actions.container
          .data(this.props.id, this.props.prop, { selects });
        core.actions.container
          .selectSome(
            this.props.id, this.props.prop,
            elementId, data
          );
      } else {
        core.actions.container
          .select(
            this.props.id, this.props.prop,
            clone.list[0],
          );
      }
    }
    this.props.save();
  }

  handleClickEditTemplate = () => {
    const templateId = this.props.elements[this.props.selectOne].templateId;
    core.route(`vis/vistemplate/vistemplateview/${templateId}/tabVistemplateEditor`);
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
            visibility: item.visible && item.visible.value == false ? 'hidden' : 'unset',
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
    if (item.type === 'template') {
      return elemets(item.type, { mode: 'admin', item, template: this.props.templates[item.templateId] })
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
    core.actions.container
      .moveSelectContainer(
        this.props.id, this.props.prop,
        { value: data.x }, { value: data.y }
      );
    this.props.save();
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
    core.actions.container
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
                <div className="parent" style={{ width: '100%', height: '100%', background: settings.overlayColor.value }}>
                  {list.map(id => 
                    <Element 
                      key={id}
                      id={id}
                      move={this.state.move}
                      grid={settings.grid.value}
                      scale={settings.scale.value}
                      item={elements[id]}
                      select={selects[id]}
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