import fetch from './fetch/index';

/**
 * 封装基础ajax请求
 * @param {any}
 */
class TagApi {
  
  getTagList = (params) => fetch('POST', '/tag/query/list', params);
  
  addTag = (params) => fetch('POST', '/tag/add', params);
  
  getTag = (params) => fetch('POST', '/tag/query/id', params);
  
  editTag = (params) => fetch('POST', '/tag/edit', params);
  
  delTag = (params) => fetch('POST', '/tag/del', params);

}

// 实例化再导出
export default new TagApi();
