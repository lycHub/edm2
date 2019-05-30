import Vue from 'vue';
import { format } from 'date-fns';
import {toDate} from "../utils/tool";

Vue.filter('format', function (time, gs) {
  if (!time) return '';
  const pattern = gs || 'MMM/DD/YYYY hh:mm A';
  return format(toDate(time), pattern);
});
