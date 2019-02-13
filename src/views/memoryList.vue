<template>
<div class="memoryList">
  <div class="nav flex">
    <div class="flex-1">
      <span class="cubeic-back" @click='goback'></span>
    </div>
    <div class="flex-1">拾忆</div>
  </div>
  <cube-scroll
    ref="scroll"
    :options='options'
    :data="memoryList"
    style='margin-top: 3px;position: relative;padding-bottom: 40px;box-sizing: border-box;'
    @pulling-up="onPullingUp"
   >
    <ul class="memorys">
      <li v-for='(item, index) in memoryList' :key='item.id'>
        <div class="content">{{item.content}}</div>
        <div class="flex info">
          <div class="flex-1">{{item.createTime && new Date(item.createTime).toLocaleString()}}</div>
          <div class="flex-1"><i class='cubeic-delete deleteic' @click='_deleteUserMemory(item, index)'></i></div>
        </div>
      </li>
    </ul>
    <div class="nomore" v-if='isNoMore'>暂无更多数据</div>
  </cube-scroll>
</div>
</template>

<script>
import { getUserMemorys, deleteUserMemory } from '@/api/memoryList'
export default {
  name: 'memoryList',
  data () {
    return {
      pager: {
        pageNo: 1,
        pageSize: 30
      },
      options: {
        click: true,
        probeType: 1,
        scrollbar: true,
        pullDownRefresh: false,
        pullUpLoad: true
      },
      memoryList: [],
      isNoMore: false
    }
  },
  activated () {
    this.memoryList = []
    this._getUserMemorys()
  },
  methods: {
    goback () {
      this.$router.go(-1)
    },
    _getUserMemorys () {
      var params = {
        ...this.pager
      }
      getUserMemorys(params).then(res => {
        if (res.data && res.data.length > 0) {
          this.memoryList = this.memoryList.concat(res.data)
        } else {
          this.pager.pageNo--
          setTimeout(() => {
            this.$refs.scroll.forceUpdate()
            this.isNoMore = true
            setTimeout(() => {
              this.isNoMore = false
            }, 1000)
          }, 200)
        }
      })
    },
    onPullingUp () {
      this.pager.pageNo++
      this._getUserMemorys()
    },
    _deleteUserMemory (item, index) {
      var params = {
        ids: item.id
      }
      deleteUserMemory(params).then(res => {
        this.memoryList.splice(index, 1)
        this.$createToast({
          txt: '操作成功',
          time: 2000,
          type: 'correct'
        }).show()
      }).catch(e => {
        this.$createToast({
          txt: e.message,
          time: 2000,
          type: 'error'
        }).show()
      })
    }
  }
}
</script>

<style lang="less">
.memoryList{
  height: 100%;
  padding-top: 50px;
  box-sizing: border-box;
  background-color: #f1f1f1;
  .memorys{
    height: 100%;
    overflow: auto;
    li{
      padding: 10px 10px 0 10px;
      background-color: #fff;
      margin-bottom: 10px;
      .content{
        padding: 10px 0;
        border-bottom:1px solid #e5e5e5 ;
      }
      .info{
        padding: 5px;
        line-height: 30px;
        >div:first-of-type{
          font-size: 12px;
          color: #999;
        }
        >div:last-of-type{
          text-align: right;
          color: #ff0000;
          font-size: 20px;
        }
      }
    }
  }
  .nav{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }
  .nomore{
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #999;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 40px;
    line-height: 40px;
  }
}
</style>
