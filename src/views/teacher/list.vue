<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-input v-model="searchObj.name" placeholder="讲师名" /> -->
        <el-autocomplete
          v-model="searchObj.name"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          class="inline-input"
          placeholder="讲师名称"
          value-key="name" />
      </el-form-item>

      <el-form-item label="讲师头衔：">
        <el-select v-model="searchObj.level" clearable placeholder="头衔">
          <el-option value="1" label="高级讲师" />
          <el-option value="2" label="首席讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="入驻时间：">
        <el-date-picker
          v-model="searchObj.joinDateBegin"
          placeholder="开始时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="searchObj.joinDateEnd"
          placeholder="结束时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getTeacherList()"
        >查询</el-button
        >
        <el-button type="default" @click="clear()">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具按钮 -->
    <div style="margin-bottom: 10px">
      <el-button type="danger" size="mini" @click="batchRemove()">批量删除</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="teacherList" border stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection"/>
      <el-table-column label="#" width="50">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="80" />
      <el-table-column prop="level" label="头衔" width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1" type="success">高级讲师</el-tag>
          <el-tag v-if="scope.row.level === 2">首席讲师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="简介" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="joinDate" label="入驻时间" width="160" />
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/' + scope.row.id">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            >修改</el-button
            >
          </router-link>
          <el-button
            size="mini"
            type="danger"
            @click="removeById(scope.row.id)"
          >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[5, 10, 20]"
      style="padding: 30px, 0; text-align: center"
      layout="total,sizes,prev, pager, next,jumper"
      @current-change="changeCurrentPage"
      @size-change="changePageSize"
    />
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'
export default {
  data() {
    return {
      teacherList: [],
      total: 0,
      page: 1,
      limit: 5,
      searchObj: {},
      multipleSelection: []// 批量删除选中的记录列表
    }
  },

  created() {
    this.getTeacherList()
  },

  methods: {
    getTeacherList() {
      teacherApi
        .pageList(this.page, this.limit, this.searchObj)
        .then((response) => {
          this.teacherList = response.data.rows
          this.total = response.data.total
        })
    },

    // 改变当前页
    changeCurrentPage(page) {
      console.log('changeCurrentPage' + page)
      this.page = page
      this.getTeacherList()
    },
    // 改变每页显示记录数
    changePageSize(size) {
      console.log('changePageSize:' + size)
      this.limit = size
      this.getTeacherList()
    },
    // 重置查询条件
    clear() {
      this.searchObj = {}
      this.getTeacherList()
    },
    // 删除
    removeById(id) {
      // 确认是否删除
      this.$confirm('确定删除该记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return teacherApi.removeById(id)
        })
        .then((response) => {
          // 刷新列表
          this.getTeacherList()
          // 弹出提示
          this.$message({
            type: 'success',
            message: response.message
          })
        })
        .catch((err) => {
          if (err === 'cancel') {
            this.$message({
              type: 'info',
              message: '取消操作！'
            })
          }
        })
    },
    // 批量删除
    batchRemove() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }

      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，远程调用ajax
        // 遍历selection，将id取出放入id列表
        var idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        })
        // 调用api
        return teacherApi.batchRemove(idList)
      }).then((response) => {
        this.getTeacherList()
        this.$message.success(response.message)
      }).catch(error => {
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    },
    // 当多选选项发生变化的时候调用
    handleSelectionChange(selection) {
      console.log(selection)
      this.multipleSelection = selection
    },
    querySearch(queryString, cb) {
      // console.log('queryString' + queryString)
      teacherApi.selectNameListByKey(queryString).then(response => {
        cb(response.data.nameList)
      })
    }
  }
}
</script>
