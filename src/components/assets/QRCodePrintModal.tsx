'use client';

import React from 'react';
import { Asset } from '../../types/asset';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer } from 'lucide-react';

interface QRCodePrintModalProps {
  assets: Asset[];
  onClose: () => void;
}

export const QRCodePrintModal: React.FC<QRCodePrintModalProps> = ({
  assets,
  onClose,
}) => {
  if (assets.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base">🖨️ พิมพ์ป้ายบาร์โค้ด / สติกเกอร์ QR Code ({assets.length} รายการ)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Area */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto print:max-h-none print:p-0">
          <p className="text-xs text-slate-500 print:hidden">
            ตัวอย่างสติกเกอร์ที่พร้อมสำหรับเครื่องพิมพ์สติกเกอร์ (Thermal / Label Printer 7x3 cm)
          </p>

          <div className="printable-qr-area grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2">
            {assets.map((asset) => (
              <div 
                key={asset.id} 
                className="qr-sticker-card bg-white border-2 border-slate-800 rounded-lg p-3 flex space-x-3 items-center shadow-sm print:border-black print:shadow-none"
              >
                <div className="flex-shrink-0 bg-slate-50 p-1 border border-slate-200 rounded">
                  <QRCodeSVG value={`ASSET:${asset.assetCode}`} size={80} />
                </div>

                <div className="text-[11px] leading-tight space-y-1 overflow-hidden font-sans">
                  <div className="font-bold text-slate-900 text-xs truncate">
                    {asset.department || 'สำนักงานเทคโนโลยีสารสนเทศ'}
                  </div>
                  <div className="font-mono font-bold text-blue-700 text-sm print:text-black">
                    {asset.assetCode}
                  </div>
                  <div className="font-semibold text-slate-800 truncate">
                    {asset.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">
                    S/N: {asset.serialNumber}
                  </div>
                  <div className="text-[10px] text-slate-600 truncate">
                    {asset.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-end space-x-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
          >
            ปิดหน้าต่าง
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/30"
          >
            <Printer className="w-4 h-4" />
            <span>เริ่มสั่งพิมพ์ (Print Labels)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
