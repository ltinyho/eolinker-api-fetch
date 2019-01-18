const path = require('path');
const fs = require('fs-extra');
const api = require('./api');
const { username, password, dataDir, spaceKey, projectHashKey } = require('./env');
const { API_STATUS } = require('./const');

function Eolinker(options) {
  this.api = api;
  this._options = Object.assign({}, {
    spaceKey: '',
    projectHashKey: '',
    username: '',
    password: '',
  }, options);
  this.init();
}

Eolinker.prototype = {
  constructor: api,
  init() {
    this.checkLogin();
  },
  get spaceKey() {
    return this._options.spaceKey;
  },
  get projectHashKey() {
    return this._options.projectHashKey;
  },
  checkLogin() {
    this.api.getUserInfo().catch(() => {
      this.login();
    });
  },
  login() {
    this.api.login(this._options.username, this._options.password);
  },
  getGroupApiList(groupID) {
    return this.api.getApiListByCondition({
      groupID,
      spaceKey: this.spaceKey,
      projectHashKey: this.projectHashKey,
    }).then((data) => {
      if (data.apiList.length <= 0) {
        return;
      }
      const apiInfoList = [];
      const apiInfoPromise = data.apiList.map(item => {
        return webEolinker.api.getApiInfo({
          spaceKey: webEolinker.spaceKey,
          projectHashKey: webEolinker.projectHashKey,
          apiID: item.apiID,
        });
      });
      try {
        return Promise.all(apiInfoPromise).then((data) => {
          console.log(path.resolve(dataDir, 'coupon.json'));
          fs.outputJson(path.resolve(dataDir, 'coupon.json'), data);
          return data;
        });
      } catch (e) {
        throw new Error('获取接口数据失败');
        return Promise.reject(e);
      }
    });
  },
};
const webEolinker = new Eolinker({
  username,
  password,
  spaceKey,
  projectHashKey,
});
const getCouponList = webEolinker.getGroupApiList(272732);
