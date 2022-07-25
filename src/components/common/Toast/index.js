import Vue from "vue";
import MessageTemplate from "./ToastTemplate.vue";

const MessageConstructor = Vue.extend(MessageTemplate);

let instance;
const instances = [];
let seed = 1;

const Message = function (options) {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  if (typeof options === "string") {
    options = {
      message: options,
    };
  }

  const id = "message_" + seed++;
  options.onClose = function () {
    Message.close(id);
  };
  instance = new MessageConstructor({
    data: options,
  });
  instance.id = id;
  instance.vm = instance.$mount();
  instance.dom = instance.vm.$el;
  document.body.appendChild(instance.dom);
  instance.vm.visible = true;
  instance.dom.style.zIndex = 100000 + seed;
  instances.push(instance);
  return instance.vm;
};

// instances中删除message
Message.close = function (id) {
  for (let i = 0, len = instances.length; i < len; i++) {
    if (id === instances[i].id) {
      instances.splice(i, 1);
      break;
    }
  }
};

export default Message;
