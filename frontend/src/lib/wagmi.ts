'use client'

import { http, createConfig } from 'wagmi'
import { avalancheFuji, arbitrumSepolia, sepolia, baseSepolia, saigon } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [avalancheFuji, arbitrumSepolia, sepolia, baseSepolia, saigon],
  transports: {
    [avalancheFuji.id]: http(),
    [arbitrumSepolia.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [saigon.id]: http(),
  },
})
