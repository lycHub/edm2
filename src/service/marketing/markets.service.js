import request from '../../configs/axios';
import { formDataFilterEmpty } from '../../utils/tool';

class MarketsServe {
  // 单例
  static singleInstance(){
    if (!MarketsServe.instance) {
      MarketsServe.instance = new MarketsServe();
    }
    return MarketsServe.instance;
  }


  constructor() {
    this.prefix = "/marketinginfo/";
    this.prefix_contents = "/mailcontent/";
  }

  getMarketList(params) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix + 'list', params).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data.response);
        } else {
          reject(data);
        }
      });
    });
  }

  getMarketInfo(id) {
    return new Promise((resolve, reject) => {
      request.get(this.prefix + 'selectById', { params: { id } }).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data.response);
        } else {
          reject(data);
        }
      });
    });
  }


  addMarket(params) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix + "insert", params).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }


  editMarket(params) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix + 'modify', params).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }


  // 批量改变营销分类
  changeMarketCategory(marketCategoryId, ids) {
    const idArr =  Array.isArray(ids) ? ids : [ids];
    return new Promise((resolve, reject) => {
      request.post(this.prefix + "modifyMarketCategoryId", formDataFilterEmpty({ marketCategoryId, "ids[]": idArr })).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }


  deletMarkets(ids) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix + "delete", formDataFilterEmpty({ "ids[]": ids })).then(({ data }) => {
        if (data.status === "200") {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }


  // copy
  copyMarket(params) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix + 'copySave', params).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }


  // 正文相关
  addContents(params) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix_contents + "insert", params).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }

  editContents(params) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix_contents + "modify", params).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }


  deleteContents(ids) {
    const params = Array.isArray(ids) ? ids : [ids];
    return new Promise((resolve, reject) => {
      request.post(this.prefix_contents + "delete", formDataFilterEmpty({ "ids[]": params })).then(res => {
          // console.log("deletMarketCategories :", res);
          const { data } = res;
          if (data.status === "200") {
            resolve(data);
          } else {
            reject(data);
          }
        });
    });
  }


  // 摘要
  changeAbstracts(params) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix + "abstracts", params).then(res => {
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

export default MarketsServe.singleInstance();
