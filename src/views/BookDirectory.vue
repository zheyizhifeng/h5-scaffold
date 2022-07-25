<template>
  <div class="directory-container" :class="isDirOpened ? 'opened' : 'closed'">
    <div class="book-summary">
      <div
        class="cover-row"
        @click="
          toggleDir(false);
          $emit('directory-click');
        ">
        <img :src="book.cover" alt="" class="book-cover" />
        <div class="title-author">
          <div class="title">{{ book.title }}</div>
          <div class="author">{{ book.source_user }}</div>
        </div>
      </div>
      <div class="words-row">
        <div class="total-words-box">
          Total words
          <div class="total-words">
            {{ book.word_num | format_thousand_sep }}
          </div>
        </div>
        <img :src="sortImage" class="icon-sort" @click="toggleSort" />
      </div>
    </div>
    <div class="bs-wrap">
      <ul class="directory-list">
        <li
          :class="{
            'directory-item': true,
            readed: readedChapters.indexOf(chap.id) > -1,
            reading: chap.id === currentChapter.id,
          }"
          v-for="chap in chapters"
          :key="chap.id"
          @click="readChapter(chap)">
          {{ chap.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions, mapMutations } from "vuex";

  export default {
    watch: {
      isDirOpened(isOpened) {
        if (isOpened) {
          this.$stLog({
            params: {
              eventId: "show_content",
              pve_cur: "/novel/contents/x",
              items: JSON.stringify({
                item_id: this.book.id,
              }),
              portal: this.$portal,
            },
          });
        }
      },
    },
    computed: {
      ...mapState(["book", "readedChapters", "currentChapter", "isDirOpened", "isAscSort"]),
      chapters() {
        return this.isAscSort ? this?.book?.chapters : this?.book?.chapters?.slice()?.reverse();
      },
      sortImage() {
        return this.isAscSort ? require("../assets/images/sort-asc.png") : require("../assets/images/sort-desc.png");
      },
    },
    methods: {
      ...mapActions(["addHistory", "getBookHistory", "toggleDir"]),
      ...mapMutations(["setIsAscSort"]),
      toggleSort() {
        this.setIsAscSort(!this.isAscSort);
        this.$stLog({
          params: {
            eventId: "click_ve",
            pve_cur: "/novel/contents_order/x",
            items: JSON.stringify({
              item_id: this.book.id,
            }),
            portal: this.$portal,
          },
        });
      },
      readChapter(chap) {
        this.toggleDir(false);
        this.addHistory({
          book: this.book,
          read_chapter: chap,
          pager: 1,
        }).then(() => {
          this.getBookHistory(this.book.id);
        });
        this.$emit("update");
      },
    },
  };
</script>

<style lang="scss" scoped>
  .directory-container {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 540px;
    z-index: 4;
    background: #fcf8eb;
    display: flex;
    flex-direction: column;
    transition: left 0.2s ease-in-out;
    &.opened {
      left: 0;
    }
    &.closed {
      left: -540px;
    }
    .book-summary {
      padding: 84px 40px 40px;
      border-bottom: 1px solid #ddd7be;
      .cover-row {
        display: flex;
        margin-bottom: 37px;
        .book-cover {
          width: 110px;
          height: 157px;
          border-radius: 12px;
          margin-right: 28px;
        }
        .title-author {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .title {
            font-size: 28px;
            font-family: Roboto-Bold, Roboto;
            font-weight: bold;
            color: #171920;
            line-height: 40px;
          }
          .author {
            font-size: 24px;
            font-family: Roboto-Regular, Roboto;
            font-weight: 400;
            color: #a19a85;
            line-height: 30px;
          }
        }
      }
      .words-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .total-words-box {
          display: flex;
          align-items: center;
          font-size: 24px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #9e9880;
          .total-words {
            margin-left: 10px;
            font-size: 26px;
            font-family: Roboto-Black, Roboto;
            font-weight: 900;
            color: #ae8818;
          }
        }
        .icon-sort {
          width: 36px;
        }
      }
    }
    .bs-wrap {
      flex: 1;
      overflow-y: scroll;
    }
    .directory-list {
      list-style: none;
      padding: 0;
      margin: 0;
      .directory-item {
        padding: 32px 40px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 24px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #171920;
        &.readed {
          color: #9e9880;
        }
        &.reading {
          color: #ae8818;
        }
      }
    }
  }
</style>
