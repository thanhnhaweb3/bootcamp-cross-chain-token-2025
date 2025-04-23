'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'CCTSgtoBs', path: '/cctsaigon-to-base' },
    { label: 'CCTBtoS', path: '/cctbase-to-saigon' }
  ]

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            CCIPBridge
          </Link>
        </div>

        <div className="hidden md:flex space-x-6 mx-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === item.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center">
          <ConnectButton />
        </div>
      </div>
    </nav>
  )
} 