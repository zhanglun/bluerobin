import {
  createStore,
  applyMiddleware
} from 'redux';

import thunk from 'redux-thunk';

import rootReducer from '../reducers';

// 使用中间件 包装了一下 createStore 方法
const createStoreWithMiddle = applyMiddleware(thunk)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddle(rootReducer, initialState, window.devToolsExtension ? window.devToolsExtension() : undefined);
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
