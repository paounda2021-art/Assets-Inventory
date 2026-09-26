'use client';

import React from 'react';
import { Bell, User, Box, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenAuditScanner: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuditScanner }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & System Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-blue-500/30">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-tight text-slate-100 flex items-center space-x-2">
              <span>ระบบบริหารจัดการและทะเบียนคุมพัสดุ-ครุภัณฑ์</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                v2.5 Enterprise
              </span>
            </h1>
            <p className="text-xs text-slate-400">Fixed Asset & Inventory Management System</p>
          </div>
        </div>

        {/* User Actions & Quick QR Audit Scanner */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenAuditScanner}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all shadow-md shadow-emerald-900/40"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">📱 สแกนตรวจนับ (Mobile QR)</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold border border-blue-400">
              รณ
            </div>
            <div className="hidden md:block text-left text-xs">
              <p className="font-medium text-slate-200">น.ส.รณิดา โชติธนาอุดม</p>
              <p className="text-slate-400 text-[11px]">นักพัฒนาระบบ (สำนักไอที)</p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
