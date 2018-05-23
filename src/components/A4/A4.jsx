import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import Immutable from 'immutable';

import * as markedex from '../../logic/marked-ex.js';

import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Body from './Body.jsx';

const header_height = 18;
const footer_height = 3;

const sectioncss = {
  "width":"210mm",
  "height":"296mm", /* 1mm余裕をもたせる */
  "pageBreakAfter": "always",
  "position": "relative"
}

const cssCaution={
  "textAlign" : "center",
  "position": "absolute",
  "left":"10mm",
  "top":"130mm",
  "opacity":"0.3",
  "width": "190mm",
  "fontSize" : "8em",
  "transform": "rotate(-35deg)",
  "fontWeight": "900",
  //"backgroundColor": "rgba(0, 0, 0, 0.5)"
}


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const pages = [];
    let hoge = this.props.state.get("html").split("<hr>")
    hoge.forEach((v,i)=>{
      pages.push(
        <section key={i} style={sectioncss}>
          <Header height={header_height} page={`${parseInt(i)+1}/${hoge.length}`} />
          <Body height={296 - header_height - footer_height}>
            {v}
          </Body>
          <Footer height={footer_height} />
          <div style={cssCaution}>{this.props.state.get("caution")}</div>
        </section>
      );
    })
    return (
      <div>
        {pages}
      </div>
    );
  }
}


export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
