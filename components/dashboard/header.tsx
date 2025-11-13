/**
 * Dashboard Header Component
 * 
 * Displays the main header with:
 * - Application title and logo
 * - Navigation menu
 * - User profile and settings
 */

import { Package, AlertCircle, TrendingUp, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DashboardHeader() {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Delivery ETA Predictor
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              AI-Powered Supply Chain Intelligence
            </p>
          </div>
        </div>

        {/* Navigation and Actions */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Alerts</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </a>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 dark:text-slate-300"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
