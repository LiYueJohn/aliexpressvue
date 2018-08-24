import fetch from './fetch/index';

/**
 * 封装基础ajax请求
 * @param {any}
 */
class GoodsApi {
  
  getGoodsList = (params) => fetch('POST', '/goods/query/list', params);
  
  addGoods = (params) => fetch('POST', '/goods/add', params);
  
  getGoods = (params) => fetch('POST', '/goods/query/id', params);
  
  editGoods = (params) => fetch('POST', '/goods/edit', params);
  
  delGoods = (params) => fetch('POST', '/goods/del', params);
  
  getGoodsDetails = (params) => fetch('POST', '/goods/query/details', params);
  
  addGoodsDetails  = (params) => fetch('POST', '/goods/details/add', params); 
  
  editGoodsDetails  = (params) => fetch('POST', '/goods/details/edit', params);
  
  delGoodsDetails  = (params) => fetch('POST', '/goods/details/del', params);

  downloadImg  = (params) => fetch('POST', '/img/download/imgIds', params);

}

// 实例化再导出
export default new GoodsApi();
