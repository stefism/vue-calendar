<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn color="primary" class="mr-4" @click="dialog = true" dark>
              New Event
            </v-btn>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Today
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small> mdi-chevron-left </v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small> mdi-chevron-right </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right> mdi-menu-down </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 days</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <!-- Add event dialog -->
        <v-dialog v-model="dialog" max-width="500">
          <v-card>
            <v-container>
              <v-form @submit.prevent="addEvent">
                <v-text-field
                  v-model="name"
                  type="text"
                  label="event name (required)"
                >
                </v-text-field>
                <v-text-field v-model="details" type="text" label="details">
                </v-text-field>
                <v-text-field
                  v-model="start"
                  type="datetime-local"
                  label="start (required)"
                >
                </v-text-field>
                <v-text-field
                  v-model="end"
                  type="datetime-local"
                  label="end (required)"
                >
                </v-text-field>
                <v-text-field
                  v-model="color"
                  type="color"
                  label="color (click to open color menu)"
                >
                </v-text-field>
                <v-checkbox
                  v-model="timed"
                  dense
                  label="Timed event (a part of the day)"
                  color="info"
                  :value="true"
                  hide-details
                  class="mb-2"
                ></v-checkbox>
                <v-btn type="submit" color="primary" class="mr-4"
                  >Create Event</v-btn
                >
              </v-form>
            </v-container>
            <v-alert
              :value="isErrors"
              border="bottom"
              color="pink darken-1"
              dark
            >
              Please fill all required fields
            </v-alert>
          </v-card>
        </v-dialog>

        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @contextmenu:date="contextMenuDate"
            @contextmenu:time="contextMenuTime"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn @click="deleteEvent(selectedEvent.id)" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <form v-if="currentlyEditing != selectedEvent.id">
                  {{ selectedEvent.details }}
                </form>
                <form v-else>
                  <textarea-autosize
                    v-model="selectedEvent.details"
                    type="text"
                    style="width: 100%"
                    :min-height="100"
                    placeholder="add note"
                  >
                  </textarea-autosize>
                </form>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">
                  Close
                </v-btn>
                <v-btn
                  text
                  v-if="currentlyEditing != selectedEvent.id"
                  @click.prevent="editEvent(selectedEvent)"
                >
                  Edit
                </v-btn>
                <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { db } from "@/main";
export default {
  data() {
    return {
      today: new Date().toISOString().substring(0, 10),
      focus: new Date().toISOString().substring(0, 10),
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days",
      },
      name: null,
      details: null,
      start: null,
      end: null,
      color: "#1976D2",
      timed: false,
      currentlyEditing: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      dialog: false,
      isErrors: false,
      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "orange",
        "grey darken-1",
      ],
      names: [
        "Meeting",
        "Holiday",
        "PTO",
        "Travel",
        "Event",
        "Birthday",
        "Conference",
        "Party",
      ],
    };
  },
  mounted() {
    console.log(this.events);
    this.getEvents();
  },
  computed: {},
  methods: {
    contextMenuDate(e) {
      console.log(e);
    },
    contextMenuTime(e) {
      console.log(e);
    },
    async updateEvent(selectedEvent) {
      //in this.currentlyEditing we hold the selectedEvent.id
      await db.collection("calEvent").doc(this.currentlyEditing).update({
        details: selectedEvent.details,
      });
      this.selectedOpen = false;
      this.currentlyEditing = null;
    },
    async deleteEvent(selectedEventId) {
      await db.collection("calEvent").doc(selectedEventId).delete();
      this.selectedOpen = false;
      this.getEvents();
    },
    async getEvents() {
      let snapshot = await db.collection("calEvent").get();
      let currEvents = [];

      snapshot.forEach((doc) => {
        let appData = doc.data();
        appData.id = doc.id;
        currEvents.push(appData);
      });

      this.events = currEvents;
    },
    async addEvent() {
      if (this.name == null || this.start == null || this.end == null) {
        console.log("this.start", this.start);
        console.log("this.timed", this.timed);
        this.isErrors = true;
      } else {
        await db.collection("calEvent").add({
          name: this.name,
          details: this.details,
          start: this.start,
          end: this.end,
          color: this.color,
          timed: this.timed == null ? false : true,
        });

        this.name = null;
        this.details = null;
        this.start = null;
        this.end = null;
        this.color = null;

        this.dialog = false;
        this.isErrors = false;
        this.getEvents();
      }
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    editEvent(selectedEvent) {
      this.currentlyEditing = selectedEvent.id;
    },
    showEvent({ nativeEvent, event }) {
      console.log("in showEvent", event);
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;

      //   const events = [];

      //   const min = new Date(`${start.date}T00:00:00`);
      //   const max = new Date(`${end.date}T23:59:59`);
      //   const days = (max.getTime() - min.getTime()) / 86400000;
      //   const eventCount = this.rnd(days, days + 20);

      //   for (let i = 0; i < eventCount; i++) {
      //     const allDay = this.rnd(0, 3) === 0;
      //     const firstTimestamp = this.rnd(min.getTime(), max.getTime());
      //     const first = new Date(firstTimestamp - (firstTimestamp % 900000));
      //     const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
      //     const second = new Date(first.getTime() + secondTimestamp);

      //     events.push({
      //       name: this.names[this.rnd(0, this.names.length - 1)],
      //       start: first,
      //       end: second,
      //       color: this.colors[this.rnd(0, this.colors.length - 1)],
      //       timed: !allDay,
      //     });
      //   }

      //   this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>

<style></style>
