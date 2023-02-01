/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly __BUILD_TIME__: string;
  readonly __BUILD_VERSION__: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  readonly __BUILD_TIME__?: string;
  readonly __BUILD_VERSION__?: string;
}
