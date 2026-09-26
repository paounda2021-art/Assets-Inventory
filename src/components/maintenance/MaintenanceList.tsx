'use client';

import React from 'react';
import { MaintenanceRecord } from '../../types/asset';
import { Wrench, Plus, Clock, CheckCircle2 } from 'lucide-react';

interface MaintenanceListProps {
  records: MaintenanceRecord[];
}

export const MaintenanceList: React.FC<MaintenanceListProps> = ({ records }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-amber-600" />
            <span>4. ซ่อมบำรุงและประวัติการดูแล (Maintenance & Service)</span>
          </h2>
          <p className="text-xs text-slate-500">ติดตามรายการแจ้งซ่อม ครุภัณฑ์ประกัน และประวัติการซ่อมบำรุงรักษา</p>
        </div>

        <button 
          onClick={() => alert('เปิดแบบฟอร์มแจ้งซ่อมใหม่')}
          className="flex items-center space-x-1 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>แจ้งซ่อมใหม่</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-800 uppercase text-[11px] font-bold border-b border-slate-200">
            <tr>
              <th className="p-3">รหัสครุภัณฑ์</th>
              <th className="p-3">ชื่อรายการครุภัณฑ์</th>
              <th className="p-3">วันที่แจ้งซ่อม</th>
              <th className="p-3">อาการชำรุด / รายละเอียด</th>
              <th className="p-3">ผู้แจ้ง</th>
              <th className="p-3 text-center">สถานะการซ่อม</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {records.map((rec) => (
              <tr key={rec.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-bold text-blue-700">{rec.assetCode}</td>
                <td className="p-3 font-semibold text-slate-800">{rec.assetName}</td>
                <td className="p-3 text-slate-500 font-mono">{rec.requestDate}</td>
                <td className="p-3 text-slate-600">{rec.issue}</td>
                <td className="p-3 text-slate-700 font-medium">{rec.reporter}</td>
                <td className="p-3 text-center">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full font-bold text-[11px] inline-flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>กำลังส่งซ่อม</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
