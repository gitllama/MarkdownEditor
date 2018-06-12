import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import Immutable from 'immutable';

import * as g from './generator.js';

// ['ACTION_NAME_THROUGH']
// ['ACTION_NAME_ASYNC']       : 連射すると遅れてまとめて帰ってくる
// ['ACTION_NAME_ASYNCLATEST'] : 最後だけ返る（すでに動いてても呼び出しは起こる）
const takeSagas = {
  ['INIT_ASYNCLATEST'] : g.init,


  ['VIEW_CHANGE'] : (state, action) => (
    state.withMutations(m => (
      m.set('view', action.payload)
    ))
  ),
  ['PREVIEW_CHANGE'] : (state, action) => (
    state.withMutations(m => (
      m.set('preview', action.payload)
    ))
  ),
  ['PAGE_CHANGE'] : (state, action) => (
    state.withMutations(m => (
      m.set('page', state.get("page") + action.payload)
    ))
  ),

  ['CHANGE_TEXT_ASYNCLATEST'] : g.markdownAsync,

  ['READFILE_ASYNCLATEST'] : g.readfileAsync,
  ['SAVEFILE_ASYNCLATEST'] : g.savefileAsync,

  // ['SELECT_LEGEND_ASYNCLATEST'] : g.selectlegendAsync,
  //
  // ['READSQL_ASYNCLATEST'] : g.sqlAsync,
  // ['READLOG_ASYNCLATEST'] : g.readlogAsync,
  // ['READTEST_ASYNCLATEST'] : g.readtestAsync,
  //
  // ['EXPORTSVG_ASYNCLATEST'] : g.exportSVGAsync
  ['SYNC_HTML_ASYNCLATEST'] : g.syncHTMLAsync,
};


// saga monitor

function* setTake(actionName, callback) {
  if(actionName.indexOf("_ASYNCLATEST") > 0){
    yield takeLatest(actionName, callback);
    //console.log("registor :",actionName)
  }
  else if(actionName.indexOf("_ASYNC") > 0){
    yield takeEvery(actionName, callback);
    //console.log("registor :",actionName)
  }
  else{
    yield takeEvery(
      actionName,
      function * (action){
        yield put(actions.reducerChange(
          state => callback(state, action)
        ))
      }
    );
    //console.log("registor :",actionName)
  }
}

export default function* rootSaga() {
  for(let key in takeSagas){
    yield fork(setTake, key, takeSagas[key]);
  }
}



// ["CHANGE_ZOOM"] : (state, action) => (
//   state.withMutations(m => (
//     m.set('size', action.payload)
//   ))
// ),

// function* changeText(action) {
//   let html = "";
//   let dst = markedex.markdownCreate(action.payload, null);
//
//
//   if(dst["header"]["diff"] == true){
//     const markold = markedex.markdownCreate(fs.readFileSync("default.md").toString(), null);
//     let dst_diff = jsdiff.diffWords(markold["value"], dst["value"])
//
//     dst_diff.forEach((part)=>{
//
//       var color
//         = part.added   ? "<font color='green'>"+part.value+"</font>"
//         : part.removed ? "<font color='red'>"+part.value+"</font>"
//         : part.value;
//       html = html + color;
//     });
//   }else{
//     if(dst["header"]["page-break"] == true){
//       html = dst["value"].split("<hr>");
//     }else{
//       html = dst["value"]
//     }
//   }
//
//
//   yield put(mutation(m=>
//     m.set('html', html)
//     .set('zoom', dst["header"]["zoom"] || 1)
//   ));
//
// }
