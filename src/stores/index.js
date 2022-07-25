import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";
import { getBookDetail, getBookRelated } from "../apis/index";
import { ADD_BOOK_TO_SHELF, ADD_READ_HISTROY, IS_BOOK_ON_SHELF, REMOVE_BOOK_FROM_SHELF } from "../common/js/constant";
Vue.use(Vuex);
function bookAction({ action, novel_item = {}, read_chapter = {} }, cb) {
  const json = {
    novel_item: JSON.stringify(novel_item),
    action,
    read_chapter: JSON.stringify(read_chapter),
  };

  const stringRes = window?.shareitBridge?.syncInvoke("PayPhoneFare", "novelAction", JSON.stringify(json));
  const res = JSON.parse(stringRes || "{}");
  if (res.responseCode === "0") {
    cb && cb(res);
  }
}
export default new Vuex.Store({
  state: {
    book: {},
    isReaded: false,
    readedChapters: [],
    historyLoading: false,
    historyLoadingSuccess: false,
    bookDetailLoading: false,
    bookDetailLoadingSuccess: false,
    isBookAdded: false,
    isDirOpened: false,
    isAscSort: true,
    currentChapter: {},
    chapterContent: "",
    chapterContentLoading: false,
    chapterContentLoadingSuccess: false,
    relatedBooks: [],
  },
  mutations: {
    setBook(state, book) {
      state.book = book;
    },
    setIsReaded(state, isReaded) {
      state.isReaded = isReaded;
    },
    setReadedChapters(state, readedChapters) {
      state.readedChapters = readedChapters;
    },
    setCurrentChapter(state, currentChapter) {
      state.currentChapter = currentChapter;
    },
    setChapterContent(state, chapterContent) {
      state.chapterContent = chapterContent;
    },
    setHistoryLoading(state, historyLoading) {
      state.historyLoading = historyLoading;
    },
    setHistoryLoadingSuccess(state, historyLoadingSuccess) {
      state.historyLoadingSuccess = historyLoadingSuccess;
    },
    setBookDetailLoading(state, bookDetailLoading) {
      state.bookDetailLoading = bookDetailLoading;
    },
    setBookDetailLoadingSuccess(state, bookDetailLoadingSuccess) {
      state.bookDetailLoadingSuccess = bookDetailLoadingSuccess;
    },
    setIsBookAdded(state, isBookAdded) {
      state.isBookAdded = isBookAdded;
    },
    setIsDirOpened(state, isDirOpened) {
      state.isDirOpened = isDirOpened;
    },
    setIsAscSort(state, isAscSort) {
      state.isAscSort = isAscSort;
    },
    setChapterContentLoading(state, chapterContentLoading) {
      state.chapterContentLoading = chapterContentLoading;
    },
    setChapterContentLoadingSuccess(state, chapterContentLoadingSuccess) {
      state.chapterContentLoadingSuccess = chapterContentLoadingSuccess;
    },
    setRelatedBooks(state, relatedBooks) {
      state.relatedBooks = relatedBooks;
    },
  },
  actions: {
    updateCurrentChapter({ commit }, currentChapter) {
      commit("setCurrentChapter", currentChapter);
    },
    toggleDir({ commit }, isDirOpened) {
      commit("setIsDirOpened", isDirOpened);
    },
    getBookHistory({ commit, state }, item_id) {
      commit("setHistoryLoading", true);
      const json = {
        book_id: item_id,
      };
      const stringRes = window?.shareitBridge?.syncInvoke("PayPhoneFare", "getNovelHistory", JSON.stringify(json));
      const res = JSON.parse(stringRes || "{}");
      if (res.responseCode === "0") {
        commit("setHistoryLoading", false);
        commit("setHistoryLoadingSuccess", true);
        commit("setReadedChapters", JSON.parse(res.chapter_list || "[]"));
        const last = JSON.parse(res.last_chapter || "{}");
        if (last.id) {
          commit("setIsReaded", true);
          commit("setCurrentChapter", last);
        } else {
          commit("setIsReaded", false);
          if (state.book?.chapters?.length > 0) {
            commit("setCurrentChapter", state.book.chapters[0]);
          }
        }
      } else {
        commit("setHistoryLoading", false);
        commit("setHistoryLoadingSuccess", false);
      }
    },
    async getBookDetail({ commit, state }, item_id) {
      commit("setBookDetailLoading", true);
      try {
        const res = await getBookDetail({ item_id });
        commit("setBookDetailLoading", false);
        commit("setBookDetailLoadingSuccess", true);
        const book = res?.data?.item || {};
        commit("setBook", book);
        if (!state.isReaded && book?.chapters?.length > 0) {
          commit("setCurrentChapter", book.chapters[0]);
        }
      } catch (error) {
        commit("setBookDetailLoading", false);
        commit("setBookDetailLoadingSuccess", false);
        console.error(error);
      }
    },
    judgeBookIsAdded({ commit }, item_id) {
      bookAction(
        {
          action: IS_BOOK_ON_SHELF,
          novel_item: {
            id: item_id,
          },
        },
        (res) => {
          commit("setIsBookAdded", res?.action_result);
        }
      );
    },
    addBookToShelf({ commit }, book) {
      bookAction(
        {
          action: ADD_BOOK_TO_SHELF,
          novel_item: book,
        },
        () => {
          commit("setIsBookAdded", true);
        }
      );
    },
    removeBookFromShelf({ commit }, book) {
      bookAction(
        {
          action: REMOVE_BOOK_FROM_SHELF,
          novel_item: book,
        },
        () => {
          commit("setIsBookAdded", false);
        }
      );
    },
    addHistory(context, { book, read_chapter, pager }) {
      bookAction({
        action: ADD_READ_HISTROY,
        novel_item: book,
        read_chapter: { ...read_chapter, pager },
      });
    },
    async getChapterContent({ commit }, url) {
      commit("setChapterContentLoading", true);
      try {
        const res = await axios.get(url);
        commit("setChapterContent", res?.data);
        commit("setChapterContentLoading", false);
        commit("setChapterContentLoadingSuccess", true);
      } catch (error) {
        commit("setChapterContentLoading", false);
        commit("setChapterContentLoadingSuccess", false);
        console.error(error);
      }
    },
    async getRelatedBooks({ commit }, item_id) {
      commit("setRelatedBooks", []);
      try {
        const res = await getBookRelated({ item_id });
        commit("setRelatedBooks", res?.data?.cards || []);
      } catch (error) {
        console.error(error);
      }
    },
  },
  modules: {},
});
