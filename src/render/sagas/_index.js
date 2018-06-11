import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import Immutable from 'immutable';

import * as markedex from '../../logic/marked-ex.js';
import * as jsdiff from 'diff';



import fs from 'fs';


function mutation(callback){
  return actions.reducerChange(
    (state)=> state.withMutations(m =>
      callback(m)
    )
  )
}

const takeSagas = {
  ['INIT_ASYNCLATEST'] : init,
  ["CHANGE_TEXT_ASYNCLATEST"] : changeText,
  ["CHANGE_CURSOR_ASYNCLATEST"] : changeCursor,

  ["CHANGE_ZOOM"] : (state, action) => (
    state.withMutations(m => (
      m.set('size', action.payload)
    ))
  ),

  ["PAGE"] : (state, action) => (
    state.withMutations(m => (
      m.set('page', state.get("page") + action.payload)
    ))
  ),
};

function* init(action) {
  yield put(mutation(m=>m.set('busy', false)));
}

function* changeText(action) {
  let html = "";
  let dst = markedex.markdownCreate(action.payload, null);


  if(dst["header"]["diff"] == true){
    const markold = markedex.markdownCreate(fs.readFileSync("default.md").toString(), null);
    let dst_diff = jsdiff.diffWords(markold["value"], dst["value"])

    dst_diff.forEach((part)=>{

      var color
        = part.added   ? "<font color='green'>"+part.value+"</font>"
        : part.removed ? "<font color='red'>"+part.value+"</font>"
        : part.value;
      html = html + color;
    });
  }else{
    if(dst["header"]["page-break"] == true){
      html = dst["value"].split("<hr>");
    }else{
      html = dst["value"]
    }
  }


  yield put(mutation(m=>
    m.set('html', html)
    .set('zoom', dst["header"]["zoom"] || 1)
  ));

}

function* changeCursor(action) {
  console.log(action.payload)
}


// saga monitor

export default function* rootSaga() {

  const setTake = function* (actionName, callback) {
    if(actionName.indexOf("_ASYNCLATEST") > 0){
      yield takeLatest(actionName, callback);
    }
    else if(actionName.indexOf("_ASYNC") > 0){
      yield takeEvery(actionName, callback);
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
    }
  }

  for(let key in takeSagas){
    yield fork(setTake, key, takeSagas[key]);
  }
}
