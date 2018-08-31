const Main = {
  target: process.env.NODE_ENV !== 'production' ?  'http://localhost:8077':'http://8888888888:8077', //目标网站
  constant: {
    cookie: 'VUE_ELEMENT'
  },
  route: {
    login: '/'
  }
};

export default Main;
