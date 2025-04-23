// Import the ABI JSON files
import MyTokenJson from '../abi/MyToken.json';
import MyRouterJson from '../abi/MyRouter.json';

// Token addresses
export const BASE_SEPOLIA_TOKEN_ADDRESS = '0xd8be95eD07089b7D0914a8fEb0Db8A3096eCe15e' as const;
export const SAIGON_TOKEN_ADDRESS = '0xA9E420D4387A3Cd8624d1C7438c39b8B4e51a21D' as const;

// Router addresses 
export const BASE_SEPOLIA_ROUTER_ADDRESS = '0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93' as const;
export const SAIGON_ROUTER_ADDRESS = '0x0aCAe4e51D3DA12Dd3F45A66e8b660f740e6b820' as const;

// Chain selectors 
export const CHAIN_SELECTORS = {
  BASE_SEPOLIA: '10344971235874465080', // Base Sepolia 
  SAIGON: '13116810400804392105', // Saigon
} as const;

// Export the ABIs
export const MYTOKEN_ABI = MyTokenJson;
export const ROUTER_ABI = MyRouterJson; 