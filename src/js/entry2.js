const  API=require("../../api")
import css from '../css/index.css'
import axios from 'axios';
var instance = axios.create();
var baseUrl="http://localhost:8080/medapp";

// 在实例已创建后修改默认值
var postHttp=function(url,param){
  //如果有token；就加上token到请求对象的header上
 
    instance.defaults.headers.common['token'] = "9754fda9-6474-47f7-a522-8549c626d102"

  return instance.post(baseUrl+url,param);
}; 
window.onload=function(){
  
    postHttp('/api/con/info/list',{
        "cid":1992,
        "info_class":uuu,
    }).then((response)=>{
        console.log(response);
    }).catch( (error)=> {
        console.log(error);
      })
    
}()

  
    // document.getElementById('box').innerHTML='hello word'
   
    

