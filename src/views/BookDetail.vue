<template>
  <div v-if="!onLine" class="offline-wrap">
    <img class="img" src="../assets/images/offline.png" alt="" />
    <div class="error-msg">Oops! Network Error. Failed to load</div>
    <div class="offline-btn btn" @click="openSettings">CONNECT NETWORK</div>
  </div>
  <Loading v-else-if="historyLoading || bookDetailLoading"></Loading>
  <div v-else-if="bookDetailLoadingSuccess && historyLoadingSuccess" class="book-container">
    <div class="detail-container" v-if="summaryShow">
      <div class="back-bar" @click="retainBack">
        <img src="../assets/images/back-old.png" alt="" class="back-bar-icon" />
      </div>
      <div class="detail-wrap">
        <div v-if="book.progress === 'completed'" class="end-tag">
          <div class="text">END</div>
        </div>
        <div class="detail-card">
          <div class="book-row">
            <img :src="book.cover" alt="" class="book-cover" />
            <div class="title-author">
              <div class="title">{{ book.title }}</div>
              <div class="author">{{ book.source_user }}</div>
            </div>
          </div>
          <div class="data-row">
            <div class="data-column">
              <div class="data-number">
                {{ book.source_shelves | format_thousand_sep }}
              </div>
              <div class="data-name">Adds</div>
            </div>
            <span class="line">|</span>
            <div class="data-column">
              <div class="data-number">
                {{ book.view_count | format_thousand_sep }}
              </div>
              <div class="data-name">Reading</div>
            </div>
            <span class="line">|</span>
            <div class="data-column">
              <div class="data-number">
                {{ book.word_num | format_thousand_sep }}
              </div>
              <div class="data-name">Total words</div>
            </div>
          </div>
        </div>
        <div class="brief-card">
          <div class="brief-wrap">
            <div class="abs-wrap">
              <div class="brief-title">Brief Introduction</div>
              <div class="brief-text" ref="briefTextRef">
                {{ book.description }}
              </div>
              <div class="book-tags">
                <span class="book-tag" v-for="tag in book.categories" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="click-right-bar"
        @click="
          isStartReading = true;
          isBack = false;
        ">
        Click to read
        <div class="arrow-right" ref="arrowRef"></div>
      </div>
    </div>
    <book-reader v-else ref="readerRef" @back="isBack = true" @retainBack="retainBack" />
    <!-- 弹框 -->
    <div class="popup" v-if="retainDialogShow">
      <div class="show-item2">
        <p class="show-item3">Add To Bookshelf?</p>
        <div class="show-item4">
          <span class="show-item5" @click="handleCancel">{{ "CANCEL" }}</span>
          <span class="show-item6" @click="handleConfirm">{{ "ADD" }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="error-wrap">
    <img class="img" src="../assets/images/warning.png" alt="" />
    <div class="error-msg">Loading failed</div>
    <div class="fresh-btn btn" @click="initRequest(true)">REFRESH</div>
  </div>
</template>

<script>
  import { inject, lifecycleCallback } from "shareit-hybird-js-sdk";
  import BookReader from "./BookReader.vue";
  import { mapState, mapActions } from "vuex";
  import lottie from "lottie-web";
  import dataJson from "../assets/lottie/readerEntry/data.json";
  export default {
    components: {
      BookReader,
    },
    data() {
      return {
        onLine: navigator.onLine,
        isStartReading: false,
        isBack: false,
        enterTime: Date.now(),
        retainDialogShow: false,
      };
    },
    watch: {
      retainDialogShow(show) {
        if (show) {
          let t = window?.performance?.timing;
          const loadTime = t.loadEventEnd - t.navigationStart;
          this.$stLog({
            params: {
              eventId: "popup_show",
              pve_cur: "/novel/detail/x",
              items: JSON.stringify({
                item_id: this.book.id,
                load_duration: Math.max(loadTime, 0),
              }),
              portal: this.$portal,
            },
          });
        }
      },
      summaryShow(newShow, oldShow) {
        if (newShow && !oldShow) {
          this.initSummary();
        }
      },
    },
    computed: {
      ...mapState([
        "book",
        "isReaded",
        "isBookAdded",
        "readedChapters",
        "historyLoading",
        "historyLoadingSuccess",
        "bookDetailLoading",
        "bookDetailLoadingSuccess",
        "currentChapter",
        "chapterContentLoadingSuccess",
      ]),
      summaryShow() {
        const show = !(this.isReaded || this.isStartReading) || this.isBack;
        return show;
      },
    },
    created() {
      window.addEventListener("online", () => {
        this.onLine = true;
        this.initRequest();
      });
      this.initRequest();
    },
    mounted() {
      if (this.summaryShow) {
        this.initSummary();
      }
    },
    methods: {
      ...mapActions(["getBookHistory", "getBookDetail", "judgeBookIsAdded", "addBookToShelf", "getRelatedBooks"]),
      initRequest(flag) {
        if (flag) {
          this.$stLog({
            params: {
              eventId: "click_ve",
              pve_cur: "/novel/detail/refresh",
              portal: this.$portal,
            },
          });
        }
        this.initLifeCycle();
        this.initInject();
        this.getBookHistory(this.item_id);
        this.judgeBookIsAdded(this.item_id);
        this.getBookDetail(this.item_id);
        this.getRelatedBooks(this.item_id);
        this.inPageBuryPoint();
        this.initBriefHeight();
      },
      initSummary() {
        this.$nextTick(() => {
          lottie.loadAnimation({
            container: this.$refs.arrowRef, // the dom element that will contain the animation
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: dataJson,
          });
          this.initBriefHeight();
        });
      },
      openSettings() {
        location.href =
          "shareits://test/1?url=%23Intent;action%3Dandroid.settings.SETTINGS;launchFlags%3D0x10000000;end";
      },
      retainBack() {
        this.$refs.readerRef && this.$refs.readerRef.saveHistory();
        if (this.bookDetailLoadingSuccess && this.historyLoadingSuccess && !this.isBookAdded) {
          this.retainDialogShow = true;
        } else {
          this.handleBack();
        }
      },
      handleCancel() {
        this.$stLog({
          params: {
            eventId: "popup_click",
            pve_cur: "/novel/detail/x",
            items: JSON.stringify({
              type: 1,
            }),
          },
        });
        this.retainDialogShow = false;
        this.handleBack();
      },
      handleConfirm() {
        this.$stLog({
          params: {
            eventId: "popup_click",
            pve_cur: "/novel/detail/x",
            items: JSON.stringify({
              type: 0,
            }),
          },
        });
        this.addBookToShelf(this.book).then(() => {
          this.retainDialogShow = false;
          this.$toast("Add successfully");
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
          setTimeout(() => {
            this.handleBack();
          }, 1000);
        });
      },
      initInject() {
        inject({ callbackName: "" });
        inject({ callbackName: "outPageCallback" });
        window.outPageCallback = this.retainBack;
      },
      initLifeCycle() {
        lifecycleCallback({
          portal: this.$hybirdPortal,
          callbackName: "__LIFECYCLE_UPDATE__",
        });
        window.__LIFECYCLE_UPDATE__ = (res) => {
          try {
            const data = JSON.parse(res);
            if (data?.lifecycle === "onResume") {
              this.enterTime = Date.now();
              this.judgeBookIsAdded(this.item_id);
            } else if (data?.lifecycle === "onPause") {
              this.outPageBuryPoint();
            }
          } catch (error) {
            window.addEventListener("pagehide", this.outPageBuryPoint);
            window.addEventListener("pageshow", () => {
              this.enterTime = Date.now();
            });
          }
        };
      },
      initBriefHeight() {
        this.$nextTick(() => {
          const { briefTextRef } = this.$refs;
          if (briefTextRef) {
            const briefTextHeight =
              briefTextRef?.clientHeight || briefTextRef?.offsetHeight || briefTextRef?.scrollHeight;
            const lineHeight = (50 / 36) * window.rem;
            const maxLineCount = Math.floor(briefTextHeight / lineHeight);
            if (briefTextRef) {
              briefTextRef.style.webkitLineClamp = maxLineCount;
            }
          }
        });
      },
      inPageBuryPoint() {
        let t = window?.performance?.timing;
        const loadTime = t.loadEventEnd - t.navigationStart;
        this.$stLog({
          params: {
            eventId: "in_page",
            pve_cur: "/novel/detail/x",
            items: JSON.stringify({
              item_id: this.item_id,
              load_duration: Math.max(loadTime, 0),
            }),
            portal: this.$portal,
          },
        });
      },
      outPageBuryPoint() {
        const now = Date.now();
        const chapterList = this?.book?.chapters;
        let read_first_end = false;
        if (Array.isArray(chapterList) && chapterList.length > 0) {
          const first = chapterList[0];
          const last = chapterList[chapterList.length - 1];
          if (this.readedChapters.includes(first.id) && this.readedChapters.includes(last.id)) {
            read_first_end = true;
          }
        }
        this.$stLog({
          params: {
            eventId: "out_page",
            pve_cur: "/novel/detail/x",
            items: JSON.stringify({
              item_id: this.book.id,
              read_duration: now - this.enterTime,
              chapter: this.currentChapter,
              read_first_end,
              content_result: this.summaryShow || this.chapterContentLoadingSuccess,
            }),
            portal: this.$portal,
          },
        });
      },
      slideUpHandler(loaded) {
        this.isStartReading = true;
        loaded("done");
      },
    },
  };
</script>

<style lang="scss" scoped>
  .error-wrap,
  .offline-wrap {
    height: 100vh;
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

  .book-container {
    .popup {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 9999;
      overflow: hidden;
      display: flex;
      justify-items: center;
      align-items: center;
    }
    .show-item2 {
      width: 640px;
      height: 240px;
      background-color: white;
      margin: 0 auto;
      border-radius: 32px;
    }
    .show-item3 {
      padding: 24px 0 0 0;
      margin-left: 48px;
      color: #666666;
      font-size: 32px;
    }
    .show-item4 {
      margin-left: 357px;
      margin-top: 76px;
      color: #247fff;
      font-size: 28px;
      font-weight: bold;
    }
    .show-item6 {
      margin-left: 68px;
      color: #247fff;
      font-size: 28px;
      font-weight: bold;
    }
  }
  .detail-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 0 40px;
    background: #fcf8eb;
    .back-bar {
      height: 80px;
      display: flex;
      align-items: center;
      margin: 84px 0 20px -20px;
      .back-bar-icon {
        width: 72px;
        height: 72px;
      }
    }
    .detail-wrap {
      flex: 1;
      border-radius: 40px;
      box-shadow: 0 0 0 4px #f7f1db;
      display: flex;
      flex-direction: column;
      position: relative;
      .end-tag {
        z-index: 1;
        position: absolute;
        width: 120px;
        height: 120px;
        top: -8px;
        right: -8px;
        background: url("../assets/images/end.png") no-repeat;
        background-size: cover;
        .text {
          width: 160px;
          font-size: 20px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #a19a85;
          transform-origin: 0 0;
          transform: rotate(45deg) translateY(-35px);
          text-align: center;
        }
      }
      .detail-card {
        padding: 48px 50px 0;
        background: rgba(#f2edda, 0.62);
        border-radius: 40px 40px 0px 0px;
        .book-row {
          display: flex;
          .book-cover {
            width: 164px;
            height: 235px;
            border-radius: 12px;
            margin-right: 28px;
          }
          .title-author {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .title {
              font-size: 36px;
              font-family: Roboto-Bold, Roboto;
              font-weight: bold;
              color: #171920;
              line-height: 50px;
            }
            .author {
              margin-top: 20px;
              font-size: 26px;
              font-family: Roboto-Regular, Roboto;
              font-weight: 400;
              color: #9e9880;
              line-height: 28px;
            }
          }
        }
        .data-row {
          height: 128px;
          margin: 20px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          .data-column {
            .data-number {
              font-size: 26px;
              font-family: Roboto-Black, Roboto;
              font-weight: 900;
              color: #c97907;
              line-height: 28px;
              margin-bottom: 8px;
            }
            .data-name {
              font-size: 20px;
              font-family: Roboto-Regular, Roboto;
              font-weight: 400;
              color: #9e9880;
              line-height: 28px;
            }
          }
          .line {
            color: rgba($color: #000, $alpha: 0.1);
          }
        }
      }
      .brief-card {
        flex: 1;
        padding: 0 30px;
        display: flex;
        flex-direction: column;
        .brief-wrap {
          flex: 1;
          position: relative;
          .abs-wrap {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            flex-direction: column;
          }
          .brief-title {
            padding: 36px 0 24px;
            height: 40px;
            line-height: 40px;
            font-size: 28px;
            font-family: Roboto-Bold, Roboto;
            font-weight: bold;
            color: #171920;
          }
          .brief-text {
            word-break: break-word;
            font-size: 24px;
            font-family: Roboto-Regular, Roboto;
            font-weight: 400;
            color: #171920;
            line-height: 50px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .book-tags {
            display: flex;
            flex-wrap: wrap;
            text-overflow: ellipsis;
            padding-top: 10px;
            padding-bottom: 20px;
            .book-tag {
              white-space: nowrap;
              background: #f5f0df;
              border-radius: 8px;
              margin-top: 10px;
              margin-right: 10px;
              padding: 10px;
              font-size: 24px;
              font-family: Roboto-Regular, Roboto;
              font-weight: 400;
              color: #9e9880;
            }
          }
        }
      }
    }
    .click-right-bar {
      height: 40px;
      margin: 35px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #9e9880;
      .arrow-right {
        margin-left: 14px;
        width: 40px;
        height: 40px;
      }
    }
  }
</style>
