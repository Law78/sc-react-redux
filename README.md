
# Inizializzazione Ambiente

0) Avvio con
```
npm init -y
```
1) Creo la cartella dist con index.html con l'entry point app e il bundle come script
2) Lancio:
```
npm install --save-dev webpack webpack-dev-server
```
3) In package.json inserisco: "start": "webpack-dev-server --progress --colors --hot --config ./webpack.config.js"
4) Creo il file webpack.config.js
5) Creo la cartella src ed il file index.js
6) Installo il modulo per l'HOT RELOADING:
```
npm install --save-dev react-hot-loader
```
7) Aggiungo nell'entry di webpack.config.js le impostazioni per l'hot reloading:
'webpack-dev-server/client?http://localhost:8080',
'webpack/hot/only-dev-server',
e aggiungo il parametro hot: true nella parte del devServer sempre del webpack.config.js
8) Installo Babel per la transpilazione del codice ES6 e React:
```
npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react
```
9) Creo il file .babelrc:
```
{
  "presets": ["react", "es2015"],
  "plugins": ["react-hot-loader/babel"]
}
```
 o aggiungo queste impostazioni nel package.json:
```
"babel": {
  "presets": ["es2015", "react"],
  "plugins": ["babel"]
},
```
10) Inserisco le seguenti impostazioni in webpack.config.js:
```
module: {
 loaders: [{
   test: /\.jsx?$/,
   exclude: /node_modules/,
   loaders: ['babel?cacheDirectory']
 }]
},
resolve: {
  root: __dirname,
   alias: {
   },
   modulesDirectories: [
       'node_modules',
       './src/components'
   ],
   extensions: ['','.js','.jsx']
},
```
11) Installo le librerie iniziali di React: npm install --save react react-dom
12) Creo la cartella components in src ed il file Stream.jsx a cui associo del codice creando un componente stateless:
```js
import React from 'react';

function Stream({ tracks = [] }) {
  return (
    <div>
      {
         tracks.map((track) => {
           return <div className="track">{track.title}</div>;
         })
       }
    </div>
  );
}

export default Stream;
```
13) Inserisco il codice anche in index.jsx che importa Stream.jsx:
```js
import React from 'react';
import ReactDOM from 'react-dom';
import Stream from 'Stream';

const tracks = [
  {
    title: 'Some track'
  },
  {
    title: 'Some other track'
  }
];

ReactDOM.render(
  <Stream tracks={tracks} />,
  document.getElementById('app')
);
```
14) Avvio con npm start, apro localhost:8080 e troverò un messaggio di WARNING in console. Devo aggiungere una proprietà key per ogni elemento react di una lista, lo faccio utilizzando l'index della max:
```
tracks.map((track, key) => {
  return <div className="track" key={key}>{track.title}</div>;
})
```

###FINE PRIMA parte

# Ambiente di Test

1) Installiamo un ambiente di Test, con mocha (test frameork), chai (libreria di asserzioni) e jsdom che ci fornisce un DOM in Javascript che funziona in NodeJS:
```
npm install --save-dev mocha chai jsdom
```
2) creo una cartella di test e un file di setup.js con il seguente codice:
```js
import React from 'react';
import { expect } from 'chai';
import jsdom from 'jsdom';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

global.React = React;
global.expect = expect;
```
Abbiamo esposto nel global un document ed un window generati da jsdom, che utilizzeremo duranti i test di React.  Inoltre dobbiamo esporre tutte le proprietà dell'oggetto window, sempre per i nostri test. Infine, accediamo a React ed expect, assegnadoli al global.
3) Devo aggiungere un nuovo script per avviare l'ambiente di test, che avvierà Babel, userà mocha come test framework, e il test/setup.js e analizzerà i file con suffisso \*spec.js in test/\*\*:
```
"test": "mocha --compilers js:babel-core/register --require ./test/setup.js 'test/**/*spec.js'"
```
4) Installiamo anche Enzyme di Airbnb e TestUtils di React, che viene utilizzato da Enzyme:
```
npm install --save-dev react-addons-test-utils enzyme
```
5) Creo il mio primo test in test/components/Stream.spec.js:
```js
import Stream from '../../src/components/Stream';
import { shallow } from 'enzyme';

describe('Stream', () => {

  const props = {
    tracks: [{ title: 'x' }, { title: 'y' }],
  };

  it('shows two elements', () => {
    const element = shallow(<Stream { ...props } />);

    expect(element.find('.track')).to.have.length(2);
  });

});
```
Dove ho creato una finta props con 2 tracks e verifico che la lunghezza sia proprio di 2, in quanto puntiamo il class .track (lo sappiamo perchè il className del componente è proprio track)
6) Aggiungo il comando scripts in package.json:
```
"test:watch": "npm run test -- --watch"
```
7) Avvio con: npm run test:watch

### FINE SECONDA Parte

# Redux

Redux si descrive come un contenitore predicibile dello stato di una applicazione JS. Solitamente è in accoppiata con React ma in realtà possiamo utilizzarlo come contenuto dello stato dell'applicazione con qualsiasi altra libreria o framework Javascript. E' un ecosistema molto grande, inventato da Dan Abramov.

