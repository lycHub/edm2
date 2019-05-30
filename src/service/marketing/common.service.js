import request from '../../configs/axios';

class CommonServe {
  // 单例
  static singleInstance(){
    if (!CommonServe.instance) {
      CommonServe.instance = new CommonServe();
    }
    return CommonServe.instance;
  }

  // 营销状态
  getMarketStatus() {
    return new Promise((resolve, reject) => {
      request.get('/common/getAllEnum').then(({ data }) => {
        if (data.status === "200") {
          const list = data.response.filter(item => item.value !==2 && item.value !==3) || [];
          list.unshift({
            value: -1,
            desc: 'All'
          });
          resolve(list);
        } else {
          reject(data);
        }
      });
    });
  }


  // 时区
  getTimeZones() {
    return new Promise((resolve, reject) => {
      request.get('/common/query-all-zoneId').then(({ data }) => {
        if (data.status === "200") {
          resolve(data.response);
        } else {
          reject(data);
        }
      });
    });
  }


  // 用户信息
  getContext() {
    return new Promise((resolve, reject) => {
      request.post('/employeeLoginContext/getContext').then(({ data }) => {
        if (data.status === "200") {
          resolve({
            id: data.response.id,
            username: data.response.username
          });
        } else {
          reject(data);
        }
      });
    });
  }
}

export default CommonServe.singleInstance();
