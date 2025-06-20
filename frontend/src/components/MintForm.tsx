'use client'

import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import abi from '@/abi/MyToken.json'

const contractAddress = '<MYTOKEN_CONTRACT_ADDRESS>'

export default function MintForm() {
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')

  const { writeContract } = useWriteContract()

  const handleMint = () => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'mint',
      args: [to, BigInt(amount || '0')],
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mint Tokens</h2>
      <div className="flex flex-col space-y-4">
        <div>
          <label htmlFor="toAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Address
          </label>
          <input
            id="toAddress"
            type="text"
            placeholder="0x..."
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount to Mint
          </label>
          <input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleMint}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:from-blue-700 hover:to-indigo-700 transition duration-200"
        >
          Mint Tokens
        </button>
      </div>
    </div>
  )
}
