import { useEffect } from "react";

const useTimeout = (doLogout) => {
  const signoutTime = 1000 * 60 * 60
  let logoutTimeout;

  const logout = () => {
    console.log('You have been logged out');
    doLogout()
  }

  const setTimeouts = () => {
    //    warnTimeout = setTimeout(warn, warningTime);
    logoutTimeout = setTimeout(logout, signoutTime);
  };

  const clearTimeouts = () => {
    //  if (warnTimeout) clearTimeout(warnTimeout);
    if (logoutTimeout) clearTimeout(logoutTimeout);
  };

  useEffect(() => {
    const events = [
      'load',
      'mousedown',
      'click',
      'scroll',
      'keypress'
    ];

    const resetTimeout = () => {
      clearTimeouts();
      setTimeouts();
    };

    for (let i in events) {
      window.addEventListener(events[i], resetTimeout);
    }

    setTimeouts();
  });
}

export default useTimeout