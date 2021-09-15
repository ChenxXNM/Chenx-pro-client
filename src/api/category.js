import request from "../utils/request";

/*
* 获取所有类别
* */
export function categorys(){
  return request({
    url:`/allCateGory`,
  })
}

export function addCategory(data){
  return request({
    url:`/insertCateGory`,
    method:"post",
    data
  })
}

export function updateCategory(data){
  return request({
    url:`updateCateGory`,
    method:"put",
    data
  })
}

export function deleteCategory(id){
  return request({
    url:`deleteCateGory/`+id,
    method:"delete",
  })
}
