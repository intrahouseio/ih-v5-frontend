import React, { PureComponent } from 'react';
import core from 'core';

import TextField from '@material-ui/core/TextField';

import IconButton from '@material-ui/core/IconButton';

import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


const styles = {
  root: {
    margin: 12,
  },
  rootMini: {
    fontSize: 13,
    fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
    fontWeight: 400,
    color: 'rgba(0, 0, 0, 0.87)',
    width: '100%',
    border: 'unset', 
    height: 21,
    background: 'unset',
  },
  rootMini2: {
    fontSize: 13,
    fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
    fontWeight: 400,
    color: 'rgb(48, 84, 150)',
    width: '100%',
    border: 'unset', 
    height: 21,
    background: 'unset',
    fontWeight: 'bold',
  }
}

function ButtonMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [list, setList] = React.useState([]);

  const handleClick = (event, icon) => {
    if (icon) {
      props.onChange(null);
    } else {
      const store = core.store.getState().apppage.data.p1.template;
      setList(store.listState.map(id => ({ id, title: store.state[id].title, value: store.state[id].curent })));
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setList([]);
  };

  const handleChangeMenu = (item) => {
    setAnchorEl(null);
    setList([]);
    props.onChange(item.title, item.id, item.value);
  }

  if (props.enabled) {
    return (
      <div>
        <IconButton onClick={(e) => handleClick(e, props.icon)} size="small" >
          {props.icon ? <LinkOffIcon fontSize="small" /> : <LinkIcon fontSize="small" />}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {list.map(i => 
            <MenuItem key={i.id} onClick={() => handleChangeMenu(i)}>{i.title}</MenuItem>
          )}
        </Menu>
      </div>
    );
    
  }
  return null;
}

class InputLink extends PureComponent {
  handleChangeText = (e) => {
    this.props.onChange(this.props.id, this.props.options, null, { value: e.target.value })
  }

  handleClickButton = (title, id, value) => {
    if (title === null) {
      this.props.onChange(this.props.id, this.props.options, null, { link: null, title: null, text: null, value: this.props.data.text || 'Text 1' })
    } else {
      this.props.onChange(this.props.id, this.props.options, null, { link: id, title, value, text: this.props.data.value })
    }
  }

  render() {
    if (this.props.mini) {
      return (
        <>
          <input
            className="core"
            style={this.props.data.link ? styles.rootMini2 : styles.rootMini} 
            disabled={Boolean(this.props.data.link)}
            value={this.props.data.link ? this.props.data.title : this.props.data.value}
            onChange={(e) => this.props.onChange(this.props.id, this.props.options, null, this.handleChangeText)}
          />
            <ButtonMenu 
              enabled={this.props.route.type} 
              icon={this.props.data.link} 
              onChange={this.handleClickButton} 
            />
        </>
      )
    }

    return (
      <TextField
        id={this.props.options.id} 
        label={this.props.options.title} 
        style={styles.root}
        disabled={Boolean(this.props.data.link)}
        InputProps={{
          endAdornment: (
            <ButtonMenu 
              enabled={this.props.route.type} 
              icon={this.props.data.link} 
              onChange={this.handleClickButton} 
            />
          )
        }}
        InputLabelProps={{ shrink: true, style: this.props.getStyle(this.props) }} 
        value={this.props.data.link ? this.props.data.title : this.props.data.value}
        error={this.props.cache && this.props.cache.error}
        helperText={this.props.cache && this.props.cache.error}
        onChange={this.handleChangeText}
      />
    )
  }
}

export default InputLink;