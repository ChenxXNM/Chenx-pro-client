import request from "../utils/request";
/*
*用户登录
* */

export function login(data){
  return request({
    url:`/login`,  //路径
    method:'post',  //方式
    data  //参数
  })
}

/*
* 安全退出
* */
export function signOut(token){
  return request({
    url:`/delete`,
    method:"delete",
    token
  })
}
/*
* 获取验证码
* */
export function captcha(){
  return request({
    url:`/captcha`,
  })
}

/*
* 检查登录状态
* */
export function userStatus(token){
  return request({
    url:`selLogin`,
    method:"get",
    token
  })
}
