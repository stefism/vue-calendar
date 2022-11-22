<template>
  <v-card
    outlined
    shaped
    elevation="1"
    color="grey lighten-4"
    min-width="350px"
    flat
  >
    <v-toolbar color="red" dark>
      <v-toolbar-title>{{ titleText }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text>
      <form>
        <textarea> Test test </textarea>
      </form>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="$emit('onEventMenuClose')" text color="secondary">
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    titleText: String,
  },
};
</script>

<style></style>
