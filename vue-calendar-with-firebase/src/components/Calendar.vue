<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn color="primary" class="mr-4" @click="dialog = true" dark>
              Ново събитие
            </v-btn>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Днес
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
                  <v-list-item-title>Ден</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Седмица</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Месец</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 дневка</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <!-- Add event dialog -->
        <v-dialog persistent v-model="dialog" max-width="500">
          <v-card>
            <v-container>
              <v-form>
                <v-text-field
                  v-model="name"
                  type="text"
                  label="Име (задължително)"
                >
                </v-text-field>
                <v-text-field v-model="details" type="text" label="details">
                </v-text-field>
                <v-text-field
                  v-model="start"
                  :type="timed ? 'datetime-local' : 'date'"
                  label="Начало (задължително)"
                >
                </v-text-field>
                <v-text-field
                  v-model="end"
                  :type="timed ? 'datetime-local' : 'date'"
                  label="Край (задължително)"
                >
                </v-text-field>
                <v-text-field
                  v-model="color"
                  type="color"
                  label="Цвят (кликнете за да отворите)"
                >
                </v-text-field>
                <v-checkbox
                  v-model="timed"
                  dense
                  label="Часово събитие (за част от деня)"
                  color="info"
                  :value="true"
                  hide-details
                  class="mb-2"
                ></v-checkbox>
                <v-btn
                  @click.prevent="closeEventDialog"
                  color="primary"
                  class="mr-4"
                  >Затвори</v-btn
                >
                <v-btn @click.prevent="addEvent" color="info" class="mr-4"
                  >Създай събитие</v-btn
                >
              </v-form>
            </v-container>
            <Alert
              :message="errorMessage"
              :value="isErrors"
              color="pink darken-1"
            />
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
            :weekdays="calendarDays"
            locale="bg"
            @contextmenu:date="contextMenuDate"
            @contextmenu:time="contextMenuTime"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <MultidayEventMenu
            v-if="isMenuOpen"
            :titleText="menuText"
            :addEventErrors="isErrors"
            :isNewEventStarted="isNewEventStarted"
            :newEvent="newEvent"
            @onEventMenuClose="onEventMenuClose"
            @startEventFromMenu="startEventFromMenu"
            @cancelAddNewEvent="cancelAddNewEvent"
            @saveEventToCalendar="saveEventToCalendar"
            :style="{
              position: 'absolute',
              top: `${menuXposition}px`,
              left: `${menuYposition}px`,
              'z-index': 2,
            }"
          />
          <DailyEventMenu
            v-if="isDailyMenuOpen"
            @onDailyEventMenuClose="onDailyEventMenuClose"
            @addNewDailyEvent="addNewDailyEvent"
            @cancelNewDailyEvent="cancelNewDailyEvent"
            :newEvent="newDailyEvent"
            :style="{
              position: 'absolute',
              top: `${menuXposition}px`,
              left: `${menuYposition}px`,
              'z-index': 2,
            }"
          />
          <v-menu
            :close-on-click="false"
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            style="top: 300px !important"
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
              <v-card-text style="padding-bottom: 0px">
                <Alert
                  :message="errorMessage"
                  :value="isErrors"
                  color="pink darken-1"
                />
                <form v-if="currentlyEditing != selectedEvent.id">
                  <p><b>Детайли:</b> {{ selectedEvent.details }}</p>
                  <div v-if="!selectedEvent.timed">
                    <p><b>Начална дата:</b> {{ selectedEvent.start }}</p>
                    <p><b>Крайна дата:</b> {{ selectedEvent.end }}</p>
                  </div>
                  <div v-else>
                    <p>
                      <b>Начален час:</b>
                      {{ selectedEvent.startTime }} ч.
                    </p>
                    <p>
                      <b>Краен час:</b>
                      {{ selectedEvent.endTime }} ч.
                    </p>
                  </div>
                  <p><b>Цвят:</b> {{ selectedEvent.color }}</p>
                </form>
                <form v-else>
                  <v-text-field
                    dense
                    v-model="selectedEvent.name"
                    type="text"
                    label="Име"
                  >
                  </v-text-field>
                  <v-text-field
                    dense
                    v-model="selectedEvent.details"
                    type="text"
                    label="Описание"
                  >
                  </v-text-field>
                  <div v-if="!selectedEvent.timed">
                    <v-text-field
                      dense
                      v-model="selectedEvent.start"
                      type="date"
                      label="Начална дата"
                    >
                    </v-text-field>
                    <v-text-field
                      dense
                      v-model="selectedEvent.end"
                      type="date"
                      label="Крайна дата"
                    >
                    </v-text-field>
                  </div>
                  <div v-else>
                    <v-text-field
                      dense
                      v-model="selectedEvent.startTime"
                      type="time"
                      label="Начален час"
                    >
                    </v-text-field>
                    <v-text-field
                      dense
                      v-model="selectedEvent.endTime"
                      type="time"
                      label="Краен час"
                    >
                    </v-text-field>
                  </div>
                  <v-text-field
                    dense
                    hide-details
                    v-model="selectedEvent.color"
                    type="color"
                    label="Цвят (Кликнете за да отворите)"
                  >
                  </v-text-field>
                </form>
              </v-card-text>
              <v-card-actions style="padding-top: 0px">
                <v-btn
                  v-if="currentlyEditing != selectedEvent.id"
                  text
                  color="secondary"
                  @click="selectedOpen = false"
                >
                  Затвори
                </v-btn>
                <v-btn v-else text color="secondary" @click="cancelEditEvent">
                  Откажи промените
                </v-btn>
                <v-btn
                  text
                  v-if="currentlyEditing != selectedEvent.id"
                  @click.prevent="editEvent(selectedEvent)"
                >
                  Редакция
                </v-btn>
                <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">
                  Запис
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
    <Alert
      :message="`Стартирали сте многодневно събитие от дата (година-месец-ден) ${newEvent.start}. Кликнете с десен бутон на мишката върху крайна дата за да завършите събитието.`"
      :value="isNewEventStarted"
      color="green"
    />
    <Alert
      style="
        margin-top: 20px;
        margin-left: 12px;
        max-width: 97%;
        box-shadow: 2px 2px 3px 2px lightblue;
      "
      :message="`${messages.saveEventToCalendarInfo}`"
      :value="!isNewEventStarted"
      color="blue"
    />
  </div>
