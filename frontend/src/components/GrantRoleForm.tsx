'use client'

import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import abi from '@/abi/MyToken.json'

const contractAddress = '<MYTOKEN_CONTRACT_ADDRESS>'

export default function GrantRoleForm() {
  const [addressToGrant, setAddressToGrant] = useState('')

  const { writeContract } = useWriteContract()

  const handleGrantRole = () => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'grantMintAndBurnRoles',
      args: [addressToGrant],
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Grant Mint & Burn Roles</h2>
      <div className="flex flex-col space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address to Grant Role
          </label>
          <input
            id="address"
            type="text"
            placeholder="0x..."
            value={addressToGrant}
            onChange={(e) => setAddressToGrant(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleGrantRole}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:from-purple-700 hover:to-blue-700 transition duration-200"
        >
          Grant Role
        </button>
      </div>
    </div>
  )
}
