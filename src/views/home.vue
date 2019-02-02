<template>
<div class="Home">
  <div class="topNav flex">
    <div ref="scroll" style="width: 100%;">
      <span>memory capsule</span>
      <ul class="list-wrapper" v-if='false'>
        <li v-for="(item, index) in categorys"
          @click='_changeTab(index)'
          :key='item.value'
          class="list-item flex-1"
          :class="{active: curIndex === index}">
            {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
  <div id="mapContainer"></div>
</div>
</template>

<script>
import AMap from 'AMap'
import { getMemoryList } from '@/api/home'
export default {
  name: 'Home',
  data () {
    return {
      categorys: [
        { label: '此时', value: 'time' },
        { label: '此地', value: 'where' },
        { label: '我的', value: 'self' },
        { label: '他的', value: 'other' }
      ],
      curIndex: 0,
      pager: {
        pageNo: 1,
        pageSize: 10
      },
      Amap: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._getLocation()
    })
  },
  methods: {
    _changeTab (index) {
      this.curIndex = index
    },
    _getLocation () {
      const toast = this.$createToast({
        txt: 'Loading...',
        time: 0,
        mask: true
      })
      toast.show()
      var amap = new AMap.Map('mapContainer', {
        zoom: 14,
        resizeEnable: true
      })
      this.Amap = amap
      amap.plugin('AMap.Geolocation', () => {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: 'RB'
        })
        geolocation.getCurrentPosition()
        AMap.event.addListener(geolocation, 'complete', (data) => {
          let position = data.position
          amap.setCenter([position.R, position.Q])
          var marker = new AMap.Marker({
            position: new AMap.LngLat(position.R, position.Q),
            // 设置是否可以拖拽
            draggable: true,
            cursor: 'move',
            // 设置拖拽效果
            raiseOnDrag: true
          })
          amap.add(marker)
          this._getMemoryList(position.R, position.Q)
          toast.hide()
          // 地图覆盖物的拖拽回调
          marker.on('touchend', (data) => {
            amap.setCenter([data.lnglat.R, data.lnglat.Q])
          })
          // 拖动地图的时候的回调
          amap.on('touchend', (data) => {
            // 获取地图中心点位置
            let center = amap.getCenter()
            let positions = [center.R, center.Q]
            setTimeout(() => {
              this._getMemoryList(positions[0], positions[1])
              marker.setPosition(positions)
              
            }, 200)
          })
        })
        AMap.event.addListener(geolocation, 'error', (data) => {
          toast.hide()
          setTimeout(() => {
            this.$createToast({
              txt: data.message,
              time: 2000,
              type: 'txt'
            }).show()
          })
        })
      })
    },
    _getMemoryList (lng, lat) {
      var params = {
        ...this.pager,
        lng,
        lat
      }
      getMemoryList(params).then(res => {
        if (res.data && res.data.length > 0) {
          res.data.map(item => {
            var marker = new AMap.Marker({
              position: new AMap.LngLat(item.lng, item.lat)
            })
            this.Amap.add(marker)
          })
          
        }
      })
    }
  }
}
</script>

<style lang="less">
@import url("../assets/less/mixin.less");
.Home{
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  #mapContainer{
    height: 100%;
  }
  .topNav{
    text-align: left;
    text-indent: 20px;
    line-height: 40px;
    font-size: 14px;
    height: 40px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    background-color: #fff;
    .boxShadow(0 0 5px rgba(0,0,0,0.3));
    span{
      font-weight: 200;
      color: transparent;
      background: linear-gradient(to right, #3583d8, #07cbfc );
      -webkit-background-clip: text;
    }
    .list-wrapper{
      white-space: nowrap;
      box-sizing: border-box;
      padding: 0 10px;
    }
    .cube-scroll-content{
      display: inline-block;
    }
    .list-wrapper{
      .flex;
      width: 100%;
    }
    .list-item{
      text-align: center;
      line-height: 40px;
      &.active{
        color: #ff8000;
      }
    }
  }
}
</style>
