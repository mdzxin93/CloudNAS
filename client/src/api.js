import axios from 'axios';
const api=axios.create({baseURL:'/api',withCredentials:true});
let csrf='';
export async function prepare(){const r=await api.get('/auth/csrf');csrf=r.data.csrf;}
api.interceptors.request.use(config=>{if(!['get','head','options'].includes((config.method||'get').toLowerCase()))config.headers['x-csrf-token']=csrf;return config;});
export async function req(method,url,data,config={}){try{const r=await api({method,url,data,...config});if(r.data?.csrf)csrf=r.data.csrf;return r.data;}catch(e){throw Error(e.response?.data?.error||e.message)}}
export async function download(url,name){const r=await api.get(url,{responseType:'blob'});const a=document.createElement('a');const href=URL.createObjectURL(r.data);a.href=href;a.download=name||'download';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),30000);}
export async function upload(url,file){const form=new FormData();form.append('file',file);return req('post',url,form);}
export default api;
