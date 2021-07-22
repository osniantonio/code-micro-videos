const { createStore, applyMiddleware } = require("redux");
const { default: createDefaultMiddleware } = require("redux-saga");
const { take, put, call, actionChannel } = require("redux-saga/effects");
const axios = require("axios");

function reducer(state, action) {
  if (action.type === "acaoX") {
    return { value: action.value };
  }
}

function* helloWorldSaga() {
  console.log("Hello World");
  const channel = yield actionChannel('acaoY');
  console.log(channel);
  while (true) {
    console.log("antes da acao y");
    const action = yield take(channel);
    const search = action.value;
    try {
      const { data } = yield call(
        //() => axios.get('http://nginx/api/videos?search=' + search)
        //(search) => axios.get('http://nginx/api/videos?search=' + search), search
        axios.get, "http://nginx/api/videos?search=" + search
      );
      console.log(search);
      yield put({
        type: "acaoX",
        value: data,
      });
    } catch (e) {
        yield put({
            type: "acaoX",
            error: e,
          });
    }
  }
}

const sagaMiddleware = createDefaultMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(helloWorldSaga);
const action = (type, value) => store.dispatch({ type, value });
action("acaoY", "l");
action("acaoY", "lu");
action("acaoY", "lu");
action("acaoY", "lu");
action("acaoY", "lu");
action("acaoY", "lu");
action("acaoY", "lu");
//action("acaoW", "a");
console.log(store.getState());
