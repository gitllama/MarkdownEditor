import Immutable from 'immutable';

const initialState = Immutable.Map({
  busy : true,
  config : null,

  filename : null,
  text : null,
  html : null,

  title : "",
  docNo : "",
  caution : "DRAFT",

  view : "Editor"
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
