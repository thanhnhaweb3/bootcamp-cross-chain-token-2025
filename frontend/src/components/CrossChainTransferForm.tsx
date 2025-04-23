'use client'

import { useState } from 'react'
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  useChainId
} from 'wagmi'
import { parseEther, encodeAbiParameters } from 'viem'
import {
  MYTOKEN_ABI,
  ROUTER_ABI,
  BASE_SEPOLIA_TOKEN_ADDRESS,
  BASE_SEPOLIA_ROUTER_ADDRESS,
  SAIGON_TOKEN_ADDRESS,
  CHAIN_SELECTORS
} from '@/constants/contract'

export function CrossChainTransferForm() {
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState<string>('')
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const chainId = useChainId()

  // Check token allowance
  const { data: allowance } = useReadContract({
    address: BASE_SEPOLIA_TOKEN_ADDRESS,
    abi: MYTOKEN_ABI,
    functionName: 'allowance',
    args: [address, BASE_SEPOLIA_ROUTER_ADDRESS],
    query: {
      enabled: Boolean(address) && chainId === 84532,
    },
  })

  // For approving tokens
  const { 
    data: approvalHash, 
    writeContractAsync: approveTokens,
    isPending: approvalPending
  } = useWriteContract()

  // For transferring tokens
  const { 
    data: transferHash, 
    writeContractAsync: transferTokens,
    isPending: transferPending
  } = useWriteContract()

  // Track the approval transaction
  const { 
    isLoading: isApprovalLoading, 
    isSuccess: isApprovalSuccess 
  } = useWaitForTransactionReceipt({ 
    hash: approvalHash 
  })

  // Track the transfer transaction
  const { 
    isLoading: isTransferLoading, 
    isSuccess: isTransferSuccess 
  } = useWaitForTransactionReceipt({ 
    hash: transferHash 
  })

  const handleTransfer = async () => {
    try {
      setError(null)
      
      if (!isConnected) {
        setError('Please connect your wallet')
        return
      }

      if (!amount || parseFloat(amount) <= 0) {
        setError('Please enter a valid amount')
        return
      }

      if (chainId !== 84532) {
        setError('Please switch to Base Sepolia network')
        return
      }

      const tokenAmount = parseEther(amount)

      // Kiểm tra xem cần phê duyệt không
      if (allowance && BigInt(allowance.toString()) < tokenAmount) {
        setIsApproving(true)
        await approveTokens({
          address: BASE_SEPOLIA_TOKEN_ADDRESS,
          abi: MYTOKEN_ABI,
          functionName: 'approve',
          args: [BASE_SEPOLIA_ROUTER_ADDRESS, tokenAmount],
        })
        
        // Wait for approval transaction to complete
        return
      }
      
      // Sau khi phê duyệt hoặc nếu không cần phê duyệt
      if (!isApproving || isApprovalSuccess) {
        setIsApproving(false)
        
        // Tạo message cho ccipSend
        const extraArgs = encodeAbiParameters(
          [{ type: 'bool' }],
          [true] // isNativeFee = true (thanh toán bằng native token)
        ) as `0x${string}`
        
        const message = {
          receiver: SAIGON_TOKEN_ADDRESS as `0x${string}`,
          data: '0x' as `0x${string}`,
          tokenAmounts: [
            {
              token: BASE_SEPOLIA_TOKEN_ADDRESS as `0x${string}`,
              amount: tokenAmount
            }
          ] as const,
          feeToken: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Zero address cho native token
          extraArgs: extraArgs
        }
        
        // Gọi hàm ccipSend
        await transferTokens({
          address: BASE_SEPOLIA_ROUTER_ADDRESS,
          abi: ROUTER_ABI,
          functionName: 'ccipSend',
          args: [CHAIN_SELECTORS.SAIGON, message],
          value: BigInt(5e15), // 0.005 ETH cho phí, giảm xuống để tránh phí quá cao
        })
      }
    } catch (err) {
      console.error(err)
      setError('Transfer failed. Please try again.')
      setIsApproving(false)
    }
  }

  // Auto-execute transfer after successful approval
  if (isApprovalSuccess && isApproving) {
    handleTransfer()
  }

  return (
    <div className="p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Transfer Token</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">From: Base Sepolia</p>
        <p className="text-sm text-gray-500 mb-4">To: Saigon</p>
        <label className="block text-sm font-medium mb-2" htmlFor="amount">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="0.0"
          disabled={approvalPending || isApprovalLoading || transferPending || isTransferLoading}
        />
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <button
        onClick={handleTransfer}
        disabled={!isConnected || !amount || approvalPending || isApprovalLoading || transferPending || isTransferLoading}
        className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-gray-400"
      >
        {approvalPending || isApprovalLoading
          ? 'Approving...'
          : transferPending || isTransferLoading
          ? 'Transferring...'
          : isApproving
          ? 'Approve Token'
          : 'Transfer'}
      </button>
      
      {isTransferSuccess && transferHash && (
        <div className="mt-4 p-3 bg-green-100 rounded">
          <p className="text-green-700">Transfer successful!</p>
          <a
            href={`https://sepolia.basescan.org/tx/${transferHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View transaction
          </a>
        </div>
      )}
    </div>
  )
} 