import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    ROOT_API: `"${process.env.REACT_API_URL}"`,
    ROOT_HOST: `"${process.env.REACT_HOSTNAME}"`,
  },
});
