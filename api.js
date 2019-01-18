const axios = require('axios');
const querystring = require('querystring');
const CryptoJS = require('crypto-js');
const fs = require('fs');
const { verifyCode, userToken, fsExistsSync } = require('./utils');
const agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';
const headers = {
  'Origin': 'https://www.eolinker.com',
  'Host': 'www.eolinker.com',
  'Referer': 'https://www.eolinker.com/',
  'User-Agent': agent,
  'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
};
let loginVerfyCode = '';
axios.default.withCredentials = true;
axios.default.headers = headers;

const xhr = axios.create({
  baseURL: 'https://www.eolinker.com',
  headers: headers,
});
xhr.interceptors.request.use((config) => {
  if (config.method === 'post' && config.isJson !== true) {
    config.data = querystring.stringify(config.data);
  }
  const token = userToken();
  config.headers.Cookie = `userToken=${token.userToken};verifyCode=${token.verifyCode}`;
  return config;
});
xhr.interceptors.response.use((res) => {
  const cookieList = res.headers['set-cookie'];
  if (cookieList) {
    const userTokenStr = cookieList.find(item => item.includes('userToken'));
    if (userTokenStr) {
      const token = {
        'userToken': userTokenStr.split(';')[0].split('=')[1],
        'verifyCode': loginVerfyCode,
      };
      fs.writeFileSync('token.json', JSON.stringify(token));
    }
  }
  if (res.data.statusCode === '000000') {
    return res.data;
  }
  return Promise.reject(res.data);
}, (error) => {
  return Promise.reject(error);
});
const api = {
  login(username, password) {
    loginVerfyCode = verifyCode();
    return xhr({
      url: '/common/Guest/login',
      method: 'post',
      data: {
        'loginCall': username,
        'loginPassword': CryptoJS.MD5(password).toString(),
        'verifyCode': loginVerfyCode,
      },
    });
  },
  getUserInfo() {
    return xhr({
      url: '/common/User/getUserInfo',
      method: 'post',
    });
  },
  getProductList(spaceKey) {
    return xhr({
      method: 'post',
      url: `/space/Company/getProductList`,
      data: {
        spaceKey,
      },
    });
  },
  getCompanyList() {
    return xhr({
      method: 'post',
      url: `/space/Company/getCompanyList`,
      data: {},
    });
  },
  getApiInfo({ spaceKey, projectHashKey, apiID }) {
    return xhr({
      method: 'post',
      url: `/apiManagementPro/Api/getApi`,
      data: { spaceKey, projectHashKey, apiID },
    });
  },
  getApiListByCondition({
                          spaceKey,
                          projectHashKey,
                          groupID,
                          apiStatus = 0,
                          condition = 0,
                          asc = 0,
                          orderBy = 3,
                        }) {
    return xhr({
      method: 'post',
      url: `/apiManagementPro/Api/getApiListByCondition`,
      data: {
        spaceKey,
        projectHashKey,
        groupID,
        orderBy,
        asc,
        condition,
        apiStatus,
      },
    });
  },
};

module.exports = api;
