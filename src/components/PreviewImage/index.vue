<template>
  <viewer
    :key="uuid"
    :images="images"
    @inited="inited"
    class="viewer"
    ref="viewer"
  >
    <template slot-scope="scope">
      <figure class="images">
        <div class="image-wrapper" v-for="(v, i) in scope.images" :key="i">
          <img class="image" :src="v" :data-source="v" />
        </div>
      </figure>
    </template>
  </viewer>
</template>
<script>
import { uuid } from "@/utils";

export default {
  name: "PreviewImage",
  data() {
    return {
      images: [],
      uuid: uuid()
    };
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer;
    },
    async show(images, view = 0) {
      this.uuid = uuid();
      this.images = images;
      await this.$nextTick();
      this.$viewer.view({ view });
      this.$viewer.show();
    }
  }
};
</script>
<style lang="scss">
.viewer {
  position: fixed;
  z-index: -1;
  display: none;
}
</style>
