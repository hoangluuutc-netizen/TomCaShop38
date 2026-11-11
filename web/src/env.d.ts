interface ImportMetaEnv {
  readonly PUBLIC_ORDER_ENDPOINT?: string;
  readonly PUBLIC_BANK_ID?: string;
  readonly PUBLIC_BANK_ACCOUNT?: string;
  readonly PUBLIC_BANK_ACCOUNT_NAME?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv }
