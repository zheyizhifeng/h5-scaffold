<template>
  <div class="reader-container">
    <!-- 首次引导overlay -->
    <div class="guide-overlay" v-if="guideOverlay && !chapterContentLoading" @click="closeGuideOverlay">
      <div class="prev-btn btn">
        <div class="btn-img-box">
          <img src="../assets/images/overlay-prev.webp" alt="" class="btn-img" />
        </div>
        <div class="btn-title">Previous page</div>
      </div>
      <div class="guide-line"></div>
      <div class="menu-btn btn">
        <div class="btn-img-box">
          <img src="../assets/images/overlay-menu.webp" alt="" class="btn-img menu-img" />
        </div>
        <div class="btn-title">Click Show menu</div>
      </div>
      <div class="guide-line"></div>
      <div class="next-btn btn">
        <div class="btn-img-box">
          <img src="../assets/images/overlay-next.webp" alt="" class="btn-img" />
        </div>
        <div class="btn-title">Next page</div>
      </div>
    </div>
    <!-- 首次听书overlay -->
    <div class="audio-overlay" v-if="audioOverlayShow"></div>
    <transition name="bounce">
      <div class="audio-overlay fake-overlay" v-if="audioOverlayShow">
        <div class="audio-animation" ref="audioAnimationRef">
          <div class="close" @click="closeAudioOverlay"></div>
        </div>
        <template v-if="lottieReady">
          <div class="audio-title">Unlock new features</div>
          <div class="audio-desc">Congratulations on being hit by the gift box Unlock audio features</div>
          <div class="audio-btn" @click="gotoAudio">AUDIO</div>
        </template>
      </div>
    </transition>
    <!-- 书籍目录overlay -->
    <div class="directory-overlay" v-if="isDirOpened" @click="toggleDir(false)"></div>
    <!-- 目录模块 -->
    <book-directory
      @directory-click="$emit('back')"
      @update="
        toReachLastChapterLastPage = false;
        currentPageIndex = 1;
      " />
    <!-- 顶部区域 -->
    <div v-if="isActionMode" class="back-bar" :class="pagingMode === VERTICAL_SCROLL ? '' : 'fixed'">
      <img src="../assets/images/back-old.png" @click="$emit('retainBack')" class="back-bar-icon" />
      <div class="book-title">{{ book.title }}</div>
      <img
        v-if="currentChapter.audio_url && listening === '0'"
        src="../assets/images/audio.png"
        class="book-audio"
        @click="gotoAudio(true)" />
      <div
        class="audio-tooltip"
        v-if="currentChapter.audio_url && listening === '0' && audioTooltip && !guideOverlay && !audioOverlayShow">
        Congratulations, you can listen to the book here
      </div>
    </div>
    <div v-else class="book-title-in-reading" :class="pagingMode === VERTICAL_SCROLL ? '' : 'fixed'">
      {{ book.title }}
    </div>
    <!-- 阅读内容区域 -->
    <div v-if="!onLine" class="offline-wrap">
      <img class="img" src="../assets/images/offline.png" alt="" />
      <div class="error-msg">Oops! Network Error. Failed to load</div>
      <div class="offline-btn btn" @click="openSettings">CONNECT NETWORK</div>
    </div>
    <Loading v-else-if="chapterContentLoading"></Loading>
    <!-- 章节内容加载成功 -->
    <div v-else-if="chapterContentLoadingSuccess" class="paging-container" ref="contentRef" @click="handleClickContent">
      <VerticalScroll v-if="pagingMode === VERTICAL_SCROLL" @toggleActionMode="isActionMode = !isActionMode" />
      <HorizontalCover v-else @toggleActionMode="isActionMode = !isActionMode" />
      <div class="abs-box" v-if="false">
        <div class="content-box" ref="contentWrapRef" :style="computedTransformStyle">
          <!-- <div class="chapter-title">{{ currentChapter.title }}</div> -->
          <!-- <div class="content" ref="pagerRef"></div> -->
          <div class="content" ref="pagerRef" v-html="chapterContent"></div>
          <BookRecommendation v-if="recommendationShow"></BookRecommendation>
        </div>
      </div>
    </div>
    <div v-else class="error-wrap">
      <img class="img" src="../assets/images/warning.png" alt="" />
      <div class="error-msg">Loading failed</div>
      <div class="fresh-btn btn" @click="init(true)">REFRESH</div>
    </div>
    <!-- 底部菜单区域 -->
    <div v-if="isActionMode" class="footer-wrap action-wrap" :class="pagingMode === VERTICAL_SCROLL ? '' : 'fixed'">
      <div class="action-item" @click="openDir">
        <div class="directory-guide-tooltip" v-if="directoryTooltip && !guideOverlay && !audioOverlayShow" @click.stop>
          All chapters can be viewed here
        </div>
        <img src="../assets/images/directory.png" alt="" class="action-icon" />
        <div class="action-title">Catalogue</div>
      </div>
      <div class="action-item" @click="handleBook">
        <div class="shlef-guide-tooltip" v-if="bookShelfTooptip" @click.stop>
          Add to the bookshelf for easy reading next time
        </div>
        <img :src="bookActionImg" alt="" class="action-icon" />
        <div class="action-title">
          {{ this.isBookAdded ? "Remove" : "Add bookshelf" }}
        </div>
      </div>
    </div>
    <div v-else class="footer-wrap info-wrap" :class="pagingMode === VERTICAL_SCROLL ? '' : 'fixed'">
      <div class="info-item">{{ progress }}</div>
      <div class="info-item">
        {{ time }}
      </div>
    </div>
  </div>
