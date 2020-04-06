import React, { Component } from 'react';
import core from 'core';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Tooltip from '@material-ui/core/Tooltip';

import UnlinkIcon from '@material-ui/icons/LinkOff';

const styles = {
  root: {
    padding: 20,
  },
  row: {
    height: 50,
    borderBottom: '2px dotted #E0E0E0',
    paddingBottom: 4,
    marginBottom: 12,
  },
  body: {
    display: 'flex'
  },
  text: {
    width: '100%',
    marginLeft: 8,
    color: '#9E9E9E',
  },
  buttons: {
    top: -21,
    position: 'relative',
    flexShrink: 0,
  },
  buttonUnlink: {
    marginRight: 18,
    height: 36,
  },
  buttonOk: {
    
  },
  icon: {
    marginLeft: 8,
  }
}

function getValue(value) {
  if (value && value != '') {
    const temp = value.split('.');
    return `${temp[0]} --> ${temp[1]}`
  }
  return value;
}

function Row(props) {
  return (
    <div style={styles.row}>
      <Typography variant="subtitle2" >
        {props.params.prop.toUpperCase()}
      </Typography>
      <div style={styles.body}>
        <div style={styles.text}>{getValue(props.params.link)}</div>
        <div style={styles.buttons}>
          <Tooltip title="Unlink">
            <Button
              disabled={!props.params.clear}
              variant="contained" 
              color="secondary" 
              style={styles.buttonUnlink} 
              startIcon={<UnlinkIcon style={styles.icon} />}
              onClick={() => props.onClickUnlink(props.params)}
            />
          </Tooltip>
          <Button 
            variant="contained" 
            color="primary" 
            disabled={!props.params.enable} 
            style={styles.buttonOk}
            onClick={() => props.onClickOk(props.params)} 
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  )
}

class Devicelink extends Component {
  componentDidMount() {
    this.request();
  }

  request = () => {
    core
    .request({ method: 'appdialog_devlink', params: this.props.state.template })
    .ok((res) => {
      core.actions.appdialog.component({ list: res.data.properties });
    });
  }

  handleClickUnlink = (item) => {
    const params = item.clearreq;

    core
    .request({ method: 'appdialog_devlink_unlink', params })
    .ok((res) => {
      console.log(res);
    });
  }

  handleClickOk = (item) => {
    core.transfer.send(this.props.state.transferid, item.result);
  }
  

  render({ state } = this.props) {
    return (
      <div style={styles.root} >
        {state.component.list.map(i => 
          <Row 
            key={i.prop} 
            params={i}
            onClickUnlink={this.handleClickUnlink}
            onClickOk={this.handleClickOk}
          />
        )}
      </div>
    )
  }
}


export default Devicelink;