/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_NODE_ENV: string;
  readonly VITE_ENABLE_MOCK_AUTH: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_JWT_REFRESH_THRESHOLD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}