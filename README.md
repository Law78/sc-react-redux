
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
