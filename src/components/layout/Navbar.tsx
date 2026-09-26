'use client';

import React from 'react';
import { 
  BarChart3, 
  PackageCheck, 
  Repeat, 
  Wrench, 
  ClipboardCheck, 
  Settings,
  Boxes
} from 'lucide-react';

export type TabType = 'dashboard' | 'assets' | 'supplies' | 'transactions' | 'maintenance' | 'audit' | 'settings';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard' as TabType, label: '1. หน้าภาพรวม', icon: BarChart3, badge: null },
    { id: 'assets' as TabType, label: '2. ทะเบียนครุภัณฑ์', icon: PackageCheck, badge: 'หลัก' },
    { id: 'supplies' as TabType, label: '2.3 วัสดุสิ้นเปลือง', icon: Boxes, badge: 'คลัง' },
    { id: 'transactions' as TabType, label: '3. เบิก-โอนย้าย', icon: Repeat, badge: null },
    { id: 'maintenance' as TabType, label: '4. ซ่อมบำรุง', icon: Wrench, badge: '1' },
    { id: 'audit' as TabType, label: '5. ตรวจนับ/จำหน่าย', icon: ClipboardCheck, badge: null },
    { id: 'settings' as TabType, label: '6. ตั้งค่าระบบ', icon: Settings, badge: null },
  ];

  return (
    <nav className="bg-slate-800 text-slate-300 border-b border-slate-700 shadow-sm sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-semibold'
                    : 'hover:bg-slate-700 hover:text-white text-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      isActive
                        ? 'bg-blue-800 text-blue-100'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
