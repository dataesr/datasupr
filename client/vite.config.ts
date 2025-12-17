import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // @ts-expect-error - Conflit de versions Rollup entre workspace racine et client
  plugins: [react()],
  css: {
    preprocessorOptions: {
      sass: {
        style: 'expanded',
      },
    },
  },
  resolve: {
    // Dédupliquer React et React-DOM pour éviter les versions multiples
    // Utilisé en combinaison avec "overrides" dans package.json pour forcer React 19
    dedupe: ['react', 'react-dom'],
  },
});