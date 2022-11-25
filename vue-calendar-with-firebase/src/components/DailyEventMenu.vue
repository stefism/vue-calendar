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
      <v-toolbar-title>
        <div
          style="
            justify-content: center !important;
            text-align: center !important;
            margin-top: 10px;
            margin-left: 30px;
          "
        >
          <p style="margin-bottom: 0px">Създаване на дневно събитие</p>
          <p>за дата: {{ newEvent.date }}</p>
        </div>
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <form>
        <v-text-field
          v-model="event.name"
          type="text"
          label="Име (Задължително)"
        >
        </v-text-field>
        <v-text-field v-model="event.start" type="time" label="Начален час">
        </v-text-field>
        <v-text-field v-model="event.end" type="time" label="Краен час">
        </v-text-field>
        <v-text-field v-model="event.details" type="text" label="Описание">
        </v-text-field>
        <v-text-field
          dense
          hide-details
          v-model="event.color"
          type="color"
          label="Цвят (Кликнете за да отворите)"
        >
        </v-text-field>
      </form>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="$emit('onDailyEventMenuClose')" text color="secondary">
        Затвори
      </v-btn>
      <v-btn @click="cancelEvent" text color="secondary"> Откажи </v-btn>
      <v-btn @click="addNewEvent" text color="secondary">
        Запиши събитието
      </v-btn>
    </v-card-actions>
    <Alert :message="errorMessage" :value="isErrors" color="pink darken-1" />
  </v-card>
</template>

<script>
import Alert from "./Alert";
export default {
  components: { Alert },
  props: {
    titleText: String,
    addEventErrors: Boolean,
    isNewEventStarted: Boolean,
    newEvent: Object,
  },
  created() {
    this.event.start = this.newEvent.start;
  },
  data() {
    return {
      isErrors: false,
      errorMessage: "",
      event: {
        name: "",
        start: "",
        end: "",
        color: "",
        details: "",
      },
    };
  },
  watch: {
    "newEvent.start"() {
      this.event.start = this.newEvent.start;
    },
  },
  methods: {
    addNewEvent() {
      const startTime = Date.parse(`${this.newEvent.date}T${this.event.start}`);
      const endTime = Date.parse(`${this.newEvent.date}T${this.event.end}`);

      if (
        this.event.name == "" ||
        this.event.color == "" ||
        this.event.details == "" ||
        this.event.end == ""
      ) {
        this.errorMessage = "Моля, попълнете всички полета.";
        this.isErrors = true;
        return;
      }

      if (endTime < startTime) {
        this.errorMessage = "Крайния час е по-малък от началния.";
        this.isErrors = true;
        return;
      }

      this.isErrors = false;
      this.$emit("addNewDailyEvent", this.event);
    },
    cancelEvent() {
      this.event.name = "";
      this.event.start = "";
      this.event.end = "";
      this.event.color = "";
      this.event.details = "";

      this.isErrors = false;
      this.$emit("cancelNewDailyEvent");
    },
  },
};
</script>

<style></style>
