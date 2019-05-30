import request from "../../configs/axios";
import { formDataFilterEmpty } from "../../utils/tool";

class MarketCategoryServe {
  // 单例
  static singleInstance() {
    if (!MarketCategoryServe.instance) {
      MarketCategoryServe.instance = new MarketCategoryServe();
    }
    return MarketCategoryServe.instance;
  }

  constructor() {
    this.prefix = "/marketingcategory/";
  }

  getMarketCategories(params, type = 'listCount') {
    return new Promise((resolve, reject) => {
      request.post(this.prefix + type, params).then(res => {
          const { data } = res;
          if (data.status === "200") {
            resolve(data.response);
          } else {
            reject(data);
          }
        });
    });
  }

  getMarketCategoryInfo(id) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix + "listCount", { id, name: '' }).then(res => {
          const { data } = res;
          if (data.status === "200") {
            resolve(data.response.list[0]);
          } else {
            reject(data);
          }
        });
    });
  }

  addMarketCategories(name) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix + "insert", { name }).then(res => {
          const { data } = res;
          if (data.status === "200") {
            resolve(data);
          } else {
            reject(data);
          }
        });
    });
  }

  editMarketCategories(params) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix + "modify", params).then(res => {
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

  deleteMarketCategories(ids, createId) {
    const params = Array.isArray(ids) ? ids : [ids];
    return new Promise((resolve, reject) => {
      request.post(this.prefix + "delete", formDataFilterEmpty({
        createId,
        "ids[]": params
      })).then(res => {
          // console.log("deletMarketCategories :", res);
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

  initCategory() {
    return new Promise((resolve, reject) => {
      request.post(this.prefix + "insertInit").then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data.message);
        } else {
          reject(data);
        }
      }).catch(err => {
        console.error("err :", err);
      });
    });
  }
}

export default MarketCategoryServe.singleInstance();
