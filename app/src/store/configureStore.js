import {
  createStore,
  applyMiddleware
} from 'redux';

import thunk from 'redux-thunk';

import rootReducer from '../reducers';

const createStoreWithMiddle = applyMiddleware(thunk)(createStore);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, applyMiddleware(thunk), initialState, window.devToolsExtension ? window.devToolsExtension() : undefined);
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
