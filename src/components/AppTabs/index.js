import React, { Component } from 'react';
import core from 'core';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { withStyles } from '@material-ui/core/styles';

import Draggable from 'react-draggable-original';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import css from './main.module.css';

const MIN_WIDTH_COLUMN = 75;


const styles = {
  root: {
    position: 'absolute',
    width: '100%',
    height: 35,
  },
  rootA: {
    height: 35,
    // borderBottom: '2px solid #eceff1',
  },
  box: {
    display: 'flex',
    width: '100%',
    height: 35,
    backgroundColor: '#90a4ae',
    flexShrink: 0,
    overflow: 'hidden',
  },
  tab: {
    // width: 145,
    // background: '#78909c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid #607D8B',
    flexShrink: 0,
    paddingLeft: 34,
    paddingRight: 34,
    cursor: 'pointer',
    marginTop: 7,
    marginBottom: 7,
  },
  tabA: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    paddingLeft: 34,
    paddingRight: 34,
    cursor: 'pointer',
    backgroundColor: '#fafafa',
    zIndex: 20,
  },
  fake: {
    position: 'absolute',
    display: 'none',
    zIndex: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fake2: {
    border: '2px dashed #E0E0E0', 
    width: '100%', 
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  fake3: {
    position: 'absolute',
    marginTop: 3,
    marginBottom: 0,
    left: 0,
    width: '100%', 
    height: 21,
  },
  fakeText: {
    position: 'absolute',
    color: '#9E9E9E'
  },
  icon: {
    position: 'absolute',
    right: 5,
    display: 'none',
  },
  iconA: {
    position: 'absolute',
    right: 5,
    display: 'inline-flex',
  },
  text: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
};

const classes = theme => ({

});


function Tab(props) {
  return (
  <Draggable
    axis='x'
    position={{ x: 0, y: 0 }}
    onStart={(e, data) => props.onClick(e, 'dragstart', props.item, data, props.index)}
    onDrag={(e, data) => props.onClick(e, 'drag', props.item, data, props.index)}
    onStop={(e, data) => props.onClick(e, 'dragstop', props.item, data, props.index)}
  >
    <div 
      className={css.tab} 
      style={props.select === props.item.id ? styles.tabA : styles.tab} 
      onClick={(e) => props.onClick(e, 'click', props.item)}
      onContextMenu={(e) => props.onClick(e, 'contextmenu', props.item)}
    >
      <div style={styles.text}>{props.item.title}</div>
      <IconButton
        size="small"
        className={css.button} 
        style={props.select === props.item.id ? styles.iconA : styles.icon} 
        onClick={(e) => props.onClick(e, 'close', props.item)} 
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>
    </div>
  </Draggable>
  )
}

class AppTabs extends Component {

  linkBox = (e) => {
    this.box = e;
  }

  linkFake= (e) => {
    this.fake = e;
  }

  linkFakeText= (e) => {
    this.fakeText = e;
  }

  handleDragStart = (e, item, data, index) => {
    const temp = [];
    let lastWidth = 0;

    Array.from(this.box.children).forEach((i, key)=> {
      if (key === 0) {
        temp.push(lastWidth)
      } else {
        temp.push(lastWidth)
      }
      lastWidth = lastWidth + i.offsetWidth;
    })

    const curentColumnWidth = temp[index] + data.x;
    this.fake.style.width = `${data.node.offsetWidth + 1}px`;
    this.fake.style.transform = `translateX(${curentColumnWidth -1}px)`;
    this.fake.style.height = '35px';
    this.fake.style.display = 'flex';
    this.fakeText.innerText = item.title;
  }

  handleDragStop = (e, item, data, index) => {
    this.fake.style.display = 'none';
    this.fakeText.innerText = '';

    const temp = [];
    let lastWidth = 0;
    let targetColumnIndex = null;

    Array.from(this.box.children).forEach((i, key)=> {
      if (key === 0) {
        temp.push(lastWidth)
      } else {
        temp.push(lastWidth)
      }
      lastWidth = lastWidth + i.offsetWidth;
    })

    const curentColumnWidth = temp[index] + data.x;

    temp.forEach((i, key) => {
      if (targetColumnIndex === null && i - MIN_WIDTH_COLUMN > curentColumnWidth) {
        targetColumnIndex = key - 1;
      }
    });

    if (targetColumnIndex === null) {
      targetColumnIndex = temp.length - 1;
    }
    if (targetColumnIndex === -1) {
      targetColumnIndex = 0;
    }

    if (targetColumnIndex !== index) {
      const temp2 = this.props.state.list.reduce((l, n, key, arr) => {
        if (key === targetColumnIndex && key === index) {
          return l.concat(n);
        } 
        if (key === targetColumnIndex) {
          if (targetColumnIndex > index) {
            return l.concat(n, arr[index]);
          }
          if (targetColumnIndex < index) {
            return l.concat(arr[index], n);
          }
          return l.concat(n);
        }
        if (key === index) {
          return l;
        }
        return l.concat(n);
      }, []);
      
  
      
      core.actions.apptabs.data({
        ...this.props.state,
        list: temp2,
      });
    }
  }

  handleClick = (e, type, item, data, index) => {
    e.preventDefault();
    e.stopPropagation();

    if (type === 'drag') {
      if (this.drag === undefined) {
        this.drag = true;
        if (core.cache.tab[item.id] !== undefined) {
          core.route(core.cache.tab[item.id]);
        } else {
          core.route(item.path);
        }
        this.handleDragStart(e, item, data, index);
      }
    }

    if (type === 'dragstop') {
      this.drag = undefined;
      this.handleDragStop(e, item, data, index);
    }
    
    if (type === 'click') {
      if (core.cache.tab[item.id] !== undefined) {
        core.route(core.cache.tab[item.id]);
      } else {
        core.route(item.path);
      }
    }

    if (type === 'contextmenu') {
      // core.event('contextmenu', 'tab', e, item);
    }

    if (type === 'close') {
      if (core.cache.tab[item.id] !== undefined) {
        delete core.cache.tab[item.id];
      }
      core.actions.apptabs.remove(item);
      if (this.props.route.nodeid === item.id) {
        const store = core.store.getState()
        const index = store.apptabs.list.length;
    
        if (index !== 0) {
          const item = store.apptabs.list[index - 1];
          if (core.cache.tab[item.id] !== undefined) {
            core.route(core.cache.tab[item.id]);
          } else {
            core.route(item.path);
          }
        } else {
          core.route(this.props.route.menuid);
        }
      }
    }
  }

  render({ id, state, route, classes } = this.props) {
    if (route.menuid === null) {
      return null;
    }
    return (
      <div style={state.list.length === 0 ? styles.root : styles.rootA }>
        <div ref={this.linkFake} style={styles.fake}>
          <div ref={this.linkFakeText} style={styles.fakeText} />
          <div style={styles.fake3} />
          <div style={styles.fake2} />
        </div>
        <div ref={this.linkBox} style={styles.box}>
          {state.list.map((i, k) => 
            <Tab 
              key={i.id}
              index={k}
              item={i} 
              select={route.nodeid}
              onClick={this.handleClick}
            />)}
        </div>
      </div>
    );
  }
}


const mapStateToProps = createSelector(
  state => state.app.route,
  state => state.apptabs,
  (route, state) => ({ route, state })
)

export default connect(mapStateToProps)(withStyles(classes)(AppTabs));