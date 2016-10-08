import * as actionTypes from '../constants/actionTypes';

const initialState = [];

var TrackReducer = function(state, action) {
  if(state === undefined){
    state = [];
  }
  switch (action.type) {
    case actionTypes.TRACKS_SET:
      return setTracks(state, action);
  }
  return state;
}

function setTracks(state, action) {
  const { tracks } = action;
  return [ ...state, ...tracks ];
}

export default TrackReducer;
