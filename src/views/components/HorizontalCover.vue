<template>
  <div class="horizontal-wrapper" ref="contentRef">
    <div class="hidden-node" ref="hiddenRef" v-html="chapterContent"></div>
    <canvas ref="canvasRef" class="canvas" @click="togglePage"></canvas>
    <div class="pages-container" ref="pagerRef">
      <div class="page-item" v-for="(frame, index) in frames" :key="index" v-text="123"></div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  import { computeTextFrames, renderFrame } from "@mattuy/text-frame/esm";
  import { PageFlip } from "page-flip";

  export default {
    data() {
      return {
        frames: [],
        pageIndex: 0,
      };
    },
    watch: {
      pageIndex(newIndex) {
        const ctx = this.$refs.canvasRef.getContext("2d");
        renderFrame(ctx, this.frames[newIndex], true);
      },
    },
    computed: {
      ...mapState(["book", "currentChapter", "chapterContent"]),
      pageContent() {
        return function (frame) {
          return frame.lines.map((line) => line.chars.join("")).join("\n");
        };
      },
    },
    methods: {
      ...mapActions(["getChapterContent", "updateCurrentChapter", "addHistory", "getBookHistory"]),
      initFrames() {
        const contentRef = this.$refs.contentRef;
        const innerText = this.$refs.hiddenRef.innerText;
        const paragraphs = innerText.split("\n\n");
        this.frames = computeTextFrames({
          viewWidth: contentRef.clientWidth,
          viewHeight: contentRef.clientHeight,
          color: "#171920",
          textAlign: "left",
          margin: {
            top: (146 / 36) * window.rem,
            bottom: (110 / 36) * window.rem,
            left: (40 / 36) * window.rem,
            right: (40 / 36) * window.rem,
          },
          lineHeight: (72 / 36) * window.rem,
          trim: true,
          unbreakableRule: /^──|……|[\w\d]+$/,
          fragments: [
            {
              fontFamily: "ProductSans-Bold, ProductSans",
              fontSize: (48 / 36) * window.rem,
              fontWeight: "bold",
              margin: {
                top: (44 / 36) * window.rem,
                bottom: (60 / 36) * window.rem,
              },
              text: this.currentChapter.title,
            },
            ...paragraphs.map((text) => {
              return {
                fontFamily: "ProductSans-Regular, ProductSans",
                fontSize: (38 / 36) * window.rem,
                fontWeight: "normal",
                margin: {
                  top: (46 / 36) * window.rem,
                  bottom: (46 / 36) * window.rem,
                },
                textIndent: (72 / 36) * window.rem,
                text,
              };
            }),
          ],
        });
        // 渲染frame
        const ctx = this.$refs.canvasRef.getContext("2d");
        renderFrame(ctx, this.frames[this.pageIndex], true);
      },
      initPaging() {
        const pageFlip = new PageFlip(this.$refs.pagerRef, {
          width: window.innerWidth,
          height: window.innerHeight,
        });
        pageFlip.loadFromHTML(document.querySelectorAll(".page-item"));
      },
      togglePage(event) {
        const screenWidth = window.innerWidth || screen.width;
        if (event.x < screenWidth / 3) {
          this.pageIndex--;
        } else if (event.x > (screenWidth * 2) / 3) {
          this.pageIndex++;
        } else {
          this.$emit("toggleActionMode");
        }
      },
    },
    mounted() {
      this.initFrames();
      this.initPaging();
    },
  };
</script>

<style lang="scss" scoped>
  .horizontal-wrapper {
    height: 100vh;
    .hidden-node {
      height: 0;
      overflow: hidden;
    }
    .canvas {
      width: 100%;
      height: 100%;
    }
    .pages-container {
      height: 100%;
      .page-item {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
