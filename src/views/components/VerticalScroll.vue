<template>
  <pull-to
    @click="$emit('toggleActionMode')"
    :top-load-method="turnPrevChapter"
    :bottom-load-method="turnNextChapter"
    :top-config="topConfig"
    :bottom-config="bottomConfig">
    <div class="chapter-title">{{ currentChapter.title }}</div>
    <div class="chapter-content" v-html="chapterContent"></div>
  </pull-to>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  export default {
    data() {
      return {
        topConfig: {
          pullText: "Pull down to load previous chapter",
          triggerText: "Release to load previous chapter",
          loadingText: "Loading previous chapter...",
          doneText: "Loading success",
          failText: "Loading fail",
        },
        bottomConfig: {
          pullText: "Pull up to load next chapter",
          triggerText: "Release to load next chapter",
          loadingText: "Loading next chapter...",
          doneText: "Loading success",
          failText: "Loading fail",
        },
      };
    },
    watch: {
      currentChapter(newChap, oldChap) {
        if (newChap.chapter_no !== oldChap.chapter_no) {
          const scrollContainer = document.querySelector(".vue-pull-to-wrapper > .scroll-container");
          if (scrollContainer) {
            scrollContainer.scrollTop = 0;
          }
        }
      },
    },
    computed: {
      ...mapState(["book", "currentChapter", "chapterContent"]),
    },
    methods: {
      ...mapActions(["getChapterContent", "updateCurrentChapter", "addHistory", "getBookHistory"]),
      turnPrevChapter(loaded) {
        if (this.currentChapter?.chapter_no <= 1) {
          this.$toast("You are on the first page");
          loaded("done");
        } else {
          this.updateCurrentChapter(this.book?.chapters[this.currentChapter.chapter_no - 2]);
          this.getChapterContent(this?.currentChapter?.content_url).then(() => {
            this.addHistory({
              book: this.book,
              read_chapter: this.currentChapter,
            }).then(() => {
              this.getBookHistory(this.book.id);
            });
            loaded("done");
          });
        }
      },
      turnNextChapter(loaded) {
        if (this.currentChapter?.chapter_no >= this.book?.chapters?.length) {
          this.$toast("This is already the last page");
          loaded("done");
        } else {
          this.updateCurrentChapter(this.book?.chapters[this.currentChapter.chapter_no]);
          this.getChapterContent(this?.currentChapter?.content_url).then(() => {
            this.addHistory({
              book: this.book,
              read_chapter: this.currentChapter,
            }).then(() => {
              this.getBookHistory(this.book.id);
            });
            loaded("done");
          });
        }
      },
    },
  };
</script>

<style>
  .vue-pull-to-wrapper > .action-block {
    color: #9e9880;
    font-size: 32px;
  }
  .vue-pull-to-wrapper > .action-block > .default-text {
    padding: 0;
    margin: 0;
  }
</style>
<style lang="scss" scoped>
  .chapter-title {
    margin: 60px 0 30px;
    padding: 0 40px;
    font-size: 48px;
    font-family: ProductSans-Bold, ProductSans;
    font-weight: bold;
    line-height: 72px;
    color: #171920;
  }
  .chapter-content {
    padding: 0 40px;
    font-size: 38px;
    font-family: ProductSans-Regular, ProductSans;
    font-weight: 400;
    line-height: 72px;
    color: #171920;
  }
</style>
