import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import Immutable from 'immutable';

import JsBarcode from 'jsbarcode';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  componentDidMount() {
    this.renderBarcode();
  }
  componentDidUpdate(prevProps, prevState) {
    this.renderBarcode();
  }
  renderBarcode(){
    try{
      // JsBarcode(this.node)
      JsBarcode(this.inputRef.current)
      　.options({font: "OCR-B"}) // Will affect all barcodes
      　.CODE128(this.props.state.get("docNo"), {
          height: 40,
          fontSize: 18,
          textMargin: 0,
          displayValue: false
        })
      　.render();
    }
    catch(e){

    }
  }
  render() {
    return (
      <div className="A4-footer">
        <img style={{"margin":"1mm 0mm 0mm 0mm"}} ref={this.inputRef}></img>
        <div ref={node => this.node = node}></div>
        <div style={{"margin":"2mm 0mm"}}>
          <font color="red" align="right">CONFIDENTIAL</font>
        </div>
      </div>
    );
  }
}


export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
