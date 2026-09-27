'use client';

import React, { useState, useEffect } from 'react';
import { Asset, MaintenanceRecord } from '../../types/asset';
import { ThaiDatePicker } from '../ui/ThaiDatePicker';
import { X, Check, Wrench, FileText, User, Calendar, AlertTriangle, Building2, Search, DollarSign } from 'lucide-react';

interface NewMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onAddRecord: (record: MaintenanceRecord) => void;
}

export const NewMaintenanceModal: React.FC<NewMaintenanceModalProps> = ({
  isOpen,
  onClose,
  assets,
  onAddRecord,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [assetCode, setAssetCode] = useState<string>('');
  const [assetName, setAssetName] = useState<string>('');
  const [requestDate, setRequestDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [issue, setIssue] = useState<string>('');
  const [reporter, setReporter] = useState<string>('');
  const [technician, setTechnician] = useState<string>('');
  const [cost, setCost] = useState<number>(0);
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>('in_progress');
  const [assetSearch, setAssetSearch] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSelectedAssetId('');
      setAssetCode('');
      setAssetName('');
      setRequestDate(new Date().toISOString().substring(0, 10));
      setIssue('');
      setReporter('เจ้าหน้าที่พัสดุ (ผู้แจ้งซ่อม)');
      setTechnician('ศูนย์บริการแต่งตั้ง / ช่างเทคนิค อสป.');
      setCost(0);
      setStatus('in_progress');
      setAssetSearch('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectAsset = (ast: Asset) => {
    setSelectedAssetId(ast.id);
    setAssetCode(ast.assetCode);
    setAssetName(ast.name);
    setAssetSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!assetCode.trim() || !assetName.trim()) {
      alert('⚠️ กรุณาเลือกหรือระบุครุภัณฑ์ที่ต้องการแจ้งซ่อม');
      return;
    }

    if (!issue.trim()) {
      alert('⚠️ กรุณาระบุอาการชำรุด หรือรายละเอียดปัญหา');
      return;
    }

    const newRecord: MaintenanceRecord = {
      id: `maint-${Date.now()}`,
      assetCode: assetCode.trim(),
      assetName: assetName.trim(),
      requestDate,
      issue: issue.trim(),
      reporter: reporter.trim() || 'ผู้แจ้งซ่อม',
      technician: technician.trim() || 'ศูนย์บริการซ่อมบำรุง',
      cost: Number(cost) || 0,
      status,
    };

    onAddRecord(newRecord);
    onClose();
  };

  const filteredAssets = assets.filter(ast => {
    if (!assetSearch.trim()) return true;
    const q = assetSearch.toLowerCase();
    return (
      ast.assetCode.toLowerCase().includes(q) ||
      ast.name.toLowerCase().includes(q) ||
      (ast.department && ast.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 px-6 py-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <Wrench className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                🔧 บันทึกแจ้งซ่อมครุภัณฑ์ใหม่
              </h2>
              <p className="text-xs text-amber-100/90 font-light">
                ลงทะเบียนแจ้งซ่อม อัพเดตอาการชำรุด และส่งต่อช่างบริการซ่อมบำรุง
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-amber-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-[15px]">
            {/* Asset Selection */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5 text-[15px]">
                <Building2 className="w-4 h-4 text-amber-600" />
                เลือกครุภัณฑ์ที่ต้องการแจ้งซ่อม <span className="text-rose-500">*</span>
              </label>

              {/* Quick Search & Select Box */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={assetSearch}
                    onChange={e => setAssetSearch(e.target.value)}
                    placeholder="พิมพ์เพื่อค้นหารหัส หรือชื่อครุภัณฑ์ในระบบ..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-[15px] outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Dropdown Options List */}
                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 bg-white">
                  {filteredAssets.slice(0, 30).map(ast => {
                    const isSelected = selectedAssetId === ast.id || assetCode === ast.assetCode;
                    return (
                      <div
                        key={ast.id}
                        onClick={() => handleSelectAsset(ast)}
                        className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected ? 'bg-amber-50 border-l-4 border-amber-500 font-bold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <span className="font-mono text-amber-700 font-bold mr-2">{ast.assetCode}</span>
                          <span className="text-slate-800">{ast.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">{ast.department || 'ส่วนกลาง'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Asset Code & Asset Name (Readonly or Editable) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  รหัสครุภัณฑ์
                </label>
                <input
                  type="text"
                  required
                  value={assetCode}
                  onChange={e => setAssetCode(e.target.value)}
                  placeholder="เช่น สนง.67-0102-01"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  ชื่อรายการครุภัณฑ์
                </label>
                <input
                  type="text"
                  required
                  value={assetName}
                  onChange={e => setAssetName(e.target.value)}
                  placeholder="ชื่อเครื่องจักร / อุปกรณ์"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Request Date & Reporter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <ThaiDatePicker
                  value={requestDate}
                  onChange={setRequestDate}
                  label="วันที่แจ้งซ่อม"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  ผู้แจ้งซ่อม <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reporter}
                  onChange={e => setReporter(e.target.value)}
                  placeholder="ชื่อ-นามสกุล ผู้แจ้งซ่อม"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Issue Description */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                อาการชำรุด / รายละเอียดปัญหา <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={issue}
                onChange={e => setIssue(e.target.value)}
                placeholder="อธิบายอาการชำรุด ชิ้นส่วนที่เสียหาย หรือลักษณะความผิดปกติที่พบ..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Service / Vendor & Cost & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  ศูนย์บริการ / ช่างผู้ดูแล
                </label>
                <input
                  type="text"
                  value={technician}
                  onChange={e => setTechnician(e.target.value)}
                  placeholder="เช่น ศูนย์ HP, ช่าง อสป."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                  ประมาณการค่าใช้จ่าย (บาท)
                </label>
                <input
                  type="number"
                  min={0}
                  value={cost}
                  onChange={e => setCost(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  สถานะการซ่อม
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="in_progress">🟡 กำลังส่งซ่อม / ดำเนินการ</option>
                  <option value="pending">🟠 รอดำเนินการ / รอช่าง</option>
                  <option value="completed">🟢 ซ่อมแซมเสร็จสิ้น</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="flex-shrink-0 px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-600/25 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              บันทึกรายการแจ้งซ่อม
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
