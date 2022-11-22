<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-alert :value="value" border="bottom" :color="color" dark>
    {{ message }}
  </v-alert>
</template>

<script>
// color - pink darken-1
export default {
  props: {
    message: String,
    color: String,
    value: Boolean,
  },
};
</script>

<style></style>
