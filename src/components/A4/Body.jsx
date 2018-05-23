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
    const bodycss = {
      "borderWidth":"1px",
      "borderStyle":"solid",
      "left":"0mm",
      //"top" : `${this.props.top}mm`,
      "width" : "210mm",
      "height": `${this.props.height}mm`,
      "position" : "relative",
    }
    return (
      <div  className="A4-body" style={bodycss}>
        <div className="markdown-body" dangerouslySetInnerHTML={{__html: this.props.children}} />
      </div>
    );
  }
}

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
