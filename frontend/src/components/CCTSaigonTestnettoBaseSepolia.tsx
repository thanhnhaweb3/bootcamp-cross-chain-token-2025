'use client'

import { useState, useCallback, useEffect } from 'react'
import { useWriteContract, useAccount, useChainId, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { encodeAbiParameters, formatEther, parseEther, concat } from 'viem'
import { MYTOKEN_ABI, SAIGON_TOKEN_ADDRESS, SAIGON_ROUTER_ADDRESS, CHAIN_SELECTORS, ROUTER_ABI } from '@/constants/contract'

export default function CCTSaigonTestnettoBaseSepolia() {
  // Cố định số lượng token để chuyển
  const fixedAmount = 33;
  const [isApproving, setIsApproving] = useState(false)
  const [error, setError] = useState('')
  const [estimatedFee, setEstimatedFee] = useState<bigint | null>(null)
  const [isEstimatingFee, setIsEstimatingFee] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { address } = useAccount()
  const chainId = useChainId()

  // Reset success status when component remounts or wallet changes
  useEffect(() => {
    setIsSuccess(false)
  }, [address])

  const { data: allowance } = useReadContract({
    address: SAIGON_TOKEN_ADDRESS as `0x${string}`,
    abi: MYTOKEN_ABI,
    functionName: 'allowance',
    args: [address || '0x0000000000000000000000000000000000000000', SAIGON_ROUTER_ADDRESS],
    chainId: 2021, // Saigon
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  }) as { data: bigint | undefined }

  // Kiểm tra token balance
  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    address: SAIGON_TOKEN_ADDRESS as `0x${string}`,
    abi: MYTOKEN_ABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
    chainId: 2021, // Saigon
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  }) as { data: bigint | undefined, refetch: () => void }

  // Lấy thông tin symbol của token
  const { data: tokenSymbolData } = useReadContract({
    address: SAIGON_TOKEN_ADDRESS as `0x${string}`,
    abi: MYTOKEN_ABI,
    functionName: 'symbol',
    chainId: 2021, // Saigon
  })
  
  // Convert unknown type to string
  const tokenSymbol = tokenSymbolData as string || 'BnM2kh'

  const { writeContract: approve, data: approveData } = useWriteContract()
  const { writeContract: transfer, data: transferData } = useWriteContract()
  const { writeContractAsync: estimateFee } = useWriteContract()

  const { isLoading: isApprovingLoading, isSuccess: isApproved } = useWaitForTransactionReceipt({
    hash: approveData,
  })

  const { isLoading: isTransferring, isSuccess: isTransferred } = useWaitForTransactionReceipt({
    hash: transferData,
  })

  // Automatically refresh balance and set success when transfer completes
  useEffect(() => {
    if (isTransferred) {
      refetchBalance()
      setIsSuccess(true)
    }
  }, [isTransferred, refetchBalance])

  // Kiểm tra xem đã approve đủ token chưa
  const hasApprovedTokens = allowance !== undefined && allowance >= BigInt(fixedAmount * 10 ** 18)
  // Kiểm tra xem có đủ token để chuyển không
  const hasEnoughTokens = tokenBalance !== undefined && tokenBalance >= BigInt(fixedAmount * 10 ** 18)

  const createCCIPMessage = useCallback((amountBigInt: bigint) => {
    if (!address) return null;

    // Mã hóa địa chỉ receiver đúng cách theo TransferTokens.s.sol
    // Trong Solidity: receiver: abi.encode(msg.sender)
    const receiverEncoded = encodeAbiParameters(
      [{ type: 'address' }],
      [address as `0x${string}`]
    );

    // ExtraArgs được mã hóa đúng cách theo TransferTokens.s.sol
    // bytes4(keccak256("CCIP EVMExtraArgsV1")) + abi.encode(uint256(0))
    const CCIP_EVMExtraArgsV1_ID = '0x97a657c9' as `0x${string}`; // bytes4(keccak256("CCIP EVMExtraArgsV1"))
    const extraArgParams = encodeAbiParameters([{ type: 'uint256' }], [BigInt(0)]);
    const extraArgs = concat([
      CCIP_EVMExtraArgsV1_ID,
      extraArgParams as `0x${string}`
    ]) as `0x${string}`;

    const message = {
      receiver: receiverEncoded as `0x${string}`,
      data: '0x' as `0x${string}`,
      tokenAmounts: [{
        token: SAIGON_TOKEN_ADDRESS as `0x${string}`,
        amount: amountBigInt
      }] as const,
      feeToken: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Địa chỉ zero cho native token
      extraArgs: extraArgs
    };

    return message;
  }, [address]);

  // Hàm để ước tính phí giao dịch CCIP
  const calculateFee = useCallback(async () => {
    if (!address || chainId !== 2021) {
      setError(chainId !== 2021 ? 'Please switch to Saigon network' : 'Please connect your wallet');
      return;
    }
    
    try {
      setIsEstimatingFee(true);
      setError('');
      const amountBigInt = BigInt(fixedAmount * 10 ** 18);
      const message = createCCIPMessage(amountBigInt);
      
      if (!message) {
        setError('Failed to create CCIP message');
        return;
      }

      // Gọi getFee để ước tính phí
      const data = await estimateFee({
        address: SAIGON_ROUTER_ADDRESS as `0x${string}`,
        abi: ROUTER_ABI,
        functionName: 'getFee',
        args: [
          CHAIN_SELECTORS.BASE_SEPOLIA,
          message
        ],
      });

      // Xử lý dữ liệu phí trả về
      let feeBigInt: bigint;
      if (typeof data === 'string' && data.startsWith('0x')) {
        // Nếu là chuỗi hex, chuyển đổi thành BigInt
        feeBigInt = BigInt(data);
      } else if (typeof data === 'bigint') {
        feeBigInt = data;
      } else {
        feeBigInt = BigInt(0);
        console.error('Unexpected fee data format:', data);
      }

      setEstimatedFee(feeBigInt);
      console.log('Estimated fee:', formatEther(feeBigInt), 'ETH');
    } catch (err: unknown) {
      console.error('Error estimating fee:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to estimate fee. Please try again.';
      setError(errorMessage);
    } finally {
      setIsEstimatingFee(false);
    }
  }, [address, chainId, estimateFee, fixedAmount, createCCIPMessage]);

  const handleApprove = useCallback(async () => {
    if (!address) {
      setError('Please connect your wallet')
      return
    }

    if (chainId !== 2021) { // Saigon chain ID
      setError('Please switch to Saigon network')
      return
    }

    setError('')
    const amountBigInt = BigInt(fixedAmount * 10 ** 18) // 33 tokens

    try {
      setIsApproving(true)
      approve({
        abi: MYTOKEN_ABI,
        address: SAIGON_TOKEN_ADDRESS as `0x${string}`,
        functionName: 'approve',
        args: [SAIGON_ROUTER_ADDRESS as `0x${string}`, amountBigInt],
      })
    } catch (err: unknown) {
      console.error('Approval error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve tokens. Please try again.';
      setError(errorMessage);
      setIsApproving(false)
    }
  }, [address, chainId, approve, fixedAmount]);

  const handleTransfer = useCallback(async () => {
    if (!address) {
      setError('Please connect your wallet')
      return
    }

    if (chainId !== 2021) { // Saigon chain ID
      setError('Please switch to Saigon network')
      return
    }

    if (!hasApprovedTokens) {
      setError('Please approve tokens first')
      return
    }

    if (!hasEnoughTokens) {
      setError(`Insufficient token balance. You need at least ${fixedAmount} ${tokenSymbol}`)
      return
    }

    setError('')
    setIsSuccess(false)
    const amountBigInt = BigInt(fixedAmount * 10 ** 18) // 33 tokens

    try {
      // Tạo CCIP message đúng cách
      const message = createCCIPMessage(amountBigInt);
      
      if (!message) {
        setError('Failed to create CCIP message');
        return;
      }

      // Nếu đã ước tính phí, sử dụng giá trị đó. Nếu không, dùng giá trị mặc định + buffer
      // Add 20% buffer to estimated fee, or use default if not estimated
      const feeAmount = estimatedFee && typeof estimatedFee === 'bigint'
        ? estimatedFee * BigInt(120) / BigInt(100) 
        : parseEther('1');
      
      console.log("CCIP Send Parameters:", {
        value: formatEther(feeAmount) + " ETH",
        destinationChainSelector: CHAIN_SELECTORS.BASE_SEPOLIA.toString(),
        message: {
          receiver: message.receiver,
          data: message.data,
          tokenAmounts: message.tokenAmounts.map(item => ({
            token: item.token,
            amount: item.amount.toString()
          })),
          feeToken: message.feeToken,
          extraArgs: message.extraArgs
        }
      });

      transfer({
        abi: ROUTER_ABI,
        address: SAIGON_ROUTER_ADDRESS as `0x${string}`,
        functionName: 'ccipSend',
        args: [
          CHAIN_SELECTORS.BASE_SEPOLIA,
          message
        ],
        value: feeAmount
      })
    } catch (err: unknown) {
      console.error('Transfer error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate transfer. Please try again.';
      setError(errorMessage);
    }
  }, [address, chainId, hasApprovedTokens, hasEnoughTokens, transfer, fixedAmount, estimatedFee, createCCIPMessage, tokenSymbol]);

  // Tự động gọi transfer sau khi approval hoàn tất
  useEffect(() => {
    if (isApproved && isApproving) {
      handleTransfer()
      setIsApproving(false) // Reset the flag after transfer is initiated
    }
  }, [isApproved, isApproving, handleTransfer])

  const getExplorerUrl = (hash: `0x${string}`) => {
    return `https://saigon-app.roninchain.com/tx/${hash}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Saigon ➡️ Base Sepolia Transfer</h2>
      <div className="bg-green-50 p-4 rounded-lg mb-4 text-green-800">
        <p className="font-medium">Quick transfer of {fixedAmount} {tokenSymbol} from Saigon to Base Sepolia</p>
        <div className="text-sm mt-1 flex justify-between">
          <span>Token Balance: {tokenBalance ? formatEther(tokenBalance).slice(0, 10) : '0'} {tokenSymbol}</span>
          {estimatedFee && (
            <span>Estimated Fee: {
              // Đảm bảo hiển thị phí dưới dạng ETH với định dạng đúng
              typeof estimatedFee === 'bigint' 
                ? Number(formatEther(estimatedFee)).toFixed(8)
                : '0'
            } ETH</span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={handleApprove}
          disabled={isApprovingLoading || hasApprovedTokens || isTransferring}
          className={`p-3 text-white rounded font-medium ${hasApprovedTokens ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600 disabled:opacity-50'}`}
        >
          {isApprovingLoading ? 'Approving...' : hasApprovedTokens ? 'Approved ✓' : `Approve ${fixedAmount} ${tokenSymbol}`}
        </button>
        
        <button
          onClick={calculateFee}
          disabled={isEstimatingFee || !hasApprovedTokens || isTransferring}
          className="p-3 bg-amber-500 text-white rounded disabled:opacity-50 font-medium hover:bg-amber-600"
        >
          {isEstimatingFee ? 'Calculating...' : 'Estimate Fee'}
        </button>
        
        <button
          onClick={handleTransfer}
          disabled={isTransferring || !hasApprovedTokens || !hasEnoughTokens || isSuccess}
          className="p-3 bg-purple-500 text-white rounded disabled:opacity-50 font-medium hover:bg-purple-600"
        >
          {isTransferring ? 'Transferring...' : isSuccess ? 'Transferred ✓' : `Transfer ${fixedAmount} ${tokenSymbol}`}
        </button>
      </div>
      
      {error && <p className="mt-2 text-red-500">{error}</p>}
      
      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Status</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className={`mr-2 w-3 h-3 rounded-full ${hasEnoughTokens ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{hasEnoughTokens 
              ? `Sufficient balance: ${tokenBalance ? formatEther(tokenBalance).slice(0, 10) : '0'} ${tokenSymbol}` 
              : `Insufficient balance: ${tokenBalance ? formatEther(tokenBalance).slice(0, 10) : '0'} ${tokenSymbol}`}</span>
          </div>
          <div className="flex items-center">
            <div className={`mr-2 w-3 h-3 rounded-full ${hasApprovedTokens ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span>{hasApprovedTokens 
              ? `Approved ${fixedAmount} ${tokenSymbol} for transfer` 
              : `Approval needed for ${fixedAmount} ${tokenSymbol}`}</span>
          </div>
          <div className="flex items-center">
            <div className={`mr-2 w-3 h-3 rounded-full ${estimatedFee ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span>{estimatedFee 
              ? `Fee estimated: ${typeof estimatedFee === 'bigint' 
                ? Number(formatEther(estimatedFee)).toFixed(8) 
                : '0'} ETH` 
              : `Fee not estimated yet`}</span>
          </div>
          <div className="flex items-center">
            <div className={`mr-2 w-3 h-3 rounded-full ${chainId === 2021 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{chainId === 2021 
              ? `Connected to Saigon network` 
              : `Not connected to Saigon network`}</span>
          </div>
        </div>
      </div>
      
      {isApproved && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Approval Transaction</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Network:</span>
              <span className="font-medium">Saigon</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Action:</span>
              <span className="font-medium">Approve Router to spend {fixedAmount} {tokenSymbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction Hash:</span>
              <a 
                href={getExplorerUrl(approveData as `0x${string}`)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-blue-600 hover:text-blue-800 truncate max-w-[200px]"
              >
                {approveData?.slice(0, 10)}...{approveData?.slice(-8)}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-500 font-medium">Approved</span>
            </div>
          </div>
        </div>
      )}
      
      {isTransferred && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">CCIP Transfer Transaction</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">From Network:</span>
              <span className="font-medium">Saigon</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">To Network:</span>
              <span className="font-medium">Base Sepolia</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Token:</span>
              <span className="font-medium">{tokenSymbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">{fixedAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gas Fee:</span>
              <span className="font-medium">{
                estimatedFee && typeof estimatedFee === 'bigint'
                ? Number(formatEther(estimatedFee)).toFixed(8)
                : Number(formatEther(parseEther('0.002'))).toFixed(8)
              } ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction Hash:</span>
              <a 
                href={getExplorerUrl(transferData as `0x${string}`)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-blue-600 hover:text-blue-800 truncate max-w-[200px]"
              >
                {transferData?.slice(0, 10)}...{transferData?.slice(-8)}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-500 font-medium">Cross-chain transfer initiated</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              The tokens should arrive in your wallet on Base Sepolia in a few minutes. Check your balance on the Base Sepolia network.
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 