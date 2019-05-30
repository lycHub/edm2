import SendServe from '../../service/marketing/send.service';

export default {
  path: '/Blank',
  name: 'Blank',
  component: () => import('./blank.vue'),
  beforeEnter(to, from, next) {
    const id = Number(localStorage.getItem('marketingId'));
    // const id = 226;
    console.log('marketingId', id);
    if (id) {
      SendServe.saveReceives(id).then(() => {
        next(to.query.to);
      });
    }else {
      next(to.query.to);
    }

    // console.log(to.query.to);
    // to="/Blank?to=/Marketing/SendTime"
    // to="/Blank?to=/MyMarkets"
  /*  setTimeout(() => {
      next('/MyMarkets');
    }, 1000);*/
  }
}
// http://192.168.212.99:8080/#/blank
