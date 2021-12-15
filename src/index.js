import WFSSearch from "./components/WFSSearch.vue";

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("WFSSearch", WFSSearch);
}

const plugin = {
  install
};

let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

WFSSearch.install = install;

export default WFSSearch;