</template>

<script>
import { db } from "@/main";
import Alert from "./Alert.vue";
import { messages } from "@/assets/messages";
import MultidayEventMenu from "./MultidayEventMenu.vue";
import DailyEventMenu from "./DailyEventMenu.vue";

export default {
  components: { Alert, MultidayEventMenu, DailyEventMenu },
  data() {
    return {
      messages: messages,
      calendarDays: [1, 2, 3, 4, 5, 6, 0],
      today: new Date().toISOString().substring(0, 10),
      focus: new Date().toISOString().substring(0, 10),
      type: "month",
      typeToLabel: {
        month: "Месец",
        week: "Седмица",
        day: "Ден",
        "4day": "4 Дневка",
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
      errorMessage: null,
      isMenuOpen: false,
      isDailyMenuOpen: false,
      menuText: "",
      menuXposition: 0,
      menuYPosition: 0,
      newEvent: {
        name: "",
        details: "",
        start: "",
        end: "",
        color: "",
        timed: false,
      },
      newDailyEvent: {
        name: "",
        date: "",
        details: "",
        start: "",
        end: "",
        color: "",
        timed: true,
      },
      isNewEventStarted: false,
      currentNativeEvent: null,
      currentEvent: null,
    };
  },
  mounted() {
    this.getEvents();
  },
  computed: {},
  methods: {
    getTimeStringFromDate(date) {
      const time = date.substring(11);
      return time;
    },
    closeEventDialog() {
      this.dialog = false;
      this.isErrors = false;
    },
    contextMenuDate(e) {
      console.log(e);
      const menuWidth = 450;

      if (e.nativeEvent.pageX + menuWidth > window.innerWidth) {
        this.menuYposition = e.nativeEvent.pageX - menuWidth;
      } else {
        this.menuYposition = e.nativeEvent.pageX;
      }

      this.menuXposition = e.nativeEvent.pageY;

      if (!this.isNewEventStarted) {
        this.newEvent.start = e.date;
        this.menuText = `Начална дата (година-месец-ден): ${e.date}`;
      } else {
        this.newEvent.end = e.date;
        const startDay = this.newEvent.start.substring(8, 10);
        const endDay = this.newEvent.end.substring(8, 10);

        if (endDay <= startDay) {
          this.isErrors = true;
        } else {
          this.isErrors = false;
        }

        this.menuText = `Крайна дата (година-месец-ден): ${e.date}`;
      }

      this.isMenuOpen = true;
    },
    contextMenuTime(e) {
      this.isMenuOpen = false;

      const menuWidth = 392;
      const menuHeight = 497;

      if (e.nativeEvent.pageX + menuWidth > window.innerWidth) {
        this.menuYposition = e.nativeEvent.pageX - menuWidth;
      } else {
        this.menuYposition = e.nativeEvent.pageX;
      }

      if (e.nativeEvent.pageY + menuHeight > window.innerHeight) {
        this.menuXposition = e.nativeEvent.pageY - menuHeight;
      } else {
        this.menuXposition = e.nativeEvent.pageY;
      }

      this.newDailyEvent.start = e.time;
      this.newDailyEvent.date = e.date;

      this.isDailyMenuOpen = true;
      console.log(e);
    },
    startEventFromMenu(ev) {
      console.log("event", ev);

      this.newEvent.name = ev.name;
      this.newEvent.color = ev.color;
      this.newEvent.details = ev.details;

      this.isNewEventStarted = true;
      this.isMenuOpen = false;

      console.log("this.newEvent", this.newEvent);
    },
    async saveEventToCalendar() {
      await db.collection("calEvent").add({
        name: this.newEvent.name,
        details: this.newEvent.details,
        start: this.newEvent.start,
        end: this.newEvent.end,
        color: this.newEvent.color,
        timed: this.newEvent.timed,
      });

      this.newEvent.name = "";
      this.newEvent.details = "";
      this.newEvent.start = "";
      this.newEvent.end = "";
      this.newEvent.color = "";

      this.dialog = false;
      this.isErrors = false;

      this.isNewEventStarted = false;
      this.isMenuOpen = false;
      this.getEvents();
    },
    cancelEditEvent() {
      this.selectedEvent = {};
      this.currentlyEditing = null;
      this.selectedOpen = false;
      this.isErrors = false;
      this.showEvent({
        nativeEvent: this.currentNativeEvent,
        event: this.currentEvent,
      });
    },
    cancelAddNewEvent() {
      this.newEvent.name = "";
      this.newEvent.color = "";
      this.newEvent.details = "";

      this.isErrors = false;
      this.isNewEventStarted = false;
      this.isMenuOpen = false;
    },
    onEventMenuClose() {
      this.isMenuOpen = false;
    },
    async addNewDailyEvent(ev) {
      this.newDailyEvent.name = ev.name;
      this.newDailyEvent.details = ev.details;
      this.newDailyEvent.color = ev.color;

      this.newDailyEvent.start = `${this.newDailyEvent.date}T${ev.start}`;
      this.newDailyEvent.end = `${this.newDailyEvent.date}T${ev.end}`;

      await db.collection("calEvent").add({
        name: this.newDailyEvent.name,
        details: this.newDailyEvent.details,
        start: this.newDailyEvent.start,
        end: this.newDailyEvent.end,
        color: this.newDailyEvent.color,
        timed: this.newDailyEvent.timed,
      });

      this.newDailyEvent.name = "";
      this.newDailyEvent.details = "";
      this.newDailyEvent.start = "";
      this.newDailyEvent.end = "";
      this.newDailyEvent.color = "";
      this.newDailyEvent.date = "";
      this.newDailyEvent.timed = true;

      this.isErrors = false;
      this.isDailyMenuOpen = false;

      this.getEvents();

      console.log("this.newDailyEvent", this.newDailyEvent);
    },
    cancelNewDailyEvent() {
      this.newDailyEvent.name = "";
      this.newDailyEvent.date = "";
      this.newDailyEvent.details = "";
      this.newDailyEvent.start = "";
      this.newDailyEvent.end = "";
      this.newDailyEvent.color = "";

      this.isErrors = false;
      this.isDailyMenuOpen = false;
    },
    onDailyEventMenuClose() {
      this.isDailyMenuOpen = false;
    },
    async updateEvent(selectedEvent) {
      //in this.currentlyEditing we hold the selectedEvent.id
      if (
        selectedEvent.name == "" ||
        selectedEvent.details == "" ||
        selectedEvent.start == "" ||
        selectedEvent.end == ""
      ) {
        this.errorMessage = this.messages.fillAllfieldsError;
        this.isErrors = true;
        return;
      }

      if (selectedEvent.timed) {
        selectedEvent.start = `${selectedEvent.date}T${selectedEvent.startTime}`;
        selectedEvent.end = `${selectedEvent.date}T${selectedEvent.endTime}`;
      }

      const startDate = Date.parse(selectedEvent.start);
      const endDate = Date.parse(selectedEvent.end);

      if (endDate < startDate) {
        this.errorMessage = selectedEvent.timed
          ? this.messages.endTimeError
          : this.messages.endDayError;
        this.isErrors = true;
        return;
      }

      await db.collection("calEvent").doc(this.currentlyEditing).update({
        name: selectedEvent.name,
        color: selectedEvent.color,
        details: selectedEvent.details,
        start: selectedEvent.start,
        end: selectedEvent.end,
      });

      this.selectedOpen = false;
      this.currentlyEditing = null;
      this.getEvents();
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
      let startDay = null;
      let endDay = null;
      let currentStartDate = null;
      let currentEndDate = null;

      if (this.start) {
        startDay = this.start.substring(8, 10);
        currentStartDate = Date.parse(this.start);
      }

      if (this.end) {
        endDay = this.end.substring(8, 10);
        currentEndDate = Date.parse(this.end);
      }

      //Input validation
      if (this.name == null || this.start == null || this.end == null) {
        this.errorMessage = this.messages.fillAllfieldsError;
        this.isErrors = true;
        return;
      }

      if ((this.timed == null || this.timed == false) && endDay < startDay) {
        this.errorMessage = this.messages.endDayError;
        this.isErrors = true;
        return;
      }

      if (
        this.timed == true &&
        (currentEndDate < currentStartDate || endDay < startDay)
      ) {
        this.errorMessage = this.messages.endTimeError;
        this.isErrors = true;
        return;
      }

      this.isErrors = false;
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
      //This properties is need if cancelling edit event. In this case we need to show again the same event in view mode with original data. To do this we called showEvent() method again into cancelEditEvent() method.
      this.currentNativeEvent = nativeEvent;
      this.currentEvent = event;

      this.isErrors = false;

      const open = () => {
        this.selectedEvent = JSON.parse(JSON.stringify(event));

        if (event.timed) {
          this.selectedEvent.date = event.start.substring(0, 10);
          this.selectedEvent.startTime = this.getTimeStringFromDate(
            event.start
          );
          this.selectedEvent.endTime = this.getTimeStringFromDate(event.end);
        }

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
    updateRange() {},
  },
};
</script>

<style></style>
