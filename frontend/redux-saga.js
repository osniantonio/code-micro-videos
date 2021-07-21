const { createStore, applyMiddleware } = require("redux");
const { default: createDefaultMiddleware } = require("redux-saga");
const { take, put, call } = require("redux-saga/effects");
const axios = require("axios");

function reducer(state, action) {
  if (action.type === "acaoX") {
    return { value: action.value };
  }
}

function* helloWorldSaga() {
  console.log("Hello World");
  while (true) {
    console.log("antes da acao y");
    const action = yield take("acaoY");
    const search = action.value;
    try {
      const { data } = yield call(
        //() => axios.get('http://nginx/api/videos?search=' + search)
        //(search) => axios.get('http://nginx/api/videos?search=' + search), search
        axios.get, "http://nginx/api/videos?search=" + search
      );
      //console.log(data);
      const value = "Novo valor ".concat(Math.random());
      console.log(value);
      yield put({
        type: "acaoX",
        value: data,
      });
    } catch (e) {
        yield put({
            type: "acaoE",
            error: e,
          });
    }
  }
}

const sagaMiddleware = createDefaultMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(helloWorldSaga);
const action = (type, value) => store.dispatch({ type, value });
action("acaoY", "a");
action("acaoY", "a");
action("acaoW", "a");
console.log(store.getState());
