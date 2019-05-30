import request from '../../configs/axios';
import qs from 'qs';

class SendServe {
  // 单例
  static singleInstance(){
    if (!SendServe.instance) {
      SendServe.instance = new SendServe();
    }
    return SendServe.instance;
  }

  constructor() {
    this.prefix = "/sendstrategy/";
  }

  // 获取收件人列表
  getReceiverList(params) {
    // console.log('params :', params);
    return new Promise((resolve, reject) => {
      request.post(this.prefix + 'list-page-receive-detail', qs.stringify(params), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then(({ data }) => {
        if (data.status === "200" && data.response) {
          resolve(data.response);
        } else {
          reject(data);
        }
      });
    });
  }

  // 保存收件人,判断是否有收件人信息
  saveReceives(marketingId) {
    return new Promise((resolve, reject) => {
      request.get(this.prefix + 'create-receive-detail', {
        params: { marketingId }
      }).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data);
        } else {
          reject(data);
        }
      }).catch(err => {
        console.error("err :", err);
      });
    });
  }

  // 发测试邮件
  sendTestMail(params) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix + 'send-test-mail', params).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data);
        } else {
          reject(data);
        }
      }).catch(err => {
        console.error("err :", err);
      });
    });
  }

  // 测试邮件发送记录
  getTestHistories(marketingId) {
    return new Promise((resolve, reject) => {
      request.post('/mailtestrecord/list', {
        pageNum: 0,
        pageSize: 0,
        marketingId
      }).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data.response);
        } else {
          reject(data);
        }
      }).catch(err => {
        console.error("err :", err);
      });
    });
  }


  // 立即发送
  sendAtNow(marketingId) {
    return new Promise((resolve, reject) => {
      request.get(this.prefix + 'send-at-now', {
        params: { marketingId }
      }).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }


  // 安排发送
  arrangeStrategy(params) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix + 'creat-modify-strategy', params).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }

  // 获取某营销的发送策略
  getStrategyInfo(marketingId) {
    return new Promise((resolve, reject) => {
      request.get(this.prefix + 'info', { params: { marketingId } }).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data.response);
        } else {
          reject(data);
        }
      }).catch(err => {
        console.error("err :", err);
      });
    });
  }


  // 取消安排
  cancelStrategy(marketingId) {
    return new Promise((resolve, reject) => {
      request.get(this.prefix + 'delete-by-marketingId', { params: { marketingId } }).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data);
        } else {
          reject(data);
        }
      }).catch(err => {
        console.error("err :", err);
      });
    });
  }
}

export default SendServe.singleInstance();
