import React from 'react';
import ReactDOM from 'react-dom';

//aggiunte per Redux
import configureStore from './stores/configureStore';
import * as actions from './actions';
import { Provider } from 'react-redux';

import Stream from './components/Stream';

const tracks = [
  {
    title: 'Some track'
  },
  {
    title: 'Some other track'
  }
];

//aggiunte per Redux
/* Inizializziamo un OGGETTO STORE a cui associamo delle AZIONI che ancora sono da definire.
Lo Store è un OGGETTO SINGLETON REDUX e mantiene lo stato globale. In questo caso facciamo il dispatch di una azione con un payload rappresentato dalle nostre track hardcoded. Ovviamente non dobbiamo più passare le tracks al nostro oggetto (sarà lui a prelevarle!)
*/
const store = configureStore();
store.dispatch(actions.setTracks(tracks));

ReactDOM.render(
  <Provider store={store}>
    <Stream />
  </Provider>,
  document.getElementById('app')
);
