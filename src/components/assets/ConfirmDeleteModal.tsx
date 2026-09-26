'use client';

import React from 'react';
import { Asset } from '../../types/asset';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  asset: Asset | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  asset,
  onClose,
  onConfirm,
}) => {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-rose-900 text-white p-4 flex items-center justify-between border-b border-rose-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-rose-700 flex items-center justify-center text-white">
              <Trash2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">🗑️ ยืนยันการลบรายการครุภัณฑ์</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-rose-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-rose-900">
            <div className="font-semibold flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>คำเตือน: การทำรายการลบไม่สามารถเลิกทำ (Undo) ได้</span>
            </div>
            <p className="text-[11px] text-rose-700">รายการนี้จะถูกลบออกจากระบบทะเบียนครุภัณฑ์ถาวร</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <div className="text-slate-500 font-medium">รหัสครุภัณฑ์: <strong className="font-mono text-blue-700">{asset.assetCode}</strong></div>
            <div className="font-bold text-slate-900 text-sm">{asset.name}</div>
            <div className="text-[11px] text-slate-500">หน่วยงาน: {asset.department} ({asset.location})</div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => {
              onConfirm(asset.id);
              onClose();
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30"
          >
            <Trash2 className="w-4 h-4" />
            <span>ยืนยันการลบรายการ</span>
          </button>
        </div>

      </div>
    </div>
  );
};
