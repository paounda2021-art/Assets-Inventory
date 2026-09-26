'use client';

import React, { useState, useEffect } from 'react';
import { Asset } from '../../types/asset';
import { DEPARTMENT_LIST, DepartmentItem } from '../../data/departments';
import { ThaiDatePicker } from '../ui/ThaiDatePicker';
import { CategoryOption, TypeOption } from '../settings/SettingsView';
import { 
  RESPONSIBLE_CODES, 
  CATEGORY_CODES, 
  TYPE_CODES, 
  INITIAL_TYPE_COUNTS,
  getNextSequenceNumber,
  generateAssetCode 
} from '../../lib/codeGenerator';
import { X, Check, FileText, Upload, Sparkles, Building2, Calendar, Tag, Info } from 'lucide-react';

interface NewAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newAsset: Asset) => void;
  assets?: Asset[];
  categories?: CategoryOption[];
  typeCodesMap?: Record<string, TypeOption[]>;
  departments?: DepartmentItem[];
}

export const NewAssetModal: React.FC<NewAssetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  assets = [],
  categories = CATEGORY_CODES,
  typeCodesMap = TYPE_CODES,
  departments = DEPARTMENT_LIST,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [autoGenerateCode, setAutoGenerateCode] = useState<boolean>(true);

  // Asset Code Formula Rule State
  const [year2, setYear2] = useState<string>('69');
  const [resp2, setResp2] = useState<string>('01');
  const [cat2, setCat2] = useState<string>('01'); // Default: 01 ครุภัณฑ์สำนักงาน
  const [type3, setType3] = useState<string>('001'); // Default: 001 โต๊ะทำงาน
  const [runningSeq, setRunningSeq] = useState<number>(129); // Default: 129 -> "0129"
  const [useSeparator, setUseSeparator] = useState<boolean>(true);

  // Form State
  const [assetCode, setAssetCode] = useState<string>('');
  const [name, setName] = useState<string>('โต๊ะทำงานผู้บริหาร 1.6 เมตร');
  const [spec, setSpec] = useState<string>('โครงเหล็กพ่นสี เบาะลายไม้ พร้อมลิ้นชักล็อคอัตโนมัติ');
  const [categoryName, setCategoryName] = useState<string>('สำนักงานและครุภัณฑ์');
  const [subCategory, setSubCategory] = useState<string>('โต๊ะทำงาน');
  const [brand, setBrand] = useState<string>('Modernform');
  const [model, setModel] = useState<string>('Executive-160');
  const [serialNumber, setSerialNumber] = useState<string>('MF-2026-0129');

  const [budgetYear, setBudgetYear] = useState<string>('2569');
  const [acquisitionDate, setAcquisitionDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [poNumber, setPoNumber] = useState<string>('พด.12/2569');
  const [vendor, setVendor] = useState<string>('บริษัท โมเดิร์นฟอร์ม กรุ๊ป จำกัด');
  const [purchasePrice, setPurchasePrice] = useState<number>(8500.00);
  const [usefulLifeYears, setUsefulLifeYears] = useState<number>(5);
  const [depreciationMethod, setDepreciationMethod] = useState<string>('20% ต่อปี (เส้นตรง)');

  const [department, setDepartment] = useState<string>('ส่วนกลางและสะพานปลากรุงเทพ');
  const [location, setLocation] = useState<string>('อาคาร 1 > ชั้น 2 > ห้องบริหาร');
  const [custodian, setCustodian] = useState<string>('รณิดา โชติธนาอุดม (เจ้าหน้าที่ระบบ)');

  // Auto calculate NEXT running sequence when Category or Type changes!
  useEffect(() => {
    const nextSeq = getNextSequenceNumber(cat2, type3, assets);
    setRunningSeq(nextSeq);
  }, [cat2, type3, assets]);

  // Auto update generated asset code string
  useEffect(() => {
    if (autoGenerateCode) {
      const generated = generateAssetCode({
        year2Digits: year2,
        resp2Digits: resp2,
        cat2Digits: cat2,
        type3Digits: type3,
        running4Digits: runningSeq,
        useSeparator: useSeparator
      });
      setAssetCode(generated);
    }
  }, [year2, resp2, cat2, type3, runningSeq, useSeparator, autoGenerateCode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = autoGenerateCode
      ? generateAssetCode({
          year2Digits: year2,
          resp2Digits: resp2,
          cat2Digits: cat2,
          type3Digits: type3,
          running4Digits: runningSeq,
          useSeparator: useSeparator
        })
      : assetCode;

    const newAssetObj: Asset = {
      id: `ast-${Date.now()}`,
      assetCode: finalCode,
      name,
      spec,
      category: categoryName,
      subCategory,
      brand,
      model,
      serialNumber,
      department,
      custodian,
      location,
      budgetYear: `25${year2}`,
      acquisitionDate,
      poNumber,
      vendor,
      purchasePrice,
      usefulLifeYears,
      depreciationMethod,
      currentBookValue: purchasePrice,
      status: 'active',
      warrantyStart: acquisitionDate,
      warrantyEnd: '2029-08-14',
      imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=60',
      history: [
        {
          id: `h-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          type: 'registration',
          title: 'ตรวจรับและตั้งรหัสครุภัณฑ์ตามสูตร อสป.',
          by: 'คณะกรรมการตรวจรับ',
          detail: `ออกรหัสทรัพย์สินสูตร อสป: ${finalCode} (วันที่ได้มา: ${acquisitionDate})`,
          documentNo: poNumber
        }
      ]
    };

    onSave(newAssetObj);
  };

  const availableTypes = TYPE_CODES[cat2] || [
    { code: '001', name: '001 ทั่วไป' },
    { code: '002', name: '002 อุปกรณ์ต่อพ่วง' }
  ];

  // Get current last count for badge display
  const lastCount = (INITIAL_TYPE_COUNTS[`${cat2}-${type3}`] || 0);
  const formattedSeq = String(runningSeq).padStart(4, '0');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">➕ บันทึกรับครุภัณฑ์เข้าใหม่ (New Asset Entry)</h3>
              <p className="text-xs text-slate-400">ระบบตั้งเลขรหัสทรัพย์สิน: ปี2หลัก + ผู้รับผิดชอบ2หลัก + ประเภท2หลัก + ชนิด3หลัก + เลขรันออโต้4หลัก</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header Navigation */}
        <div className="bg-slate-100 px-4 pt-2 border-b border-slate-200 flex space-x-2 text-xs font-semibold text-slate-600 overflow-x-auto">
          {[
            { id: 1, label: '1. ข้อมูลสินทรัพย์ & สูตรสร้างรหัส', icon: FileText },
            { id: 2, label: '2. จัดซื้อ/สัญญา', icon: Calendar },
            { id: 3, label: '3. สถานที่และการถือครอง', icon: Building2 },
            { id: 4, label: '4. ภาพถ่ายและเอกสาร', icon: Upload },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-t-lg border-t border-x transition-all ${
                  isActive
                    ? 'bg-white text-blue-700 border-slate-200 border-b-white font-bold shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">

            {/* TAB 1: ข้อมูลสินทรัพย์ + รหัสตามสูตร อสป. */}
            {activeTab === 1 && (
              <div className="space-y-4 text-xs">
                
                {/* Formula Rule Generator Box */}
                <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-blue-900 text-xs flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>⚙️ ระบบสร้างรหัสทรัพย์สินออโต้ (รันต่อจากเดิมอัตโนมัติ)</span>
                    </h4>
                    <span className="text-[11px] text-blue-700 font-mono">
                      สูตร: [ปี 2] + [ผู้รับผิดชอบ 2] + [ประเภท 2] + [ชนิด 3] + [รันออโต้ 4]
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">ปี พ.ศ. (2หลัก):</label>
                      <select
                        value={year2}
                        onChange={(e) => setYear2(e.target.value)}
                        className="w-full bg-white border border-blue-300 rounded px-2 py-1.5 font-mono font-bold text-blue-900"
                      >
                        <option value="69">69 (พ.ศ. 2569)</option>
                        <option value="68">68 (พ.ศ. 2568)</option>
                        <option value="67">67 (พ.ศ. 2567)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">ผู้รับผิดชอบ (2หลัก):</label>
                      <select
                        value={resp2}
                        onChange={(e) => setResp2(e.target.value)}
                        className="w-full bg-white border border-blue-300 rounded px-2 py-1.5 font-mono font-bold text-blue-900"
                      >
                        {RESPONSIBLE_CODES.map(r => (
                          <option key={r.code} value={r.code}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">ประเภท (2หลัก):</label>
                      <select
                        value={cat2}
                        onChange={(e) => {
                          const newCat = e.target.value;
                          setCat2(newCat);
                          const defaultTypes = typeCodesMap[newCat] || TYPE_CODES[newCat];
                          if (defaultTypes && defaultTypes.length > 0) {
                            setType3(defaultTypes[0].code);
                          }
                        }}
                        className="w-full bg-white border border-blue-300 rounded px-2 py-1.5 font-mono font-bold text-blue-900"
                      >
                        {categories.map(c => (
                          <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">ชนิด (3หลัก):</label>
                      <select
                        value={type3}
                        onChange={(e) => setType3(e.target.value)}
                        className="w-full bg-white border border-blue-300 rounded px-2 py-1.5 font-mono font-bold text-blue-900"
                      >
                        {(typeCodesMap[cat2] || TYPE_CODES[cat2] || []).map(t => (
                          <option key={t.code} value={t.code}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">เลขรันถัดไป (4หลัก):</label>
                      <input
                        type="text"
                        value={formattedSeq}
                        onChange={(e) => {
                          const parsed = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
                          setRunningSeq(isNaN(parsed) ? 1 : parsed);
                        }}
                        className="w-full bg-emerald-50 border-2 border-emerald-400 rounded px-2 py-1.5 font-mono font-extrabold text-emerald-800 text-center shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Highlight Banner showing auto calculation */}
                  <div className="p-2.5 bg-emerald-100/80 border border-emerald-300 rounded-lg flex flex-wrap items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center space-x-1.5">
                      <Info className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>
                        ชนิดนี้ในระบบรับล่าสุด: <strong className="font-mono text-slate-900 text-sm font-bold">{String(lastCount).padStart(4, '0')}</strong> ({lastCount} รายการ)
                      </span>
                    </div>

                    <div className="font-bold text-emerald-900 flex items-center space-x-1">
                      <span>➡ เลขรันถัดไปที่จะได้อัตโนมัติ:</span>
                      <span className="font-mono font-extrabold text-blue-700 bg-white px-2.5 py-0.5 rounded border border-blue-400 text-sm shadow-sm">
                        {formattedSeq}
                      </span>
                    </div>
                  </div>

                  {/* Format Display Selection */}
                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-blue-200/80 gap-2">
                    <div className="flex items-center space-x-3 text-xs text-slate-700">
                      <span className="font-semibold">รูปแบบรหัส:</span>
                      <label className="inline-flex items-center space-x-1 cursor-pointer">
                        <input
                          type="radio"
                          name="sep"
                          checked={useSeparator}
                          onChange={() => setUseSeparator(true)}
                          className="text-blue-600"
                        />
                        <span>แบบเครื่องหมาย (เช่น {year2}/{resp2}-{cat2}-{type3}-{formattedSeq})</span>
                      </label>
                      <label className="inline-flex items-center space-x-1 cursor-pointer">
                        <input
                          type="radio"
                          name="sep"
                          checked={!useSeparator}
                          onChange={() => setUseSeparator(false)}
                          className="text-blue-600"
                        />
                        <span>แบบรวดเดียว 13 หลัก (เช่น {year2}{resp2}{cat2}{type3}{formattedSeq})</span>
                      </label>
                    </div>

                    <div className="font-mono text-sm font-extrabold text-blue-700 bg-white px-3 py-1 rounded border border-blue-300 shadow-sm">
                      รหัสทรัพย์สิน: {assetCode}
                    </div>
                  </div>
                </div>

                {/* Main Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      <span className="text-rose-500">*</span> หมายเลขรหัสทรัพย์สิน (Asset Code):
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={assetCode}
                        onChange={(e) => setAssetCode(e.target.value)}
                        disabled={autoGenerateCode}
                        className={`w-full border rounded-lg px-3 py-2 font-mono font-bold text-sm ${
                          autoGenerateCode ? 'bg-slate-100 text-blue-800 border-slate-300' : 'bg-white border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setAutoGenerateCode(!autoGenerateCode)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                          autoGenerateCode 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{autoGenerateCode ? '✔ สร้างตามสูตร' : 'กรอกเอง'}</span>
                      </button>
                    </div>
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
                    <label className="block font-semibold text-slate-700 mb-1">
                      <span className="text-rose-500">*</span> หมวดหมู่:
                    </label>
                    <select
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="สำนักงานและครุภัณฑ์">สำนักงานและครุภัณฑ์</option>
                      <option value="คอมพิวเตอร์และอุปกรณ์ไอที">คอมพิวเตอร์และอุปกรณ์ไอที</option>
                      <option value="ยานพาหนะและขนส่ง">ยานพาหนะและขนส่ง</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      <span className="text-rose-500">*</span> ชื่อรายการทรัพย์สิน:
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium"
                      placeholder="เช่น โต๊ะทำงานผู้บริหาร"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ประเภท:</label>
                    <input
                      type="text"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium"
                      placeholder="เช่น โต๊ะทำงาน / เก้าอี้"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ยี่ห้อ / แบรนด์:</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">รุ่น / Model:</label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      <span className="text-rose-500">*</span> Serial Number:
                    </label>
                    <input
                      type="text"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">สเปกและรายละเอียดเพิ่มเติม:</label>
                  <textarea
                    value={spec}
                    onChange={(e) => setSpec(e.target.value)}
                    rows={2}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: จัดซื้อ/สัญญา */}
            {activeTab === 2 && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg font-semibold text-blue-900">
                  [ข้อมูลการเงินและสัญญาจัดซื้อจัดจ้าง]
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      <span className="text-rose-500">*</span> ปีงบประมาณ:
                    </label>
                    <select
                      value={budgetYear}
                      onChange={(e) => setBudgetYear(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold"
                    >
                      <option value="2569">2569</option>
                      <option value="2568">2568</option>
                      <option value="2567">2567</option>
                    </select>
                  </div>

                  <div>
                    <ThaiDatePicker
                      label="วันที่ตรวจรับ / ได้มา"
                      value={acquisitionDate}
                      onChange={(val) => setAcquisitionDate(val)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">เลขที่สัญญา/PO:</label>
                    <input
                      type="text"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ผู้จัดจำหน่าย / ร้านค้า:</label>
                    <input
                      type="text"
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      <span className="text-rose-500">*</span> ราคาจัดซื้อ (บาท):
                    </label>
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 font-bold text-blue-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">อายุการใช้งาน (ปี):</label>
                    <input
                      type="number"
                      value={usefulLifeYears}
                      onChange={(e) => setUsefulLifeYears(parseInt(e.target.value) || 5)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">อัตราค่าเสื่อมราคา:</label>
                    <select
                      value={depreciationMethod}
                      onChange={(e) => setDepreciationMethod(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2"
                    >
                      <option value="20% ต่อปี (เส้นตรง)">20% ต่อปี (เส้นตรง)</option>
                      <option value="10% ต่อปี (เส้นตรง)">10% ต่อปี (เส้นตรง)</option>
                      <option value="ไม่คิดค่าเสื่อมราคา">ไม่คิดค่าเสื่อมราคา</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: สถานที่และการถือครอง */}
            {activeTab === 3 && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg font-semibold text-emerald-900">
                  [สถานที่ติดตั้งและการมอบหมายผู้ดูแล]
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    <span className="text-rose-500">*</span> หน่วยงานผู้รับผิดชอบ (ดรอปดาวน์ตัวย่อจาก .txt):
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium"
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
                    <span className="text-rose-500">*</span> อาคาร / ชั้น / ห้องสถานที่ตั้ง:
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ผู้ถือครอง / ผู้ดูแลรักษา:
                  </label>
                  <input
                    type="text"
                    value={custodian}
                    onChange={(e) => setCustodian(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 font-medium"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: ภาพถ่ายและเอกสาร */}
            {activeTab === 4 && (
              <div className="space-y-4 text-xs">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">📸 อัปโหลดรูปภาพตัวเครื่อง / หรือแนบไฟล์เอกสาร PDF ใบตรวจรับ</p>
                  <p className="text-slate-400 text-[11px] mt-1">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์ (รองรับ JPG, PNG, PDF ขนาดไม่เกิน 10MB)</p>
                </div>
              </div>
            )}

          </div>

          {/* Footer Action Bar */}
          <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                type="button"
                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs hover:bg-slate-50 font-medium"
              >
                <FileText className="w-3.5 h-3.5 text-red-600" />
                <span>แนบไฟล์ใบตรวจรับ PDF</span>
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/30 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>บันทึกรหัส {assetCode} และพิมพ์ QR Code</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
