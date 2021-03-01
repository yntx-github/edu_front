import request from '@/utils/request'

export default {

  list() {
    return request({
      url: '/admin/edu/teacher/list',
      method: 'get'
    })
  },
  pageList(page, limit, searchObj) {
    return request({
      url: `/admin/edu/teacher/list/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  removeById(id) {
    return request({
      url: `/admin/edu/teacher/removeById/${id}`,
      method: 'delete'
    })
  },
  save(teacher) {
    return request({
      url: '/admin/edu/teacher/save',
      method: 'post',
      data:
          teacher
    })
  },
  getById(id) {
    return request({
      url: `/admin/edu/teacher/selectById/${id}`,
      method: 'get'
    })
  },

  updateById(teacher) {
    return request({
      url: `/admin/edu/teacher/update`,
      method: 'put',
      data: teacher
    })
  },
  // 批量删除
  batchRemove(idList) {
    return request({
      url: '/admin/edu/teacher/remove',
      method: 'delete',
      data: idList
    })
  },
  selectNameListByKey(key) {
    return request({
      url: `/admin/edu/teacher/list/name/${key}`,
      method: 'get'
    })
  }
}
