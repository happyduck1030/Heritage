import service from "../utils/request";

// 获取非遗信息列表
export const getHeritageList = (params) => {
    return service.get('/api/heritage', { params })
}

// 根据id获取非遗信息
export const getHeritageById = (id) => {
    return service.get(`/api/heritage/${id}`)
}

// 添加评论
export const addComment = (id, data) => {
    return service.post(`/api/heritage/${id}/comments`, data)
}

// 添加评分
export const addRating = (id, data) => {
    return service.post(`/api/heritage/${id}/ratings`, data)
}

// 修改删除评论方法
export const deleteComment = (id, commentId) => {
  return service.delete(`/api/heritage/${id}/comments/${commentId}`);
}

// 修改点赞方法，添加username参数
export const addLike = (id, data) => {
    return service.post(`/api/heritage/${id}/like`, data);
}
