"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
});

export default theme;
