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
  return res.data;
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
  getApiListByCondition() {
    const data = {
      spaceKey: 'PUwABKU15203820ded3304f79d21d0503be64733224ce4b',
      projectHashKey: 'lIwd7sR1f379f87c209a8f755d60ce0e9ca5b0a4ea727a8',
      groupID: 272732,
      orderBy: 3,
      asc: 0,
      condition: 0,
      apiStatus: 0,
    };
    return xhr({
      url: '/apiManagementPro/Api/getApiListByCondition',
      method: 'post',
      data: data,
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
        spaceKey: 'PUwABKU15203820ded3304f79d21d0503be64733224ce4b',
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
};

module.exports = api;
