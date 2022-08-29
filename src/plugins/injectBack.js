import Vue from "vue";
import { inject, close } from "shareit-hybird-js-sdk";

const injectBackPlugin = {};
injectBackPlugin.install = function (Vue) {
  var defaultBackFn = null; // 用户自定义的默认返回逻辑
  var beforeCloseFn = null; // 注册默认关闭前执行的方法
  var routeBackMap = {}; // 各路由下自定义的返回逻辑
  const globalName = "__GLOBAL_PAGE__";
  const backDefaultKey = "__BACK_DEFAULT__";
  Vue.prototype.$goDefaultBack = backDefaultKey;
  // {
  //   "HOME": {
  //     beginFnName: 'fun1',
  //     cb: {
  //       'fun1': {
  //         fn: function () {},
  //         next: 'fun3'
  //       },
  //       'fun3': {
  //         fn: function () {},
  //         next: 'fun2'
  //       },
  //       'fun2': {
  //         fn: function () {},
  //         next: null
  //       }
  //     }
  //   }
  // }

  // 注册默认关闭前执行函数
  Vue.prototype.$registBeforeClose = function (fn) {
    if (typeof fn !== "function") {
      console.warn("[fn] must be a function!");
      return;
    } else {
      beforeCloseFn = fn;
    }
  };

  function addBackFn(routeName, fn, fnName, beforeFnName) {
    const pageConf = routeBackMap[routeName] || { beginFnName: "", cb: {} };
    if (!beforeFnName) {
      // 已经含有初始函数
      if (pageConf.beginFnName) {
        console.warn("you have already regist the first function!");
        return;
      }
      pageConf.beginFnName = fnName;
      pageConf.cb[fnName] = pageConf.cb[fnName] || {
        fn: null,
        next: null,
      };
      pageConf.cb[fnName].fn = fn;
    } else {
      // 已经注册这个函数
      if (pageConf.cb[fnName] && pageConf.cb[fnName].fn) {
        console.warn(
          `you have already regist [${fnName}] function, please check!`
        );
        return;
      }
      // beforeFn已经注册next函数
      if (pageConf.cb[beforeFnName] && pageConf.cb[beforeFnName].next) {
        console.warn(
          `[${beforeFnName}] function has already regist next fn [${pageConf.cb[beforeFnName].next}], please check!`
        );
        return;
      }
      pageConf.cb[fnName] = {
        fn: fn,
        next: (pageConf.cb[fnName] && pageConf.cb[fnName].next) || null,
      };
      pageConf.cb[beforeFnName] = pageConf.cb[beforeFnName] || {
        fn: null,
        next: null,
      };
      pageConf.cb[beforeFnName].next = fnName;
    }
    // 注册多个？
    // if (routeBackMap[routeName]) {
    //   routeBackMap[routeName].push(fn);
    // } else {
    //   routeBackMap[routeName] = [fn];
    // }

    // 一个路由仅能注册一个
    routeBackMap[routeName] = pageConf;
    // console.log("routeBackMap :>> ", routeBackMap);
  }
  /**
   * 注册路由物理返回函数
   * @param {function} fn 自定义的物理返回键执行函数
   * @param {String} fnName 传入函数的名字
   * @param {String} beforeFnName 函数执行前调用方法的名字（不传则为第一个执行的函数）
   * @returns
   */
  Vue.prototype.$injectBackAddFn = function (fn, fnName, beforeFnName) {
    if (!this.$router) {
      console.warn("only support with vue-router！");
      return;
    } else if (typeof fn !== "function") {
      console.warn("[fn] must be a function!");
      return;
    } else if (!fnName) {
      console.warn("please input your function name!");
      return;
    } else {
      const routeName = this.$route.name;
      addBackFn(routeName, fn, fnName, beforeFnName);
    }
  };

  Vue.prototype.$injectBackGlobal = function (fn, fnName, beforeFnName) {
    if (typeof fn !== "function") {
      console.warn("[fn] must be a function!");
      return;
    } else if (!fnName) {
      console.warn("please input your function name!");
      return;
    } else {
      const routeName = globalName;
      addBackFn(routeName, fn, fnName, beforeFnName);
    }
  };

  // 顺序调用页面注册的返回函数
  function executedPageBackFn(fnName, config) {
    if (config[fnName] && config[fnName].fn) {
      const result = config[fnName].fn();
      const nextFnName = config[fnName].next;
      if (result && nextFnName) {
        return executedPageBackFn(nextFnName, config);
      } else {
        return result;
      }
    } else {
      return false;
    }
  }

  /**
   *
   * @param {function} defaultFn
   * @description 传入的自定义默认返回逻辑
   */
  Vue.prototype.$injectBackInit = function (portal = "web", defaultFn) {
    if (typeof defaultFn === "function") {
      defaultBackFn = defaultFn;
    }

    // 因为注册的对应路由的函数，是与实例绑定在一起的，当切换路由后实例已经改变，需要清调之前注册的方法
    if (this.$router) {
      this.$router.beforeEach((to, from, next) => {
        const routeName = to.name;
        routeBackMap[routeName] = null;
        next();
      });
    }

    const backFun = function () {
      // 检查是否展示了h5登录弹窗
      if (this.$entryLogin && this.$entryLogin.isH5LoginShow()) {
        this.$entryLogin.closeH5Login();
        return false;
      }
      // 检查全局弹窗
      let gresult = true;
      if (routeBackMap[globalName] && routeBackMap[globalName].beginFnName) {
        const pageConf = routeBackMap[globalName];
        const fnName = pageConf.beginFnName;
        gresult = executedPageBackFn(fnName, pageConf.cb);
      }

      if (!gresult) {
        return false;
      }

      // 如果当前路由注册了对应页面的返回逻辑，执行
      let result = backDefaultKey;
      const routeName = this.$route.name;
      if (
        this.$router &&
        routeBackMap[routeName] &&
        routeBackMap[routeName].beginFnName
      ) {
        const pageConf = routeBackMap[routeName];
        const fnName = pageConf.beginFnName;
        result = executedPageBackFn(fnName, pageConf.cb);
        console.log("===== [InjectBack:页面自定义返回执行结果] =====", result);
      }

      // 如果希望页面执行完自定义返回后，继续执行默认返回逻辑，可返回this.$goDefaultBack
      if (result !== backDefaultKey) {
        return false;
      }

      // 执行默认返回逻辑
      if (typeof defaultBackFn === "function") {
        defaultBackFn();
      } else {
        // 默认逻辑，返回上一页&关闭webview
        try {
          if (this.$router && this.$route.path !== "/") {
            console.log("===== [InjectBack:default] Router back =====");
            this.$router.go(-1);
          } else {
            console.log("===== [InjectBack:default] Close page =====");
            beforeCloseFn && beforeCloseFn();
            close({ portal: this.$hybirdPortal });
          }
        } catch (err) {
          console.log("err :>> ", err);
        }
      }
    };

    // 注册物理返回键
    inject({ portal: portal, callbackName: "" });
    inject({
      portal: portal,
      callbackName: "__PageInjectBackCallback__",
    });
    window.__PageInjectBackCallback__ = backFun.bind(this);
  };
};

Vue.use(injectBackPlugin);
