export default function configureStore(initialState) {
  const store = createStore(reducer, initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f
  ));
  return store;
}
