import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable'
const {webFrame} = require('electron')


class App extends React.Component {
  constructor(props) {
    super(props);
    this.interval = null;
  }
  tick() {
    this.props.actions.checkAsynclatest();
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  componentDidMount() {
    this.interval = setInterval(this.tick.bind(this), 1000);
    //D&D設定
    this.node.ondragover =()=> false;
    this.node.ondragleave = this.node.ondragend = () => false;

    this.node.ondrop = ((e) => {
      e.preventDefault();
      let file = e.dataTransfer.files[0];
      this.props.actions.textChangeAsynclatest(file);
      return false;
    }).bind(this);
  }
  render() {
    return (
      <div ref={node => this.node = node}>
        {this.props.state.get("text")}
      </div>
    );
  }
}

export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
