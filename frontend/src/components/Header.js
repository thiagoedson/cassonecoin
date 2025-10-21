import Link from 'next/link';
import ConnectWallet from './ConnectWallet';

export default function Header({ onWalletConnect }) {
  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="text-3xl">🪙</div>
            <div>
              <h1 className="text-2xl font-bold text-white">CassoneCoin</h1>
              <p className="text-xs text-slate-400">Dashboard de Gerenciamento</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/mint" className="text-slate-300 hover:text-white transition-colors">
              Mintar
            </Link>
            <Link href="/transfer" className="text-slate-300 hover:text-white transition-colors">
              Transferir
            </Link>
            <Link href="/burn" className="text-slate-300 hover:text-white transition-colors">
              Queimar
            </Link>
            <Link href="/admin" className="text-slate-300 hover:text-white transition-colors">
              Admin
            </Link>
          </nav>

          <ConnectWallet onConnect={onWalletConnect} />
        </div>

        {/* Menu mobile */}
        <nav className="md:hidden flex gap-4 mt-4 overflow-x-auto pb-2">
          <Link href="/" className="text-sm text-slate-300 hover:text-white whitespace-nowrap">
            Dashboard
          </Link>
          <Link href="/mint" className="text-sm text-slate-300 hover:text-white whitespace-nowrap">
            Mintar
          </Link>
          <Link href="/transfer" className="text-sm text-slate-300 hover:text-white whitespace-nowrap">
            Transferir
          </Link>
          <Link href="/burn" className="text-sm text-slate-300 hover:text-white whitespace-nowrap">
            Queimar
          </Link>
          <Link href="/admin" className="text-sm text-slate-300 hover:text-white whitespace-nowrap">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
