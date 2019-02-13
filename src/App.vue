<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
    <div class='operation' v-if='isApp'>
      <span :class="{'active': opertationOpen}" class="cubeic-add" @click='opertationOpen = !opertationOpen'></span>
      <span class="cubeic-edit icon" @click='goPage("edit")' :class='{bounceIn: opertationOpen}' v-if='opertationOpen'></span>
      <span class="cubeic-person icon" @click='goPage("my")' :class='{bounceIn: opertationOpen}' v-if='opertationOpen'></span>
      <span class="cubeic-home icon" @click='goPage("home")' :class='{bounceIn: opertationOpen}' v-if='opertationOpen'></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      opertationOpen: false,
      isApp: true
    }
  },
  watch: {
    '$route' (val) {
      if (val.path === '/signin' || val.path === '/signup') {
        this.isApp = false
      } else {
        this.isApp = true
      }
    }
  },
  created () {
    var curRoute = this.$route
    if (curRoute.path === '/signin' || curRoute.path === '/signup') {
      this.isApp = false
    } else {
      this.isApp = true
    }
  },
  methods: {
    goPage (sign) {
      if (sign === 'home') {
        this.$router.push('/')
      } else if (sign === 'edit') {
        this.$router.push('/edit')
      } else {
        this.$router.push('/my')
      }
      this.opertationOpen = !this.opertationOpen
    }
  }
}
</script>

<style lang="less">
@import url("./assets/less/index.less");
.operation{
  position: absolute;
  bottom: 15%;
  right: 2%;
  height: 50px;
  width: 50px;
  z-index: 800;
  opacity: 0.8;
  background-color: #2ebbf2;
  border-radius: 50%;
  span.cubeic-add{
    color: #fff;
    font-size: 50px;
    position: absolute;
    top: 0;
    right: 0;
    transition: all .3s;
  }
  .icon{
    color: #fff;
    position: absolute;
    background-color: #2ebbf2;
    .boxShadow(5px 5px 10px rgba(0,0,0,0.5));
    width: 35px;
    height: 35px;
    border-radius: 50%;
    font-size: 25px;
    text-align: center;
    line-height: 35px;
  }
  .cubeic-home{
    left: -100%;
    top: 10px;
  }
  .cubeic-edit{
    top: -62.5px;
    left: -30%;
  }
  .cubeic-person{
    bottom: -50px;
    left: -30%;
  }
}
.cubeic-add.active{
  transform-origin: center;
  transform:rotate(135deg)
}
</style>
