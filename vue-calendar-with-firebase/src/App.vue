<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { user } from "@/main";
export default {
  name: "App",

  components: {},
  mounted() {
    user.onAuthStateChanged((u) => {
      if (u) {
        if (this.$router.currentRoute.fullPath != "/calendar") {
          this.$router.push("/calendar");
        }
      } else {
        if (this.$router.currentRoute.fullPath != "/home") {
          this.$router.push("/home");
        }
      }
    });
  },
  data: () => ({
    //
  }),
  methods: {},
};
</script>
