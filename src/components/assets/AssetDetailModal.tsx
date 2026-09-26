'use client';

import React from 'react';
import { Asset } from '../../types/asset';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  Printer, 
  Wrench, 
  RefreshCw, 
  QrCode, 
  Calendar, 
  ShieldCheck, 
  MapPin, 
  User, 
  FileText,
  DollarSign,
  History
} from 'lucide-react';

interface AssetDetailModalProps {
  asset: Asset | null;
  onClose: () => void;
  onOpenQRPrintModal: (assets: Asset[]) => void;
  onOpenMaintenanceModal?: (asset: Asset) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onOpenQRPrintModal,
}) => {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
              🔖
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center space-x-2">
                <span>ข้อมูลครุภัณฑ์:</span>
                <span className="font-mono text-blue-300">{asset.assetCode}</span>
                <span className="text-slate-300">({asset.name})</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenQRPrintModal([asset])}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>🖨️ พิมพ์การ์ด / QR Code</span>
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Top Asset Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Asset Image & QR Code Preview */}
            <div className="space-y-3 text-center">
              <div className="w-full h-40 bg-slate-200 rounded-lg overflow-hidden relative border border-slate-300">
                {asset.imageUrl ? (
                  <img src={asset.imageUrl} alt={asset.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    ไม่มีรูปถ่าย
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center p-2 bg-white rounded-lg border border-slate-200 shadow-sm space-x-3">
                <QRCodeSVG value={`ASSET:${asset.assetCode}`} size={56} />
                <div className="text-left font-mono">
                  <p className="text-[10px] text-slate-400">QR Sticker Preview</p>
                  <p className="font-bold text-slate-800 text-[11px]">{asset.assetCode}</p>
                </div>
              </div>
            </div>

            {/* Asset Details Info */}
            <div className="md:col-span-3 space-y-3">
              
              {/* Status Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{asset.name}</h4>
                  <p className="text-slate-500">{asset.spec}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-medium">สถานะปัจจุบัน:</span>
                  {asset.status === 'active' && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold">
                      🟢 ใช้งานปกติ
                    </span>
                  )}
                  {asset.status === 'repair' && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full font-bold">
                      🟡 อยู่ระหว่างส่งซ่อม
                    </span>
                  )}
                  {asset.status === 'damaged' && (
                    <span className="px-3 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded-full font-bold">
                      🔴 ชำรุดรอจำหน่าย
                    </span>
                  )}
                </div>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-slate-700">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span><strong>ผู้ถือครอง:</strong> {asset.custodian} ({asset.department})</span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span><strong>สถานที่ตั้ง:</strong> {asset.location}</span>
                </div>

                <div className="flex items-center space-x-2 font-mono">
                  <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span><strong>S/N:</strong> {asset.serialNumber}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>ระยะเวลารับประกัน:</strong> {asset.warrantyStart} - {asset.warrantyEnd}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span><strong>ราคาทุน:</strong> {asset.purchasePrice.toLocaleString()} บาท</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span><strong>มูลค่าบัญชีปัจจุบัน:</strong> <span className="font-bold text-blue-700">{asset.currentBookValue.toLocaleString()} บาท</span></span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-2">
                <button 
                  onClick={() => onOpenQRPrintModal([asset])}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-semibold"
                >
                  <QrCode className="w-4 h-4" />
                  <span>📱 ดาวน์โหลด QR Code สติกเกอร์</span>
                </button>

                <button 
                  onClick={() => alert(`ส่งเรื่องแจ้งซ่อมครุภัณฑ์ ${asset.assetCode}`)}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-semibold"
                >
                  <Wrench className="w-4 h-4" />
                  <span>🛠️ แจ้งซ่อม</span>
                </button>

                <button 
                  onClick={() => alert(`ทำเรื่องส่งมอบ/โอนย้ายครุภัณฑ์ ${asset.assetCode}`)}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 font-semibold"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>🔄 ส่งมอบ/โอนย้าย</span>
                </button>
              </div>

            </div>

          </div>

          {/* Asset Audit Trail Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <History className="w-4 h-4 text-blue-600" />
                <span>ไทม์ไลน์และประวัติการเคลื่อนไหว (Asset Audit Trail)</span>
              </h4>
              <span className="text-slate-400 text-[11px]">{asset.history.length} รายการประวัติ</span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {asset.history.map((item) => (
                <div key={item.id} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-1 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center space-x-2">
                        <span>{item.title}</span>
                        {item.statusBadge && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border">
                            {item.statusBadge}
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{item.date}</span>
                    </div>

                    <p className="text-slate-600">{item.detail}</p>
                    
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>ดำเนินการโดย: <strong className="text-slate-700">{item.by}</strong></span>
                      {item.documentNo && (
                        <span className="font-mono text-blue-600 font-medium">
                          เอกสาร: {item.documentNo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
