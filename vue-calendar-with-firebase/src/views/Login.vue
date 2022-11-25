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
        <v-btn :disabled="isLoginBtnDisabled" @click="login" color="primary"
          >Вход</v-btn
        >
      </v-card-actions>
      <Alert :message="errorMessage" :value="isErrors" color="pink darken-1" />
    </v-card>
  </div>
</template>

<script>
import { user } from "@/main";
import Alert from "@/components/Alert";
import { messages } from "@/assets/messages";
export default {
  components: { Alert },
  data() {
    return {
      errorMessage: "",
      isErrors: false,
      email: "",
      password: "",
    };
  },
  computed: {
    isLoginBtnDisabled() {
      return this.email == "" || this.password == "";
    },
  },
  methods: {
    async login() {
      this.isErrors = false;

      user
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          if (this.$router.currentRoute.fullPath != "/calendar") {
            this.$router.push("/calendar");
          }
        })
        .catch((error) => {
          this.errorMessage = returnOnLoginErrorMessage(error);
          this.isErrors = true;
          console.log(error);
        });
    },
  },
};

function returnOnLoginErrorMessage(error) {
  if (error.toString().includes("no user record corresponding")) {
    return messages.invalidUser;
  } else if (error.toString().includes("password is invalid")) {
    return messages.invalidPassword;
  } else if (error.toString().includes("address is badly formatted")) {
    return messages.invalidEmail;
  } else {
    return messages.globalError;
  }
}
</script>

<style></style>
