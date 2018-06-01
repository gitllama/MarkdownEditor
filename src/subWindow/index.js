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


ipcRenderer.on("change-text", (event, param) =>{
  store.dispatch({
    type  : "CHANGE_TEXT_ASYNCLATEST",
    payload : param
  });
});
ipcRenderer.on("change-cursor", (event, param) =>{
  store.dispatch({
    type  : "CHANGE_CURSOR_ASYNCLATEST",
    payload : param
  });
});

ipcRenderer.on("resize", (event, param) =>{
  store.dispatch({
    type  : "CHANGE_ZOOM",
    payload : param
  });
});

ipcRenderer.on("page", (event, param) =>{
  store.dispatch({
    type  : "PAGE",
    payload : param
  });
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
