import axios from 'axios';

const service = axios.create({
  // baseURL: 'http://11.11.22.118:8080'
  baseURL: 'http://mgt.mysteelcms.com/edm'
});
export default service;
