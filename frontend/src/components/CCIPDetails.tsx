'use client'

import { useState } from 'react'
import { formatEther } from 'viem'
import { BASE_SEPOLIA_TOKEN_ADDRESS, SAIGON_TOKEN_ADDRESS } from '@/constants/contract'

export default function CCIPDetails() {
  const [expanded, setExpanded] = useState(false)
  
  // Prepare common CCIP parameters for display
  const baseToSaigonParams = {
    payableAmount: formatEther(BigInt(1e15)) + " ETH",
    destinationChainSelector: "13116810400804392105", // Exact value for Saigon
    message: {
      receiver: "Your wallet address on destination chain",
      data: "0x (empty)",
      tokenAmounts: [{
        token: BASE_SEPOLIA_TOKEN_ADDRESS,
        amount: "66000000000000000000" // 66 * 10^18
      }],
      feeToken: "0x0000000000000000000000000000000000000000",
      extraArgs: "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001"
    }
  }
  
  const saigonToBaseParams = {
    payableAmount: formatEther(BigInt(1e15)) + " ETH",
    destinationChainSelector: "10344971235874465080", // Exact value for Base Sepolia
    message: {
      receiver: "Your wallet address on destination chain",
      data: "0x (empty)",
      tokenAmounts: [{
        token: SAIGON_TOKEN_ADDRESS,
        amount: "33000000000000000000" // 33 * 10^18
      }],
      feeToken: "0x0000000000000000000000000000000000000000",
      extraArgs: "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">CCIP Parameters Details</h2>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          {expanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      {expanded && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-3">Base Sepolia to Saigon</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-gray-700 align-top">payableAmount</td>
                    <td className="py-2 pl-4 text-gray-900">{baseToSaigonParams.payableAmount}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-gray-700 align-top">destinationChainSelector</td>
                    <td className="py-2 pl-4 text-gray-900">{baseToSaigonParams.destinationChainSelector}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-gray-700 align-top">message.receiver</td>
                    <td className="py-2 pl-4 text-gray-900">{baseToSaigonParams.message.receiver}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-gray-700 align-top">message.data</td>
                    <td className="py-2 pl-4 text-gray-900">{baseToSaigonParams.message.data}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-gray-700 align-top">message.tokenAmounts</td>
                    <td className="py-2 pl-4 text-gray-900">
                      <div>
                        <div><span className="font-medium">token:</span> {baseToSaigonParams.message.tokenAmounts[0].token}</div>
                        <div><span className="font-medium">amount:</span> {baseToSaigonParams.message.tokenAmounts[0].amount}</div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-gray-700 align-top">message.feeToken</td>
                    <td className="py-2 pl-4 text-gray-900">{baseToSaigonParams.message.feeToken}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-gray-700 align-top">message.extraArgs</td>
                    <td className="py-2 pl-4 text-gray-900 break-all">{baseToSaigonParams.message.extraArgs}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-3">Saigon to Base Sepolia</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-gray-700 align-top">payableAmount</td>
                    <td className="py-2 pl-4 text-gray-900">{saigonToBaseParams.payableAmount}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-gray-700 align-top">destinationChainSelector</td>
                    <td className="py-2 pl-4 text-gray-900">{saigonToBaseParams.destinationChainSelector}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-gray-700 align-top">message.receiver</td>
                    <td className="py-2 pl-4 text-gray-900">{saigonToBaseParams.message.receiver}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-gray-700 align-top">message.data</td>
                    <td className="py-2 pl-4 text-gray-900">{saigonToBaseParams.message.data}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-gray-700 align-top">message.tokenAmounts</td>
                    <td className="py-2 pl-4 text-gray-900">
                      <div>
                        <div><span className="font-medium">token:</span> {saigonToBaseParams.message.tokenAmounts[0].token}</div>
                        <div><span className="font-medium">amount:</span> {saigonToBaseParams.message.tokenAmounts[0].amount}</div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-gray-700 align-top">message.feeToken</td>
                    <td className="py-2 pl-4 text-gray-900">{saigonToBaseParams.message.feeToken}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-gray-700 align-top">message.extraArgs</td>
                    <td className="py-2 pl-4 text-gray-900 break-all">{saigonToBaseParams.message.extraArgs}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">CCIP Send Function Signature</h3>
            <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto text-xs">
              {`function ccipSend(
  uint64 destinationChainSelector,
  struct Client.EVM2AnyMessage message
) external payable returns (bytes32);

struct EVM2AnyMessage {
  bytes receiver;         // Bytes-encoded recipient address
  bytes data;             // Data payload
  EVMTokenAmount[] tokenAmounts; // Tokens to transfer
  address feeToken;       // Token used for paying fees (0x0 for native)
  bytes extraArgs;        // Additional arguments
}

struct EVMTokenAmount {
  address token;          // Token contract address
  uint256 amount;         // Amount of tokens
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
} 