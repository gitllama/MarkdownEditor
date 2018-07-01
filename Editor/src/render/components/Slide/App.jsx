import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import Immutable from 'immutable'

import styled from 'styled-components';
const HEADER = styled.div`
  width : 100%;
  justify-content : space-between;
  display : flex;
`;
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
    // webFrame.setZoomFactor(this.props.state.get("zoom") * parseFloat(this.props.state.get("size")));
    const arr = this.props.state.get("html").split("<hr>");
    const page = this.props.state.get("page")
    const html =(src, i)=>{
      if(Array.isArray(arr)){
        return arr[i < 0 ? 0 : arr.length - 1 < i ? arr.length - 1 : i]
      }else{
        return arr
      }
    }
    return (
      <DIVS>
      <HEADER>
        <div/><div>{page+1}/{arr.length}</div>
      </HEADER>
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{__html: html(arr, page)}}
      />
      </DIVS>
    );
  }
}


export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
