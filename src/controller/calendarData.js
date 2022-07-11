const {google} = require('googleapis');

// Provide the required configuration
const CREDENTIALS = {
  "type": "service_account",
  "project_id": "sound-octagon-343808",
  "private_key_id": "c3d24727863290b26cb451eef6624469a06a0169",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDBPZeJ+AXjDyhO\nV9zD15kiKmYRi9WTK1d2TEwDavVd2dSQS7Y+07pWX88mBwAixv7shos9Nug87BFS\nppX8UKrihjSOIg7SgKJqAZjiP+ZNGa28Wvdu2wUum7AMU3jPQPKnbSnUMmJ0a40M\nwm7F4/i3lzvp7rJbrto9wtUXMKi4vtXxAAOLMnwD1GG0kTR8ZdbNNrKaS5aQXjt+\ncnbEkghqH3BbGsmgGn0NKSlzVJYzyjPVFDe7VBE0uer/KNEtpZ/3eS718BwVBnuY\nVUNw4cS6uKuCAskeubcp1TSyQHXtjxULpg79YNUj50vvSoQ5vxOHsWomelcEdb/N\n71AjFnNZAgMBAAECggEARjyJUnwEQ8HUIBmeY85+2eS4QaNmRv4nZZeYv1tGgMy2\njpX+UTqqzU84nzVHLtzOdpD2lhLZeZ9CMpzbAiEd44TtIEYvxgI8RjR7aazZG+f7\n9mzH55KTARxUcj56uDX+nK04WWjQ0UjwNRWMpr/UPIKrI71/NYTJzU3+HtYwVSlh\nwz/H3F6TSa24zl6AhWy3aWyRiF/wHHLE3s2ZJge2hozApS4jCRfCi+ZiVdE8cUBE\nkbtnfFXp/bI3nDsYWHYiEpntTuA3Ghf60qkUldlQmONQCT3FUmnDNeTEnJ727F+a\nF3k1jMY2E6SoSuYw5W2mXfxQPmneNC2ftI+J1yzuiwKBgQDvO4LCYj64NlWQax9q\nRa2senfZ/ZZJU6c/x+PTpZo4S5BJshgTCbbzM7ouy1KTjfsR9FoUquyUyuaHE++3\ns3M7E46K5hCSYVjpilzC1d2r+6ZdRGAjGTA6YrvzSMcNvwTQUdW31wxwQ++JEJyi\n/Gv8Ns8/orxdmbpPa9cPJUdh9wKBgQDOyNxAedXM5xmg/nsEdUlAkA6+2iIdnkRa\nEkc2fQs0ldZwf52FqLhY59R2ANpYd+ad1vKT/zBFABw1gL6WdwFVXnnTIXzDFRf+\neYG2btCBjKRXuXWiQ3isHeW771VQAhAtUWXOAcExgAxEa2P1X3OJ4iTaueJusC0S\n+oc5OtKBLwKBgCDT2LiVxKeAhTNBD9mEYDWXxJR8MMA1I3EkG8YyJjxtWgpSzuzl\n2136DiVXrygiRn6LOkU1wysTwJhuiul5TWmg4GF8+m8rvoilfN8be8SazpRjypFm\nZnDMlZ/nr7DaMm3nnN0SPFm3aMo1JllTK/o7BytjSFfLvX4ifStN4UK3AoGAexEX\n5FeeYuB3ZFWQKUsUWZRi8jsoarAyxdhzAX7SGG3Evhd1TILplCAFVmWTjWtumSnA\nHUyXEbnLEBybUTlqVcBwiLM5aXE4Yn82L7kr5q4pcPwzgmrderIgdAUwpPlVX2M+\nT6jDrg4jPuUbDIHOZZVtka9nj7DSYqUvrWPQvIkCgYBzvs57yrCh78A/f0P8YQkh\nU0vfjvQs1gJq+Lub07YPb5fHgK5nZES/HZK+n+Me+MjVpCKLgugelpXZf10s+f+f\nEKsHzBS6NAWYjHQLSeAgrccuW2v+aKaYF8XNee/RImdckLxLlV+NS8bnaOy8Nqfa\n38S8uBxSr8vYl8atZE6uVw==\n-----END PRIVATE KEY-----\n",
  "client_email": "appointment-schedule@sound-octagon-343808.iam.gserviceaccount.com",
  "client_id": "117476511829707471572",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/appointment-schedule%40sound-octagon-343808.iam.gserviceaccount.com"
}
const calendarId = "h8q3p0rjn3ps92ms55gh7tkf8g@group.calendar.google.com";

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

// Your TIMEOFFSET Offset
const TIMEOFFSET = '+05:30';

// Get date-time string for calender
const dateTimeForCalander = () => {

    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

    return {
        'start': startDate,
        'end': endDate
    }
};

// console.log(dateTimeForCalander() ,"aya");

// Insert new event to Google Calendar
const insertEvent = async (event) => {

    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};

let dateTime = dateTimeForCalander();

// // Event for Google Calendar
// let event = {
//     'summary': `This is the summary.`,
//     'description': `This is the description.`,
//     'start': {
//         'dateTime': dateTime['start'],
//         'timeZone': 'Asia/Kolkata'
//     },
//     'end': {
//         'dateTime': dateTime['end'],
//         'timeZone': 'Asia/Kolkata'
//     }
// };

// insertEvent(event)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// Get all the events between two dates
const getEvents = async (dateTimeStart, dateTimeEnd) => {

    try {
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: 'Asia/Kolkata'
        });
    
        let items = response['data']['items'];
        return items;
    } catch (error) {
        console.log(`Error at getEvents --> ${error}`);
        return 0;
    }
};

// let start = '2020-10-03T00:00:00.000Z';
// let end = '2020-10-04T00:00:00.000Z';

// getEvents(start, end)
//     .then((res) => {
//         console.log(res ,"aya");
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// Delete an event from eventID
const deleteEvent = async (eventId) => {

    try {
        let response = await calendar.events.delete({
            auth: auth,
            calendarId: calendarId,
            eventId: eventId
        });

        if (response.data === '') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at deleteEvent --> ${error}`);
        return 0;
    }
};

let eventId = 'hkkdmeseuhhpagc862rfg6nvq4';

// deleteEvent(eventId)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
