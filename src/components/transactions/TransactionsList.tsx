'use client';

import React, { useState, useMemo } from 'react';
import { Asset, AssetTransferRecord } from '../../types/asset';
import { 
  Truck, 
  ArrowRight, 
  FileText, 
  Search, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Building2, 
  User, 
  Calendar,
  Filter,
  Eye,
  ShieldCheck,
  X
} from 'lucide-react';

interface TransactionsListProps {
  assets: Asset[];
  transferRecords: AssetTransferRecord[];
  onOpenTransferModal: (selectedAssets?: Asset[]) => void;
  onOpenDisburseModal?: (selectedAssets?: Asset[]) => void;
  onTriggerToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  assets,
  transferRecords,
  onOpenTransferModal,
  onOpenDisburseModal,
  onTriggerToast,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<AssetTransferRecord | null>(null);

  const filteredRecords = useMemo(() => {
    return transferRecords.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchDoc = r.documentNo.toLowerCase().includes(q);
        const matchCodes = r.assetCodes.some(c => c.toLowerCase().includes(q));
        const matchNames = r.assetNames.some(n => n.toLowerCase().includes(q));
        const matchFrom = r.fromDepartment.toLowerCase().includes(q);
        const matchTo = r.toDepartment.toLowerCase().includes(q);
        const matchCust = r.toCustodian.toLowerCase().includes(q);
        if (!matchDoc && !matchCodes && !matchNames && !matchFrom && !matchTo && !matchCust) return false;
      }
      return true;
    });
  }, [transferRecords, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-medium flex items-center space-x-1 mb-1">
            <span>หน้าหลัก</span>
            <span>&gt;</span>
            <span className="text-slate-800 font-semibold">การเบิกจ่าย โอนย้าย และยืม-คืน</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            🔄 การเบิกจ่าย โอนย้าย และยืม-คืน (Transactions & Movement Dashboard)
          </h2>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenTransferModal()}
            className="flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            <Truck className="w-4 h-4" />
            <span>🚚 ทำเรื่องโอนย้ายครุภัณฑ์</span>
          </button>
          <button
            onClick={() => onOpenDisburseModal ? onOpenDisburseModal() : onTriggerToast('info', 'เบิกจ่ายครุภัณฑ์', 'ระบบบันทึกเบิกจ่ายอุปกรณ์ส่วนตัวกำลังเปิดใช้งาน')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>📤 บันทึกเบิกจ่ายประจำตัว</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-semibold mb-1">รายการโอนย้ายทั้งหมด</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{transferRecords.length} <span className="text-xs font-normal text-slate-500">คำขอ</span></h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-semibold mb-1">โอนย้ายสำเร็จเดือนนี้</p>
            <h3 className="text-2xl font-extrabold text-emerald-600">
              {transferRecords.filter(r => r.status === 'completed').length} <span className="text-xs font-normal text-slate-500">รายการ</span>
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-semibold mb-1">ครุภัณฑ์ที่ถูกยืมอยู่นอกสถานที่</p>
            <h3 className="text-2xl font-extrabold text-blue-600">3 <span className="text-xs font-normal text-slate-500">รายการ</span></h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <RefreshCw className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">📋 ประวัติและบันทึกการทำเรื่องโอนย้าย (Transfer History Audit Log)</h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">-- ทุกสถานะ --</option>
              <option value="completed">🟢 โอนย้ายสำเร็จ</option>
              <option value="pending">🟡 รอดำเนินการ</option>
            </select>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาเลขที่บันทึก, รหัส, แผนก..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3">เลขที่หนังสือ / วันที่</th>
                <th className="p-3">ครุภัณฑ์ที่โอนย้าย</th>
                <th className="p-3">หน่วยงานต้นทาง (From)</th>
                <th className="p-3">➔ หน่วยงานปลายทาง (To)</th>
                <th className="p-3">เหตุผล / ผู้อนุมัติ</th>
                <th className="p-3 text-center">สถานะ</th>
                <th className="p-3 text-center">การกระทำ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    ยังไม่มีรายการโอนย้ายในระบบ กดปุ่ม <strong>"🚚 ทำเรื่องโอนย้ายครุภัณฑ์"</strong> เพื่อเริ่มทำรายการ
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3 font-mono">
                      <div className="font-bold text-slate-900">{r.documentNo}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {r.transferDate}
                      </div>
                      {r.attachmentName && (
                        <div className="mt-1 text-[10px] text-rose-600 font-sans font-semibold flex items-center gap-1 truncate max-w-[140px]" title={r.attachmentName}>
                          <FileText className="w-3 h-3 shrink-0" />
                          <span className="truncate">{r.attachmentName}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="font-mono font-bold text-blue-700">
                        {r.assetCodes.join(', ')}
                      </div>
                      <div className="text-slate-700 text-[11px] truncate max-w-[200px]">
                        {r.assetNames.join(', ')}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 font-bold text-slate-800 rounded">
                        {r.fromDepartment}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">{r.fromCustodian}</div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1 font-bold text-emerald-800">
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded">
                          {r.toDepartment}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600 mt-0.5 pl-4">{r.toCustodian}</div>
                    </td>

                    <td className="p-3">
                      <div className="text-slate-800 truncate max-w-[180px]">{r.reason}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">ผู้อนุมัติ: {r.approvedBy}</div>
                    </td>

                    <td className="p-3 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        🟢 สำเร็จ
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedRecord(r)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="ดูรายละเอียดรายการโอนย้าย"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-xs animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                รายละเอียดหนังสือโอนย้าย: {selectedRecord.documentNo}
              </h3>
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p><strong>วันที่โอนย้าย:</strong> {selectedRecord.transferDate}</p>
              <p><strong>รหัสครุภัณฑ์:</strong> {selectedRecord.assetCodes.join(', ')}</p>
              <p><strong>ชื่อรายการ:</strong> {selectedRecord.assetNames.join(', ')}</p>
              <p><strong>โอนย้ายจาก:</strong> {selectedRecord.fromDepartment} ({selectedRecord.fromCustodian})</p>
              <p><strong>โอนย้ายไปยัง:</strong> {selectedRecord.toDepartment} ({selectedRecord.toCustodian})</p>
              <p><strong>สถานที่ใหม่:</strong> {selectedRecord.newLocation}</p>
              <p><strong>เหตุผล:</strong> {selectedRecord.reason}</p>
              <p><strong>ผู้อนุมัติ:</strong> {selectedRecord.approvedBy}</p>
              {selectedRecord.attachmentName && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-rose-700 font-semibold bg-rose-50 p-2 rounded-lg">
                  <div className="flex items-center gap-1.5 truncate">
                    <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="truncate">เอกสารแนบอนุมัติ: {selectedRecord.attachmentName}</span>
                  </div>
                  <span className="text-[10px] bg-rose-200 px-2 py-0.5 rounded text-rose-900">PDF / Image</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
