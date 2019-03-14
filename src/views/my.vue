<template>
<div class="My">
  <div class="nav flex">
    <div class="flex-1">
      <span class="cubeic-back" @click='goback'></span>
    </div>
    <div class="flex-1">个人中心</div>
  </div>
  <div class="userInfo flex flex-v flex-align-center ">
    <img :src="avatar"/>
    <div class="user-phone">{{userInfo.account}}  {{userInfo.phone}}</div>
    <div class="slogon">{{userInfo.slogon || 'write your slogon......'}}</div>
  </div>
  <div class="func-list">
    <ul>
      <li v-for='(item, index) in funcList' :key="index">
        <router-link :to='item.path'>
          <span class="icon" :class="item.icon"></span><span>{{item.name}}</span><span class="cubeic-arrow right"></span>
        </router-link>
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
import avatarDefault from '../assets/user_default.png'
export default {
  name: 'My',
  data () {
    return {
      funcList: [
        {
          name: '拾忆',
          icon: 'cubeic-alert',
          path: '/memoryList'
        }, {
          name: '设置',
          icon: 'cubeic-setting',
          path: '/setting'
        }
      ],
      userInfo: {},
      avatar: avatarDefault
    }
  },
  activated () {
    this.userInfo = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
    this.avatar = this.userInfo.avatar ? this.userInfo.avatar : avatarDefault
  },
  created () {
    this.userInfo = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
    this.avatar = this.userInfo.avatar ? this.userInfo.avatar : avatarDefault
    console.log(this.userInfo)
  },
  methods: {
    goback () {
      this.$router.go(-1)
    },
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
      margin-bottom: 10px;
      font-size: 12px;
    }
    .slogon{
      width: 100%;
      box-sizing: border-box;
      padding: 0 15px;
      color: #999;
      text-align: center;
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
      a{
        display: block;
      }
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
    color: #2ebbf2;
    padding: 20px 0;
    letter-spacing: 2px;
  }
  .nav{
    height: 50px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    >div{
      line-height: 50px;
      span{
        display: block;
        width: 40px;
        height: 100%;
        text-align: center;
      }
    }
    >div:last-of-type{
      text-align: right;
      padding-right: 15px;
      box-sizing: border-box;
    }
  }
}
</style>
