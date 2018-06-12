import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import Immutable from 'immutable';

import * as markedex from '../../../logic/marked-ex.js';

import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Body from './Body.jsx';

import styled from 'styled-components';
const A4div = styled.div`
@page{
  size : A4;
}
/*ここに印刷用スタイル指定を書く*/
*, *:before, *:after {
    -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
         -o-box-sizing: border-box;
        -ms-box-sizing: border-box;
            box-sizing: border-box;
}
.sheet {
  background: white;
  width: 210mm;
  height: 297mm;  /* 1mm余裕をもたせる */
  padding: 12.7mm;
  page-break-after: always;
  position : relative;
}
.A4-header{
  width : 100%;
  height: 18mm;
  padding : 2mm;
  display : flex;
  justify-content : space-between;
}
.A4-body{
  width : 100%;
  height : 230mm;
  padding : 5mm;
  border-width : 1px;
  border-style : solid;
}
.A4-footer{
  width : 100%;
  display : flex;
  justify-content : space-between;
  /*height : 14mm;*/
  padding : 0mm 2mm 0mm;
  /* position : relative; */
}
.A4-caution{
  text-align : center;
  position : absolute;
  left : 10mm;
  top : 130mm;
  width : 190mm;
  opacity : 0.3;
  font-size : 8em;
  transform : rotate(-35deg);
  font-weight : 900;
}
/* プレビュー用のスタイル */
@media screen {
  .sheet {
    width: 210mm;
    height: 297mm;
    background: white; /* 背景を白く */
    box-shadow: 0 .5mm 2mm rgba(0,0,0,.3);  /* ドロップシャドウ */
    margin: 5mm;
    padding: 12.7mm;
  }
}
`;

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
        </section >
      );
    })
    return (
      <A4div>
        {pages}
      </A4div>
    );
  }
}


export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
