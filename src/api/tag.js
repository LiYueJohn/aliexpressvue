import fetch from './fetch/index';

/**
 * 封装基础ajax请求
 * @param {any}
 */
class TagApi {
  
  getTagList(){return(params)=>fetch('POST', '/tag/query/list', params);}
  
  addTag(){return(params)=>fetch('POST', '/tag/add', params);}
  
  getTag(){return(params)=>fetch('POST', '/tag/query/id', params);}
  
  editTag(){return(params)=>fetch('POST', '/tag/edit', params);}
  
  delTag(){return(params)=>fetch('POST', '/tag/del', params);}

}

// 实例化再导出
export default new TagApi();
