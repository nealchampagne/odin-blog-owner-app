// global.d.ts
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // add other VITE_ variables here if needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// This ensures the file is treated as a module, so TS loads it
export {};