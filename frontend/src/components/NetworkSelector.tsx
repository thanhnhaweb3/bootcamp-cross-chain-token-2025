'use client'

import { useAccount, useSwitchChain } from 'wagmi'
import { baseSepolia, saigon } from 'wagmi/chains'

const SUPPORTED_CHAINS = [baseSepolia, saigon]

export default function NetworkSelector() {
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Network</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {SUPPORTED_CHAINS.map((supportedChain) => (
          <button
            key={supportedChain.id}
            onClick={() => switchChain({ chainId: supportedChain.id })}
            className={`p-4 rounded-lg border ${
              chain?.id === supportedChain.id
                ? 'bg-blue-100 border-blue-500'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="text-lg font-semibold text-gray-800">
              {supportedChain.name}
            </div>
            <div className="text-sm text-gray-600">
              Chain ID: {supportedChain.id}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 