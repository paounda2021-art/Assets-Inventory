'use client';

import React, { useState } from 'react';
import { SupplyItem } from '../../types/asset';
import { Boxes, Plus, AlertCircle, ShoppingCart, ArrowDownLeft } from 'lucide-react';

interface SuppliesListProps {
  supplies: SupplyItem[];
  onDisburse: (id: string, qty: number) => void;
  onTriggerToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}

export const SuppliesList: React.FC<SuppliesListProps> = ({ supplies, onDisburse, onTriggerToast }) => {
  const [selectedSupply, setSelectedSupply] = useState<SupplyItem | null>(null);
  const [disburseQty, setDisburseQty] = useState<number>(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            <span>2.3 ทะเบียนวัสดุสิ้นเปลือง / พัสดุคงคลัง (Office Supplies & Inventory)</span>
          </h2>
          <p className="text-xs text-slate-500">จัดการคลังวัสดุสิ้นเปลือง ควบคุมจุดสั่งซื้อ (Reorder Level) และบันทึกการเบิกจ่าย</p>
        </div>

        <button 
          onClick={() => onTriggerToast('info', 'เพิ่มวัสดุใหม่', 'เปิดแบบฟอร์มเพิ่มรายการวัสดุสิ้นเปลือง')}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มวัสดุใหม่</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-800 uppercase text-[11px] font-bold border-b border-slate-200">
            <tr>
              <th className="p-3">รหัสวัสดุ</th>
              <th className="p-3">รายการวัสดุสิ้นเปลือง</th>
              <th className="p-3">หมวดหมู่</th>
              <th className="p-3 text-center">คงเหลือปัจจุบัน</th>
              <th className="p-3 text-center">จุดสั่งเพิ่ม (Min)</th>
              <th className="p-3 text-right">ราคา/หน่วย</th>
              <th className="p-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {supplies.map((item) => {
              const isLow = item.currentStock <= item.minStock;
              return (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-blue-700">{item.code}</td>
                  <td className="p-3 font-semibold text-slate-800">{item.name}</td>
                  <td className="p-3 text-slate-600">{item.category}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full font-bold ${
                      isLow ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.currentStock} {item.unit}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono text-slate-500">{item.minStock} {item.unit}</td>
                  <td className="p-3 text-right font-medium">฿{item.unitPrice.toFixed(2)}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => { setSelectedSupply(item); setDisburseQty(1); }}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded font-semibold text-[11px] inline-flex items-center space-x-1"
                    >
                      <ArrowDownLeft className="w-3 h-3" />
                      <span>เบิกจ่าย</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Disburse Modal */}
      {selectedSupply && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900">📦 บันทึกเบิกจ่ายวัสดุสิ้นเปลือง</h3>
            <p className="text-xs text-slate-600">รายการ: <strong>{selectedSupply.name}</strong> (คงเหลือ {selectedSupply.currentStock} {selectedSupply.unit})</p>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">จำนวนที่ต้องการเบิก ({selectedSupply.unit}):</label>
              <input 
                type="number" 
                min={1} 
                max={selectedSupply.currentStock} 
                value={disburseQty} 
                onChange={(e) => setDisburseQty(parseInt(e.target.value) || 1)}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm font-bold text-blue-700" 
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setSelectedSupply(null)} className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-semibold">ยกเลิก</button>
              <button 
                onClick={() => {
                  onDisburse(selectedSupply.id, disburseQty);
                  onTriggerToast('success', 'บันทึกเบิกจ่ายสำเร็จ', `เบิกจ่าย ${selectedSupply.name} จำนวน ${disburseQty} ${selectedSupply.unit} เรียบร้อยแล้ว`);
                  setSelectedSupply(null);
                }} 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md"
              >
                ยืนยันการเบิกจ่าย
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
