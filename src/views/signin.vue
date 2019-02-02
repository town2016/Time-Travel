<template>
<div class="signup">
  <div class="signup-wrapper">
    <div class="form-box">
      <h5>sign in</h5>
      <div class="form-group">
        <input placeholder="手机号码" v-model='phone'/>
      </div>
      <div class="form-group">
        <input placeholder="密码" type="password" v-model='password'/>
      </div>
    </div>
    <div class="signup-btn" @click='_validate'>登录</div>
    <p class="link">还没注册？<router-link to='/signup'>猛戳这里</router-link></p>
  </div>
</div>
</template>

<script>
import { signIn } from '@/api/sign'
import md5 from 'js-md5'
import Cookies from 'js-cookie'
export default {
  name: 'signup',
  data () {
    return {
      phone: '',
      password: ''
    }
  },
  activated () {
    this.phone = ''
    this.password = ''
  },
  methods: {
    _validate () {
      let regPhone = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/
      let regPwd = /[^\u4e00-\u9fa5]+/
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
      this._signin()
    },
    _signin () {
      this.$createToast({
        txt: 'loading...',
        type: 'loading',
        time: 0,
        mask: true
      }).show()
      var params = {
        phone: this.phone,
        password: md5(this.password)
      }
      signIn(params).then(res => {
        if (res.data.length > 0) {
          this.$createToast({
            txt: '登录成功',
            time: 2000,
            type: 'correct'
          }).show()
          Cookies.set('user', JSON.stringify(res.data[0]))
          this.$router.push({
            path: '/'
          })
        } else {
          this.$createToast({
            txt: '账号或密码错误',
            time: 2000,
            type: 'correct'
          }).show()
        }
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
