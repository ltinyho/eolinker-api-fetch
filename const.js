const API_STATUS = {
  '启动': 0,
  '维护': 1,
  '弃用': 2,
  '待定': 3,
  '开发': 4,
  '测试': 5,
  '对接': 6,
  'BUG': 7,
};
const API_REQUEST_TYPE = {
  POST: 0,
  GET: 1,
  PUT: 2,
  DELETE: 3,
  HEAD: 4,
  OPTIONS: 5,
  PATCH: 6,
};

module.exports = {
  API_STATUS,
  API_REQUEST_TYPE,
};
