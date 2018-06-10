import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import Immutable from 'immutable'


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  // onmousewheel(i){
  //   if(i.ctrlKey){
  //     if(i.deltaY<0)
  //       webFrame.setZoomLevel(webFrame.getZoomLevel()+1);
  //     else if(i.deltaY>0)
  //       webFrame.setZoomLevel(webFrame.getZoomLevel()-1);
  //   }
  // }
  render() {
    webFrame.setZoomFactor(this.props.state.get("zoom") * parseFloat(this.props.state.get("size")));
    const hoge = this.props.state.get("html");
    const page = this.props.state.get("page")
    const html =(arr, i)=>{
      if(Array.isArray(arr)){
        return arr[i < 0 ? 0 : arr.length - 1 < i ? arr.length - 1 : i]
      }else{
        return arr
      }
    }
    return (
      <div style={{"width":"100%", "height":"100%"}}>
        <div dangerouslySetInnerHTML={{__html : html(hoge, page)}} />
      </div>
    );
  }
}

// <div dangerouslySetInnerHTML={{__html : html(hoge, page)}} />

// <div style={{"width":"100%", "height":"10%"}}>
//   <img style={{"height":"5%"}} src="../img/logo.svg" />
// </div>

export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
