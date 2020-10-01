import core from 'core';


core.network.request('login', (send, context) => {
  send({
    payload: true,
    method: 'auth', 
    username: context.params.username, 
    password: core.tools.sha256(`intrahouse${context.params.password === '' ? Date.now() : context.params.password}`),  
  });
})


core.network.response('login', (answer, res, context) => {
  // window.localStorage.setItem('token', res.token);
  
  core.cache.token = res.token;
  core.network.realtime.start();

  answer(res);
})
