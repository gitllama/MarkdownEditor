import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga';
import { ipcRenderer } from 'electron'

import App from './components/Preview';
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
    type  : "REDRAW",
    payload : param
  });
});
// ipcRenderer.on("change-cursor", (event, param) =>{
//   store.dispatch({
//     type  : "CHANGE_CURSOR_ASYNCLATEST",
//     payload : param
//   });
// });
//
// ipcRenderer.on("resize", (event, param) =>{
//   store.dispatch({
//     type  : "CHANGE_ZOOM",
//     payload : param
//   });
// });
//

import styled from 'styled-components';
const DIVS = styled.div`
  width : 100%
  height : 10px;
  border: 1px solid #000000;
  -webkit-app-region: drag;
`;
const DIVS2 = styled.div`
  width : 100%
  border: 1px solid #000000;
`;
ReactDOM.render(
  <Provider store={store}>
    <div>
      <DIVS/>
      <App />
    </div>
  </Provider>,
  document.getElementById('root')
);
