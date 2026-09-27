'use client';

import React, { useState } from 'react';
import { UserAccount } from '../../types/user';
import { OFFICIAL_USERS } from '../../data/users';
import { X, Lock, User, ShieldCheck, CheckCircle2, UserCheck, Key, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
  onTriggerToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onTriggerToast,
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('กรุณาระบุชื่อผู้ใช้งานและรหัสผ่าน');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });

      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onTriggerToast('success', 'เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับ ${data.user.name} (${data.user.roleName})`);
        onClose();
      } else {
        setErrorMsg(data.error || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      // Fallback check against OFFICIAL_USERS
      const matched = OFFICIAL_USERS.find(
        u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password.trim()
      );
      if (matched) {
        onLoginSuccess(matched);
        onTriggerToast('success', 'เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับ ${matched.name} (${matched.roleName})`);
        onClose();
      } else {
        setErrorMsg('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (user: UserAccount) => {
    setUsername(user.username);
    setPassword(user.password || '');
    onLoginSuccess(user);
    onTriggerToast('success', 'สลับบัญชีผู้ใช้สำเร็จ', `เข้าใช้งานในฐานะ ${user.name} (${user.roleName})`);
    onClose();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-rose-200">แอดมินหลัก</span>;
      case 'approver':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">ผู้อนุมัติ</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-200">เจ้าหน้าที่พัสดุ</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex-shrink-0 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                🔐 เข้าสู่ระบบ / สลับบัญชีผู้ใช้งาน
              </h2>
              <p className="text-xs text-slate-400">
                ระบบบริหารจัดการและทะเบียนคุมพัสดุ-ครุภัณฑ์ อสป.
              </p>
            </div>
          </div>
          {currentUser && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Active User Card if logged in */}
          {currentUser && (
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-sm border-2 border-blue-400">
                  {currentUser.avatarText}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>{currentUser.name}</span>
                    {getRoleBadge(currentUser.role)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    ชื่อผู้ใช้งาน: <span className="font-mono text-blue-700 font-semibold">{currentUser.username}</span> | {currentUser.department}
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                กำลังใช้งาน
              </span>
            </div>
          )}

          {/* Direct Username / Password Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-blue-600" />
              กรอกชื่อผู้ใช้งานและรหัสผ่านเข้าสู่ระบบ
            </h3>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  ชื่อผู้ใช้งาน (Username) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="เช่น ranida.c"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-medium outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  รหัสผ่าน (Password) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="รหัสผ่าน"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-medium outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-md transition-all text-xs inline-flex items-center gap-1.5"
              >
                <span>เข้าสู่ระบบ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick User Selection List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>เลือกล็อกอินรวดเร็วตามรายชื่อผู้ใช้งานระบบ (4 ท่าน):</span>
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {OFFICIAL_USERS.map(usr => {
                const isActive = currentUser?.username === usr.username;
                return (
                  <div
                    key={usr.id}
                    onClick={() => handleQuickLogin(usr)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isActive
                        ? 'bg-blue-50 border-blue-400 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs border border-slate-600">
                        {usr.avatarText}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{usr.name}</span>
                          {getRoleBadge(usr.role)}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Username: <span className="font-mono text-blue-700 font-bold">{usr.username}</span> | รหัสผ่าน: <span className="font-mono text-slate-700">{usr.password}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-[11px] font-bold transition-all"
                    >
                      เข้าใช้งาน
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
