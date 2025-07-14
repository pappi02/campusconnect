import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const StickyHeader = () => {
  const location = useLocation();
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0);
  const hideTimeout = useRef(null);

  const scrollThreshold = 50; // Minimum scroll before triggering
  const hideDelay = 300; // ms

  // Determine if login button should be hidden (only show on index page)
  const hideLogin = location.pathname !== "/" && location.pathname !== "/index";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = Math.abs(currentScrollY - lastScrollY.current);

      if (scrollDiff < scrollThreshold) return;

      // Scrolling Up
      if (currentScrollY < lastScrollY.current || currentScrollY <= 0) {
        clearTimeout(hideTimeout.current);
        setShow(true);
      } else {
        // Scrolling Down (hide with delay)
        clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => {
          setShow(false);
        }, hideDelay);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(hideTimeout.current);
    };
  }, []);

  return (
    <div
      className={`sticky top-0 w-full z-50 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <Navbar hideLogin={hideLogin} />
    </div>
  );
};

export default StickyHeader;
