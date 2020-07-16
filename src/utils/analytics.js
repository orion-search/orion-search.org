/**
 * adapted from
 * https://medium.com/brownbag/add-google-analytics-to-create-react-app-project-with-react-router-v4-f12b947262fc
 */
import React, { useEffect } from "react";
import ReactGA from "react-ga";
import { Route, useLocation } from "react-router-dom";

const GoogleAnalytics = (options = {}) => {
  const location = useLocation();

  const logPageChange = (pathname, search = "", options) => {
    const page = pathname + search;
    const { location } = window;
    console.log(pathname, search);

    ReactGA.set({
      page,
      location: `${location.origin}${page}`,
      ...options,
    });
    ReactGA.pageview(page);
  };

  useEffect(() => {
    logPageChange(location.pathname, location.search, options);
  }, [location.pathname, location.search, options]);

  return null;
};

const RouteTracker = () => <Route component={GoogleAnalytics} />;

const init = (options = {}) => {
  const isGAEnabled = process.env.NODE_ENV === "production";

  if (isGAEnabled) {
    ReactGA.initialize("UA-171261709-1");
  }

  return isGAEnabled;
};

export default {
  GoogleAnalytics,
  init,
  RouteTracker,
};
