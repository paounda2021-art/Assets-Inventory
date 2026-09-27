'use client';

import React, { useState } from 'react';
import { UserAccount } from '../../types/user';
import { Bell, User, Box, ShieldCheck, LogIn, ChevronDown, LogOut, UserCheck } from 'lucide-react';

interface HeaderProps {
  onOpenAuditScanner: () => void;
  currentUser?: UserAccount | null;
  onOpenLoginModal: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuditScanner,
  currentUser,
  onOpenLoginModal,
  onLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

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

          {/* User Profile Menu */}
          <div className="relative pl-3 border-l border-slate-800">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold border border-blue-400 shadow-sm">
                    {currentUser.avatarText}
                  </div>
                  <div className="hidden md:block text-left text-xs">
                    <p className="font-bold text-slate-200 flex items-center gap-1">
                      <span>{currentUser.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </p>
                    <p className="text-blue-300 text-[11px] font-semibold">{currentUser.roleName}</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 text-slate-900 text-xs z-50 animate-in fade-in duration-150"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                      <p className="font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-slate-500 text-[11px]">Username: <span className="font-mono text-blue-700 font-bold">{currentUser.username}</span></p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{currentUser.position}</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>🚪 ออกจากระบบ</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
