import Immutable from 'immutable';

const initialState = Immutable.Map({
  busy : true,

  html_src : "null",
  html : "null",
  zoom : 1,
  size : 1,

  page : 1
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