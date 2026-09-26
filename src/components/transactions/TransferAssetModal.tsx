'use client';

import React, { useState, useEffect } from 'react';
import { Asset, AssetTransferRecord } from '../../types/asset';
import { DEPARTMENT_LIST, DepartmentItem } from '../../data/departments';
import { ThaiDatePicker } from '../ui/ThaiDatePicker';
import { X, Check, Truck, Building2, User, MapPin, FileText, Search, ShieldCheck, Upload, Paperclip } from 'lucide-react';

interface TransferAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAssets: Asset[];
  allAssets: Asset[];
  departments?: DepartmentItem[];
  onConfirmTransfer: (record: AssetTransferRecord, updatedAssets: Asset[]) => void;
}

export const TransferAssetModal: React.FC<TransferAssetModalProps> = ({
  isOpen,
  onClose,
  selectedAssets,
  allAssets,
  departments = DEPARTMENT_LIST,
  onConfirmTransfer,
}) => {
  const [targetAssets, setTargetAssets] = useState<Asset[]>([]);
  const [documentNo, setDocumentNo] = useState<string>('');
  const [transferDate, setTransferDate] = useState<string>(
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
      setDocumentNo(`บันทึก อสป. ${Math.floor(100 + Math.random() * 900)}/2569`);
      const defaultDept = departments[0]?.code || 'ฝตน.';
      setToDepartment(defaultDept);
      setToCustodian('น.ส.วิไลวรรณ จิตต์นิยม (ผู้ถือครองใหม่)');
      setNewLocation('อาคาร 1 > ชั้น 3 > สำนักงานใหม่');
      setReason('โอนย้ายครุภัณฑ์เพื่อรองรับการปรับโครงสร้างหน่วยงานประจำปี 2569');
      setApprovedBy('ผู้อำนวยการสำนักบริหารทรัพยากรบุคคล (อนุมัติ)');
      setAttachedFile({ name: 'บันทึกอนุมัติโอนย้าย_อสป_367-2569.pdf', size: 345800 });
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
      alert('กรุณาเลือกอย่างน้อย 1 รายการครุภัณฑ์ที่ต้องการโอนย้าย');
      return;
    }

    if (!attachedFile) {
      alert('⚠️ กรุณาแนบไฟล์เอกสารบันทึกอนุมัติโอนย้ายก่อนกดยืนยัน (*จำเป็น)');
      return;
    }

    const fileName = attachedFile.name;
    const recordId = `tr-${Date.now()}`;
    const transferRecord: AssetTransferRecord = {
      id: recordId,
      documentNo: documentNo.trim(),
      transferDate,
      assetIds: targetAssets.map(a => a.id),
      assetCodes: targetAssets.map(a => a.assetCode),
      assetNames: targetAssets.map(a => a.name),
      fromDepartment: targetAssets[0]?.department || 'ส่วนกลาง',
      toDepartment,
      fromCustodian: targetAssets[0]?.custodian || 'ผู้ถือครองเดิม',
      toCustodian: toCustodian.trim(),
      newLocation: newLocation.trim(),
      reason: reason.trim(),
      approvedBy: approvedBy.trim(),
      attachmentName: fileName,
      attachmentUrl: '#',
      status: 'completed',
    };

    const updatedAssetsList = targetAssets.map(ast => {
      const historyLog = {
        id: `h-tr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        date: transferDate,
        type: 'transfer' as const,
        title: `โอนย้ายไปยัง ${toDepartment}`,
        by: approvedBy || 'เจ้าหน้าที่โอนย้าย',
        detail: `โอนย้ายจาก ${ast.department} (${ast.custodian}) ➔ ${toDepartment} (${toCustodian}) | อ้างอิง: ${documentNo} (แนบไฟล์: ${fileName})`,
        documentNo: documentNo,
        attachmentName: fileName,
        attachmentUrl: '#',
        statusBadge: '🟢 โอนย้ายสำเร็จ',
      };

      return {
        ...ast,
        department: toDepartment,
        custodian: toCustodian,
        location: newLocation,
        history: [historyLog, ...ast.history],
      };
    });

    onConfirmTransfer(transferRecord, updatedAssetsList);
  };

  const filteredSearchAssets = allAssets.filter(a =>
    a.assetCode.toLowerCase().includes(assetSearch.toLowerCase()) ||
    a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
    a.serialNumber.toLowerCase().includes(assetSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">🚚 ทำเรื่องโอนย้ายครุภัณฑ์ (Asset Transfer Order)</h3>
              <p className="text-xs text-slate-400">บันทึกโอนย้ายครุภัณฑ์ระหว่างหน่วยงาน/ผู้ถือครอง พร้อมบันทึกประวัติ อสป.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
            
            {/* Box 1: Selected Assets for Transfer */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  1. รายการครุภัณฑ์ที่จะโอนย้าย ({targetAssets.length} รายการ)
                </h4>
                <span className="text-[11px] text-amber-800 font-semibold bg-amber-100 px-2.5 py-0.5 rounded-full">
                  เลือกแล้ว {targetAssets.length} ชิ้น
                </span>
              </div>

              {/* Target Assets Chips */}
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-white border border-slate-200 rounded-lg">
                {targetAssets.length === 0 ? (
                  <p className="text-slate-400 italic text-center w-full py-2">
                    ยังไม่ได้เลือกครุภัณฑ์ (กรุณาเลือกครุภัณฑ์จากด้านล่าง)
                  </p>
                ) : (
                  targetAssets.map(a => (
                    <div 
                      key={a.id} 
                      className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-900 px-2.5 py-1 rounded-lg font-mono font-medium text-[11px]"
                    >
                      <span className="font-bold">{a.assetCode}</span>
                      <span className="text-slate-600 font-sans truncate max-w-[150px]">({a.name})</span>
                      <button
                        type="button"
                        onClick={() => handleToggleAsset(a)}
                        className="text-amber-700 hover:text-rose-600 ml-1 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add/Remove Asset Search Selector if needed */}
              {targetAssets.length < 5 && (
                <div className="relative pt-1">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ค้นหารหัส หรือชื่อครุภัณฑ์เพิ่มเติมเพื่อเลือกโอนย้ายพร้อมกัน..."
                    value={assetSearch}
                    onChange={(e) => setAssetSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                  {assetSearch.trim() && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-36 overflow-y-auto divide-y divide-slate-100">
                      {filteredSearchAssets.slice(0, 5).map(ast => (
                        <div
                          key={ast.id}
                          onClick={() => {
                            handleToggleAsset(ast);
                            setAssetSearch('');
                          }}
                          className="p-2 hover:bg-amber-50 cursor-pointer flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-blue-700 mr-2">{ast.assetCode}</span>
                            <span className="font-medium text-slate-800">{ast.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{ast.department}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Box 2: Document & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  <span className="text-rose-500">*</span> เลขที่หนังสือ/บันทึกอนุมัติโอนย้าย:
                </label>
                <input
                  type="text"
                  value={documentNo}
                  onChange={(e) => setDocumentNo(e.target.value)}
                  placeholder="เช่น บันทึก อสป. 102/2569"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <ThaiDatePicker
                  label="วันที่โอนย้าย"
                  value={transferDate}
                  onChange={(val) => setTransferDate(val)}
                  required
                />
              </div>
            </div>

            {/* Box 2.5: Mandatory File Upload Field */}
            <div className="bg-rose-50/60 border-2 border-dashed border-rose-300 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-rose-600" />
                  <span>แนบไฟล์เอกสารบันทึกอนุมัติโอนย้าย (PDF / รูปถ่ายสแกน):</span>
                  <span className="text-rose-600 font-extrabold text-xs">* จำเป็นต้องแนบ</span>
                </label>
                {attachedFile && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> แนบไฟล์สำเร็จแล้ว
                  </span>
                )}
              </div>

              <div>
                <input
                  type="file"
                  id="approval-file-input"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {!attachedFile ? (
                  <label
                    htmlFor="approval-file-input"
                    className="w-full flex items-center justify-center gap-2 p-3 bg-white border border-rose-300 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors text-slate-700 text-xs font-semibold shadow-xs"
                  >
                    <Upload className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>📁 คลิกที่นี่เพื่อเลือกอัปโหลดไฟล์บันทึกอนุมัติ PDF / รูปภาพสแกน</span>
                    <span className="text-[10px] text-slate-400 font-normal">(รองรับ PDF, PNG, JPG ขนาดไม่เกิน 15MB)</span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-white border border-emerald-400 rounded-lg shadow-xs text-xs">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="w-5 h-5 text-rose-600 shrink-0" />
                      <div className="truncate">
                        <p className="font-bold text-slate-900 truncate">{attachedFile.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {'size' in attachedFile && typeof attachedFile.size === 'number'
                            ? `${(attachedFile.size / 1024).toFixed(1)} KB`
                            : 'ไฟล์แนบเรียบร้อย'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-colors shrink-0 flex items-center gap-1 font-semibold text-[11px]"
                      title="ลบไฟล์และแนบใหม่"
                    >
                      <X className="w-4 h-4" />
                      <span>ลบไฟล์</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Box 3: Destination Details (To Department, Custodian, Location) */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-4">
              <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-600" />
                2. ข้อมูลปลายทางที่รับโอนย้าย (Destination)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    <span className="text-rose-500">*</span> หน่วยงานปลายทาง (ตัวย่อ):
                  </label>
                  <select
                    value={toDepartment}
                    onChange={(e) => setToDepartment(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-blue-900 focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    {departments.map((d, idx) => (
                      <option key={`${d.code}-${idx}`} value={d.code}>
                        {d.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    <span className="text-rose-500">*</span> ผู้ถือครอง / ผู้รับมอบใหม่:
                  </label>
                  <input
                    type="text"
                    value={toCustodian}
                    onChange={(e) => setToCustodian(e.target.value)}
                    placeholder="เช่น น.ส.วิไลวรรณ จิตต์นิยม"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 font-medium bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    <span className="text-rose-500">*</span> สถานที่จัดวางใหม่:
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="เช่น อาคาร 2 > ชั้น 3 > ห้อง 301"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 font-medium bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Box 4: Reason & Approver */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">เหตุผลความจำเป็นในการโอนย้าย:</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  placeholder="เช่น โอนย้ายอุปกรณ์ตามคำขอเปิดแผนกใหม่"
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ผู้อนุมัติโอนย้าย:</label>
                <input
                  type="text"
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                  placeholder="เช่น ผู้อำนวยการสำนักบริหารทรัพยากรบุคคล"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white font-medium"
                />
              </div>
            </div>

          </div>

          {/* Footer Action Bar */}
          <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={targetAssets.length === 0}
              className={`flex items-center space-x-1.5 px-5 py-2 rounded-lg text-white text-xs font-bold shadow-md transition-all ${
                targetAssets.length > 0
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>💾 ยืนยันบันทึกการโอนย้าย ({targetAssets.length} รายการ)</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
