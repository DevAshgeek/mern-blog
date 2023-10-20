import { createContext, useState } from "react";

const UserContext = createContext({});

function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState({});

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserContextProvider };
