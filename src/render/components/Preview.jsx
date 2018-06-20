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
  width : 100%;
  height : 100%;
  /* overflow-x : hide;
  overflow-y : hide; */
`;
// position: absolute; <-改ページできなくなる悪魔
// width : calc(100% - 10px);
// height : calc(100% - 10px);

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
      if(i in foo){
        return ( foo[i] );
      }else{
        return ( <div>ERR</div> );
      }
      // switch(i){
      //   case "Default":
      //     return ( <Default/> );
      //   case "A4":
      //     return ( <A4/> );
      //   case "Slide":
      //     return ( <Slide  /> );
      //   default:
      //     return ( <div>ERR</div> );
      // }
    }
    return (
      <DIVS >
        <div onWheel={(i) => this.onmousewheel(i)}>
        {viewselector(this.props.state.get("preview"))}
        </div>
      </DIVS>
    );
  }
}

const foo = ({
  "Default" : <Default/>,
  "A4" : <A4/>,
  "Slide" : <Slide/>
});
export const previewDefault = "Default";
export const getPreviewKeys = Object.keys(foo)

export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
