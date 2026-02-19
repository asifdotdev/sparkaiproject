'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Wrench,
  FolderOpen,
  Calendar,
  Star,
  CreditCard,
  UserCheck,
  LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/users', label: 'Users', icon: Users },
  { href: '/dashboard/providers', label: 'Providers', icon: UserCheck },
  { href: '/dashboard/categories', label: 'Categories', icon: FolderOpen },
  { href: '/dashboard/services', label: 'Services', icon: Wrench },
  { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
  { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/payments', label: 'Payments', icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-lg">⚡</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">SparkAI</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white w-full rounded-lg hover:bg-gray-800 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
