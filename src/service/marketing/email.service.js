import request from '../../configs/axios';
import { formDataFilterEmpty } from '../../utils/tool';

class EmailServe {
  // 单例
  static singleInstance(){
    if (!EmailServe.instance) {
      EmailServe.instance = new EmailServe();
    }
    return EmailServe.instance;
  }

  constructor() {
    this.prefix = "/senderinfo/";
    this.prefix_test = "/mailtest/";
  }

  getEmails(params, isTest = false) {
    const prefix = isTest ? this.prefix_test : this.prefix;
    return new Promise((resolve, reject) => {
      request.post(prefix + 'list', params).then(res => {
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


  addEmail(params, isTest = false) {
    const prefix = isTest ? this.prefix_test : this.prefix;
    return new Promise((resolve, reject) => {
      request.post(prefix + 'insert', params).then(res => {
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


  deleteEmails(ids) {
    const params = Array.isArray(ids) ? ids : [ids];
    return new Promise((resolve, reject) => {
      request.post(this.prefix + "delete", formDataFilterEmpty({ "ids[]": params })).then(res => {
          // console.log("deleteEmails :", res);
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

export default EmailServe.singleInstance();
