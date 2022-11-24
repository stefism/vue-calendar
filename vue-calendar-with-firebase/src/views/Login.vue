<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <v-card class="mx-auto mt-5" color="grey lighten-4" max-width="600px" flat>
      <v-toolbar color="blue">
        <v-toolbar-title class="mx-auto" style="color: white"
          >Форма за вход</v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-text-field dense v-model="email" type="text" label="И мейл">
        </v-text-field>
        <v-text-field dense v-model="password" type="password" label="Парола">
        </v-text-field>
      </v-card-text>
      <v-card-actions style="justify-content: center">
        <v-btn @click="login" color="primary">Вход</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { user } from "@/main";
export default {
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    async login() {
      user
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          if (this.$router.currentRoute.fullPath != "/calendar") {
            this.$router.push("/calendar");
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
};
</script>

<style></style>
