import fetch from './fetch/index';

/**
 * 封装基础ajax请求
 * @param {any}
 */
class ImgApi {
  
  getImgById = (params) => fetch('POST', '/img/query/imgId', params); 

}

// 实例化再导出
export default new ImgApi();
