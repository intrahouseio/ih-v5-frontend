import React, { Component } from 'react';
import core from 'core';

import { withStyles } from '@material-ui/core/styles';



const styles = {
  box: {
    width: '100%',
    height: '100%',
  },
};

const classes = theme => ({
  root: {
  },
});

class Table extends Component {

  static defaultProps = {
    id: 'table'
  };

  componentDidMount() {
  }

  render({ id, state, match, classes, onClick } = this.props) {
    return (
      <div style={styles.box}>
        Table
        <br />
        {state.text}
      </div>
    );
  }
}



export default core.connect(withStyles(classes)(Table));