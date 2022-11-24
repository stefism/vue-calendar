<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <v-card class="mx-auto mt-5" color="grey lighten-4" max-width="600px" flat>
      <v-toolbar color="blue">
        <v-toolbar-title class="mx-auto" style="color: white"
          >Добре дошли в персоналния Ви календар</v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <h3>За да използвате календара, първо трябва да се регистрирате.</h3>
        <h3>Ако вече имате регистрация, можете да влезете в системата.</h3>
      </v-card-text>
      <v-card-actions style="justify-content: center">
        <v-btn @click="$router.push('/register')" color="primary"
          >Регистрация</v-btn
        >
        <v-btn @click="$router.push('/login')" color="primary">Вход</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
