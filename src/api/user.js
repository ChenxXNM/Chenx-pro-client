import request from "../utils/request";

export function userList(params){
  return request({
    url:`/queryAll`,
    method:"get",
    params
  })
}

export function deleteUser(id){
  return request({
    url:`/delete/`+id,
    method:"delete",
  })
}

export function updateUser(data){
  return request({
    url:`/update`,
    method:"put",
    data
  })
}

export function selLike(params){
  return request({
    url:"/queryAll",
    params
  })
}
