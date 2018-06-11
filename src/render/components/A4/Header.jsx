import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import Immutable from 'immutable';



function GetDateNow(){
  const now = new Date();
  const y = now.getFullYear();
  const m = ("00" + (now.getMonth()+1)).slice(-2);
  const d = ("00" + now.getDate()).slice(-2);
  const w = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'][now.getDay()];
  return `${y}-${m}-${d}`;
}
function PadLeft(i,n){
  return ([...Array(n*2)].reduce((v)=> v + " ") + i).slice(-1*n);
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const title = this.props.state.get("title");
    const page = this.props.page;
    const docNo = this.props.state.get("docNo") || "";
    const strlength = docNo.length < 12 ? 12 : docNo.length
    return (
      <div className="A4-header">
        <div>
          <img style={{"height":"10mm"}} src="../img/logo.svg"/>
          <div style={{"fontSize" : "1em"}}>{title}</div>
        </div>
        <div>
          <pre>
            {"No.  : " + PadLeft(docNo,strlength)}<br/>
            {"Date : " + PadLeft(GetDateNow(),strlength)}<br/>
            {"Page : " + PadLeft(page,strlength)}
          </pre>
        </div>
      </div>
    );
  }
}

// style={{"position" : "absolute", "fontSize" : "1em", "bottom":"0", "right":"30"}}

//style={{"position" : "absolute", "left":"0mm", "top":"0mm", "height":"10mm"}
//<div style={{"position" : "absolute", "left":"0mm", "top":"11mm", "fontSize" : "0.8em"}}>{title}</div>
//style={{"position" : "absolute", "left":"165mm","top":"4mm", "fontSize" : "0.8em"}}


export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
