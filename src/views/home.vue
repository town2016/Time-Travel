<template>
<div class="Home">
  <div class="topNav flex">
    <div ref="scroll" style="width: 100%;">
      <span>Time Travel</span>
      <span style="float: right; padding-right: 10px;"><i class='cubeic-person'></i>&nbsp;town</span>
    </div>
  </div>
  <div class="position" @click='_getLocation'>
    <img src="../assets/position.jpg" width="30px" height="30px" />
  </div>
  <div id="mapContainer"></div>
</div>
</template>

<script>
import AMap from 'AMap'
import { getMemoryList } from '@/api/home'
import { mapMutations } from 'vuex'
import avatarDefault from '../assets/user_default.png'
export default {
  name: 'Home',
  data () {
    return {
      curIndex: 0,
      pager: {
        pageNo: 1,
        pageSize: 10
      },
      Amap: null,
      timer: null,
      markers: [],
      loading: null,
      infoWindow: null,
      avatarDefault: avatarDefault
    }
  },
  activated () {
    this.$nextTick(() => {
      this._getLocation()
    })
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
      this.loading = this.$createToast({
        txt: 'Loading...',
        time: 0,
        mask: true
      })
      this.loading.show()
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
          this.setCurPos(data)// 将当前定位信息保存到vuex中
          amap.add(marker)
          this._getMemoryList(position.R, position.Q)
          this.loading.hide()
          // 地图覆盖物的拖拽回调
          marker.on('dragend', (data) => {
            amap.setCenter([data.lnglat.R, data.lnglat.Q])
            setTimeout(() => {
              this._getMemoryList(data.lnglat.R, data.lnglat.Q)
            }, 100)
          })
          // 拖动地图的时候的回调
          amap.on('dragend', (data) => {
            // 获取地图中心点位置
            let center = amap.getCenter()
            let positions = [center.R, center.Q]
            setTimeout(() => {
              this._getMemoryList(positions[0], positions[1])
              marker.setPosition(positions)
            }, 100)
          })
        })
        AMap.event.addListener(geolocation, 'error', (data) => {
          this.loading.hide()
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
      if (this.timer) {
        window.clearTimeout(this.timer)
        this.timer = null
      }
      this.infoWindow && this.infoWindow.close()
      this.timer = setTimeout(() => {
        var params = {
          ...this.pager,
          lng: lng,
          lat: lat
        }
        getMemoryList(params).then(res => {
          this.Amap.remove(this.markers)
          this.markers = []
          if (res.data && res.data.length > 0) {
            res.data.map(item => {
              // 创建范围内的数据点标记
              var marker = new AMap.Marker({
                position: new AMap.LngLat(item.lng, item.lat),
                map: this.Amap,
                icon: new AMap.Icon({
                  image: item.avatar ? item.avatar : this.avatarDefault,
                  size: new AMap.Size(25, 25),
                  imageSize: new AMap.Size(25, 25)
                })
              })
              // 点击点标记展示数据
              marker.on('click', () => {
                this.infoWindow = new AMap.InfoWindow({
                  isCustom: true,
                  content: this.createInfoWindow(item),
                  offset: new AMap.Pixel(16, -45)
                })
                this.infoWindow.open(this.Amap, marker.getPosition())
              })
              this.Amap.add(marker)
              this.markers.push(marker)
            })
          }
        })
      }, 500)
    },
    createInfoWindow (item) {
      var info = document.createElement('div')
      var top = document.createElement('div')
      top.style.cssText = 'background-color: #07CBFC; border-bottom: 1px solid #fff;height: 25px;color: #fff; padding:0 5px;line-height: 25px;'
      var closeX = document.createElement('span')
      var title = document.createElement('span')
      title.innerText = item.account
      closeX.style.cssText = 'font-size: 20px;float: right;'
      closeX.innerHTML = 'x'
      closeX.onclick = this.closeInfoWindow
      top.appendChild(closeX)
      top.appendChild(title)
      info.appendChild(top)
      // 定义中部内容
      var middle = document.createElement('div')
      middle.style.cssText = 'background-color: #07CBFC; padding:20px 10px;  border-radius: 3px; color: #fff;width: 300px;word-break: break-word;line-height: 24px;font-size: 12px;'
      middle.innerHTML = item.content
      info.appendChild(middle)
      // 定义底部内容
      var bottom = document.createElement('div')
      bottom.style.cssText = 'position: relative;top: 0;margin: 0 auto;'
      var sharp = document.createElement('div')
      sharp.style.cssText = 'position: absolute;left: 50%;margin-left: -10px;height: 0;border-style: solid;border-width: 10px 6px 0 6px; border-color: #07CBFC transparent transparent  transparent;'
      bottom.appendChild(sharp)
      info.appendChild(bottom)
      return info
    },
    closeInfoWindow () {
      this.infoWindow.close()
    },
    ...mapMutations([
      'setCurPos'
    ])
  }
}
</script>

<style lang="less">
@import url("../assets/less/mixin.less");
.Home{
  width: 100%;
  height: 100%;
  padding-top: 50px;
  position: relative;
  box-sizing: border-box;
  #mapContainer{
    height: 100%;
  }
  .position{
    position: fixed;
    z-index: 800;
    top: 60px;
    right: 2%;
    margin-right: 10px;
  }
  .topNav{
    text-align: left;
    text-indent: 20px;
    line-height: 50px;
    font-size: 14px;
    height: 50px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    background-color: #fff;
    .boxShadow(0 0 5px rgba(0,0,0,0.3));
    span{
      font-weight: 400;
      color: #3583d8;
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
