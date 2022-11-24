<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <v-card class="mx-auto mt-5" color="grey lighten-4" max-width="600px" flat>
      <v-toolbar color="blue">
        <v-toolbar-title class="mx-auto" style="color: white"
          >Форма за регистрация</v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-text-field dense v-model="email" type="text" label="И мейл">
        </v-text-field>
        <v-text-field dense v-model="password" type="password" label="Парола">
        </v-text-field>
        <v-text-field
          dense
          v-model="repass"
          type="password"
          label="Потвърди паролата"
        >
        </v-text-field>
      </v-card-text>
      <v-card-actions style="justify-content: center">
        <v-btn @click="registerUser" color="primary">Регистрирай ме</v-btn>
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
      repass: null,
    };
  },
  methods: {
    async registerUser() {
      const create = await user;
      const createdUser = create.createUserWithEmailAndPassword(
        this.email,
        this.password
      );
      const result = await createdUser;

      this.name = null;
      this.email = null;
      this.password = null;
      this.repass = null;
      console.log(result);
    },
  },
};
</script>

<style></style>
