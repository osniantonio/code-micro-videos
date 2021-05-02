const { createActions } = require('reduxsauce');

const createdActions = createActions({
  addParams: ['payload'],
  removeParam: ['id'],
});

console.log(createdActions);
// dispatch(createdActions.addParams({search}));