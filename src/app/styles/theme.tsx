import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark", 
    primary: {
      main: "#bb86fc",
    },
    secondary: {
      main: "#03dac6",
    },
    background: {
      default: "#121212", 
      paper: "#1e1e1e", 
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#b0b0b0",
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
      color: "#ffffff",
    },
    h5: {
      fontWeight: 500,
      color: "#ffffff",
    },
    body1: {
      fontFamily: "'Roboto', sans-serif",
      color: "#e0e0e0", 
    },
  },
  spacing: 8, 
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "8px 16px", 
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 4px 20px rgba(255, 255, 255, 0.1)",
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 6px 30px rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
});

export default theme;
