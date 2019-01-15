const api = require('./api');
const { username, password } = require('./env');

checkLogin();

async function checkLogin() {
  const userInfo = await api.getUserInfo();
  console.log(userInfo);
  if (userInfo.statusCode === '100001') {
    return api.login(username, password).then((res) => {
      console.log(res);
      return true;
    });
  }
  return Promise.resolve(true);
}
