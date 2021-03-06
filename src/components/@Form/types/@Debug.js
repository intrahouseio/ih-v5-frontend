import React, { PureComponent } from 'react';
import core from 'core';

import AceEditor from 'react-ace';
import ReactResizeDetector from 'react-resize-detector';

import { 
  MosaicWithoutDragDropContext as Mosaic, MosaicWindow, 
  RemoveButton, ExpandButton, Separator, 
} from 'react-mosaic-component';

import { Button } from '@blueprintjs/core';

import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/mode-text';
import { TramRounded } from '@material-ui/icons';


const scheme = 'script'


const EMPTY_ARRAY = [];


const styles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  toolbar: {
    width: '100%',
    display: 'flex',
  },
  title: {
    marginLeft: 15,
    marginRight: 15,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
    color: '#394b59',
  },
  buttons: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end',
  },
  filer: {
    width: 250,
    height: 24,
    marginLeft: 12,
    marginRight: 12,
  },
}



class Debug extends PureComponent { 

  state = {
    start: false,
    filter: '',
    consoleValue: '', 
    consoleAutoScroll: true,
    scrollTop: 0,
  };


  componentWillUnmount() {
    if (this.state.start === true) {
      core.tunnel.unsub({
        method: 'unsub',
        type: 'debug',
        id: 'plugin',
        nodeid: this.nodeid,
        uuid: `plugin_${this.nodeid}`
      }, this.handleRealTimeDataConsole);
      this.nodeid = null;
    }
  }

  handleStart = () => {
    if (this.state.start === false) { 
      this.nodeid = this.props.route.nodeid;
      core.tunnel.sub({
        method: 'sub',
        type: 'debug',
        id: 'plugin',
        nodeid: this.nodeid,
        uuid: `plugin_${this.nodeid}`
      }, this.handleRealTimeDataConsole);
      this.setState({ start: true })
    }
  }

  handleStop = () => {
    if (this.state.start === true) {
      core.tunnel.unsub({
        method: 'unsub',
        type: 'debug',
        id: 'plugin',
        nodeid: this.nodeid,
        uuid: `plugin_${this.nodeid}`
      }, this.handleRealTimeDataConsole);
      this.nodeid = null;
      this.setState({ start: false })
    }
  }

  handleRealTimeDataConsole = (value) => {
    let check = true;

    this.state.filter
      .split(' ')
      .forEach(i => {
        if (check === true) {
          if (i === '' || i === ' ') {
            check = true
          } else {
            if (value.indexOf(i) === -1) {
              check = false;
            }
          }
        }
      });

    if (!this.state.filter || check) {
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

  renderButtons = (id) => {
    return (
      [
        this.state.start ? <Button key="1" icon="stop" minimal onClick={this.handleStop} /> :
        <Button key="2" icon="play" minimal onClick={this.handleStart} />,
     
        <input value={this.state.filter} onChange={this.changeFilter} style={styles.filer} class="bp3-input core" placeholder="Filter..." type="text" />,
        this.state.consoleAutoScroll ? 
          <Button key="5" icon="git-commit" minimal onClick={this.handleChangeAutoScroll} /> : 
          <Button key="6" icon="bring-data" minimal onClick={this.handleChangeAutoScroll} />,
          <Button key="7" icon="trash" minimal onClick={this.handleClearConsole} />,
      ]
    )
  }

  changeFilter = (e) => {
    this.setState({ filter: e.target.value })
  }

  renderComponent = (id) => {
    const { props, state } = this;
    const disabled = typeof props.options.disabled === 'function' ? props.options.disabled(props.global) : props.options.disabled;
    if (id === 'script') {
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

  renderToolbar = () => {
    return (
      <div style={styles.toolbar}>
        <div style={styles.title}>Консоль</div>
        <div style={styles.buttons} className="mosaic-window-controls bp3-button-group">
          {this.renderButtons()}
        </div>
      </div>
    )
  }


  linkConsole = (e) => {
    this.console = e;
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
                title="Консоль"
                additionalControls={EMPTY_ARRAY}
                path={path}
                renderToolbar={this.renderToolbar}
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


export default Debug;