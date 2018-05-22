import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import { ipcRenderer } from 'electron'

import fs from 'fs';
import * as markedex from '../logic/marked-ex.js';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function* init(action) {
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
  console.log(action.payload)
  let hoge = fs.readFileSync(action.payload).toString()

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('busy', false)
      .set('text', hoge)
      .set('filename', action.payload)
    )
  ));
  ipcRenderer.send("change-title", action.payload)
  console.log("read!")
}

export function* savefileAsync(action) {
  if(action.payload != null){
    // from Save As
    let txt = yield select(state => state.get("text"))
    // try{
      fs.writeFileSync(action.payload ,txt);
      yield put(actions.reducerChange(
        (state)=> state.withMutations(m => m.set('filename', action.payload))
      ));
      ipcRenderer.send("change-title", filename)
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
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('busy', true))
  ));

  let contents = fs.readFileSync(action.payload)
  let dst = markedex.markdownCreate(contents.toString());

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('html', dst).set('busy', false))
  ));
}
