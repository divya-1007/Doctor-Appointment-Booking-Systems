document.addEventListener("DOMContentLoaded", function () {
  var Calendar = FullCalendar.Calendar;
  var Draggable = FullCalendar.Draggable;

  var containerEl = document.getElementById("external-events");
  var calendarEl = document.getElementById("calendar");
  var checkbox = document.getElementById("drop-remove");

  // initialize the external events
  // -----------------------------------------------------------------

  new Draggable(containerEl, {
    itemSelector: ".fc-event",
    eventData: function (eventEl) {
      return {
        title: eventEl.innerText,
      };
    },
  });

  // initialize the calendar
  // -----------------------------------------------------------------
  // if you want to empty events already in calendar.
  let globalVariable = "";
  $.ajax({
    url: $("#calendar").data("url"),
    type: "get",
    data: $("#calendar").data("_id"),
    success: function (data) {
      globalVariable = data;
    },
  });
  setTimeout(() => {
    var calendar = new Calendar(calendarEl, {
      headerToolbar: {
        left: "prev,next today addEventButton",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },

      businessHours: true, // display business hours
      editable: true,
      events: globalVariable,
      customButtons: {
        addEventButton: {
          text: "Add Event",
          click: function () {
            var dateStr = prompt("Enter a date in YYYY-MM-DD format");
            var date = new Date(dateStr + "T00:00:00"); // will be in local time

            if (!isNaN(date.valueOf())) {
              // valid?
              calendar.addEvent({
                title: "dynamic event",
                start: date,
                allDay: true,
              });
              alert("Great. Now, update your database...");
            } else {
              alert("Invalid date.");
            }
          },
        },
      },

      editable: true,
      droppable: true, // this allows things to be dropped onto the calendar
      drop: function (info) {
        // is the "remove after drop" checkbox checked?
        if (checkbox.checked) {
          // if so, remove the element from the "Draggable Events" list
          info.draggedEl.parentNode.removeChild(info.draggedEl);
        }
      },
    });
    calendar.render();
  }, 1000);
});
