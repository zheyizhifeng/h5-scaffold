<template>
  <div
    class="book-wrapper"
    @click="gotoBook(book)"
    v-intersection
    :data-log="
      JSON.stringify({
        type: 'show_ve_book',
        body: {
          novel_id: book.source_id,
        },
      })
    ">
    <div class="left">
      <img class="left-content" :src="coverSrc" />
      <div class="left-bottom">
        <img class="view-img" src="../../assets/images/view.png" />
        <span class="view-des">{{ book.views | format_thousand_sep }}</span>
      </div>
    </div>
    <div class="right">
      <div class="book-title-wrapper">
        <div class="book-title" :class="isBookReaded ? 'book-readed' : ''">
          {{ book.title }}
        </div>
        <span class="last-read-tag" v-if="isBookReaded">Last Read</span>
      </div>
      <div class="sub-des">{{ book.summary }}</div>
      <div class="sub-tag">
        <span class="tag" v-for="(ele, index) in book.tags.slice(0, 2)" :key="index">
          {{ ele }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import qs from "querystring";
  export default {
    props: {
      book: {
        type: Object,
        require: true,
        default: () => ({}),
      },
      isTab: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      isBookReaded() {
        const bookId = this.book.source_id;
        return !!localStorage.getItem(`${bookId}_opened`);
      },
      coverSrc() {
        return `${process.env.VUE_APP_CDN_URL}/i/cover_${this.book.source_id}.webp`;
      },
    },
    created() {
      this.gotoBook = this.$throttle(this.readBook, 10 * 1000);
    },
    methods: {
      readBook({ source_id: bookId }) {
        this.$stLog({
          params: {
            eventId: "click_ve",
            pve_cur: "/novel/landing/x",
            items: JSON.stringify({
              item_id: bookId,
            }),
            portal: this.$portal,
          },
        });

        if (this.isTab) {
          let json = {
            id: "cuatom",
            feedAction: "7",
            param: JSON.stringify({
              url: `${process.env.VUE_APP_BASE_URL}/${
                process.env.VUE_APP_ENVIRONMENT === "dev" ? "" : "client/mvp-fiction/index.html"
              }#/book?${qs.encode({
                book_id: bookId,
                titlebar: "hide",
                tab: 1,
                portal: this.$portal,
              })}`,
              quit_action: "qa_start_app",
              new_task: false,
              is_hybrid: true,
              is_remote: false,
            }),
          };
          window?.shareitBridge?.asyncInvoke("custom", "executeAppEvent", "", JSON.stringify(json));
        } else {
          this.$router.push({
            path: "/book",
            query: {
              book_id: bookId,
              titlebar: "hide",
              portal: this.$portal,
            },
          });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .book-wrapper {
    height: 200px;
    display: flex;
    align-items: center;
    padding: 36px 0;
    border-bottom: 1px solid #e9e9e9;
    width: 100%;
    .left {
      width: 150px;
      height: 200px;
      position: relative;
      border-radius: 12px;
      background-color: rgba($color: #000000, $alpha: 0.05);
      border: 1px solid rgba($color: #000000, $alpha: 0.05);
      .left-content {
        width: 150px;
        height: 200px;
        background-size: 100% 100%;
        border-radius: 12px;
      }
      .left-bottom {
        position: absolute;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
        bottom: 0;
        width: 150px;
        height: 42px;
        display: flex;
        align-items: center;
        border-radius: 0px 0px 12px 12px;
        .view-img {
          width: 26px;
          height: 26px;
          margin-left: 12px;
          line-height: 42px;
        }
        .view-des {
          width: 94px;
          height: 26px;
          font-size: 24px;
          font-family: ProductSans;
          font-weight: 400;
          color: #ffffff;
          line-height: 26px;
          margin: 8px 6px;
        }
      }
    }
    .right {
      flex: 1;
      margin-left: 28px;
      width: calc(100% - 150px - 28px);
      .book-title-wrapper {
        display: flex;
        align-items: center;

        .book-title {
          height: 42px;
          font-size: 34px;
          font-family: ProductSans-Bold, ProductSans;
          font-weight: bold;
          color: #333333;
          line-height: 42px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &.book-readed {
            margin-right: 12px;
            max-width: calc(100% - 126px - 12px);
          }
        }
        .last-read-tag {
          white-space: nowrap;
          width: 126px;
          height: 36px;
          text-align: center;
          line-height: 36px;
          background: #ecf4ff;
          border-radius: 85px 100px 100px 30px;
          font-size: 22px;
          font-family: ProductSans-Regular, ProductSans;
          font-weight: 400;
          color: #368aff;
        }
      }
      .sub-des {
        height: 68px;
        font-size: 28px;
        font-family: ProductSans-Regular, ProductSans;
        font-weight: 400;
        color: #757575;
        line-height: 34px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        margin-top: 20px;
        word-break: break-all;
      }
      .sub-tag {
        height: 46px;
        margin-top: 24px;
        display: flex;
        .tag {
          height: 46px;
          line-height: 46px;
          background: #f7f7f7;
          border-radius: 8px;
          font-size: 24px;
          font-family: ProductSans-Regular, ProductSans;
          font-weight: 400;
          color: #999;
          padding: 0 16px;
          margin-right: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
