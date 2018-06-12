import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga';
import { ipcRenderer } from 'electron'

import App from './components/App';
import reducer from './reducers'
import rootSaga  from './sagas'
import actions from './actions'

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)

ipcRenderer.on("sync-html", (event, param) =>{
  store.dispatch({
    type  : "SYNC_HTML_ASYNCLATEST",
    payload : param
  });
});

ipcRenderer.on("view-change", (event, param) =>{
  store.dispatch({
    type  : "VIEW_CHANGE",
    payload : param
  });
});
ipcRenderer.on("preview-change", (event, param) =>{
  store.dispatch({
    type  : "PREVIEW_CHANGE",
    payload : param
  });
});
ipcRenderer.on("page-change", (event, param) =>{
  store.dispatch({
    type  : "PAGE_CHANGE",
    payload : param
  });
});
ipcRenderer.on("redraw", (event, param) =>{
  store.dispatch({
    type  : "CHANGE_TEXT_ASYNCLATEST",
    payload : null
  });
});

Object.keys(actions).forEach((key)=>{
  ipcRenderer.on(actions[key].toString(), (event, param) =>{
    store.dispatch({
      type  : actions[key].toString(),
      payload : param
    });
  })
});


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
