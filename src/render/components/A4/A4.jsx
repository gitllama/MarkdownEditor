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
const A4section = styled.section`
  page-break-after: always;
  background: white;
  width: 210mm;
  height: 297mm;
  position : relative;
  @page{
    size : A4;
  }
  @media screen {
    width: 210mm;
    height: 297mm;
    border-width : 1px;
    border-style : solid;
    background: white; /* 背景を白く */
    box-shadow: 0 .5mm 2mm rgba(0,0,0,.3);  /* ドロップシャドウ */
    margin: 5mm;
  }
  .orderwfmap{
    justify-content : space-between;
  }
  .singlewfmap{
    -webkit-transform: scale(0.5);
  }
  .A4-body{
    position : absolute;
    left : 12.7mm;
    top : 30.7mm;
    width : 174.6mm;
    height : 225mm;
    padding : 5mm;
    border-width : 1px;
    border-style : solid;
  }
  .A4-header{
    position : absolute;
    left : 12.7mm;
    top : 12.7mm;
    width : 174.6mm;
    height: 18mm;
    padding : 2mm;
    display : flex;
    justify-content : space-between;
  }
  .A4-footer{
    position : absolute;
    left : 12.7mm;
    top : 266.3mm;
    width : 174.6mm;
    height: 18mm;
    display : flex;
    justify-content : space-between;
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
        <A4section key={"section"+i} >
          <Header key={"Header"+i} page={`${parseInt(i)+1}/${hoge.length}`} />
          <Body key={"Body"+i}>{v}</Body>
          <Footer key={"Footer"+i}/>
        </A4section >
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
