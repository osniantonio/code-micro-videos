const { createStore, applyMiddleware } = require("redux");
const { default: createDefaultMiddleware } = require("redux-saga");
const { take, put, call, actionChannel, debounce, select, all, fork } = require("redux-saga/effects");
const axios = require("axios");

function reducer(state, action) {
  if (action.type === "acaoY") {
    return { ...state, text: action.value };
  }
  if (action.type === "acaoX") {
    return { value: action.value };
  }
}

function* sagaNonBlocking() {
  console.log("antes do call");
  const {data} = yield call(axios.get, "http://nginx/api/videos");
  console.log("depois do call");
}

function* searchData(action) {
  console.log("Hello World");
  //const channel = yield actionChannel('acaoY');
  //console.log(channel);
  //while (true) {
    console.log(yield select((state) => state.text));
    console.log("antes da acao y");
    //const action = yield take(channel);
    const search = action.value;
    try {

      yield fork(sagaNonBlocking);
      console.log("depois do fork");
      
      // yield all mesma coisa do Promise.all
      /*
      const { response1, response2 } = yield all([
        call(axios.get, "http://nginx/api/videos?search=" + search),
        call(axios.get, "http://nginx/api/categories?search=" + search)
      ]);
      console.log(response1.data.data.length, response2.data.data.length);
      */

      /*
      const { data } = yield call(
        //() => axios.get('http://nginx/api/videos?search=' + search)
        //(search) => axios.get('http://nginx/api/videos?search=' + search), search
        axios.get, "http://nginx/api/videos?search=" + search
      );

      const { data1 } = yield call(        
        axios.get, "http://nginx/api/categories?search=" + search
      );
      */
      console.log(search);
      yield put({
        type: "acaoX",
        value: '',
      });
    } catch (e) {
        yield put({
            type: "acaoX",
            error: e,
          });
    }
  //}
}

function* debounceSearch() {
  yield debounce(1000, 'acaoY', searchData);
}

function* helloWorld() {
  console.log('Hello World');
}

function* rootSaga() {
  yield all([
    helloWorld(),
    debounceSearch()
  ]);
  //yield fork(helloWorld);
  //yield fork(debounceSearch);
  console.log('final');
}

const sagaMiddleware = createDefaultMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);
const action = (type, value) => store.dispatch({ type, value });
action("acaoY", "l");
action("acaoY", "lu");
action("acaoY", "lui");
action("acaoY", "luiz");
action("acaoY", "luiz c");
action("acaoY", "luiz ca");
//action("acaoW", "a");
console.log(store.getState());
