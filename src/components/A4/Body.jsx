import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import Immutable from 'immutable';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  render() {
    return (
      <div className="A4-body" key={"A4-body" + this.props.key}>
        <div className={`markdown-body`}
            key={"markdown-body" + this.props.key}
            dangerouslySetInnerHTML={{__html : this.props.children}} />
      </div>
    );
  }
}

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
