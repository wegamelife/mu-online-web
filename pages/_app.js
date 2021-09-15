import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";

import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({
  user: null,
  updateUser: () => {},
  message: "",
  updateMessage: () => {},
});

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let localUser = localStorage.getItem("user");
    localUser = localUser ? JSON.parse(localUser) : null;
    setUser(localUser);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: user,
        updateUser: setUser,
        message: message,
        updateMessage: setMessage,
      }}
    >
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;
