import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable'
const {webFrame} = require('electron')

import Editor from './Editor.jsx'
import Split from './Split.jsx'
import Preview from './Preview.jsx'

const loadimgstyle = {
  "position": "absolute",
  "top":"0",
  "left":"0",
  "bottom":"0",
  "right":"0",
  "margin": "auto"
}


class App extends React.Component {
  constructor(props) {
    super(props);
    //const configJson = this.props.state.get("config");
    //this.props.actions.readwelcomeAsynclatest(`${configJson["data"]["path"]}/welcome.md`)
  }
  render() {
    const viewselector =(i)=>{
      switch(i){
        case "Editor":
          return ( <Editor/> );
        case "Split":
          return ( <Split /> );
        case "Preview":
          return ( <Preview /> );
        default:
          return ( <div>ERR</div> );
      }
    }
    const busycheck =(i)=>{
      if(i)
        return <img style={loadimgstyle} src="../img/loding.gif" />;
      else
        return viewselector(this.props.state.get("view"));
    }
    return (
      <div>
        {busycheck(this.props.state.get("busy"))}
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
