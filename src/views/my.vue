<template>
<div class="My">
  <div class="userInfo flex flex-v flex-align-center ">
    <img :src="avatar" v-if='this.userInfo.avatar'/>
    <img src="../assets/user_default.png" v-else/>
    <div class="user-phone">{{userInfo.account}}  {{userInfo.phone}}</div>
  </div>
  <div class="func-list">
    <ul>
      <li v-for='(item, index) in funcList' :key="index">
        <span class="icon" :class="item.icon"></span><span>{{item.name}}</span><span class="cubeic-arrow right"></span>
      </li>
    </ul>
  </div>
  <div class="logout" @click='_signout'>退出登录</div>
</div>
</template>

<script>
import { signout } from '@/api/sign'
import { clearCookie } from '@/utils/common'
import Cookies from 'js-cookie'
export default {
  name: 'My',
  data () {
    return {
      funcList: [
        {
          name: '拾忆',
          icon: 'cubeic-alert'
        }, {
          name: '设置',
          icon: 'cubeic-setting'
        }
      ],
      userInfo: {},
      avatar: ''
    }
  },
  created () {
    this.userInfo = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
  },
  methods: {
    _signout () {
      signout().then(res => {
        this.$createToast({
          txt: '登出成功',
          time: 2000,
          type: 'correct'
        }).show()
        clearCookie()
        this.$router.replace({name: 'signin'})
      }).catch(e => {
        this.$createToast({
          txt: e.message,
          type: 'error'
        }).show()
      })
    }
  }
}
</script>

<style lang="less">
.My{
  background-color: #0000000a;
  width: 100%;
  height: 100%;
  .userInfo {
    background-color: #fff;
    width: 100%;
    padding: 30px 0;
    img{
      width: 100px;
      display: block;
    }
    .user-phone{
      margin-top: 10px;
    }
  }
  .func-list{
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #fff;
    li{
      border-bottom: 1px solid #e5e5e5;
      padding: 15px 0;
      line-height: 20px;
      .icon{
        font-size: 20px;
        margin-right: 10px;
      }
      span{
        color: #333;
        display: inline-block;
        vertical-align: middle;
        letter-spacing: 2px;
      }
      .right{
        float: right;
        color: #bbb;
        font-weight: 200;
      }
    }
    li:last-of-type{
      border: none;
    }
  }
  .logout{
    margin-top: 20px;
    text-align: center;
    background-color: #fff;
    color: #FF8000;
    padding: 20px 0;
    letter-spacing: 2px;
  }
}
</style>