</template>

<script>
  import VerticalScroll from "./components/VerticalScroll.vue";
  import HorizontalCover from "./components/HorizontalCover.vue";
  import BookDirectory from "./BookDirectory.vue";
  import BookRecommendation from "./BookRecommendation.vue";
  import { mapState, mapActions } from "vuex";
  import { getCloudConfig, getUrlParam } from "../common/js/utils";
  import lottie from "lottie-web";
  import dataJson from "../assets/lottie/audioEntry/data.json";

  import {
    VERTICAL_SCROLL,
    HORIZONTAL_COVER,
    HORIZONTAL_TRANSLATION,
    HORIZONTAL_SIMULATE,
    HORIZONTAL_SCROLL,
  } from "../common/js/constant";
  export default {
    components: {
      VerticalScroll,
      HorizontalCover,
      BookDirectory,
      BookRecommendation,
    },
    data() {
      const listening = getUrlParam("listening");
      const cloudRes = getCloudConfig("add_book_to_shelf_page_count");
      return {
        guideOverlay: !localStorage.getItem("guideOverlay"),
        audioOverlay: !localStorage.getItem("audioOverlay"),
        audioTooltip: !localStorage.getItem("audioTooltip"),
        anm: null,
        lottieReady: false,
        listening,
        pagingMode: VERTICAL_SCROLL,
        VERTICAL_SCROLL,
        HORIZONTAL_COVER,
        HORIZONTAL_TRANSLATION,
        HORIZONTAL_SIMULATE,
        HORIZONTAL_SCROLL,
        frames: [],
        onLine: navigator.onLine,
        add_book_to_shelf_page_count: ~~cloudRes || 3,
        togglePageCount: 1,
        directoryTooltip: !localStorage.getItem("directoryTooltip"),
        options: {
          display: "single",
          acceleration: true,
          elevation: 50,
        },
        isActionMode: true,
        time: "",
        currentPageIndex: 1,
        currentChapterPageSize: 1,
        toReachLastChapterLastPage: false,
      };
    },
    watch: {
      currentChapter(newChap, oldChap) {
        if (newChap.chapter_no !== oldChap.chapter_no) {
          this.togglePageCount++;
          this.getChapterContent(newChap?.content_url)
            .then(() => {
              this.$nextTick(() => {
                this.updateChapterPageSize();
                if (this.toReachLastChapterLastPage) {
                  this.toReachLastChapterLastPage = !this.toReachLastChapterLastPage;
                  this.currentPageIndex = this.currentChapterPageSize;
                } else {
                  this.currentPageIndex = 1;
                }
                this.addHistory({
                  book: this.book,
                  read_chapter: newChap,
                  pager: this.currentPageIndex,
                }).then(() => {
                  this.getBookHistory(this.book.id);
                });
              });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      },
      currentPageIndex(newPage, oldPage) {
        if (newPage - oldPage > 1 || newPage - oldPage < -1) {
          this.$refs.contentWrapRef && (this.$refs.contentWrapRef.style.webkitTransitionDuration = "0s");
        } else {
          this.$refs.contentWrapRef && (this.$refs.contentWrapRef.style.webkitTransitionDuration = "0.3s");
        }
      },
      audioOverlayShow(newShow, oldShow) {
        if (newShow && !oldShow) {
          this.initAudio();
        }
      },
    },
    computed: {
      ...mapState([
        "book",
        "isReaded",
        "isBookAdded",
        "currentChapter",
        "chapterContent",
        "chapterContentLoading",
        "chapterContentLoadingSuccess",
        "isDirOpened",
        "readedChapters",
      ]),
      chapterPureText() {
        // p figure h1 h2 h3 h4 h5 h6 ul li address article aside footer
        return this.chapterContent
          .replace(/<\/p>/g, "</p>\n")
          .replace(/<\/figure>/g, "</figure>\n")
          .replace(/<\/h1>/g, "</h1>\n")
          .replace(/<\/h2>/g, "</h2>\n")
          .replace(/<\/h3>/g, "</h3>\n")
          .replace(/<\/h4>/g, "</h4>\n")
          .replace(/<\/h5>/g, "</h5>\n")
          .replace(/<\/h6>/g, "</h6>\n")
          .replace(/<\/ul>/g, "</ul>\n")
          .replace(/<\/li>/g, "</li>\n")
          .replace(/<\/address>/g, "</address>\n")
          .replace(/<\/article>/g, "</article>\n")
          .replace(/<\/aside>/g, "</aside>\n")
          .replace(/<\/footer>/g, "</footer>\n")
          .replace(/<[^>]+>/g, "");
      },
      recommendationShow() {
        if (this.currentChapter) {
          return this.currentChapter?.chapter_no >= this?.book?.chapters?.length;
        }
        return false;
      },
      audioOverlayShow() {
        const show = this.currentChapter.audio_url && this.listening === "0" && this.audioOverlay && !this.guideOverlay;
        return show;
      },
      bookShelfTooptip() {
        return !this.isBookAdded && this.togglePageCount >= this.add_book_to_shelf_page_count;
      },
      computedTransformStyle() {
        return {
          "-webkit-transform": `translateX(${(this.currentPageIndex - 1) * -100}%)`,
        };
      },
      bookActionImg() {
        return this.isBookAdded
          ? require("../assets/images/remove-book.png")
          : require("../assets/images/add-book.png");
      },
      progress() {
        const chapterPercentage = this.currentChapter?.chapter_no / this.book.chapters.length;
        const everyChapterPercentage = 1 / this.book.chapters.length;
        const pagePercentage = this.currentPageIndex / this.currentChapterPageSize;
        const percentage = chapterPercentage - (1 - pagePercentage) * everyChapterPercentage;
        return (percentage * 100).toFixed(2) + "%";
      },
    },
    created() {
      window.addEventListener("online", () => {
        this.init();
      });
      this.init();
    },
    mounted() {
      if (this.audioOverlayShow) {
        this.initAudio();
      }
    },
    methods: {
      ...mapActions([
        "toggleDir",
        "addHistory",
        "getBookHistory",
        "getChapterContent",
        "addBookToShelf",
        "removeBookFromShelf",
        "updateCurrentChapter",
      ]),
      init(flag) {
        if (flag) {
          this.$stLog({
            params: {
              eventId: "click_ve",
              pve_cur: "/novel/detail/refresh",
              portal: this.$portal,
            },
          });
        }
        this.getNowTime();
        window.setInterval(() => {
          this.getNowTime();
        }, 60000);
        if (this?.currentChapter?.content_url) {
          this.getChapterContent(this?.currentChapter?.content_url).then(() => {
            this.$nextTick(() => {
              this.updateChapterPageSize();
              this?.currentChapter?.pager >= 1 && (this.currentPageIndex = this?.currentChapter?.pager);
              this.readedChapters.length === 0 &&
                this.addHistory({
                  book: this.book,
                  read_chapter: this.currentChapter,
                  pager: this.currentPageIndex,
                }).then(() => {
                  this.getBookHistory(this.book.id);
                });
            });
          });
        }
      },
      initAudio() {
        this.$nextTick(() => {
          if (this.$refs.audioAnimationRef) {
            this.anm?.destroy();
            this.anm = lottie.loadAnimation({
              container: this.$refs.audioAnimationRef, // the dom element that will contain the animation
              renderer: "svg",
              loop: true,
              autoplay: true,
              animationData: dataJson,
            });
            // 当前循环播放完成触发
            this.anm.addEventListener("DOMLoaded", () => {
              this.lottieReady = true;
            });
            this.anm.addEventListener("data_ready", () => {
              this.lottieReady = true;
            });
          }
        });
      },
      openSettings() {
        location.href =
          "shareits://test/1?url=%23Intent;action%3Dandroid.settings.SETTINGS;launchFlags%3D0x10000000;end";
      },
      closeAudioOverlay() {
        this.audioOverlay = false;
        this.anm?.destroy();
        localStorage.setItem("audioOverlay", "1");
      },
      gotoAudio(flag) {
        this.$stLog({
          params: {
            eventId: "click_ve",
            pve_cur: flag ? "/novel/detail/listen_unlock" : "/novel/detail/listen",
            items: JSON.stringify({
              item_id: this.book.id,
              category_id: this.book?.categories?.join(",") || "",
            }),
            portal: this.$portal,
          },
        });
        this.closeAudioOverlay();
        let json = {
          feedAction: "60",
          param: JSON.stringify({
            page_url: "/online/activity/novel_detail_player",
            item_id: this.book.id, //书籍id,
            PortalType: "novel_detail",
            portal: "novel_detail",
          }),
        };
        window?.shareitBridge?.asyncInvoke("custom", "executeAppEvent", "", JSON.stringify(json));
      },
      closeTooltips() {
        this.directoryTooltip = false;
        this.audioTooltip = false;
        localStorage.setItem("directoryTooltip", "1");
        localStorage.setItem("audioTooltip", "1");
        if (this.bookShelfTooptip) {
          this.togglePageCount = -Infinity;
        }
      },
      closeGuideOverlay() {
        this.guideOverlay = false;
        localStorage.setItem("guideOverlay", "1");
      },

      // eslint-disable-next-line no-unused-vars
      handleClickContent(event) {
        if (this.pagingMode === this.VERTICAL_SCROLL) {
          this.pagingMode = this.HORIZONTAL_SCROLL;
        } else {
          this.pagingMode = this.VERTICAL_SCROLL;
        }
        this.closeTooltips();
        const screenWidth = window.innerWidth || screen.width;
        if (event.x < screenWidth / 3) {
          this.togglePage(-1);
          this.togglePageCount++;
        } else if (event.x > (screenWidth * 2) / 3) {
          this.togglePage(1);
          this.togglePageCount++;
        } else {
          this.isActionMode = !this.isActionMode;
        }
        // const screenWidth = window.innerWidth || screen.width;
        // if (event.x < screenWidth / 3) {
        //   this.togglePage(-1);
        //   this.togglePageCount++;
        // } else if (event.x > (screenWidth * 2) / 3) {
        //   this.togglePage(1);
        //   this.togglePageCount++;
        // } else {
        //   this.isActionMode = !this.isActionMode;
        // }
      },
      updateChapterPageSize() {
        const ref = this.$refs.contentWrapRef;
        if (ref) {
          this.currentChapterPageSize = Math.round(ref.scrollWidth / ref.clientWidth);
        }
      },
      openDir() {
        this.toggleDir(true);
        this.$stLog({
          params: {
            eventId: "click_ve",
            pve_cur: "/novel/contents_btn/x",
            items: JSON.stringify({
              item_id: this.book.id,
            }),
            portal: this.$portal,
          },
        });
      },

      togglePage(flag) {
        if (this.currentChapter?.chapter_no <= 1 && this.currentPageIndex + flag <= 0) {
          // 边界条件，在第一章第一页时，不能向前翻页
          // this.$toast("You are on the first page");
          this.$emit("back");
        } else if (
          this.currentChapter?.chapter_no >= this.book?.chapters?.length &&
          this.currentPageIndex + flag > this.currentChapterPageSize
        ) {
          // 边界条件，在最后一章最后一页时，不能向后翻页
          this.$toast("This is already the last page");
        } else {
          if (this.currentPageIndex + flag <= 0) {
            this.toReachLastChapterLastPage = true;
            // 从非第一章的第一页切到上一章的最后一页
            this.updateCurrentChapter(this.book?.chapters[this.currentChapter.chapter_no - 2]);
          } else if (this.currentPageIndex + flag > this.currentChapterPageSize) {
            // 从非最后一章的最后一页切到下一章的第一页
            this.updateCurrentChapter(this.book?.chapters[this.currentChapter.chapter_no]);
          } else {
            // 切到本章的上一页或下一页
            this.currentPageIndex += flag;
          }
        }
      },
      handleBook() {
        this.isBookAdded
          ? this.removeBookFromShelf(this.book).then(() => {
              this.$stLog({
                params: {
                  eventId: "click_ve",
                  pve_cur: "/novel/bookshelf_btn/x",
                  items: JSON.stringify({
                    item_id: this.book.id,
                    type: "移出书架",
                  }),
                  portal: this.$portal,
                },
              });
              this.$toast("Remove successfully");
            })
          : this.addBookToShelf(this.book).then(() => {
              this.$stLog({
                params: {
                  eventId: "click_ve",
                  pve_cur: "/novel/bookshelf_btn/x",
                  items: JSON.stringify({
                    item_id: this.book.id,
                    type: "加入书架",
                  }),
                  portal: this.$portal,
                },
              });
              this.$toast("Add successfully");
            });
      },
      getNowTime() {
        let dataTime;
        let hh = new Date().getHours();
        let ff = new Date().getMinutes();
        // let long = new Date().toLocaleTimeString().length;
        // let ap = new Date().toLocaleTimeString().substring(long - 2, long);
        dataTime = (hh < 10 ? "0" + hh : hh) + ":" + (ff < 10 ? "0" + ff : ff);
        this.time = dataTime;
      },
      saveHistory() {
        this.addHistory({
          book: this.book,
          read_chapter: this.currentChapter,
          pager: this.currentPageIndex,
        }).then(() => {
          this.getBookHistory(this.book.id);
        });
      },
    },
    beforeDestroy() {
      this.saveHistory();
      this.anm?.destroy();
    },
  };
</script>
<style>
  .bounce-enter-active {
    animation: bounce-in 0.5s;
  }
  /* .bounce-leave-active {
  animation: bounce-in 0.5s reverse;
} */
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.25);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
<style lang="scss" scoped>
  .reader-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #fcf8eb;
    .guide-overlay {
      position: fixed;
      z-index: 10;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      .guide-line {
        width: 2px;
        height: calc(100% - 180px);
        background: url("../assets/images/dash-line.png") no-repeat;
        background-size: cover;
      }
      .btn {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .btn-img-box {
          width: 120px;
          height: 120px;
          line-height: 120px;
          margin-bottom: 20px;
          text-align: center;
          .btn-img {
            width: 48px;
            height: 48px;
            &.menu-img {
              width: 120px;
              height: 120px;
            }
          }
        }
        .btn-title {
          font-size: 24px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #ffffff;
          line-height: 28px;
        }
      }
      .prev-btn {
        flex: 3;
      }
      .menu-btn {
        flex: 4;
      }
      .next-btn {
        flex: 3;
      }
    }
    .audio-overlay {
      position: fixed;
      z-index: 8;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &.fake-overlay {
        background: transparent;
        z-index: 9;
      }
      .audio-animation {
        position: relative;
        width: 500px;
        height: 500px;
        .close {
          position: absolute;
          z-index: 1;
          width: 48px;
          height: 48px;
          top: 0;
          right: 0;
          background: url("../assets/images/close.webp") no-repeat;
          background-size: cover;
        }
      }
      .audio-title {
        height: 36px;
        font-size: 36px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #ffffff;
        line-height: 36px;
        margin-top: -46px;
      }
      .audio-desc {
        width: 560px;
        text-align: center;
        font-size: 28px;
        font-family: ProductSans-Regular, ProductSans;
        font-weight: 400;
        color: #ffffff;
        line-height: 36px;
        margin-top: 30px;
      }
      .audio-btn {
        width: 380px;
        height: 72px;
        margin-top: 68px;
        background: #247fff;
        border-radius: 12px;
        font-size: 28px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #ffffff;
        line-height: 72px;
        text-align: center;
      }
    }
    .directory-overlay {
      position: fixed;
      z-index: 3;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
    }
    .fixed {
      position: fixed;
    }
    .back-bar {
      position: relative;
      top: 0;
      margin-top: 60px;
      left: 0;
      right: 0;
      padding-left: 16px;
      padding-right: 40px;
      height: 72px;
      display: flex;
      align-items: center;
      font-size: 36px;
      font-family: ProductSans-Bold, ProductSans;
      font-weight: bold;
      color: #171920;
      &.fixed {
        position: fixed;
      }
      .back-bar-icon {
        width: 72px;
        height: 72px;
        margin-right: 30px;
      }
      .book-title {
        flex: 1;
        @include text-overflow;
      }
      .book-audio {
        width: 72px;
        height: 72px;
      }
      .audio-tooltip {
        position: absolute;
        z-index: 1;
        top: 90px;
        right: 20px;
        width: 428px;
        padding: 20px;
        background: #247fff;
        border-radius: 16px;
        font-size: 28px;
        font-family: ProductSans-Regular, ProductSans;
        font-weight: 400;
        color: #ffffff;
        line-height: 34px;
        &::before {
          content: "";
          width: 32px;
          height: 22px;
          position: absolute;
          right: 40px;
          top: -22px;
          background: url("../assets/images/arrow-top.png") no-repeat;
          background-size: cover;
        }
      }
    }
    .book-title-in-reading {
      top: 0;
      margin-top: 88px;
      left: 0;
      right: 0;
      padding: 0 40px;
      height: 44px;
      line-height: 44px;
      font-size: 24px;
      font-family: ProductSans-Regular, ProductSans;
      font-weight: 400;
      color: #9e9880;
      @include text-overflow;
    }
    .paging-container {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: hidden;
      .abs-box {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: hidden;
      }
      .content-box {
        width: 100%;
        height: 100%;
        column-width: 100vw;
        column-count: 1;
        column-gap: 0;
        transform: translateX(0);
        transition: transform 0.3s ease-in-out;
      }
      .chapter-title {
        padding: 70px 40px 0;
        font-size: 48px;
        font-family: ProductSans-Bold, ProductSans;
        font-weight: bold;
        color: #171920;
        position: relative;
      }
      .content {
        height: 0;
        overflow: hidden;
        padding: 0 40px;
        font-size: 38px;
        font-family: ProductSans-Regular, ProductSans;
        font-weight: 400;
      }
    }
    .error-wrap,
    .offline-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      font-size: 28px;
      .img {
        margin: 0 auto;
        width: 110px;
        height: 110px;
      }
      .error-msg {
        margin: 20px 70px 30px;
        color: #666;
      }
      .btn {
        width: 380px;
        height: 72px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #247fff;
        margin: 0 auto;
        color: #fff;
        border-radius: 12px;
        &.fresh-btn::before {
          content: "";
          width: 28px;
          height: 28px;
          background: url("../assets/images/retry.png") no-repeat center center / cover;
          margin-right: 10px;
        }
      }
    }
    .footer-wrap {
      bottom: 0;
      left: 0;
      right: 0;
      height: 110px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.info-wrap {
        padding: 0 40px;
        .info-item {
          font-size: 26px;
          font-family: ProductSans-Regular, ProductSans;
          font-weight: 400;
          color: #9e9880;
          line-height: 32px;
        }
      }
      &.action-wrap {
        box-shadow: 0px -1px 0px 1px rgba($color: #e5e2d2, $alpha: 0.6);
        .action-item {
          flex: 1;
          text-align: center;
          position: relative;
          .directory-guide-tooltip {
            position: absolute;
            left: 50%;
            top: -140px;
            width: 450px;
            height: 88px;
            line-height: 88px;
            background: #247fff;
            border-radius: 16px;
            font-size: 28px;
            font-family: ProductSans-Regular, ProductSans;
            font-weight: 400;
            color: #ffffff;
            margin-left: -60px;
            &::after {
              content: "";
              width: 32px;
              height: 22px;
              position: absolute;
              left: 50px;
              bottom: -22px;
              background: url("../assets/images/arrow-bottom.webp") no-repeat;
              background-size: cover;
            }
          }
          .shlef-guide-tooltip {
            position: absolute;
            right: 50%;
            top: -160px;
            width: 400px;
            text-align: left;
            line-height: 34px;
            padding: 24px;
            background: #247fff;
            border-radius: 16px;
            font-size: 28px;
            font-family: ProductSans-Regular, ProductSans;
            font-weight: 400;
            color: #ffffff;
            margin-right: -60px;
            &::after {
              content: "";
              width: 32px;
              height: 22px;
              position: absolute;
              right: 50px;
              bottom: -22px;
              background: url("../assets/images/arrow-bottom.webp") no-repeat;
              background-size: cover;
            }
          }
          .action-icon {
            height: 44px;
          }
          .action-title {
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #52514a;
            margin-top: -2px;
          }
        }
      }
    }
  }
</style>
