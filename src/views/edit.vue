<template>
<div class="Edit">
  <div class="nav flex">
    <div class="flex-1">
      <span class="cubeic-back" @click='goback'></span>
    </div>
    <div class="flex-1">
      <cube-button type='button' style='color: #07CBFC;' :outline='true' :disabled='feelling.length === 0' @click='_pulish'>发布</cube-button>
    </div>
  </div>
  <div class="edit-wrapper">
    <cube-textarea
      v-model="feelling"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :autofocus="autofocus">
    </cube-textarea>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addMemory } from '@/api/edit'
export default {
  name: 'Edit',
  data () {
    return {
      feelling: '',
      placeholder: '写给未来的自己......',
      maxlength: 100,
      autofocus: true
    }
  },
  methods: {
    goback () {
      if (this.feelling.length > 0) {
        this.$createDialog({
          type: 'confirm',
          content: '是否保存当前信息？',
          confirmBtn: {
            text: '是',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: '否',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onCancel: () => {
            this.feelling = ''
            this.$router.go(-1)
          },
          onConfirm: () => {
            this.$router.go(-1)
          }
        }).show()
        return
      }
      this.$router.go(-1)
    },
    _pulish () {
      if (Object.keys(this.positions).length === 0) {
        this.$createToast({
          txt: '未获取定位信息,不能发布动态'
        }).show()
        return
      }
      let address = this.positions.addressComponent
      var params = {
        content: this.feelling,
        lng: this.positions.position ? this.positions.position.R : '',
        lat: this.positions.position ? this.positions.position.Q : '',
        address: address.province + address.district + address.street + address.streetNumber
      }
      addMemory(params).then(res => {
        this.$createToast({
          txt: '发布成功',
          time: 2000,
          type: 'correct'
        }).show()
        this.feelling = ''
        this.$router.push({
          path: '/'
        })
      }).catch(e => {
        console.log(e)
        this.$createToast({
          txt: e.message,
          time: 2000,
          type: 'error'
        }).show()
      })
    }
  },
  computed: {
    ...mapGetters([
      'positions'
    ])
  }
}
</script>

<style lang="less">
  .Edit{
    .edit-wrapper{
      margin-top: 20px;
      textarea{
        outline: none;
      }
      .cube-textarea-wrapper:after{
        border: none;
      }
      .cube-textarea_active:after{
        border: none;
      }
    }
    .nav{
      height: 50px;
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
        button{
          display: inline-block !important;
          width: auto;
          height: 100%;
          padding: 0 20px;
          color: #FF8000;
        }
        .cube-btn_disabled{
          background: none;
          opacity: 0.5;
        }
        button:after{
          border: none;
        }
      }
    }
  }
</style>
