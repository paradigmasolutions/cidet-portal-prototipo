import { Bell, User, LogOut } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 402 88" className="h-8 w-auto" fill="#03D0FF">
              <path d="M97.2,1.2h21v73.6h-21V1.2z M34.1,57.5c-2.3-0.5-4.3-1.5-6-2.9c-1.8-1.5-3.1-3.5-4.2-6.2c-1-2.6-1.5-6.1-1.5-10.3c0-4.1,0.5-7.6,1.5-10.3c1-2.7,2.4-4.8,4.2-6.2c1.7-1.5,3.7-2.5,6-3c2.3-0.5,4.6-0.8,7.1-0.8h33.6c1.7,0,2.8-0.2,3.4-0.6c0.6-0.4,1.3-1.3,2.2-2.9l6.3-13H39.2c-6.6,0-12.3,0.9-17.1,2.7c-4.8,1.8-8.7,4.2-11.9,7.4c-3.1,3.2-5.4,7.1-7,11.6C1.8,27.5,1,32.5,1,38c0,5.5,0.8,10.5,2.3,15.1c1.5,4.6,3.9,8.5,7,11.6c3.1,3.2,7.1,5.7,11.9,7.4c4.8,1.8,10.5,2.7,17.1,2.7h37.3c1.7,0,2.8-0.2,3.4-0.5c0.6-0.4,1.3-1.4,2.2-2.9l6.3-13.2H41.2C38.7,58.2,36.3,57.9,34.1,57.5"/>
            </svg>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">Portal de Clientes</h1>
              <p className="text-xs text-gray-500">Gestión de Certificaciones</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-cidet-cyan font-medium text-sm border-b-2 border-cidet-cyan pb-1">
              Resumen
            </a>
            <a href="#" className="text-gray-600 hover:text-cidet-cyan text-sm transition-colors">
              Detalle
            </a>
            <a href="#" className="text-gray-600 hover:text-cidet-cyan text-sm transition-colors">
              Trazabilidad
            </a>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-cidet-cyan transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">SIGNIFY COLOMBIANA</p>
                <p className="text-xs text-gray-500">cliente@signify.com</p>
              </div>
              <div className="w-10 h-10 bg-cidet-cyan/10 rounded-full flex items-center justify-center">
                <User size={20} className="text-cidet-cyan" />
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
