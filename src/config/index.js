const Main = {
  target: process.env.NODE_ENV !== 'production' ?  'http://localhost:8077':':8077', //目标网站
  constant: {
    cookie: 'VUE_ELEMENT'
  },
  route: {
   login: '/'
  } 
};

export default Main;
