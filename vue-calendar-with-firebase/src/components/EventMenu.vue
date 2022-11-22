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
        <v-text-field
          v-model="event.name"
          type="text"
          label="Event name (required)"
        >
        </v-text-field>
        <v-text-field v-model="event.details" type="text" label="Details">
        </v-text-field>
        <v-text-field
          v-model="event.color"
          type="color"
          label="color (click to open color menu)"
        >
        </v-text-field>
      </form>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="$emit('onEventMenuClose')" text color="secondary">
        Cancel
      </v-btn>
      <v-btn @click="startEventFromMenu" text color="secondary">
        Start Event Here
      </v-btn>
    </v-card-actions>
    <Alert :message="errorMessage" :value="isErrors" color="pink darken-1" />
  </v-card>
</template>

<script>
import Alert from "./Alert.vue";
export default {
  components: { Alert },
  props: {
    titleText: String,
  },
  data() {
    return {
      isErrors: false,
      errorMessage: "Please fill all fields.",
      event: {
        name: "",
        color: "",
        details: "",
      },
    };
  },
  methods: {
    startEventFromMenu() {
      if (
        this.event.name == "" ||
        this.event.color == "" ||
        this.event.details == ""
      ) {
        this.isErrors = true;
        return;
      }

      this.isErrors = false;
      this.$emit("startEventFromMenu", this.event);
    },
  },
};
</script>

<style></style>
