import {
  combineReducers, createStore, applyMiddleware, compose,
} from 'redux';
import thunk from 'redux-thunk';
import { createWrapper } from 'next-redux-wrapper';
import setup from './setup';

const rootReducer = combineReducers({ setup });

const enhancers = [];
const middleware = [thunk];

const composeWithDevTools = typeof window === 'object'
  && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  && (process.env.NODE_ENV === 'development')
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;

const composedEnhancers = composeWithDevTools(
  applyMiddleware(...middleware),
  ...enhancers,
);

const makeStore = () => createStore(rootReducer, composedEnhancers);

export const wrapper = createWrapper(makeStore, { debug: process.env.NODE_ENV === 'development' });
