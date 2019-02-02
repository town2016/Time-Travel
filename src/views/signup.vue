<template>
<div class="signup">
  <div class="signup-wrapper">
    <div class="form-box">
      <h5>sign up</h5>
      <div class="form-group">
        <input placeholder="账号" v-model='account'/>
      </div>
      <div class="form-group">
        <input placeholder="手机号码" v-model='phone'/>
      </div>
      <div class="form-group">
        <input placeholder="密码" type="password" v-model='password'/>
      </div>
      <div class="form-group">
        <input placeholder="确认密码" type="password" v-model="rePassword"/>
      </div>
    </div>
    <div class="signup-btn" @click='_validate'>注册</div>
  </div>
</div>
</template>

<script>
import { signUp } from '@/api/sign'
import md5 from 'js-md5'
export default {
  name: 'signup',
  data () {
    return {
      account: '',
      phone: '',
      password: '',
      rePassword: ''
    }
  },
  activated () {
    this.account = ''
    this.phone = ''
    this.password = ''
    this.rePassword = ''
  },
  methods: {
    _validate () {
      let regPhone = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/
      let regPwd = /[^\u4e00-\u9fa5]+/
      if (this.account === '') {
        this.$createToast({
          txt: '请填写登录账号',
          type: 'txt',
          time: 1500
        }).show()
        return false
      }
      if (!regPhone.test(this.phone)) {
        this.$createToast({
          txt: '请填写正确手机号',
          type: 'txt',
          time: 1500
        }).show()
        return false
      }
      if (!this.password) {
        this.$createToast({
          txt: '请填写登录密码',
          type: 'txt',
          time: 1500
        }).show()
        return false
      }
      if (!regPwd.test(this.password)) {
        this.$createToast({
          txt: '密码不能填写中文',
          type: 'txt',
          time: 1500
        }).show()
        return false
      }
      if (this.password !== this.rePassword) {
        this.$createToast({
          txt: '两次填写的密码须一致',
          type: 'txt',
          time: 1500
        }).show()
        return false
      }
      this._signUp()
    },
    _signUp () {
      this.$createToast({
        txt: 'loading...',
        type: 'loading',
        time: 0,
        mask: true
      }).show()
      var params = {
        phone: this.phone,
        password: md5(this.password),
        account: this.account
      }
      signUp(params).then(res => {
        this.$createToast({
          txt: '注册成功',
          time: 2000,
          type: 'correct'
        }).show()
        this.$router.push({
          path: '/signin'
        })
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
@import url("../assets/less/sign.less");
</style>
