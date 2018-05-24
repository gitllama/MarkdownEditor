import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import Immutable from 'immutable';

import * as markedex from '../../logic/marked-ex.js';

import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Body from './Body.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const pages = [];
    let hoge = this.props.state.get("html").split("<hr>")
    hoge.forEach((v,i)=>{
      pages.push(
        <section className="sheet" key={"section"+i} >
          <Header key={"Header"+i} page={`${parseInt(i)+1}/${hoge.length}`} />
          <Body key={"Body"+i}>{v}</Body>
          <Footer key={"Footer"+i}/>
          <div className="A4-caution">{this.props.state.get("caution")}</div>
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
