import request from "../../configs/axios";

class TemplateServe {
  // 单例
  static singleInstance() {
    if (!TemplateServe.instance) {
      TemplateServe.instance = new TemplateServe();
    }
    return TemplateServe.instance;
  }

  constructor() {
    this.prefix_cat = "/templatecategory/";
    this.prefix_tem = "/mailtemplate/";
  }

  // 分类
  getTemplateCategories(params = {}) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix_cat + "list", params).then(res => {
          const { data } = res;
          if (data.status === "200") {
            resolve(data.response);
          } else {
            reject(data);
          }
        }).catch(error => {
          console.error('error :', error);
        });
    });
  }

  addTemplateCategory(name) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix_cat + "insert", { name }).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }

  // 模板
  getTemplates(params) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix_tem + "list", params).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data.response);
        } else {
          reject(data);
        }
      }).catch(error => {
        console.error('error :', error);
      });
    });
  }

  getTemplateInfo(id) {
    return new Promise((resolve, reject) => {
      request.get(this.prefix_tem + "selectById", { params: { id } }).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data.response);
        } else {
          reject(data);
        }
      }).catch(error => {
        console.error('error :', error);
      });
    });
  }

  editTemplate(params) {
    return new Promise(resolve => {
      request.post(this.prefix_tem + "modify", params).then(res => {
        const { data } = res;
        if (data.status === "200") {
          resolve(data);
        } else {
          reject(data);
        }
      }).catch(error => {
        console.error('error :', error);
      });
    });
  }


  addTemplate(params) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix_tem + "insert", params).then(res => {
        const { data } = res;
        if (data.status === "200") {
          console.log('resolve');
          resolve(data);
        } else {
          console.log('reject');
          reject(data);
        }
      });
    });
  }
}

export default TemplateServe.singleInstance();
