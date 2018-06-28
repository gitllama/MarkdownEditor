import Immutable from 'immutable';


const initialState = Immutable.Map({
  busy : true,
  config : null,

  filename : null,
  text : null,
  view : "Editor",

  preview : "Default",
  title : "",
  docNo : "",
  caution : "DRAFT",
  html : null,

  zoom : 1,
  size : 1,
  page : 0,

  datalog : null
});

const reducers = {
  ['REDUCER_CHANGE'] : (state, action) => (
    action.payload(state)
  )
};

export default function reducer(state = initialState, action) {
  console.log("reducer", action.type)
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}
