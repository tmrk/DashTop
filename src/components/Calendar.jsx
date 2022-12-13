import React, { useState, useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { DateTime } from "luxon";

const callMsGraph = async (accessToken) => {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers
  };

  const endpoint = "https://graph.microsoft.com/v1.0/me/calendar/calendarview" 
    + "?startDateTime=" + DateTime.now().toISODate() 
    + "&endDateTime=" + DateTime.now().plus({ days: 14 }).toISODate();
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
  return (<button onClick={handleLogin}>Sign in</button>);
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
  const [graphData, setGraphData] = useState(null);
  useEffect(() => {
    instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0]
    }).then((response) => {
      callMsGraph(response.accessToken).then((response) => {
        setGraphData(response);
        console.log(response.value);
        console.log(DateTime.now().toISO());
        console.log(new Date().toISOString())
      });
    });
  }, [isAuthenticated]);

  return (
    <div id="calendar">
      {isAuthenticated && graphData ? 
        <ul>
          {graphData.value.map((event) => (
            <li key={event.id}>
              <time>
                {DateTime.fromISO(event.start.dateTime, {zone: event.start.timeZone})
                .setZone(DateTime.local().zoneName)
                .toLocaleString(DateTime.TIME_24_SIMPLE)}
                &#8211;
                {DateTime.fromISO(event.end.dateTime, {zone: event.end.timeZone})
                .setZone(DateTime.local().zoneName)
                .toLocaleString(DateTime.TIME_24_SIMPLE)}
                <span>
                {DateTime.fromISO(event.start.dateTime, {zone: event.start.timeZone})
                  .setZone(DateTime.local().zoneName)
                  .toRelativeCalendar()}
                </span>
              </time>
              {event.subject}
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