Redux ha un flusso unidirezionale dei dati ed è una implementazione dell'architettura Flux. Fondamentalmente succede queste: sia avvia un'azione da un componente (ad es. da un pulsante), qualcuno "ascolta" quest'azione, "utilizza" ciò che trasporta questa azione (detto payload, ovvero il dato in se che deve essere consumato), e si genera un nuovo stato che verrà reso disponibile a tutti i componenti, che si aggiorneranno. Questo avviene in un ciclo infinito.

1) Installiamo redux:
```
npm install --save redux redux-logger
```
2) Aggiorniamo il nostro index.js in src:
```js
import React from 'react';
import ReactDOM from 'react-dom';

//aggiunte per Redux
import configureStore from './stores/configureStore';
import * as actions from './actions';

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
/* Inizializziamo un OGGETTO STORE a cui associamo delle AZIONI che ancora sono da definire (vedi punto 5 di questa guida!!!).
Lo Store è un OGGETTO SINGLETON REDUX e mantiene lo stato globale. In questo caso facciamo il dispatch di una azione con un payload rappresentato dalle nostre track hardcoded. Ovviamente non dobbiamo più passare le tracks al nostro oggetto (sarà lui a prelevarle!)
*/
const store = configureStore();
store.dispatch(actions.setTracks(tracks));

ReactDOM.render(
  <Stream />,
  document.getElementById('app')
);
```
3) Adesso dobbiamo creare la nostra prima AZIONE, il CREATORE DI AZIONI, i REDUCERS e la SOTTOSCRIZIONE allo STORE da parte del COMPONENTE per aggiornarsi.
4) Iniziamo a definire un posto dove inserire le COSTANTI che identificano le nostri AZIONI. Queste COSTANTI saranno condivise di AZIONI e REDUCERS. Creo una cartella constants in src con un file actionTypes.js con il segente codice:
```js
export const TRACKS_SET = 'TRACKS_SET';
```
5) Cos'è il CREATORE DI AZIONI? E' un PATTERN di CREAZIONE che RITORNA un OGGETTO con il suo TYPE e PAYLOAD. il TYPE identifica l'AZIONE e quindi sarà una COSTANTE che abbiamo definito in precedenza, il payload può essere qualsiasi cosa. Pertanto vado a creare in src/actions un file track.js con il seguente codice:
```js
import * as actionTypes from '../constants/actionTypes';

export function setTracks(tracks) {
  return {
    type: actionTypes.TRACKS_SET,
    tracks
  };
};
```
che importa l'actionType ed esporta una funzione setTracks con le traccie. Questa è l'azione che abbiamo impostato nel dispatch dello store. Ritorna un oggetto con TYPE e le tracks (in stile ES6, e quindi senza scrivere tracks: tracks).
6) Creiamo un punto di ingresso per i nostri CREATORI, per cui in actions creo il file index.js con il codice:
```js
import { setTracks } from './track';

export {
  setTracks
};
```
Lo scopo del file è fare il "bundle" di tutti i creatori di azione, quindi attuare una sorta di interfaccia per tutta la mia Applicazione.
7) Ora dobbiamo rendere possibile il cambio di stato che effettua una azione. Questo è possibile con i REDUCERS, che prendono una azione con il type e il payload e la riducono in un nuovo stato (previousState, action) => newState. Importante: anzichè modificare il previousState otteniamo un newState. Lo stato in REDUX è da considerare IMMUTABILE, prenderai sempre uno stato precedente e ritornerai un nuovo oggetto dello stato nuovo. Creo la cartella src/reducers con il file track.js:
```js
import * as actionTypes from '../constants/actionTypes';

const initialState = [];

export default function(state = initialState, action) {
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
```
Qui importiamo le ACTION TYPE, inizializziamo uno stato iniziale ed esportiamo una funzione anonima. Questa ha il suo interno una SWITCH, in quanto le actionTypes saranno di vario tipo. A seconda del tipo dell'azione, ritorna la funzione appropriata. In questo caso ho la sola setTracks che prende lo stato e l'azione, preleva le tracks (payload) dall'azione e ritorna un oggetto (tramite lo spread operator in modo che siano immutabili), con lo stato e le tracks.
8) Infine creiamo il nostro index.js in reducers come punto di ingresso per i REDUCERS:
```js
import { combineReducers } from 'redux';
import track from './track';

export default combineReducers({
  track
});
```
9) Abbiamo fatto il dispatch della nostra prima azione, implementato il tipo di azione e generato un nuovo stato tramite un reducer. Ci manca ancora lo STORE, che però abbiamo già inserito nella nostra index.js. Pertanto in src/stores creo configureStore.js:
```js
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import rootReducer from '../reducers/index';

const logger = createLogger();

const createStoreWithMiddleware = applyMiddleware(logger)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
```
10) Lanciamo con npm start e wow. In console vediamo il nostro nuovo stato, ma nel browser no. Questo perchè il componente Stream ancora non è connesso allo Store.
