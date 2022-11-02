import { useEffect, createContext, useState } from "react";
import { onAuthStateChangedListener } from "../utils/firebase/firebase.utils";
//as the actual value you want to access
export const UserContext = createContext({
  setCurrentUser: () => null,
  currentUser: null,
});
//so on every context that gets built for us, there is a dot provider, the provider is the component that will wrap around any other component that need access to the values inside
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const value = { currentUser, setCurrentUser };

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      console.log(user);
    });

    return unsubscribe;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

//in useContext, components hooking  it get recalled it's function (rerun)
