<template>
<div class="setting">
  <div class="nav flex">
    <div class="flex-1">
      <span class="cubeic-back" @click='goback'></span>
    </div>
    <div class="flex-1">设置</div>
  </div>
  <div class="setting-form">
    <div class="func-item">
      <div class="func-inner">
        <label>头像</label>
        <div class="right">
          <form id="fileUpload">
            <input type="file" accept="image/*" @change='_updateAvatar' name="avatar"/>
          </form>
          <img :src="!userInfo.avatar ? avatarDefault : userInfo.avatar" width="20" height="20"/>
          <i class="cubeic-arrow"></i>
        </div>
      </div>
    </div>
    <div class="func-item">
      <div class="func-inner">
        <label>昵称</label>
        <div class="right">
          <input placeholder="write your nickname" v-model='userInfo.account'/>
          <i class="cubeic-arrow"></i>
        </div>
      </div>
      <div class="func-inner">
        <label>签名</label>
        <div class="right">
          <input placeholder="write your slogon" v-model='userInfo.slogon'/>
          <i class="cubeic-arrow"></i>
        </div>
      </div>
    </div>
    <!-- <div class="func-item">
      <div class="func-inner">
        <label>密码</label>
        <div class="right">
          <input placeholder="reset your password" type="password"/>
          <i class="cubeic-arrow"></i>
        </div>
      </div>
    </div> -->
  </div>
  <div class="save-btn">
    <button @click='_updateUser'>保存</button>
  </div>
</div>
</template>

<script>
import avatarDefault from '../assets/user_default.png'
import Cookies from 'js-cookie'
import { updateUser, fileUpload } from '@/api/setting'
export default {
  name: 'setting',
  data () {
    return {
      avatarDefault: avatarDefault,
      userInfo: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
    }
  },
  activated () {
    this.userInfo = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
  },
  methods: {
    goback () {
      this.$router.go(-1)
    },
    _updateUser () {
      this.userInfo.createDate = this._dateParse(this.userInfo.createDate)
      this.userInfo.updateDate = this._dateParse(this.userInfo.updateDate)
      updateUser(this.userInfo).then(res => {
        this.$createToast({
          txt: '操作成功',
          time: 2000,
          type: 'correct'
        }).show()
        Cookies.set('user', JSON.stringify(this.userInfo))
        this.$router.push({
          path: '/my'
        })
      }).catch(e => {
        this.$createToast({
          txt: e.message,
          time: 2000,
          type: 'error'
        }).show()
      })
    },
    _dateParse (date) {
      if (date) {
        var dateDay = new Date(date).toLocaleDateString()
        var dateTime = new Date(date).toLocaleTimeString()
        dateTime = dateTime.substring(2, dateTime.length - 1)
        return dateDay + ' ' + dateTime
      } else {
        return ''
      }
    },
    _updateAvatar (e) {
      this.loading = this.$createToast({
        txt: 'Loading...',
        time: 0,
        mask: true
      }).show()
      var fm = new FormData(document.getElementById('fileUpload'))
      fileUpload(fm).then(res => {
        this.userInfo.avatar = window.location.origin + '/apis' + res.data
        this.loading.hide()
      })
    }
  }
}
</script>

<style lang="less">
@import url("../assets/less/index.less");
.setting{
  .func-item{
    border-bottom: 1px solid #e5e5e5;
    width: 100%;
    .func-inner{
      padding: 15px;
      box-sizing: border-box;
      .flex;
      .flex-align-center;
    }
  }
  .right{
    position: relative;
    padding-left:10px;
    overflow:hidden;
    .flex-1;
    .flex;
    .flex-align-center;
    .flex-pack-right;
    i{
      margin-left: 10px;
    }
    input{
      text-align: right;
      padding: 5px;
      color: #333;
    }
    input:focus{
      outline-color: #2EBBF2 !important;
    }
    input[type='file']{
      outline: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
  .save-btn{
    padding: 15px;
    margin-top: 20px;
    button{
      background: none;
      border: none;
      width: 100%;
      font-size: 18px;
      padding: 5px 0;
      background-color: #2EBBF2;
      color: #fff;
      border-radius: 4px;
      opacity: 0.8;
      letter-spacing: 5px;
    }
    button:disabled{
      opacity: 0.3;
    }
  }
}
</style>
