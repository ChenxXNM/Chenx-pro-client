import request from "../utils/request";

export function products(params){
  return request({
    url:`/queryAllPro`,
    params
  })
}

export function saveProduct(data){
  return request({
    url:`/insertPro`,
    method:"post",
    data
  })
}

export function del(id){
  return request({
    url:`/deletePro/`+id,
    method:"delete"
  })
}

export function updatePro(data){
  return request({
    url:`updatePro`,
    method:"put",
    data
  })
}
