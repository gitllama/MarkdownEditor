import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import { ipcRenderer } from 'electron'

import path from 'path';
import fs from 'fs';
import * as markedex from '../../logic/marked-ex.js';
import * as igxl from '../../logic/igxl.js';
import deepAssign from 'deep-assign';

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

function readfile(params){
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function(evt){
      resolve(evt.target.result);
    }
    reader.readAsText(params);
  });
}

export function* init(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('config', action.payload)
    )
  ));

  // yield markdownAsync({payload : "# markdown"})
  yield readfileAsync({payload : path.join(__dirname, '../../Empty.md')})

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('busy', false)
    )
  ));
}

export function* readToMemoryAsync(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('busy', true))
  ));
  let data = yield select(state => state.get("memory"))
  if(data == null) data ={}

  const ary = action.payload
  ary.forEach((path)=>{
    console.log(path)
    let txt = fs.readFileSync(path).toString();
    //deepAssign(data, igxl.getBin(txt));
    deepAssign(data, igxl.getMeasured(txt));
  });

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('busy', false)
      .set('memory', data)
    )
  ));

  console.log("read datalog!")
}

export function* readfileAsync(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('busy', true))
  ));
  let dst = "";
  let filepath = null;
  if(typeof action.payload === 'string'){
    dst = fs.readFileSync(action.payload).toString();
    filepath = action.payload;
  }else{
    //D&D
    dst = yield call(readfile, action.payload)
    filepath = action.payload.path;
    console.log(action.payload.path)
  }

  yield markdownAsync({payload : dst})

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('busy', false)
       .set('filename', filepath)
    )
  ));

  ipcRenderer.send("change-title", filepath)
  console.log("read!")
}

export function* savefileAsync(action) {
  try{
    let fullpath = action.payload != null
                 ? action.payload                                 // from Save As
                 :  yield select(state => state.get("filename")); // from Save

    let txt = yield select(state => state.get("text"))

    fs.writeFileSync(fullpath ,txt);

    yield put(actions.reducerChange(
      (state)=> state.withMutations(m => m.set('filename', fullpath))
    ));
    ipcRenderer.send("change-title", fullpath)
    // ipcRenderer.send("save-file", filename)

    console.log(`save! : ${fullpath}`)
  }catch(e){
    console.log(e)
  }
}

export function* savehtmlAsync(action) {
  try{
    let txt = yield select(state => state.get("html"))
    let html = `<html>\n<body>\n${txt}\n</body></html>`
    fs.writeFileSync(action.payload ,html);
    console.log(`save! : ${action.payload}`)
  }catch(e){
    console.log(e)
  }
}

export function* markdownAsync(action) {
  let src = action.payload ? action.payload : yield select(state => state.get("text"))
  let file = yield select(state => state.get("filename"));
  file = file != null ? file.split('.').pop() : null;

  let config = yield select(state => state.get("config"))
  let data = yield select(state => state.get("memory"))

  let dst = markedex.markdownCreate(src, config["marked-ex"], data, file);

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
