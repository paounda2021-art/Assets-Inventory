'use client';

import React, { useState, useEffect } from 'react';
import { Asset, AssetStatus } from '../../types/asset';
import { DEPARTMENT_LIST, DepartmentItem } from '../../data/departments';
import { ThaiDatePicker } from '../ui/ThaiDatePicker';
import { X, Check, Edit3, Building2, Calendar, FileText, User, MapPin } from 'lucide-react';

interface EditAssetModalProps {
  asset: Asset | null;
  onClose: () => void;
  onSave: (updatedAsset: Asset) => void;
  departments?: DepartmentItem[];
}

export const EditAssetModal: React.FC<EditAssetModalProps> = ({
  asset,
  onClose,
  onSave,
  departments = DEPARTMENT_LIST,
}) => {
  const [assetCode, setAssetCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [spec, setSpec] = useState<string>('');
  const [category, setCategory] = useState<string>('คอมพิวเตอร์และอุปกรณ์ไอที');
  const [subCategory, setSubCategory] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [serialNumber, setSerialNumber] = useState<string>('');

  const [budgetYear, setBudgetYear] = useState<string>('2569');
  const [acquisitionDate, setAcquisitionDate] = useState<string>('');
  const [poNumber, setPoNumber] = useState<string>('');
  const [vendor, setVendor] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [status, setStatus] = useState<AssetStatus>('active');

  const [department, setDepartment] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [custodian, setCustodian] = useState<string>('');

  useEffect(() => {
    if (asset) {
      setAssetCode(asset.assetCode || '');
      setName(asset.name || '');
      setSpec(asset.spec || '');
      setCategory(asset.category || 'คอมพิวเตอร์และอุปกรณ์ไอที');
      setSubCategory(asset.subCategory || '');
      setBrand(asset.brand || '');
      setModel(asset.model || '');
      setSerialNumber(asset.serialNumber || '');
      setBudgetYear(asset.budgetYear || '2569');
      setAcquisitionDate(asset.acquisitionDate || '');
      setPoNumber(asset.poNumber || '');
      setVendor(asset.vendor || '');
      setPurchasePrice(asset.purchasePrice || 0);
      setStatus(asset.status || 'active');
      setDepartment(asset.department || '');
      setLocation(asset.location || '');
      setCustodian(asset.custodian || '');
    }
  }, [asset]);

  if (!asset) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const editLog = {
      id: `h-edit-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'transfer' as const,
      title: 'แก้ไขข้อมูลครุภัณฑ์',
      by: 'เจ้าหน้าที่ระบบ (ปรับปรุงข้อมูล)',
      detail: `อัปเดตข้อมูลรายการ ${name} (วันที่ได้มา: ${acquisitionDate}, สถานะ: ${status}, สถานที่: ${location})`
    };

    const updatedAssetObj: Asset = {
      ...asset,
      assetCode,
      name,
      spec,
      category,
      subCategory,
      brand,
      model,
      serialNumber,
      department,
      custodian,
      location,
      budgetYear,
      acquisitionDate,
      poNumber,
      vendor,
      purchasePrice,
      currentBookValue: purchasePrice,
      status,
      history: [editLog, ...asset.history]
    };

    onSave(updatedAssetObj);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center space-x-2">
                <span>✏️ แก้ไขข้อมูลครุภัณฑ์:</span>
                <span className="font-mono text-amber-300">{assetCode}</span>
              </h3>
              <p className="text-xs text-slate-400">ปรับปรุงข้อมูลสินทรัพย์ วันที่ได้มา สถานะ ผู้ถือครอง หรือสถานที่จัดวาง</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
            
            {/* Section 1: Asset Code, Acquisition Date & Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">รหัสทรัพย์สิน (Asset Code):</label>
                <input
                  type="text"
                  value={assetCode}
                  onChange={(e) => setAssetCode(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 font-mono font-bold text-blue-800 text-sm"
                />
              </div>

              <div>
                <ThaiDatePicker
                  label="วันที่ได้มา / วันที่ตรวจรับ"
                  value={acquisitionDate}
                  onChange={(val) => setAcquisitionDate(val)}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">หมวดหมู่:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium"
                >
                  <option value="คอมพิวเตอร์และอุปกรณ์ไอที">คอมพิวเตอร์และอุปกรณ์ไอที</option>
                  <option value="สำนักงานและครุภัณฑ์">สำนักงานและครุภัณฑ์</option>
                  <option value="ยานพาหนะและขนส่ง">ยานพาหนะและขนส่ง</option>
                  <option value="ครุภัณฑ์การเกษตร">ครุภัณฑ์การเกษตร</option>
                  <option value="ครุภัณฑ์ไฟฟ้าและวิทยุ">ครุภัณฑ์ไฟฟ้าและวิทยุ</option>
                </select>
              </div>
            </div>

            {/* Section 2: Name, S/N & Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  <span className="text-rose-500">*</span> รายการ / ชื่อทรัพย์สิน:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-semibold text-slate-800 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">สถานะปัจจุบัน:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AssetStatus)}
                  className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 font-bold text-amber-900"
                >
                  <option value="active">🟢 ใช้งานปกติ</option>
                  <option value="repair">🟡 ส่งซ่อม</option>
                  <option value="damaged">🔴 ชำรุดรอจำหน่าย</option>
                  <option value="disposed">⚪ ตัดจำหน่ายแล้ว</option>
                </select>
              </div>
            </div>

            {/* Section 3: Serial Number, Department, Location & Custodian */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h4 className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Serial Number, หน่วยงาน, สถานที่จัดวาง และผู้ถือครอง</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Serial Number (S/N):</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ฝ่าย / สำนัก / ตัวย่อ:</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium text-xs"
                  >
                    {department && !departments.some(d => d.code === department) && (
                      <option value={department}>{department}</option>
                    )}
                    {departments.map((d, idx) => (
                      <option key={`${d.code}-${idx}`} value={d.code}>
                        {d.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">สถานที่จัดวาง:</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ผู้ถือครอง / ผู้ใช้งาน:</label>
                  <input
                    type="text"
                    value={custodian}
                    onChange={(e) => setCustodian(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Finance & Purchase details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ปีงบประมาณ:</label>
                <input
                  type="text"
                  value={budgetYear}
                  onChange={(e) => setBudgetYear(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ราคาจัดซื้อ (บาท):</label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 font-bold text-blue-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">แหล่งที่มา / ผู้ขาย:</label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            {/* Section 5: Spec / Details */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">สเปก / หมายเหตุเพิ่มเติม:</label>
              <textarea
                value={spec}
                onChange={(e) => setSpec(e.target.value)}
                rows={2}
                className="w-full border border-slate-300 rounded-lg p-2.5"
              />
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
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>💾 บันทึกการแก้ไขข้อมูล</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
