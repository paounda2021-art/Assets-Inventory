'use client';

import React, { useState } from 'react';
import { MaintenanceRecord, Asset } from '../../types/asset';
import { NewMaintenanceModal } from './NewMaintenanceModal';
import { Wrench, Plus, Clock, CheckCircle2, AlertCircle, XCircle, DollarSign, UserCheck, Search, Filter } from 'lucide-react';

interface MaintenanceListProps {
  records: MaintenanceRecord[];
  assets?: Asset[];
  onAddRecord?: (record: MaintenanceRecord) => void;
  onUpdateStatus?: (id: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => void;
}

export const MaintenanceList: React.FC<MaintenanceListProps> = ({
  records,
  assets = [],
  onAddRecord,
  onUpdateStatus,
}) => {
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRecords = records.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.assetCode.toLowerCase().includes(q) ||
      r.assetName.toLowerCase().includes(q) ||
      r.issue.toLowerCase().includes(q) ||
      r.reporter.toLowerCase().includes(q) ||
      (r.technician && r.technician.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full font-bold text-[11px] inline-flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>🟡 กำลังส่งซ่อม</span>
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-1 bg-orange-100 text-orange-800 border border-orange-300 rounded-full font-bold text-[11px] inline-flex items-center space-x-1">
            <AlertCircle className="w-3 h-3 text-orange-600" />
            <span>🟠 รอดำเนินการ</span>
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-[11px] inline-flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>🟢 ซ่อมเสร็จสิ้น</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded-full font-bold text-[11px] inline-flex items-center space-x-1">
            <XCircle className="w-3 h-3 text-slate-500" />
            <span>⚪ ยกเลิกการซ่อม</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded-full font-bold text-[11px]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-medium flex items-center space-x-1 mb-1">
            <span>หน้าหลัก</span>
            <span>&gt;</span>
            <span className="text-slate-800 font-semibold">ซ่อมบำรุงรักษา</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-600" />
            <span>4. ซ่อมบำรุงและประวัติการดูแล (Maintenance & Service)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ติดตามรายการแจ้งซ่อม ครุภัณฑ์ประกัน และประวัติการซ่อมบำรุงรักษา อสป.
          </p>
        </div>

        <button 
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ แจ้งซ่อมใหม่</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-semibold mb-1">รายการแจ้งซ่อมทั้งหมด</p>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {records.length} <span className="text-xs font-normal text-slate-500">รายการ</span>
            </h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-semibold mb-1">กำลังส่งซ่อม / รอดำเนินการ</p>
            <h3 className="text-2xl font-extrabold text-amber-600">
              {records.filter(r => r.status === 'in_progress' || r.status === 'pending').length} <span className="text-xs font-normal text-slate-500">รายการ</span>
            </h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-semibold mb-1">ซ่อมเสร็จสิ้นแล้ว</p>
            <h3 className="text-2xl font-extrabold text-emerald-600">
              {records.filter(r => r.status === 'completed').length} <span className="text-xs font-normal text-slate-500">รายการ</span>
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ค้นหารหัสครุภัณฑ์, รายการ หรือผู้แจ้งซ่อม..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 font-semibold">สถานะ:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">ทั้งหมด ({records.length})</option>
            <option value="in_progress">กำลังส่งซ่อม</option>
            <option value="pending">รอดำเนินการ</option>
            <option value="completed">ซ่อมเสร็จสิ้น</option>
          </select>
        </div>
      </div>

      {/* Maintenance Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-100 text-slate-800 uppercase text-[11px] font-bold border-b border-slate-200">
            <tr>
              <th className="p-3">รหัสครุภัณฑ์</th>
              <th className="p-3">ชื่อรายการครุภัณฑ์</th>
              <th className="p-3">วันที่แจ้งซ่อม</th>
              <th className="p-3">อาการชำรุด / รายละเอียด</th>
              <th className="p-3">ผู้แจ้งซ่อม / ช่างดูแล</th>
              <th className="p-3 text-right">ประมาณการค่าซ่อม</th>
              <th className="p-3 text-center">สถานะการซ่อม</th>
              {onUpdateStatus && <th className="p-3 text-center">จัดการ</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={onUpdateStatus ? 8 : 7} className="p-8 text-center text-slate-400">
                  ไม่พบรายการแจ้งซ่อมครุภัณฑ์
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-blue-700 bg-slate-50/50">{rec.assetCode}</td>
                  <td className="p-3 font-semibold text-slate-900">{rec.assetName}</td>
                  <td className="p-3 text-slate-500 font-mono">{rec.requestDate}</td>
                  <td className="p-3 text-slate-600 max-w-xs">{rec.issue}</td>
                  <td className="p-3 text-slate-700">
                    <div className="font-medium text-slate-900">{rec.reporter}</div>
                    {rec.technician && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <UserCheck className="w-3 h-3 text-amber-600" />
                        <span>{rec.technician}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-700">
                    {rec.cost && rec.cost > 0 ? `฿${rec.cost.toLocaleString('th-TH')}` : '-'}
                  </td>
                  <td className="p-3 text-center">
                    {getStatusBadge(rec.status)}
                  </td>
                  {onUpdateStatus && (
                    <td className="p-3 text-center">
                      <select
                        value={rec.status}
                        onChange={e => onUpdateStatus(rec.id, e.target.value as any)}
                        className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="in_progress">🟡 กำลังส่งซ่อม</option>
                        <option value="completed">🟢 ซ่อมเสร็จสิ้น</option>
                        <option value="pending">🟠 รอดำเนินการ</option>
                        <option value="cancelled">⚪ ยกเลิก</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Maintenance Modal */}
      <NewMaintenanceModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        assets={assets}
        onAddRecord={(newRec) => {
          if (onAddRecord) onAddRecord(newRec);
        }}
      />
    </div>
  );
};
