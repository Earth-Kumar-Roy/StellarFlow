export const STELLAR_CONFIG = {
  networkPassphrase:
    import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE ||
    'Test SDF Network ; September 2015',
  rpcUrl:
    import.meta.env.VITE_SOROBAN_RPC_URL ||
    'https://soroban-testnet.stellar.org',
  contractId:
    import.meta.env.VITE_CONTRACT_ID ||
    'CBNFHUIF74UPRUQ3JM45ZJCOT6MKW6JUXJ6SICGOPFHH2U6TE2UVURPS',
  // Verified Native XLM SAC Contract ID from Stellar CLI
  nativeTokenAddress:
    'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
  // Deployed Google Apps Script Web App Endpoint for Logging & Emails
  appsScriptUrl:
    import.meta.env.VITE_APPS_SCRIPT_URL ||
    'https://script.google.com/macros/s/AKfycbxjMRgCtby9FzwfrOkpeJEd3Bc5F3a98aud6HdCrlMb4I8JCxd5heH2bLTmyomJXCw/exec',
};