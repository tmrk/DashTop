import React, { useState, useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { DateTime } from "luxon";
import CallIcon from '@mui/icons-material/Call';

const callMsGraph = async (accessToken) => {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers
  };

  const endpoint = "https://graph.microsoft.com/v1.0/me/calendar/calendarview" 
    + "?startDateTime=" + DateTime.now().toISODate() // the start of today (includes even past events of today)
    + "&endDateTime=" + DateTime.now().plus({ days: 7 }).toISODate();
  return fetch(endpoint, options)
    .then(response => response.json())
    .catch(error => console.log(error));
}

const loginRequest = {
  scopes: ["User.Read", "Calendars.Read"]
};

const SignInButton = () => {
  const { instance } = useMsal();
  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => {
      console.log(e);
    });
  }
  return (<button onClick={handleLogin} id="signinbutton">Sign in</button>);
}

const SignOutButton = () => {
  const { instance } = useMsal();
  const handleLogout = () => {
    instance.logoutPopup({
    postLogoutRedirectUri: "/",
    mainWindowRedirectUri: "/"
    });
  }
  return (<button onClick={handleLogout}>Sign out</button>)
}

export default function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState( // load cashed events immediately
    localStorage.getItem("calendarEvents") ?
      JSON.parse(localStorage.getItem("calendarEvents")) :
      null
  );

  const updateCalendar = (repeat) => {
    instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0]
    }).then((response) => {
      callMsGraph(response.accessToken).then((response) => {
        const sortedEvents = response.value.sort((a,b) => new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime());
        setGraphData(sortedEvents);
        localStorage.setItem("calendarEvents", JSON.stringify(sortedEvents));
        console.log(response);
        console.log(DateTime.now().toISO());
        console.log(new Date().toISOString())
      });
    });
    if (repeat) setTimeout(() => updateCalendar(repeat), repeat);
  }

  useEffect(() => updateCalendar(60000/*repeat milliseconds*/), [isAuthenticated]);

  const eventStatus = (event) => {
    const start = DateTime.fromISO(event.start.dateTime, {zone: event.start.timeZone});
    const end = DateTime.fromISO(event.end.dateTime, {zone: event.end.timeZone});
    const now = DateTime.local();
    if (start < now && end > now) return "happening";
    else if (start < now && end < now) return "ended";
    else if (start.diff(now, 'minutes').toObject().minutes <= 15) return "soon";
  }

  return (
    <div id="calendar">
      {isAuthenticated && graphData ? 
        <ul>
          {graphData.map((event) => (
            <li 
              key={event.id} 
              className={"status_" + eventStatus(event)} 
              order={new Date(event.start.dateTime).getTime()}
            >
              <div>
                <time>
                  {DateTime.fromISO(event.start.dateTime, {zone: event.start.timeZone})
                  .setZone(DateTime.local().zoneName)
                  .toLocaleString(DateTime.TIME_24_SIMPLE)}
                  &#8211;
                  {DateTime.fromISO(event.end.dateTime, {zone: event.end.timeZone})
                  .setZone(DateTime.local().zoneName)
                  .toLocaleString(DateTime.TIME_24_SIMPLE)}
                  {}
                  <span>
                  {DateTime.fromISO(event.start.dateTime, {zone: event.start.timeZone})
                    .setZone(DateTime.local().zoneName)
                    .toRelativeCalendar()}
                  </span>
                </time>
                {event.subject}
              </div>
              {event.isOnlineMeeting 
              && (eventStatus(event) === "happening" || eventStatus(event) === "soon") 
              ? 
              <a href={event.onlineMeeting.joinUrl} class="call" target="_blank">
                <CallIcon />
                <span>Join</span>
              </a> : ""}
            </li>
          ))}
        </ul>
        : isAuthenticated ?
        <p>loading</p>
        :
        <SignInButton />
      }
    </div>
  );
};

