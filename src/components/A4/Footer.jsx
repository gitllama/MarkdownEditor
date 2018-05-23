import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import Immutable from 'immutable';

import barcode from 'barcode';
var JsBarcode = require('jsbarcode');




class App extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  componentDidMount() {
    let hoge = JsBarcode(this.inputRef.current) //JsBarcode(this.node)
      .options({font: "OCR-B"}) // Will affect all barcodes
      .CODE128("1234567890128", {height: 5, fontSize: 18, textMargin: 0})
      .render();
  }
  render() {
    return (
      <div className="A4-footer">
        <img ref={this.inputRef}></img>
        <img ref={node => this.node = node}></img>
        <div>
          <font color="red" align="right">CONFIDENTIAL</font>
        </div>
      </div>
    );
  }
}

//img ref={this.inputRef}/>
// ref={node => this.node = node}

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
