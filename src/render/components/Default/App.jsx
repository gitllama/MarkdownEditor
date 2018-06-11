import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import Immutable from 'immutable'

import styled from 'styled-components';

const DIVS = styled.div`
  overflow-x : auto;
  overflow-y : auto;
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
      <DIVS>
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{__html: html}}
        />
      </DIVS>

    )
  }
}

// <div className="markdown-body" style={css_Right} dangerouslySetInnerHTML={
//   {__html: html}
// } />

// <div style={{"width":"100%", "height":"10%"}}>
//   <img style={{"height":"5%"}} src="../img/logo.svg" />
// </div>

export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
