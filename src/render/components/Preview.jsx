import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable'
const {webFrame} = require('electron')

import Default from './Default/App.jsx'
import A4 from './A4/A4.jsx'
import Slide from './Slide/App.jsx'

import styled from 'styled-components';
const DIVS = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 1;
  width : 100%;
  height : 100%;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    //const configJson = this.props.state.get("config");
    //this.props.actions.readwelcomeAsynclatest(`${configJson["data"]["path"]}/welcome.md`)
  }
  onmousewheel(i){
    if(i.ctrlKey){
      if(i.deltaY<0)
        webFrame.setZoomLevel(webFrame.getZoomLevel()+1);
      else if(i.deltaY>0)
        webFrame.setZoomLevel(webFrame.getZoomLevel()-1);
    }
      //console.log(i.deltaX,i.deltaY,i.deltaZ)
      //webFrame.setZoomFactor(webFrame.getZoomFactor()*2);
  }
  render() {
    const viewselector =(i)=>{
      switch(i){
        case "Default":
          return ( <Default /> );
        case "A4":
          return ( <A4 /> );
        case "Slide":
          return ( <Slide /> );
        default:
          return ( <div>ERR</div> );
      }
    }
    return (
      <DIVS onWheel={(i) => this.onmousewheel(i)}>
        {viewselector(this.props.state.get("preview"))}
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
