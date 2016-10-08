import React from 'react';
import { connect } from 'react-redux';
import Stream from './presenter';

function mapStateToProps(state) {
  const {tracks} = state;
  return {
    tracks
  }
}

export default connect(mapStateToProps)(Stream);
