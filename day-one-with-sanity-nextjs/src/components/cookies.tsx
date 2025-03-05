"use client";

import { FC } from "react";

export const CookieBanner: FC = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Remove cookies
    document.cookie =
      "ab-test=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };
  return (
    <div>
      <button onClick={handleSubmit}>Remove Test Cookies</button>
    </div>
  );
};
