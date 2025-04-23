'use client'

import { useAccount, useReadContract, useChainId } from 'wagmi'
import { MYTOKEN_ABI, BASE_SEPOLIA_TOKEN_ADDRESS, SAIGON_TOKEN_ADDRESS } from '@/constants/contract'

export default function TokenInfo() {
  const { address } = useAccount()
  const chainId = useChainId()

  // Read name on Base Sepolia
  const { data: baseName } = useReadContract({
    address: BASE_SEPOLIA_TOKEN_ADDRESS as `0x${string}`,
    abi: MYTOKEN_ABI,
    functionName: 'name',
    chainId: 84532, // Base Sepolia
  }) as { data: string | undefined }

  // Read decimals on Base Sepolia
  const { data: baseDecimals } = useReadContract({
    address: BASE_SEPOLIA_TOKEN_ADDRESS as `0x${string}`,
    abi: MYTOKEN_ABI,
    functionName: 'decimals',
    chainId: 84532, // Base Sepolia
  }) as { data: number | undefined }

  // Read balance on Base Sepolia
  const { data: baseBalance, refetch: refetchBaseBalance } = useReadContract({
    address: BASE_SEPOLIA_TOKEN_ADDRESS as `0x${string}`,
    abi: MYTOKEN_ABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
    chainId: 84532, // Base Sepolia
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      gcTime: 0,
    }
  }) as { data: bigint | undefined, refetch: () => void }

  // Read name on Saigon
  const { data: saigonName } = useReadContract({
    address: SAIGON_TOKEN_ADDRESS as `0x${string}`,
    abi: MYTOKEN_ABI,
    functionName: 'name',
    chainId: 2021, // Saigon
  }) as { data: string | undefined }

  // Read decimals on Saigon
  const { data: saigonDecimals } = useReadContract({
    address: SAIGON_TOKEN_ADDRESS as `0x${string}`,
    abi: MYTOKEN_ABI,
    functionName: 'decimals',
    chainId: 2021, // Saigon
  }) as { data: number | undefined }

  // Read balance on Saigon
  const { data: saigonBalance, refetch: refetchSaigonBalance } = useReadContract({
    address: SAIGON_TOKEN_ADDRESS as `0x${string}`,
    abi: MYTOKEN_ABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
    chainId: 2021, // Saigon
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      gcTime: 0,
    }
  }) as { data: bigint | undefined, refetch: () => void }

  // Get token symbol
  const { data: tokenSymbolData } = useReadContract({
    address: BASE_SEPOLIA_TOKEN_ADDRESS as `0x${string}`,
    abi: MYTOKEN_ABI,
    functionName: 'symbol',
    chainId: 84532, // Base Sepolia
  })
  
  // Convert unknown type to string
  const tokenSymbol = tokenSymbolData as string || 'BnM2kh'

  const getCurrentNetwork = () => {
    switch (chainId) {
      case 84532:
        return 'Base Sepolia'
      case 2021:
        return 'Saigon'
      default:
        return 'Unknown Network'
    }
  }

  const formatBalance = (balance: bigint | undefined, decimals: number | undefined) => {
    if (!balance || decimals === undefined) return '0.0000'
    
    const divisor = BigInt(10) ** BigInt(decimals)
    const whole = balance / divisor
    const fraction = balance % divisor
    
    // Format with full precision but limit display
    let fractionStr = fraction.toString().padStart(decimals, '0')
    
    // Trim trailing zeros
    while (fractionStr.endsWith('0') && fractionStr.length > 4) {
      fractionStr = fractionStr.slice(0, -1)
    }
    
    // Display at least 4 decimal places
    const displayFraction = fractionStr.length > 4 ? fractionStr : fractionStr.padEnd(4, '0')
    
    return `${whole.toString()}.${displayFraction}`
  }

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  const handleRefresh = () => {
    refetchBaseBalance()
    refetchSaigonBalance()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Token Information</h2>
        <button 
          onClick={handleRefresh}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Balances
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Wallet Address
        </label>
        <div className="bg-gray-50 p-3 rounded-md text-black font-mono">
          {address || 'Not connected'}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Network
        </label>
        <div className="bg-gray-50 p-3 rounded-md text-black">
          {getCurrentNetwork()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Base Sepolia</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Token:</span>
              <span className="font-medium text-black">
                {baseName || 'MyToken'} ({tokenSymbol})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Address:</span>
              <a 
                href={`https://sepolia.basescan.org/address/${BASE_SEPOLIA_TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-500 hover:text-blue-700 text-sm"
                title={BASE_SEPOLIA_TOKEN_ADDRESS}
              >
                {formatAddress(BASE_SEPOLIA_TOKEN_ADDRESS)}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Balance:</span>
              <span className="font-mono text-black font-medium">
                {formatBalance(baseBalance, baseDecimals)} {tokenSymbol}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Saigon</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Token:</span>
              <span className="font-medium text-black">
                {saigonName || 'MyToken'} ({tokenSymbol})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Address:</span>
              <a 
                href={`https://saigon-app.roninchain.com/address/${SAIGON_TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-500 hover:text-blue-700 text-sm"
                title={SAIGON_TOKEN_ADDRESS}
              >
                {formatAddress(SAIGON_TOKEN_ADDRESS)}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Balance:</span>
              <span className="font-mono text-black font-medium">
                {formatBalance(saigonBalance, saigonDecimals)} {tokenSymbol}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
