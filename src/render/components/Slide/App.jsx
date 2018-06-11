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
    // webFrame.setZoomFactor(this.props.state.get("zoom") * parseFloat(this.props.state.get("size")));
    const hoge = this.props.state.get("html");
    const page = this.props.state.get("page")
    const html =(src, i)=>{
      let arr = src.split("<hr>");
      if(Array.isArray(arr)){
        return arr[i < 0 ? 0 : arr.length - 1 < i ? arr.length - 1 : i]
      }else{
        return arr
      }
    }
    return (
      <DIVS
        className="markdown-body"
        dangerouslySetInnerHTML={{__html: html(hoge, page)}}
      />
    );
  }
}


export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
