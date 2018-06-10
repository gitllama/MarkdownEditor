import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import Immutable from 'immutable'

import styled from 'styled-components';

const DIVS = styled.div`
  background: white;
  width: 100%;
  height: 100%;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const html = this.props.state.get("html")
    return (
      <DIVS
        className="markdown-body"
        dangerouslySetInnerHTML={{__html: html}}
      />
    )
  }
}

// <div className="markdown-body" style={css_Right} dangerouslySetInnerHTML={
//   {__html: html}
// } />

export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
