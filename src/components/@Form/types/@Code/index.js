import React, { PureComponent } from 'react';
import core from 'core';

import AceEditor from 'react-ace';
import ReactResizeDetector from 'react-resize-detector';

import { 
  MosaicWithoutDragDropContext as Mosaic, MosaicWindow, 
  RemoveButton, ExpandButton, Separator, 
} from 'react-mosaic-component';

import { Button } from "@blueprintjs/core";


import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-text';

import 'react-mosaic-component/react-mosaic-component.css';
import './code.css';

const styles = {
  root: {
    width: '100%',
    height: '100%',
  }
}


const scheme_old = {
  direction: 'column',
  first: {
    direction: 'row',
    first: 'code',
    second: 'inspector',
    splitPercentage: 75,
  },
  second: {
    direction: 'row',
    first: 'console',
    second: 'controls',
    splitPercentage: 75,
  },
  splitPercentage: 70,
}

const scheme = {
  direction: 'column',
  first: 'code',
  second: 'console',
  splitPercentage: 70,
}

const TITLES = {
  code: 'Script',
  console: 'Console',
  toolbar: 'Toolbar',
  controls: 'Controls',
  inspector: 'Inspector'
}

const EMPTY_ARRAY = [];


class Code extends PureComponent {
  state = { consoleValue: '', consoleAutoScroll: true }

  componentDidMount() {
    this.nodeid = this.props.route.nodeid;
    core.tunnel
      .sub({
        method: 'sub',
        type: 'debug',
        id: 'scene',
        nodeid: this.nodeid,
        uuid: `scene_${this.nodeid}`
      }, this.handleRealTimeDataConsole);
  }

  componentWillUnmount() {
    core.tunnel
      .unsub({
        method: 'unsub',
        type: 'debug',
        id: 'scene',
        nodeid: this.nodeid,
        uuid: `scene_${this.nodeid}`
      }, this.handleRealTimeDataConsole);
    this.nodeid = null;
  }


  handleRealTimeDataConsole = (value) => {
    this.setState(state => {
      if (this.state.consoleValue.length > 50 * 5000) {
        return { 
          ...state, 
          consoleValue: state.consoleValue
            .split('\r\n')
            .slice(1500)
            .join('\r\n') + value + '\r\n' 
        };
      }
      return { ...state, consoleValue: state.consoleValue + value + '\r\n' };
    }, () => {
      if (this.console && this.state.consoleAutoScroll) {
        const index = this.console.editor.session.getLength() - 1;
        this.console.editor.scrollToRow(index);
      }
    });
  }

  handleChangeAutoScroll = () => {
    this.setState(state => {
      return { ...state, consoleAutoScroll: !state.consoleAutoScroll };
    });
  }

  handleClearConsole = () => {
    this.setState(state => {
      return { ...state, consoleValue: '' };
    });
  }

  linkConsole = (e) => {
    this.console = e;
  }

  renderButtons = (id) => {
    if (id === 'code') {
      return (
        [
          <div data-tip="Expand" key="expand">
            <ExpandButton />
          </div>
        ]
      )
    }
    if (id === 'console') {
      return (
        [
          this.state.consoleAutoScroll ? 
            <Button key="1" icon="git-commit" minimal onClick={this.handleChangeAutoScroll} /> : 
            <Button key="2" icon="bring-data" minimal onClick={this.handleChangeAutoScroll} />,
          <Button key="3" icon="trash" minimal onClick={this.handleClearConsole} />,
          <Separator key="4" />,
          <div  key="5" data-tip="Expand" key="expand">
            <ExpandButton />
          </div>,
          <div key="6" data-tip="Remove" key="remove">
            <RemoveButton />
          </div>,
        ]
      )
    }
    return (
      [
        <div data-tip="Expand" key="expand">
          <ExpandButton />
        </div>,
        <div data-tip="Remove" key="remove">
          <RemoveButton />
        </div>,
      ]
    )
  }

  renderComponent = (id) => {
    const { props, state } = this;
    
    if (id === 'code') {
      return (
        <ReactResizeDetector key={id} handleWidth handleHeight>
          {({ width, height }) => 
            <AceEditor
              mode="javascript"
              theme="tomorrow"
              width={width || '100%'}
              height={height || '100%'}
              name={id}
              fontSize={14}
              value={props.data}
              setOptions={{ 
                useWorker: false,
                tabSize: 2,
                useSoftTabs: true
              }}
              onChange={(value) => props.onChange(props.id, props.options, null, value)}
            />}
        </ReactResizeDetector>
      )
    }
    if (id === 'console') {
      return (
        <ReactResizeDetector key={id} handleWidth handleHeight>
          {({ width, height }) => 
            <AceEditor
              ref={this.linkConsole}
              mode="text"
              theme="tomorrow"
              width={width || '100%'}
              height={height || '100%'}
              name={id}
              fontSize={12}
              value={state.consoleValue}
              showPrintMargin={false}
              showGutter={false}
              setOptions={{ useWorker: false }}
              readOnly
            />}
        </ReactResizeDetector>
      )
    }
    return null;
  }

  render() {
    return (
      <div style={styles.root}>
        <Mosaic
          className="mosaic-blueprint-theme"
          initialValue={scheme}
          renderTile={(id, path, x) => {
            return (
              <MosaicWindow
                key={id}
                draggable={true}
                title={TITLES[id]}
                additionalControls={EMPTY_ARRAY}
                path={path}
                renderToolbar={null}
                toolbarControls={this.renderButtons(id)}
              >
                {this.renderComponent(id)}
              </MosaicWindow>
            )
          }}
        />
      </div>
    )
  }    
}


export default Code;