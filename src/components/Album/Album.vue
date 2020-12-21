<template>
  <div v-transfer-dom :data-transfer="transfer" v-show="isShow">
    <div class="album-mask"></div>
    <div class="album-wrap">
      <div class="album-header">
        <span class="name">{{ title || currentImg.name }}</span>
        <v-btn
          large
          class="arrow"
          color="white"
          flat
          icon
          @click="left"
          v-show="rollAlbumList.length > 5"
        >
          <v-icon large>keyboard_arrow_left</v-icon>
        </v-btn>
        <div class="thumbnail-box" :class="{ roll: rollAlbumList.length > 5 }">
          <ul>
            <li
              v-for="(item, index) in rollAlbumList"
              @click="activeImg(index)"
              :key="index"
              :class="{ active: currentIndex == index }"
            >
              <img v-lazy="item.url" />
            </li>
          </ul>
        </div>
        <v-btn
          large
          class="arrow"
          color="white"
          flat
          icon
          @click="right"
          v-show="rollAlbumList.length > 5"
        >
          <v-icon large>keyboard_arrow_right</v-icon>
        </v-btn>
        <div class="close-btn">
          <v-btn large class="arrow" flat icon @click="close">
            <v-icon large>close</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="album-body">
        <v-btn
          large
          class="arrow"
          color="white"
          flat
          icon
          @click="left"
          v-show="rollAlbumList.length > 1"
        >
          <v-icon large>keyboard_arrow_left</v-icon>
        </v-btn>
        <div class="img-box">
          <v-scale-transition origin="center center">
            <img v-lazy="currentImg.url" :key="currentImg.url" />
          </v-scale-transition>
        </div>
        <v-btn
          large
          class="arrow"
          color="white"
          flat
          icon
          @click="right"
          v-show="rollAlbumList.length > 1"
        >
          <v-icon>keyboard_arrow_right</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import TransferDom from "./transfer-dom";
export default {
  name: "Album",
  directives: {
    TransferDom
  },
  data() {
    return {
      currentImg: {
        name: "",
        url: ""
      },
      currentIndex: null,
      rollAlbumList: [],
      isShow: false
    };
  },
  methods: {
    init() {
      this.currentImg = {
        name: "",
        url: ""
      };
      this.currentIndex = null;
      this.rollAlbumList = [];
    },
    show() {
      this.isShow = true;
    },
    close() {
      this.isShow = false;
    },
    activeImg(index) {
      if (this.rollAlbumList.length <= 5) {
        this.currentIndex = index;
        return;
      }
      this.move(index);
    },
    move(index) {
      let moveSteps = index - 2;
      if (moveSteps > 0) {
        for (let i = 0; i < moveSteps; i++) {
          this.moveRight();
        }
      } else if (moveSteps < 0) {
        moveSteps = -moveSteps;
        for (let i = 0; i < moveSteps; i++) {
          this.moveLeft();
        }
      }
    },
    moveLeft() {
      let delValue = this.rollAlbumList.pop();
      this.rollAlbumList.unshift(delValue);
      this.currentImg = this.rollAlbumList[2];
    },
    moveRight() {
      let delValue = this.rollAlbumList.shift();
      this.rollAlbumList.push(delValue);
      this.currentImg = this.rollAlbumList[2];
    },
    left() {
      if (this.rollAlbumList.length < 6) {
        if (this.currentIndex === 0) {
          this.currentIndex = this.rollAlbumList.length - 1;
          return;
        }
        this.currentIndex--;
        return;
      }
      this.moveLeft();
    },
    right() {
      if (this.rollAlbumList.length < 6) {
        if (this.currentIndex === this.rollAlbumList.length - 1) {
          this.currentIndex = 0;
          return;
        }
        this.currentIndex++;
        return;
      }
      this.moveRight();
    }
  },
  watch: {
    isShow(value) {
      if (value) {
        this.rollAlbumList = [];
        this.albumList.forEach(v => {
          // 循环赋值数组，直接赋值双向绑定
          this.rollAlbumList.push({
            name: v.name,
            url: v.url
          });
        });
        if (this.rollAlbumList.length > 5) {
          this.move(this.currentAlbumIndex);
          this.currentIndex = 2;
        } else {
          this.currentIndex = this.currentAlbumIndex;
        }
        return;
      }
      this.init();
    },
    currentIndex(value) {
      if (value === null) return;
      if (this.rollAlbumList.length > 5) {
        value = 2;
      }
      this.currentImg = this.rollAlbumList[value];
    }
  },
  props: {
    albumList: {
      type: Array
    },
    currentAlbumIndex: {
      default: 0
    },
    transfer: {
      type: Boolean,
      default: true
    },
    title: String
  }
};
</script>
