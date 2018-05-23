import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import Immutable from 'immutable';


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const footercss =  {
      "left":"0mm",
      "width" : "210mm",
      "display": "flex",
      "justifyContent": "space-between",
      //"top" : `${296 - this.props.height}mm`,
      "height": `${this.props.height}mm`,
      "position" : "relative",
    }
    return (
      <div style={footercss}>
          <div></div>
          <div></div>
          <div>
            <font color="red" align="right">CONFIDENTIAL</font>
          </div>
      </div>
    );
  }
}

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
