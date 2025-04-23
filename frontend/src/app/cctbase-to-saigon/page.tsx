'use client'

import TokenInfo from '@/components/TokenInfo'
import NetworkSelector from '@/components/NetworkSelector'
import CCTBaseSepoliatoSaigonTestnet from '@/components/CCTBaseSepoliatoSaigonTestnet'
import CCIPDetails from '@/components/CCIPDetails'

export default function CCTPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Base Sepolia to Saigon Transfer</h1>
        <NetworkSelector />
        <TokenInfo />
        <CCTBaseSepoliatoSaigonTestnet />
        <CCIPDetails />
      </div>
    </main>
  )
} 