import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import Immutable from 'immutable';
import { ipcRenderer } from 'electron'
import fs from 'fs';

//import * as g from './generator.js';

// ['ACTION_NAME_THROUGH']
// ['ACTION_NAME_ASYNC']       : 連射すると遅れてまとめて帰ってくる
// ['ACTION_NAME_ASYNCLATEST'] : 最後だけ返る（すでに動いてても呼び出しは起こる）
const takeSagas = {
//  ['INIT_ASYNCLATEST'] : g.init,

  ['TEXT_CHANGE'] : (state, action) => (
    state.withMutations(m => (
      m.set('text', action.payload)
    ))
  ),
  ['TEXT_CHANGE_ASYNCLATEST'] : dragAndDropAsync,
  ['CHECK_ASYNCLATEST'] : checkAsync
};

function* checkAsync(action){
  let path = yield select(state => state.get("filepath"))
  let ctime = yield select(state => state.get("ctime"))
  try{
    let stat = fs.statSync(path);
    if(stat.ctime > ctime){
      let txt = fs.readFileSync(path).toString();
      yield put(actions.reducerChange(state=>
        state.withMutations(m => (
          m.set('ctime', stat.ctime)
           .set('text', txt)
        ))
      ));
    }
  }catch(e){

  }
}

function* dragAndDropAsync(action){
  let dst = yield call(readfile, { file : action.payload});
  ipcRenderer.send("change-text", dst)

  yield put(actions.reducerChange(state=>
    state.withMutations(m => (
      m.set('filepath', action.payload.path)
    ))
  ));
}

function readfile(params){
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function(evt){
      // let json = JSON.parse(getPngChunkString(evt.target.result, "raWh"))
      // let dst = getPngChunkData(evt.target.result, "raWd");
      // dst = conv[json.type](dst);
      // dst = dst.map((x)=> Math.floor(x));
      resolve(evt.target.result);
    }
    reader.readAsText(params.file);
  });
}

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
