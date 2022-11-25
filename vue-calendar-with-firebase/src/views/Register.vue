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
        <v-btn
          :disabled="isRegisterBtnDisabled"
          @click="registerUser"
          color="primary"
          >Регистрирай ме</v-btn
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
      repass: "",
    };
  },
  computed: {
    isRegisterBtnDisabled() {
      return this.email == "" || this.password == "" || this.repass == "";
    },
  },
  methods: {
    async registerUser() {
      this.isErrors = false;

      if (this.password != this.repass) {
        this.isErrors = true;
        this.errorMessage = messages.repassError;
        return;
      }

      try {
        const create = await user;
        const createdUser = create.createUserWithEmailAndPassword(
          this.email,
          this.password
        );
        await createdUser;

        this.email = null;
        this.password = null;
        this.repass = null;

        if (this.$router.currentRoute.fullPath != "/calendar") {
          this.$router.push("/calendar");
        }
      } catch (error) {
        this.errorMessage = returnOnRegisterErrorMessage(error);
        this.isErrors = true;
      }
    },
  },
};

function returnOnRegisterErrorMessage(error) {
  if (error.toString().includes("The email address is already in use")) {
    return messages.emailExist;
  } else if (error.toString().includes("at least 6 characters")) {
    return messages.shortPass;
  } else if (error.toString().includes("address is badly formatted")) {
    return messages.invalidEmail;
  } else {
    return messages.globalError;
  }
}
</script>

<style></style>
