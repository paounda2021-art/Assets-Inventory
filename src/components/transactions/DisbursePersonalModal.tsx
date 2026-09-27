'use client';

import React, { useState, useEffect } from 'react';
import { Asset, AssetTransferRecord } from '../../types/asset';
import { DEPARTMENT_LIST, DepartmentItem } from '../../data/departments';
import { ThaiDatePicker } from '../ui/ThaiDatePicker';
import { X, Check, PackageCheck, Building2, User, MapPin, FileText, Search, ShieldCheck, Upload, Paperclip } from 'lucide-react';

interface DisbursePersonalModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAssets?: Asset[];
  allAssets: Asset[];
  departments?: DepartmentItem[];
  onConfirmDisburse: (record: AssetTransferRecord, updatedAssets: Asset[]) => void;
}

export const DisbursePersonalModal: React.FC<DisbursePersonalModalProps> = ({
  isOpen,
  onClose,
  selectedAssets = [],
  allAssets,
  departments = DEPARTMENT_LIST,
  onConfirmDisburse,
}) => {
  const [targetAssets, setTargetAssets] = useState<Asset[]>([]);
  const [documentNo, setDocumentNo] = useState<string>('');
  const [disburseDate, setDisburseDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [toDepartment, setToDepartment] = useState<string>('');
  const [toCustodian, setToCustodian] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [approvedBy, setApprovedBy] = useState<string>('');
  const [assetSearch, setAssetSearch] = useState<string>('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: number } | File | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTargetAssets(selectedAssets);
      const randomDocNum = Math.floor(100 + Math.random() * 900);
      setDocumentNo(`ใบเบิก อสป. ${randomDocNum}/2569`);
      const defaultDept = departments[0]?.code || 'สทส.';
      setToDepartment(defaultDept);
      setToCustodian('นายสมพรรษ วงศ์วิทยา (ผู้เบิก/ผู้ถือครองประจำตัว)');
      setNewLocation('อาคาร 1 > ชั้น 2 > โต๊ะทำงานประจำตัว (ส่วนกลาง)');
      setReason('เบิกจ่ายอุปกรณ์และครุภัณฑ์ประจำตัวเพื่อใช้ในการปฏิบัติงานตามภารกิจ อสป.');
      setApprovedBy('ผู้อำนวยการสำนักบริหารทรัพยากรบุคคล (อนุมัติ)');
      setAttachedFile({ name: `อนุมัติใบเบิกครุภัณฑ์_อสป_${randomDocNum}-2569.pdf`, size: 285400 });
    }
  }, [isOpen, selectedAssets, departments]);

  if (!isOpen) return null;

  const handleToggleAsset = (ast: Asset) => {
    if (targetAssets.some(a => a.id === ast.id)) {
      setTargetAssets(targetAssets.filter(a => a.id !== ast.id));
    } else {
      setTargetAssets([...targetAssets, ast]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetAssets.length === 0) {
      alert('⚠️ กรุณาเลือกอย่างน้อย 1 รายการครุภัณฑ์ที่ต้องการเบิกจ่ายประจำตัว');
      return;
    }

    if (!toCustodian.trim()) {
      alert('⚠️ กรุณาระบุชื่อผู้เบิกจ่าย / ผู้ถือครองประจำตัว');
      return;
    }

    if (!attachedFile) {
      alert('⚠️ กรุณาแนบไฟล์เอกสารบันทึกอนุมัติเบิกจ่ายก่อนกดยืนยัน (*จำเป็น)');
      return;
    }

    const fileName = attachedFile.name;
    const recordId = `tr-disb-${Date.now()}`;
    const dateFormatted = new Date().toISOString().substring(0, 16).replace('T', ' ');

    const updatedAssetItems: Asset[] = targetAssets.map(ast => {
      const existingHistory = Array.isArray(ast.history) ? ast.history : [];
      return {
        ...ast,
        department: toDepartment,
        custodian: toCustodian.trim(),
        location: newLocation.trim() || ast.location,
        history: [
          ...existingHistory,
          {
            id: `h-disb-${Date.now()}-${ast.id}`,
            date: dateFormatted,
            type: 'disbursement',
            title: `เบิกจ่ายประจำตัวให้ ${toCustodian.trim()}`,
            by: toCustodian.trim(),
            detail: `เบิกจ่ายครุภัณฑ์ ${ast.name} (${ast.assetCode}) ประจำตัวให้แก่ ${toCustodian.trim()} สังกัด ${toDepartment} สถานที่: ${newLocation.trim() || ast.location} (อ้างอิงเอกสาร: ${documentNo})`
          }
        ]
      };
    });

    const transferRecord: AssetTransferRecord = {
      id: recordId,
      documentNo: documentNo.trim(),
      transferDate: disburseDate,
      assetIds: targetAssets.map(a => a.id),
      assetCodes: targetAssets.map(a => a.assetCode),
      assetNames: targetAssets.map(a => a.name),
      fromDepartment: targetAssets[0]?.department || 'คลังส่วนกลาง',
      toDepartment,
      fromCustodian: targetAssets[0]?.custodian || 'เจ้าหน้าที่คลังพัสดุ',
      toCustodian: toCustodian.trim(),
      newLocation: newLocation.trim(),
      reason: `[เบิกจ่ายประจำตัว] ${reason.trim()}`,
      approvedBy: approvedBy.trim(),
      attachmentName: fileName,
      attachmentUrl: '#',
      status: 'completed',
    };

    onConfirmDisburse(transferRecord, updatedAssetItems);
    onClose();
  };

  const filteredAllAssets = allAssets.filter(ast => {
    if (!assetSearch.trim()) return true;
    const q = assetSearch.toLowerCase();
    return (
      ast.assetCode.toLowerCase().includes(q) ||
      ast.name.toLowerCase().includes(q) ||
      (ast.category && ast.category.toLowerCase().includes(q)) ||
      (ast.department && ast.department.toLowerCase().includes(q)) ||
      (ast.custodian && ast.custodian.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-8 transform transition-all">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-6 py-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <PackageCheck className="w-6 h-6 text-blue-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                📤 บันทึกเบิกจ่ายครุภัณฑ์ประจำตัว
              </h2>
              <p className="text-xs text-blue-100/90 font-light">
                ลงทะเบียนเบิกจ่ายครุภัณฑ์ให้แก่เจ้าหน้าที่/ผู้ถือครองประจำตัว เพื่อนำไปใช้งานในสังกัดหน่วยงาน
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Top Section: Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 text-xs">
            {/* Document No */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                เลขที่เอกสาร / ใบเบิกจ่าย <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={documentNo}
                onChange={e => setDocumentNo(e.target.value)}
                placeholder="เช่น ใบเบิก อสป. 102/2569"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
              />
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <ThaiDatePicker
                  value={disburseDate}
                  onChange={setDisburseDate}
                  label="วันที่เบิกจ่าย"
                  required
                />
              </label>
            </div>

            {/* Recipient / Custodian Name */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                ผู้เบิกจ่าย / ผู้รับมอบประจำตัว <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={toCustodian}
                onChange={e => setToCustodian(e.target.value)}
                placeholder="ระบุชื่อ-นามสกุล ผู้ถือครองครุภัณฑ์"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
              />
            </div>

            {/* Department Dropdown */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                สังกัด / หน่วยงาน <span className="text-rose-500">*</span>
              </label>
              <select
                value={toDepartment}
                onChange={e => setToDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-[15px]"
              >
                {departments.map(dept => (
                  <option key={dept.code} value={dept.code}>
                    {dept.fullTitle}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                สถานที่จัดวาง / ใช้งานประจำตัว
              </label>
              <input
                type="text"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                placeholder="เช่น อาคาร 1 > ชั้น 2 > โต๊ะทำงานประจำตัว"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
              />
            </div>

            {/* Reason */}
            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                วัตถุประสงค์ / เหตุผลการเบิกจ่าย
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="ระบุเหตุผล หรือวัตถุประสงค์ในการเบิกจ่ายครุภัณฑ์ประจำตัว"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
              />
            </div>

            {/* Approver */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                ผู้มีอำนาจอนุมัติ
              </label>
              <input
                type="text"
                value={approvedBy}
                onChange={e => setApprovedBy(e.target.value)}
                placeholder="เช่น ผู้อำนวยการส่วนงาน"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
              />
            </div>

            {/* File Attachment */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                แนบไฟล์บันทึกอนุมัติ <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <label className="flex-1 flex items-center justify-between px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors">
                  <span className="truncate text-xs text-slate-700 font-medium">
                    {attachedFile ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                        {attachedFile.name}
                      </span>
                    ) : (
                      'คลิกเพื่อแนบไฟล์ (PDF, PNG, DOC)'
                    )}
                  </span>
                  <Upload className="w-4 h-4 text-slate-400" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Asset Selection Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-blue-600" />
                  เลือกรายการครุภัณฑ์ที่ต้องการเบิกจ่ายประจำตัว 
                  <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    เลือกแล้ว {targetAssets.length} รายการ
                  </span>
                </h3>
              </div>

              {/* Asset Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={assetSearch}
                  onChange={e => setAssetSearch(e.target.value)}
                  placeholder="ค้นหารหัส หรือ ชื่อครุภัณฑ์..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Asset Selection List Table */}
            <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
              {filteredAllAssets.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  ไม่พบรายการครุภัณฑ์ที่ค้นหา
                </div>
              ) : (
                filteredAllAssets.map(ast => {
                  const isChecked = targetAssets.some(a => a.id === ast.id);
                  return (
                    <div
                      key={ast.id}
                      onClick={() => handleToggleAsset(ast)}
                      className={`p-3 flex items-center justify-between cursor-pointer transition-colors text-xs ${
                        isChecked ? 'bg-blue-50/70 hover:bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{ast.name}</span>
                            <span className="font-mono text-[11px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                              {ast.assetCode}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                            <span>หน่วยงานเดิม: {ast.department || '-'}</span>
                            <span>ผู้ถือครองเดิม: {ast.custodian || '-'}</span>
                            <span>สถานที่: {ast.location || '-'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                          {ast.category || 'ครุภัณฑ์ทั่วไป'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              ยืนยันบันทึกเบิกจ่ายประจำตัว ({targetAssets.length} รายการ)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
