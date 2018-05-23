import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import { ipcRenderer } from 'electron'

import fs from 'fs';
import * as markedex from '../logic/marked-ex.js';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function* init(action) {
  yield markdownAsync({payload : "# markdown"})

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('busy', false)
      .set('config', action.payload)
    )
  ));
}

export function* readfileAsync(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('busy', true))
  ));

  let hoge = fs.readFileSync(action.payload).toString()

  yield markdownAsync({payload : hoge})

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('busy', false)
      .set('filename', action.payload)
    )
  ));

  ipcRenderer.send("change-title", action.payload)
  console.log("read!")
}

export function* savefileAsync(action) {
  console.log(action)
  let fullpath = action.payload
  if(fullpath != null){
    // from Save As
    let txt = yield select(state => state.get("text"))
    // try{
      fs.writeFileSync(fullpath ,txt);
      yield put(actions.reducerChange(
        (state)=> state.withMutations(m => m.set('filename', fullpath))
      ));
      ipcRenderer.send("change-title", fullpath)
      console.log("save!")
    // }
    // catch{
    //
    // }
  }else{
    // from Save
    let filename = yield select(state => state.get("filename"))
    console.log(filename)
    ipcRenderer.send("save-file", filename)
  }
}

export function* markdownAsync(action) {

  let dst = markedex.markdownCreate(action.payload,null);

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('html', dst["value"])
      .set('text', action.payload))
      .set('title', dst["header"]["title"])
      .set('docNo', dst["header"]["no"])
      .set('caution', dst["header"]["caution"])
  ));
}
