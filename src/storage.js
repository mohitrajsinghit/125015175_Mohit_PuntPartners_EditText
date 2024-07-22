import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Define the initial state with four variables
  const [font, setFont] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('font'));
    return savedUser ? savedUser.userName : '';
  });
  
  const [varient, setVarient] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('varient'));
    return savedUser ? savedUser.email : '';
  });
  
  const [isItallicAllowed, setIsItalicAvailable] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('isItallicAllowed'));
    return savedUser ? savedUser.age : '';
  });
  
  const [itallic, setItallic] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('itallic'));
    return savedUser ? savedUser.address : '';
  });

  useEffect(() => {
    const user = { font, varient, isItallicAllowed, itallic };
    if (user.font || user.varient || user.isItallicAllowed || user.itallic) {
      localStorage.setItem('user', JSON.stringify(user));
      console.log("User set in localStorage:", localStorage.getItem('user'));
    } else {
      localStorage.removeItem('user');
      console.log("User removed from localStorage");
    }
  }, [ font, varient, isItallicAllowed, itallic]);

  return (
    <UserContext.Provider value={{font, setFont, varient, setVarient, isItallicAllowed, setIsItalicAvailable, itallic, setItallic}}>
      {children}
    </UserContext.Provider>
  );
};
