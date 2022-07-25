<template>
  <div class="content_bottom" v-if="relatedBooks.length > 0">
    <div class="line_title">
      <span class="line"></span>
      <div class="txt">Last Chapter</div>
      <span class="line"></span>
    </div>
    <div class="end_title">
      <div class="like-text">You May Also Like</div>
      <div
        class="book_tottom"
        :class="{ 'first-row': i === 1 }"
        v-for="i in Math.floor(Math.min(relatedBooks.length, 6) / 3)"
        :key="i">
        <div
          v-for="item in relatedBooks.slice((i - 1) * 3, i * 3)"
          :key="item.id"
          class="book_card"
          @click.stop="hanldeBookDetails(item.items[0].id, item.items[0].categories)"
          v-intersection
          :data-log="
            JSON.stringify({
              type: 'show_content',
              params: {
                item_id: item.items[0].id,
                category_id: item.items[0].categories.join(','),
              },
            })
          ">
          <div class="book-cover" :style="computedCover(item.items[0].cover)">
            <div class="book_view">
              <img src="../assets/images/view.png" alt="" class="view_cover" />
              <span class="view_num"> {{ item.items[0].view_count | format_thousand_sep }}</span>
            </div>
          </div>
          <div class="cover_content">{{ item.items[0].title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";

  export default {
    computed: {
      ...mapState(["relatedBooks"]),
      computedCover() {
        return function (src) {
          return {
            background: `url(${src}) no-repeat`,
            "background-size": "cover",
          };
        };
      },
    },

    methods: {
      // 跳转小说详情页
      hanldeBookDetails(id, categoryId) {
        this.$stLog({
          params: {
            eventId: "click_content",
            pve_cur: "/novel/detail/recommend",
            items: JSON.stringify({
              item_id: id,
              category_id: categoryId.join(","),
            }),
          },
        });
        let json = {
          feedAction: "21",
          param: JSON.stringify({
            url: `${process.env.VUE_APP_BASE_URL}/${
              process.env.VUE_APP_ENVIRONMENT === "dev" ? "" : "client/mvp-fiction/index.html"
            }#/?theme=immr&titlebar=hide&tab=novel&item_id=${id}&portal=novel_detail_recommend`,
            style: 2,
          }),
        };
        window.shareitBridge.asyncInvoke("hybirdPortal", "executeAppEvent", "", JSON.stringify(json));
      },
    },
  };
</script>

<style lang="scss" scoped>
  .content_bottom {
    .line_title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 50px;
      .line {
        width: 100px;
        height: 1px;
        background: #9e9880;
      }
      .txt {
        margin: 0 20px;
        font-weight: 400;
        font-size: 34px;
        font-family: ProductSans-Regular, ProductSans;
        color: #9e9880;
        line-height: 42px;
      }
    }
    .end_title {
      padding: 0px 40px;
      break-inside: avoid;
      .like-text {
        text-align: center;
        height: 36px;
        font-size: 32px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #191919;
        line-height: 36px;
        padding: 40px 0 32px;
      }
    }
    .book_tottom {
      display: flex;
      margin-top: 40px;
      &.first-row {
        margin-top: 0;
      }
      .book_card {
        flex: 1;
        &:nth-child(2) {
          margin: 0 40px;
        }
        .book-cover {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 267px;
          border-radius: 14px;
          .book_view {
            display: flex;
            height: 42px;
            align-items: center;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8) 100%);
            border-radius: 0px 0px 14px 14px;
            .view_cover {
              margin-left: 13px;
              width: 26px;
              height: 26px;
            }
            .view_num {
              margin-left: 6px;
              font-size: 24px;
              color: #ffffff;
              font-weight: 400;
              font-family: ProductSans-Regular, ProductSans;
            }
          }
        }
        .cover_content {
          margin-top: 15px;
          line-height: 32px;
          font-size: 24px;
          color: #191919;
          font-weight: 400;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-family: Roboto-Regular, Roboto;
        }
      }
    }
  }
</style>
