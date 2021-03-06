import React from 'react';
import core from 'core';

import Button from '@material-ui/core/Button';

const styles = {
  root: {
    top: -2,
    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 27,
    textTransform: 'unset',
  },
}


function handleClick(props) {
  const store = core.store.getState().apppage;

  const id = props.container.props.id;
  const route = props.container.props.route;
  const options = props.container.props.options;
  const column = props.column;
  const row = props.rowData;

  const params = {
    subnodeid: route.channel,
    nodeid: route.nodeid,
    command: props.cellData.command,
    param: options.param,
    id: store.component[0].id,
  };


  core
  .request({ method: 'button_table_command', params, payload: row })
  .ok(res => {
    if (res.alert) {
      core.actions.app.alertOpen(res.alert || 'info', res.message || '');
    }
    if (res.refresh) {
      core.transfer.send('refresh_content');
    }
    if (res.restart) {
      core.actions.app.restart(true);
    }
  });

}

function TableButtonComponent(props) {
  return (
    <div style={styles.root} className={props.className}>
      <Button style={styles.button} variant="contained" color="primary" onClick={() => handleClick(props)}>
        {props.cellData.title || ''}
      </Button>
    </div>
  )
}


export default TableButtonComponent; 