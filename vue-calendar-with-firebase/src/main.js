import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueTextareaAutosize from "vue-textarea-autosize";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import VueRouter from "vue-router";

import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import CalendarView from "@/views/Calendar-view.vue";

const routes = [
  { path: "/Home", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/calendar", component: CalendarView },
];

const router = new VueRouter({ routes });

Vue.use(VueTextareaAutosize);
Vue.use(VueRouter);

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_API_ID,
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const user = firebase.auth();

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
