'use client';

import React from 'react';
import { Asset, SupplyItem } from '../../types/asset';
import { 
  DollarSign, 
  Package, 
  AlertTriangle, 
  Wrench, 
  ShieldCheck, 
  TrendingUp, 
  Building2,
  Clock
} from 'lucide-react';

interface DashboardOverviewProps {
  assets: Asset[];
  supplies: SupplyItem[];
  onNavigateTab: (tab: any) => void;
  onOpenAuditScanner: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  assets,
  supplies,
  onNavigateTab,
  onOpenAuditScanner
}) => {
  const totalPurchaseVal = assets.reduce((sum, a) => sum + (Number(a.purchasePrice) || 0), 0);
  const totalBookVal = assets.reduce((sum, a) => sum + (Number(a.currentBookValue) || 0), 0);
  const activeCount = assets.filter(a => a.status === 'active').length;
  const repairCount = assets.filter(a => a.status === 'repair').length;
  const damagedCount = assets.filter(a => a.status === 'damaged').length;

  const lowStockSupplies = supplies.filter(s => s.currentStock <= s.minStock);

  // Dynamic Annual Audit statistics calculated from real asset history
  const auditedCount = assets.filter(a => a.history && a.history.some(h => h.type === 'audit')).length;
  const totalAssetsCount = assets.length;
  const auditPercent = totalAssetsCount > 0 ? Math.round((auditedCount / totalAssetsCount) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-[15px] font-bold px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full">
            ปีงบประมาณ 2569
          </span>
          <h2 className="text-2xl font-extrabold text-white">
            ภาพรวมระบบบริหารพัสดุ สินทรัพย์ และคลังวัสดุองค์กร
          </h2>
          <p className="text-slate-300 text-[15px] max-w-2xl">
            ติดตามมูลค่าสินทรัพย์ สถิติการตรวจนับ รายการส่งซ่อม และควบคุมสต็อกวัสดุสิ้นเปลืองได้แบบ Real-time
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: ราคาทุนสินทรัพย์รวม */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-slate-500">ราคาทุนสินทรัพย์รวม</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-[20px] font-extrabold text-slate-900">
              ฿{totalPurchaseVal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[15px] text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" /> ครอบคลุม {totalAssetsCount.toLocaleString()} รายการสินทรัพย์
            </p>
          </div>
        </div>

        {/* Card 2: มูลค่าสุทธิทางบัญชี */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-slate-500">มูลค่าสุทธิทางบัญชี (Book Value)</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-[20px] font-extrabold text-indigo-700">
              ฿{totalBookVal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[15px] text-slate-400 mt-1">หักค่าเสื่อมราคาแล้ว</p>
          </div>
        </div>

        {/* Card 3: จำนวนครุภัณฑ์ทั้งหมด */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-slate-500">จำนวนครุภัณฑ์ทั้งหมด</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-[20px] font-extrabold text-slate-900">
              {totalAssetsCount.toLocaleString()} <span className="text-[15px] font-normal text-slate-500">รายการ</span>
            </div>
            <p className="text-[15px] text-emerald-600 mt-1">
              ใช้งานปกติ {activeCount.toLocaleString()} รายการ
            </p>
          </div>
        </div>

        {/* Card 4: รายการส่งซ่อม / ชำรุด */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-slate-500">รายการส่งซ่อม / ชำรุด</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-[20px] font-extrabold text-rose-600">
              {(repairCount + damagedCount).toLocaleString()} <span className="text-[15px] font-normal text-slate-500">รายการ</span>
            </div>
            <p className="text-[15px] text-rose-500 mt-1">
              ส่งซ่อม {repairCount.toLocaleString()} | ชำรุดรอจำหน่าย {damagedCount.toLocaleString()}
            </p>
          </div>
        </div>

      </div>

      {/* Two Column Grid for Alerts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Low Stock & Maintenance Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-[15px] font-bold text-slate-800 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>🔔 การแจ้งเตือนที่ต้องดำเนินการ (Alerts)</span>
            </h3>
            <button 
              onClick={() => onNavigateTab('supplies')}
              className="text-[15px] text-blue-600 font-semibold hover:underline"
            >
              ดูทั้งหมด
            </button>
          </div>

          <div className="space-y-3 text-[15px]">
            {lowStockSupplies.map(sup => (
              <div key={sup.id} className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-900 text-[15px]">{sup.name}</div>
                  <div className="text-slate-500 text-[15px]">รหัส: {sup.code} | จุดสั่งซื้อ Min: {sup.minStock} {sup.unit}</div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-amber-200 text-amber-900 font-bold rounded-lg text-[15px]">
                    เหลือ {sup.currentStock} {sup.unit}
                  </span>
                </div>
              </div>
            ))}

            {assets.filter(a => a.status === 'repair').map(ast => (
              <div key={ast.id} className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-blue-900 text-[15px]">{ast.name} ({ast.assetCode})</div>
                  <div className="text-slate-500 text-[15px]">ส่งซ่อมศูนย์บริการ HP อยู่ระหว่างดำเนินการ</div>
                </div>
                <button 
                  onClick={() => onNavigateTab('maintenance')}
                  className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg text-[15px]"
                >
                  ติดตามซ่อม
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Audit & Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-[15px] font-bold text-slate-800 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>📋 การตรวจนับพัสดุประจำปี (Annual Audit)</span>
            </h3>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-[15px]">
              <span className="font-bold text-emerald-900">ความคืบหน้าการตรวจนับปี 2569:</span>
              <span className="font-bold text-emerald-700 text-[20px]">
                {auditPercent}% ({auditedCount.toLocaleString()} / {totalAssetsCount.toLocaleString()} ชิ้น)
              </span>
            </div>
            
            <div className="w-full bg-emerald-200 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, auditPercent)}%` }} 
              />
            </div>

            <p className="text-[15px] text-emerald-800">
              กรรมการตรวจนับสามารถสแกนสติกเกอร์ QR Code บนตัวเครื่องผ่านมือถือเพื่อยืนยันพัสดุได้ทันที
            </p>

            <button
              onClick={onOpenAuditScanner}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[15px] font-bold rounded-xl shadow-md shadow-emerald-900/30 transition-all flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>📱 เปิดระบบสแกน Mobile QR Code Audit Scanner</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
