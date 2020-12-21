<script>
  export default {
    data () {
      return {
        albumList: [{
          name: 'example1',
          url: 'http://img3.redocn.com/tupian/20150312/haixinghezhenzhubeikeshiliangbeijing_3937174.jpg'
        }, {
           name: 'example2',
           url: 'https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=01557f2088cb39dbdec06156e01709a7/2f738bd4b31c87017d1aa92c2e7f9e2f0608ff48.jpg'
        }, {
           name: 'example3',
           url: 'http://img3.redocn.com/tupian/20150312/haixinghezhenzhubeikeshiliangbeijing_3937174.jpg'
         }, {
            name: 'example4',
            url: 'https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=01557f2088cb39dbdec06156e01709a7/2f738bd4b31c87017d1aa92c2e7f9e2f0608ff48.jpg'
         }, {
            name: 'example5',
            url: 'http://img3.redocn.com/tupian/20150312/haixinghezhenzhubeikeshiliangbeijing_3937174.jpg'
          }, {
             name: 'example6',
             url: 'https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=01557f2088cb39dbdec06156e01709a7/2f738bd4b31c87017d1aa92c2e7f9e2f0608ff48.jpg'
          }],
        isShow: false
      }
    },
    methods: {
      open() {
        this.isShow = true
      }
    }
  }
</script>

## Album 查看大图

图片查看,滚动

### 基础用法

:::demo 基础用法

```html
<template>
  <fow-button :plain="true" @click="open">查看大图</fow-button>
  <album :album-list="albumList" :current-albumIndex="0" :is-show.sync="isShow"></album>
</template>
<script>
  export default {
    data () {
      return {
        albumList: [{
          name: 'example',
          url: 'http://img3.redocn.com/tupian/20150312/haixinghezhenzhubeikeshiliangbeijing_3937174.jpg'
        }, {
          name: 'example2',
          url: 'https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=01557f2088cb39dbdec06156e01709a7/2f738bd4b31c87017d1aa92c2e7f9e2f0608ff48.jpg'
        }],
        isShow: false
      }
    },
    methods: {
      open() {
        this.isShow = true
      }
    }
  }
</script>
```

:::

### Options

| 参数               | 说明       | 类型                                      | 可选值 | 默认值 |
| ------------------ | ---------- | ----------------------------------------- | ------ | ------ |
| album-list         | 图片组     | Array: [{name: 'imgName', url: 'imgUrl'}] | 必填   | —      |
| is-show            | 展示       | boolean: :is-show.sync="false"            | 必填   | -      |
| current-albumIndex | 打开的索引 | number                                    | 可选   | 0      |
