import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import AppRouter from "./routes/AppRouter";
import "./App.css";
import { Toaster } from "sonner";
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
        <Toaster position="top-right" />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
