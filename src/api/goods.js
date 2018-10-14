import fetch from './fetch/index';

/**
 * 封装基础ajax请求
 * @param {any}
 */
class GoodsApi {
  
  getGoodsList(){return(params)=> fetch('POST', '/goods/query/list', params);}
  
  addGoods (){return(params) => fetch('POST', '/goods/add', params);}
  
  getGoods (){return(params) => fetch('POST', '/goods/query/id', params);}
  
  editGoods (){return(params) => fetch('POST', '/goods/edit', params);}
  
  delGoods (){return(params) =>fetch('POST', '/goods/del', params);}
  
  getGoodsDetails (){return(params) =>fetch('POST', '/goods/query/details', params);}
  
  addGoodsDetails  (){return(params) => fetch('POST', '/goods/details/add', params); }
  
  editGoodsDetails  (){return(params) =>fetch('POST', '/goods/details/edit', params);}
  
  delGoodsDetails  (){return(params) => fetch('POST', '/goods/details/del', params);}

  downloadImg (){return (params) =>fetch('POST', '/img/download/imgIds', params);}

}

// 实例化再导出
export default new GoodsApi();
