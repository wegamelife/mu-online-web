import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";

import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({
  user: null,
  updateUser: () => {},
});

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);

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
      }}
    >
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;
