/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BUILD_TIME: string;
  readonly BUILD_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  readonly BUILD_TIME?: string;
  readonly BUILD_VERSION?: string;
}
