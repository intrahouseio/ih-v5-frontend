import React, { PureComponent } from 'react';
import core from 'core';

import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';

import Link from '@material-ui/core/Link';

import TextField from '@material-ui/core/TextField';

import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';

const styles = {
  root: {
    margin: 12,
  },
  button: {
    position: 'relative',
  },
}

const classes = theme => ({
  input: {
    display: 'none'
  },
  root: {
    justifyContent: 'space-between',
  },
});


class SmartButton extends PureComponent {

  handleAfterClick = (value) => {
    if (this.props.options.params.dialog === 'channellink') {
      core
        .request({ method: 'appdialog_set_channellink', params: value.setreq })
        .ok((res) => {
          this.props.onChange(this.props.id, this.props.options, null, null)
          const { menuid, rootid, componentid, nodeid, tab, channel } = this.props.route;
          const channelview = res.data.component;
          core.route(`${menuid}/${rootid}/${componentid}/${nodeid}/${tab}/${channelview}/${channel}`);
        });
    } else {
      this.props.onChange(this.props.id, this.props.options, null, value)
    }
  }


  handleDialogClick = (value) => {
    if (value === null) {
      this.handleAfterClick(value)
    } else {
      core.transfer.unsub('form_dialog', this.handleDialogClick);
      core.actions.appdialog.close();
      this.handleAfterClick(value)
    }
  }

  handleClick = (e, type) => {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.data.dialognodeid) {
      if (type === 'icon') {
        const value = {
          dialognodeid: null,
          did: '',
          dn: '',
          name: '',
          title: '',
          value: '',
          anchor: this.props.data.anchor 
        }
        this.handleAfterClick(value);
      }
    } else {
      const params = {
        ...this.props.options.params,
        anchor: this.props.data.anchor,
        nodeid: this.props.route.channel,
        selectnodeid: this.props.data.dialognodeid
       }
    
        core.transfer.sub('form_dialog', this.handleDialogClick);
        core.actions.appdialog.data({ 
          open: true, 
          transferid: 'form_dialog',
          template: params,
        });
    }
  }

  handleClickForward = (e, path) => {
    e.preventDefault();
    e.stopPropagation();

    if (path) {
      core.route(path);
    }
  }

  render() {
    return (
      <TextField
        id={this.props.options.id} 
        label={this.props.options.title} 
        style={styles.root}
        classes={{ root: this.props.classes.root }}
        InputLabelProps={{ shrink: true }} 
        InputProps={{
          classes: this.props.classes,
          endAdornment: (
            <IconButton onClick={(e) => this.handleClick(e,  'icon')} size="small">
             {this.props.data.dialognodeid ? <LinkOffIcon fontSize="small" /> : <LinkIcon fontSize="small" />}
            </IconButton>
          ),
          startAdornment: (
            <Link 
              href={`/admin/${this.props.data.path}`}
              onClick={(e) => this.handleClickForward(e, this.props.data.path)}
            >
              {this.props.data.title}
            </Link>
          ),
        }}
        value=""
        error={this.props.cache && this.props.cache.error}
        helperText={this.props.cache && this.props.cache.error}
        onClick={(e) => this.handleClick(e, 'text')}
      />
  )
  }
}

export default withStyles(classes)(SmartButton);