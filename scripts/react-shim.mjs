// Stand-in for assets/vendor/react-bundle.mjs when pre-rendering in Node.
// The browser uses the vendored bundle; the build uses the npm packages.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

export { useEffect, useMemo, useRef, useState, createRoot };
export default React;
