'use client';

import React, { useState } from 'react';
import { Asset } from '../../types/asset';
import { X, Camera, CheckCircle2, ShieldCheck, MapPin, User, Scan } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onConfirmAudit: (assetId: string, note: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  assets,
  onConfirmAudit,
}) => {
  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null);
  const [auditNote, setAuditNote] = useState<string>('อยู่ในสภาพดี ใช้งานปกติ ณ ตำแหน่งเดิม');
  const [isAudited, setIsAudited] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulateScan = (assetCode: string) => {
    const found = assets.find(a => a.assetCode === assetCode);
    if (found) {
      setScannedAsset(found);
      setIsAudited(false);
    }
  };

  const handleConfirm = () => {
    if (scannedAsset) {
      onConfirmAudit(scannedAsset.id, auditNote);
      setIsAudited(true);
      setTimeout(() => {
        setIsAudited(false);
        setScannedAsset(null);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">📱 Mobile Web QR Audit Scanner</h3>
              <p className="text-[11px] text-slate-400">ระบบสแกนตรวจนับพัสดุประจำปี 2569</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Content */}
        <div className="p-5 space-y-4">
          
          {!scannedAsset ? (
            <div className="space-y-4">
              {/* Simulated Camera Scanner Window */}
              <div className="relative w-full h-64 bg-black rounded-2xl overflow-hidden border-2 border-slate-700 flex flex-col items-center justify-center">
                {/* Target Frame */}
                <div className="relative w-48 h-48 border-2 border-emerald-400/70 rounded-xl flex items-center justify-center">
                  <Scan className="w-12 h-12 text-emerald-400 animate-pulse opacity-60" />
                  <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-[bounce_2s_infinite]" />
                </div>
                <p className="absolute bottom-3 text-xs text-emerald-300 font-mono bg-black/60 px-3 py-1 rounded-full">
                  วางป้าย QR Code ในกรอบเพื่อสแกน
                </p>
              </div>

              {/* Quick Simulator Dropdown for Testing */}
              <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  ⚡ จำลองการสแกน QR Code (เลือกครุภัณฑ์ทดสอบ):
                </label>
                <select
                  onChange={(e) => handleSimulateScan(e.target.value)}
                  defaultValue=""
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="" disabled>-- เลือกเพื่อจำลองการสแกน --</option>
                  {assets.map(a => (
                    <option key={a.id} value={a.assetCode}>
                      {a.assetCode} - {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            /* Scanned Asset Result & Instant Confirmation */
            <div className="space-y-4 text-xs animate-in fade-in slide-in-from-bottom duration-200">
              {isAudited ? (
                <div className="p-8 text-center space-y-3 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-emerald-200">บันทึกการตรวจพบพัสดุเรียบร้อย!</h4>
                  <p className="text-slate-300">รหัส {scannedAsset.assetCode} ได้รับการอัปเดต Audit Log แล้ว</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <span className="font-mono font-bold text-blue-400 text-sm">{scannedAsset.assetCode}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        🟢 ใช้งานปกติ
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-100 text-sm">{scannedAsset.name}</h4>
                      <p className="text-slate-400 text-[11px]">{scannedAsset.spec}</p>
                    </div>

                    <div className="space-y-1.5 text-slate-300 pt-2 border-t border-slate-700/60">
                      <div className="flex items-center space-x-2">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        <span>ผู้ถือครอง: {scannedAsset.custodian}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>สถานที่: {scannedAsset.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      บันทึกผลการตรวจนับ:
                    </label>
                    <input
                      type="text"
                      value={auditNote}
                      onChange={(e) => setAuditNote(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => setScannedAsset(null)}
                      className="w-1/3 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                    >
                      สแกนใหม่
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-900/50"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>ยืนยันการตรวจพบพัสดุ</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
