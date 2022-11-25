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
      <v-toolbar-title v-if="!addEventErrors"
        ><p style="margin-bottom: 0px !important; text-align: center">
          Създаване на многодневно събитие
        </p>
        {{ titleText }}</v-toolbar-title
      >
      <v-toolbar-title v-else>Грешка при въвеждане на датата</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text v-if="!addEventErrors && !isNewEventStarted">
      <form>
        <v-text-field
          v-model="event.name"
          type="text"
          label="Име (Задължително)"
        >
        </v-text-field>
        <v-text-field v-model="event.details" type="text" label="Детайли">
        </v-text-field>
        <v-text-field
          hide-details
          dense
          v-model="event.color"
          type="color"
          label="Цвят (Кликнете за да отворите)"
        >
        </v-text-field>
      </form>
    </v-card-text>
    <v-card-text v-else-if="!addEventErrors && isNewEventStarted">
      <v-text-field disabled type="text" :label="`Name: ${newEvent.name}`">
      </v-text-field>
      <v-text-field disabled type="text" :label="`Start at: ${newEvent.start}`">
      </v-text-field
      ><v-text-field disabled type="text" :label="`End at: ${newEvent.end}`">
      </v-text-field>
      <v-text-field disabled type="text" :label="`Color: ${newEvent.color}`">
      </v-text-field>
      <v-text-field
        disabled
        type="text"
        :label="`Details: ${newEvent.details}`"
      >
      </v-text-field>
    </v-card-text>
    <v-card-text v-else-if="addEventErrors">
      <p>Крайната дата трябва да бъде по-голяма от началната дата.</p>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="$emit('onEventMenuClose')" text color="secondary">
        Затвори
      </v-btn>
      <v-btn @click="$emit('cancelAddNewEvent')" text color="secondary">
        Откажи
      </v-btn>
      <v-btn
        v-if="!addEventErrors && !isNewEventStarted"
        @click="startEventFromMenu"
        text
        color="secondary"
      >
        Старт събитие
      </v-btn>
      <v-btn
        v-if="!addEventErrors && isNewEventStarted"
        @click="$emit('saveEventToCalendar')"
        text
        color="secondary"
      >
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
  data() {
    return {
      isErrors: false,
      errorMessage: "Моля, попълнете всички полета.",
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
