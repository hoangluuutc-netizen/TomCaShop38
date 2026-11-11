interface ImportMetaEnv {
  readonly PUBLIC_ORDER_ENDPOINT?: string;
  readonly PUBLIC_BANK_ID?: string;
  readonly PUBLIC_BANK_ACCOUNT?: string;
  readonly PUBLIC_BANK_ACCOUNT_NAME?: string;
  readonly PUBLIC_META_PIXEL_ID?: string;
}
interface Window {
  tomcaPixel?: (ten: string, thamSo?: Record<string, unknown>, tuyChon?: Record<string, unknown>) => void;
}
interface ImportMeta { readonly env: ImportMetaEnv }
