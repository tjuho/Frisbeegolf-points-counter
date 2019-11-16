import React, { useState, useEffect } from "react";

function useTimeout(doLogout) {
  const signoutTime = 1000 * 60 * 60
  let logoutTimeout;

  const warn = () => {
    console.log('Warning');
  };
  const logout = () => {
    console.log('You have been loged out');
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

    setTimeouts();/*
    return () => {
      console.log('loop called')
      for (let i in events) {
        window.removeEventListener(events[i], resetTimeout);
        clearTimeouts();
      }
    }*/
  }, []);
}

export default useTimeout