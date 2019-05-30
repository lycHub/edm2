import request from '../../configs/axios';
import {formDataFilterEmpty} from "../../utils/tool";

class FileServe {
  // 单例
  static singleInstance(){
    if (!FileServe.instance) {
      FileServe.instance = new FileServe();
    }
    return FileServe.instance;
  }


  constructor() {
    this.prefix = "/contentfile/";
  }

  uploadFiles(params) {
    return new Promise((resolve, reject) => {
      request.post(this.prefix + 'upLoadFile', params).then(res => {
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


  // 附件列表
  fileList(marketCategoryId) {
    return new Promise((resolve, reject) => {
      request.get(this.prefix + 'fileDetail', {
        params: { marketCategoryId }
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

  // 删附件
  deleteFile(ids) {
    const params = Array.isArray(ids) ? ids : [ids];
    return new Promise((resolve, reject) => {
      request.post(this.prefix + "delete", formDataFilterEmpty({ "ids[]": params })).then(({ data }) => {
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

export default FileServe.singleInstance();
