import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import { ipcRenderer } from 'electron'

import fs from 'fs';
import * as markedex from '../../logic/marked-ex.js';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkObject(obj, arr){
  if(obj == null) return null;
  let dst = null;
  if(arr.length > 1){
    if(obj[arr[0]]){
      let hoge = arr.slice()
      hoge.shift()
      return checkObject(obj[arr[0]],hoge)
    }else{
      return null;
    }
  }
  return obj[arr[0]];
}

export function* init(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('config', action.payload)
    )
  ));

  yield markdownAsync({payload : "# markdown"})

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('busy', false)
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
  let src = action.payload ? action.payload : yield select(state => state.get("text"))

  let config = yield select(state => state.get("config"))
  let dst = markedex.markdownCreate(src, config["marked-ex"]);

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('html', dst["value"])
      .set('text', src)
      .set('title', dst["header"]["title"])
      .set('docNo', dst["header"]["no"])
      .set('caution', dst["header"]["caution"])
  )));

  ipcRenderer.send("sync-html", dst)
}

export function* syncHTMLAsync(action) {


    yield put(actions.reducerChange(
      (state)=> state.withMutations(m =>
        m.set('html', checkObject(action.payload, ["value"]))
        .set('title', checkObject(action.payload,["header","title"]))
        .set('docNo', checkObject(action.payload,["header","no"]))
        .set('caution', checkObject(action.payload,["header","caution"]))
      )));

}
