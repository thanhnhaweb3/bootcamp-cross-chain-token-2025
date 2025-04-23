'use client'

import TokenInfo from '@/components/TokenInfo'
import NetworkSelector from '@/components/NetworkSelector'
import CCTSaigonTestnettoBaseSepolia from '@/components/CCTSaigonTestnettoBaseSepolia'
import CCIPDetails from '@/components/CCIPDetails'

export default function CCTPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Saigon to Base Sepolia Transfer</h1>
        <NetworkSelector />
        <TokenInfo />
        <CCTSaigonTestnettoBaseSepolia />
        <CCIPDetails />
      </div>
    </main>
  )
} 