<template>
<div class="Edit">
  <div class="nav flex">
    <div class="flex-1">
      <span class="cubeic-back" @click='goback'></span>
    </div>
    <div class="flex-1">
      <cube-button type='button' :outline='true' :disabled='feelling.length === 0'>发布</cube-button>
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
    }
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
