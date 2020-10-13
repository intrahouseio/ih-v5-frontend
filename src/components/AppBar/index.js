import React from 'react';
import core from 'core';

import icon from 'components/icons';

import IconButton from '@material-ui/core/IconButton';

import WebIcon from '@material-ui/icons/Web';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PublishIcon from '@material-ui/icons/Publish';

const styles = {
  box: {
    display: 'flex',
  },
  logo: {
    width: 60,
    height: 60,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    zIndex: 1000,
  },
  stub: {
    width: 60,
    height: 35,
    backgroundColor: '#607D8B',
    flexShrink: 0,
    zIndex: 101,
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: 35,
    backgroundColor: '#607D8B',
    boxShadow: 'rgba(0, 0, 0, 0.157) 0px 3px 10px, rgba(0, 0, 0, 0.227) 0px 3px 10px',
    overflow: 'hidden',
    zIndex: 100,
  },
  icon: {
    color: '#64b4d7',
    fontSize: 40,
  },
  button: {
    marginRight: 12,
    color: '#fafafa',
  },
};


function handleUpload () {
  const data = new FormData();
  const input = document.createElement('input');
  const xhr = new XMLHttpRequest();
  
  input.type = 'file';
  input.accept=".ihpack"

  input.onchange = (e) => {
    const list = [];  

    Array
      .from(input.files)
      .forEach(i => {
        data.append('files', i);
        list.push({ name: i.name, size: (i.size / 1024 / 1024).toFixed(2) })
      })

    function handleDialogClick({ complete, message, replace}) {
      if (message === 'submit') {
        data.append('replace', replace);
        xhr.send(data);
      } else {
        if (!complete) {
          xhr.abort();
        }

        list.forEach(i => URL.revokeObjectURL(i.src));

        core.transfer.unsub('form_progress', handleDialogClick);
        core.actions.appprogress.data({ open: false, type: 'upload', list: [], progress: 0, complete: false, message: 'submit' })
      }
    }

    xhr.upload.onloadstart = function(e) {
      core.actions.appprogress.data({ message: 'uploding' })
    }
    
    xhr.upload.onprogress = (e) => {
      const progress = Math.round((e.loaded / e.total) * 100);
      core.actions.appprogress.data({ progress })
    }

    xhr.onreadystatechange = (e) => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          try {
            const res = JSON.parse(xhr.responseText);
            core.actions.appnav.data(this.props.stateid, { list });
            core.actions.appprogress.data({ complete: true, message: 'complete' })
          } catch (e) {
            core.actions.appprogress.data({ message: 'error' })
            core.actions.app.alertOpen('warning', 'Error: ' + e.message);
          }
        } else {
          if (xhr.status !== 0) {
            core.actions.appprogress.data({ message: 'error' })
            core.actions.app.alertOpen('warning', xhr.responseText);
          }
        }
      }
    };
    
    xhr.upload.onload = () => {
   
    }
    
    xhr.upload.onerror = (e) => {
      core.actions.appprogress.data({ message: 'error' })
      core.actions.app.alertOpen('warning', 'Error: ' + e.message);
    }

    xhr.open('POST', '/import');

    core.transfer.sub('form_progress', handleDialogClick);
    core.actions.appprogress.data({ open: true, type: 'import', list })
  }

  input.click();
}

function handleClick() {
  core.route('');
}

function handleClickUserInterface() {
  window.open('/', '_blank');
}

function handleClickSettings(menuid) {
  if (menuid === 'settings') {
    core.route('');
  } else {
    core.route('settings');
  }
}

function handleClickExit() {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('rememberme');
  
  core.network.realtime.destroy();
  core.actions.app.auth(false);
  
  window.location.href = "/admin";
}

function AppBar(props) {
  return (
    <div style={styles.box}>
      <div style={styles.stub}/>
      <div style={styles.logo}>
        <IconButton onClick={handleClick}>
          {icon('logo2', styles.icon)}
        </IconButton>
      </div>
      <div style={styles.container}>
        <IconButton style={styles.button} size="small" onClick={handleUpload}>
          <PublishIcon fontSize="small" />
        </IconButton>
        <IconButton style={styles.button} size="small" onClick={handleClickUserInterface}>
          <WebIcon fontSize="small" />
        </IconButton>
        <IconButton style={styles.button} size="small" onClick={() => handleClickSettings(props.menuid)}>
          <SettingsIcon style={{ color: props.menuid === 'settings' ? '#03A9F4' : 'unset' }} fontSize="small" />
        </IconButton>
        <IconButton style={styles.button} size="small" onClick={handleClickExit}>
          <ExitToAppIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
}


export default AppBar;