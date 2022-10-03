import { Calendar } from "@bryntum/Calendar";
import "@bryntum/calendar/calendar.stockholm.css";

const signInButton = document.getElementById("signin");

const calendar = new Calendar({
  appendTo: "calendar",

  listeners: {
    dataChange: function (event) {
      updateMicrosoft(event);
    },
  },

  resources: [
    {
      id: 1,
      name: "Default Calendar",
      eventColor: "green",
    },
  ],
});

async function updateMicrosoft(event) {
  if (event.action == "update") {
    const microEvents = await getAllEvents();
    // check if event exists in microsoft, if it does, update it, if not, create it
    var eventExists = false;

    for (var i = 0; i < microEvents.value.length; i++) {
      // event exists in both microsoft and bryntum with the same name
      if (microEvents.value[i].subject == event.record.name) {
        eventExists = true;
        updateEvent(
          microEvents.value[i].id,
          event.record.name,
          event.record.startDate,
          event.record.endDate
        );
        return;
      } else if ("name" in event.changes) {
        if (event.changes.name.oldValue == microEvents.value[i].subject) {
          eventExists = true;
          updateEvent(
            microEvents.value[i].id,
            event.record.name,
            event.record.startDate,
            event.record.endDate
          );
          return;
        }
      } else if ("resourceId" in event.changes) {
        eventExists = true;
      }
    }
    // event does not exist in microsoft, create it
    if (!eventExists) {
      if (event.record.name != undefined) {
        createEvent(
          event.record.name,
          event.record.startDate,
          event.record.endDate
        );
      }
    }
  }
  // event is deleted
  else if (event.action == "remove") {
    const microEvents = await getAllEvents();
    var eventName = event.records[0].data.name;
    for (var i = 0; i < microEvents.value.length; i++) {
      if (microEvents.value[i].subject == eventName) {
        deleteEvent(microEvents.value[i].id);
        return;
      }
    }
  }
}

async function displayUI() {
  await signIn();

  // Hide sign in link and initial UI
  signInButton.style = "display: none";
  var content = document.getElementById("content");
  content.style = "display: block";

  // Display calendar after sign in
  var events = await getEvents();
  var calendarEvents = [];
  var eventId = 1;
  var resourceID = 1;
  events.value.forEach((event) => {
    console.log(event.start.dateTime);
    console.log(event.start.timeZone);
    calendarEvents.push({
      id: eventId,
      name: event.subject,
      startDate: event.start.dateTime,
      endDate: event.end.dateTime,
      resourceId: resourceID,
    });
    eventId++;
  });
  calendar.events = calendarEvents;
}

signInButton.addEventListener("click", displayUI);

export { displayUI };
