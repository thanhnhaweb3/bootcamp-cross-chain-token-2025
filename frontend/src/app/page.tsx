'use client'

import TokenInfo from '@/components/TokenInfo'
import MintForm from '@/components/MintForm'
import TransferForm from '@/components/TransferForm'
import GrantRoleForm from '@/components/GrantRoleForm'
import { CrossChainTransferForm } from '@/components/CrossChainTransferForm'
import NetworkSelector from '@/components/NetworkSelector'

export default function Page() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Cross-Chain Token Transfer</h1>
        <NetworkSelector />
        <TokenInfo />
        <CrossChainTransferForm />
        <MintForm />
        <TransferForm />
        <GrantRoleForm />
      </div>
    </main>
  )
}
