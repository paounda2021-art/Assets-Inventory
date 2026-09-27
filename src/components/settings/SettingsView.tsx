'use client';

import React, { useState, useEffect } from 'react';
import { 
  FolderPlus, 
  Layers, 
  Building2, 
  Boxes,
  TrendingDown,
  ShieldCheck,
  Plus, 
  Check, 
  Search, 
  Trash2, 
  Settings as SettingsIcon,
  Tag,
  AlertCircle,
  FileText,
  UserCheck,
  ChevronRight,
  Info,
  Pencil,
  X
} from 'lucide-react';
import { ToastType } from '../ui/Toast';
import { DepartmentItem } from '../../data/departments';

export interface CategoryOption {
  code: string;
  name: string;
}

export interface TypeOption {
  code: string;
  name: string;
}

export interface ResponsibleOption {
  code: string;
  name: string;
}

interface SettingsViewProps {
  categories: CategoryOption[];
  typeCodesMap: Record<string, TypeOption[]>;
  departments: DepartmentItem[];
  responsibleCodes?: ResponsibleOption[];
  supplyCategories?: string[];
  supplyUnits?: string[];
  systemConfig?: Record<string, string>;
  onAddCategory: (category: CategoryOption) => void;
  onUpdateCategory?: (code: string, name: string) => void;
  onDeleteCategory?: (code: string) => void;
  onAddType: (categoryCode: string, typeItem: TypeOption) => void;
  onUpdateType?: (categoryCode: string, code: string, name: string) => void;
  onDeleteType?: (categoryCode: string, code: string) => void;
  onAddDepartment: (dept: DepartmentItem) => void;
  onUpdateDepartment?: (code: string, fullTitle: string) => void;
  onDeleteDepartment?: (code: string) => void;
  onAddResponsibleCode?: (resp: ResponsibleOption) => void;
  onUpdateResponsibleCode?: (code: string, name: string) => void;
  onDeleteResponsibleCode?: (code: string) => void;
  onAddSupplyCategory?: (name: string) => void;
  onUpdateSupplyCategory?: (oldName: string, newName: string) => void;
  onDeleteSupplyCategory?: (name: string) => void;
  onAddSupplyUnit?: (name: string) => void;
  onUpdateSupplyUnit?: (oldName: string, newName: string) => void;
  onDeleteSupplyUnit?: (name: string) => void;
  onSaveConfig?: (key: string, value: string) => void;
  onTriggerToast: (type: ToastType, title: string, message?: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  categories,
  typeCodesMap,
  departments,
  responsibleCodes = [],
  supplyCategories = ['วัสดุสำนักงาน', 'เครื่องเขียน', 'วัสดุคอมพิวเตอร์', 'วัสดุงานบ้านงานครัว', 'วัสดุไฟฟ้าและวิทยุ', 'วัสดุการเกษตร', 'อื่นๆ'],
  supplyUnits = ['รีม', 'ด้าม', 'ตลับ', 'กล่อง', 'แผ่น', 'ชุด', 'เครื่อง', 'พวง', 'ม้วน', 'เล่ม', 'อัน', 'ขวด', 'ถุง'],
  systemConfig = {},
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddType,
  onUpdateType,
  onDeleteType,
  onAddDepartment,
  onUpdateDepartment,
  onDeleteDepartment,
  onAddResponsibleCode,
  onUpdateResponsibleCode,
  onDeleteResponsibleCode,
  onAddSupplyCategory,
  onUpdateSupplyCategory,
  onDeleteSupplyCategory,
  onAddSupplyUnit,
  onUpdateSupplyUnit,
  onDeleteSupplyUnit,
  onSaveConfig,
  onTriggerToast,
}) => {
  // Active Sidebar Sub-menu Tab State
  const [activeSubMenu, setActiveSubMenu] = useState<
    'categories' | 'departments' | 'supplies' | 'depreciation' | 'organization'
  >('categories');

  // --- Edit Modal States ---
  const [editingCategory, setEditingCategory] = useState<{ code: string; name: string } | null>(null);
  const [editingType, setEditingType] = useState<{ categoryCode: string; code: string; name: string } | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<{ code: string; fullTitle: string } | null>(null);
  const [editingRespCode, setEditingRespCode] = useState<{ code: string; name: string } | null>(null);
  const [editingSupplyCat, setEditingSupplyCat] = useState<{ oldName: string; newName: string } | null>(null);
  const [editingSupplyUnit, setEditingSupplyUnit] = useState<{ oldName: string; newName: string } | null>(null);

  // --- 1. Asset Categories & Subtypes State ---
  const [newCatCode, setNewCatCode] = useState<string>('');
  const [newCatName, setNewCatName] = useState<string>('');
  const [selectedCatCodeForType, setSelectedCatCodeForType] = useState<string>(
    categories[0]?.code || '01'
  );
  const [newTypeCode, setNewTypeCode] = useState<string>('');
  const [newTypeName, setNewTypeName] = useState<string>('');

  // Auto calculate NEXT Category Code
  useEffect(() => {
    const maxCatNum = categories.reduce((max, cat) => {
      const num = parseInt(cat.code, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextCat = String(maxCatNum + 1).padStart(2, '0');
    setNewCatCode(nextCat);
  }, [categories]);

  // Auto calculate NEXT Subtype Code for selected category
  useEffect(() => {
    const currentSubtypes = typeCodesMap[selectedCatCodeForType] || [];
    const maxTypeNum = currentSubtypes.reduce((max, t) => {
      const num = parseInt(t.code, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextType = String(maxTypeNum + 1).padStart(3, '0');
    setNewTypeCode(nextType);
  }, [selectedCatCodeForType, typeCodesMap]);

  // --- 2. Departments & Responsible Codes State ---
  const [newDeptCode, setNewDeptCode] = useState<string>('');
  const [newDeptTitle, setNewDeptTitle] = useState<string>('');
  const [deptSearch, setDeptSearch] = useState<string>('');

  const [newRespCode, setNewRespCode] = useState<string>('');
  const [newRespName, setNewRespName] = useState<string>('');

  // --- 3. Supply Categories & Units State ---
  const [newSupCatName, setNewSupCatName] = useState<string>('');
  const [newSupUnitName, setNewSupUnitName] = useState<string>('');

  // --- 4 & 5. Config Form State ---
  const [orgName, setOrgName] = useState<string>(systemConfig.orgName || 'องค์การสะพานปลา (Fish Marketing Organization)');
  const [fiscalYear, setFiscalYear] = useState<string>(systemConfig.fiscalYear || '2569');
  const [defaultApprover, setDefaultApprover] = useState<string>(systemConfig.defaultApprover || 'ผู้อำนวยการองค์การสะพานปลา');
  const [usefulLife, setUsefulLife] = useState<string>(systemConfig.defaultUsefulLife || '5');
  const [depreciationRate, setDepreciationRate] = useState<string>(systemConfig.defaultDepreciationMethod || '20% ต่อปี (เส้นตรง)');

  // Handlers for Category & Subtype
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatCode.trim() || !newCatName.trim()) {
      onTriggerToast('warning', 'ข้อมูลไม่ครบถ้วน', 'กรุณาระบุทั้งรหัสหมวดหมู่และชื่อหมวดหมู่');
      return;
    }
    const formattedCode = newCatCode.padStart(2, '0');
    if (categories.some(c => c.code === formattedCode)) {
      onTriggerToast('error', 'รหัสหมวดหมู่ซ้ำ', `รหัสหมวดหมู่ ${formattedCode} มีอยู่แล้วในระบบ`);
      return;
    }
    const newCat = { code: formattedCode, name: `${formattedCode} ${newCatName.trim()}` };
    onAddCategory(newCat);
    setNewCatName('');
    onTriggerToast('success', 'เพิ่มหมวดหมู่สำเร็จ!', `เพิ่มหมวดหมู่ครุภัณฑ์ใหม่ ${newCat.name} เรียบร้อยแล้ว`);
  };

  const handleCreateType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeCode.trim() || !newTypeName.trim()) {
      onTriggerToast('warning', 'ข้อมูลไม่ครบถ้วน', 'กรุณาระบุทั้งรหัสชนิดและชื่อชนิดครุภัณฑ์');
      return;
    }
    const formattedCode = newTypeCode.padStart(3, '0');
    const existingSubtypes = typeCodesMap[selectedCatCodeForType] || [];
    if (existingSubtypes.some(t => t.code === formattedCode)) {
      onTriggerToast('error', 'รหัสชนิดซ้ำ', `รหัสชนิด ${formattedCode} มีอยู่แล้วในหมวดหมู่นี้`);
      return;
    }
    const newTypeItem = { code: formattedCode, name: `${formattedCode} ${newTypeName.trim()}` };
    onAddType(selectedCatCodeForType, newTypeItem);
    setNewTypeName('');
    onTriggerToast('success', 'เพิ่มชนิดครุภัณฑ์สำเร็จ!', `เพิ่มชนิด ${newTypeItem.name} เรียบร้อยแล้ว`);
  };

  // Handlers for Department & Responsible Code
  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptCode.trim() || !newDeptTitle.trim()) {
      onTriggerToast('warning', 'ข้อมูลไม่ครบถ้วน', 'กรุณากรอกทั้งรหัสย่อและชื่อเต็มหน่วยงาน');
      return;
    }
    const codeUpper = newDeptCode.trim().toUpperCase();
    if (departments.some(d => d.code.toUpperCase() === codeUpper)) {
      onTriggerToast('error', 'รหัสหน่วยงานซ้ำ', `รหัสหน่วยงาน ${codeUpper} มีอยู่แล้วในระบบ`);
      return;
    }
    const newDept = { code: codeUpper, fullTitle: newDeptTitle.trim() };
    onAddDepartment(newDept);
    setNewDeptCode('');
    setNewDeptTitle('');
    onTriggerToast('success', 'เพิ่มหน่วยงานสำเร็จ!', `เพิ่มหน่วยงาน ${newDept.code} - ${newDept.fullTitle} เรียบร้อย`);
  };

  const handleCreateRespCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRespCode.trim() || !newRespName.trim()) {
      onTriggerToast('warning', 'ข้อมูลไม่ครบถ้วน', 'กรุณากรอกรหัสและชื่อผู้รับผิดชอบ');
      return;
    }
    const codeFormatted = newRespCode.trim().padStart(2, '0');
    const newResp = { code: codeFormatted, name: `${codeFormatted} - ${newRespName.trim()}` };
    if (onAddResponsibleCode) {
      onAddResponsibleCode(newResp);
    }
    setNewRespCode('');
    setNewRespName('');
    onTriggerToast('success', 'เพิ่มรหัสผู้รับผิดชอบสำเร็จ!', `บันทึกรหัส ${newResp.code} เรียบร้อยแล้ว`);
  };

  // Handlers for Supply Categories & Units
  const handleCreateSupplyCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupCatName.trim()) return;
    if (onAddSupplyCategory) {
      onAddSupplyCategory(newSupCatName.trim());
    }
    setNewSupCatName('');
    onTriggerToast('success', 'เพิ่มหมวดหมู่วัสดุสำเร็จ!', `เพิ่ม ${newSupCatName.trim()} เรียบร้อย`);
  };

  const handleCreateSupplyUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupUnitName.trim()) return;
    if (onAddSupplyUnit) {
      onAddSupplyUnit(newSupUnitName.trim());
    }
    setNewSupUnitName('');
    onTriggerToast('success', 'เพิ่มหน่วยนับสำเร็จ!', `เพิ่มหน่วยนับ ${newSupUnitName.trim()} เรียบร้อย`);
  };

  // Save Org & Config
  const handleSaveConfigForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveConfig) {
      onSaveConfig('orgName', orgName);
      onSaveConfig('fiscalYear', fiscalYear);
      onSaveConfig('defaultApprover', defaultApprover);
      onSaveConfig('defaultUsefulLife', usefulLife);
      onSaveConfig('defaultDepreciationMethod', depreciationRate);
    }
    onTriggerToast('success', 'บันทึกการตั้งค่าสำเร็จ!', 'อัปเดตข้อมูลองค์กรและการตั้งค่าระบบเรียบร้อยแล้ว');
  };

  const filteredDepts = departments.filter(d => 
    d.code.toLowerCase().includes(deptSearch.toLowerCase()) ||
    d.fullTitle.toLowerCase().includes(deptSearch.toLowerCase())
  );

  const currentSubtypes = typeCodesMap[selectedCatCodeForType] || [];

  return (
    <div className="space-y-5 text-slate-800">
      
      {/* Top Main Title Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-[20px] font-extrabold text-slate-900 flex items-center space-x-2">
            <SettingsIcon className="w-6 h-6 text-blue-600 animate-spin-slow" />
            <span>6. ตั้งค่าระบบ (System Configuration & Master Data)</span>
          </h2>
          <p className="text-[14px] text-slate-500 mt-0.5">
            บริหารจัดการข้อมูลหลัก (Master Data) โครงสร้างองค์กร รหัสรันระบบ และการตั้งค่าพื้นฐานสำหรับทั้งองค์กร
          </p>
        </div>
      </div>

      {/* Main Layout: Left Sub-Menu Sidebar (260px) + Right Detail Panel */}
      <div className="flex flex-col md:flex-row gap-5 items-start">
        
        {/* LEFT SUB-MENU SIDEBAR */}
        <div className="w-full md:w-64 bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-1 shrink-0">
          <div className="px-3 py-2 text-[13px] font-bold text-slate-400 uppercase tracking-wider">
            เมนูตั้งค่าระบบ (Settings Menu)
          </div>

          <button
            onClick={() => setActiveSubMenu('categories')}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-[16px] font-bold transition-all ${
              activeSubMenu === 'categories'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center space-x-2 shrink-0">
              <FolderPlus className="w-4 h-4 shrink-0" />
              <span>1. หมวดหมู่ & ชนิดครุภัณฑ์</span>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 ${activeSubMenu === 'categories' ? 'text-white' : 'text-slate-400'}`} />
          </button>

          <button
            onClick={() => setActiveSubMenu('departments')}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-[16px] font-bold transition-all ${
              activeSubMenu === 'departments'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center space-x-2 shrink-0">
              <Building2 className="w-4 h-4 shrink-0" />
              <span>2. หน่วยงาน & รหัสผู้รับผิดชอบ</span>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 ${activeSubMenu === 'departments' ? 'text-white' : 'text-slate-400'}`} />
          </button>

          <button
            onClick={() => setActiveSubMenu('supplies')}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-[16px] font-bold transition-all ${
              activeSubMenu === 'supplies'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center space-x-2 shrink-0">
              <Boxes className="w-4 h-4 shrink-0" />
              <span>3. หมวดหมู่ & หน่วยนับวัสดุ</span>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 ${activeSubMenu === 'supplies' ? 'text-white' : 'text-slate-400'}`} />
          </button>

          <button
            onClick={() => setActiveSubMenu('depreciation')}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-[16px] font-bold transition-all ${
              activeSubMenu === 'depreciation'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center space-x-2 shrink-0">
              <TrendingDown className="w-4 h-4 shrink-0" />
              <span>4. ค่าเสื่อมราคา & สถานะ</span>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 ${activeSubMenu === 'depreciation' ? 'text-white' : 'text-slate-400'}`} />
          </button>

          <button
            onClick={() => setActiveSubMenu('organization')}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-[16px] font-bold transition-all ${
              activeSubMenu === 'organization'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center space-x-2 shrink-0">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>5. ข้อมูลองค์กร & ผู้อนุมัติ</span>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 ${activeSubMenu === 'organization' ? 'text-white' : 'text-slate-400'}`} />
          </button>

          <div className="pt-3 border-t border-slate-100 p-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-500 space-y-1">
              <div className="font-bold text-slate-700 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>คำแนะนำการใช้งาน:</span>
              </div>
              <div>ข้อมูลที่ตั้งค่าจะถูกนำไปซิงค์ใช้กับแบบฟอร์มลงทะเบียน พัสดุ และรายงานทั่วทั้งระบบทันที</div>
            </div>
          </div>
        </div>

        {/* RIGHT DETAIL PANEL */}
        <div className="flex-1 w-full space-y-5">
          
          {/* ================= PANEL 1: CATEGORIES & SUBTYPES ================= */}
          {activeSubMenu === 'categories' && (
            <div className="space-y-5">
              {/* Category Section */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-[16px] text-slate-900 flex items-center space-x-2">
                    <FolderPlus className="w-4 h-4 text-blue-600" />
                    <span>จัดการหมวดหมู่ครุภัณฑ์หลัก (Asset Categories - 2 หลัก)</span>
                  </h3>
                  <span className="text-[14px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold border border-blue-200">
                    ทั้งหมด {categories.length} หมวดหมู่
                  </span>
                </div>

                <form onSubmit={handleCreateCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-[14px]">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">รหัสหมวดหมู่ (2 หลัก):</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={newCatCode}
                      onChange={(e) => setNewCatCode(e.target.value)}
                      placeholder="เช่น 13"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ชื่อหมวดหมู่ครุภัณฑ์:</label>
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="เช่น ครุภัณฑ์การศึกษา..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[14px] font-bold shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ เพิ่มหมวดหมู่หลัก</span>
                    </button>
                  </div>
                </form>

                {/* List Table of Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[14px]">
                  {categories.map((cat) => (
                    <div key={cat.code} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-blue-300 transition-all">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 font-bold rounded-md">
                          {cat.code}
                        </span>
                        <span className="font-bold text-slate-800">{cat.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingCategory({ code: cat.code, name: cat.name })}
                          title="แก้ไขหมวดหมู่"
                          className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteCategory && (
                          <button
                            onClick={() => onDeleteCategory(cat.code)}
                            title="ลบหมวดหมู่"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtype Section */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-[16px] text-slate-900 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>จัดการชนิดครุภัณฑ์ย่อย (Subtypes / Kinds - 3 หลัก)</span>
                  </h3>
                </div>

                <div className="flex items-center space-x-3 text-[14px]">
                  <span className="font-bold text-slate-700">เลือกหมวดหมู่หลัก:</span>
                  <select
                    value={selectedCatCodeForType}
                    onChange={(e) => setSelectedCatCodeForType(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-[14px] font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handleCreateType} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-[14px]">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">รหัสชนิด (3 หลัก):</label>
                    <input
                      type="text"
                      maxLength={3}
                      value={newTypeCode}
                      onChange={(e) => setNewTypeCode(e.target.value)}
                      placeholder="เช่น 009"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ชื่อชนิดครุภัณฑ์ย่อย:</label>
                    <input
                      type="text"
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                      placeholder="เช่น โต๊ะประชุมไม้..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[14px] font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ เพิ่มชนิดย่อย</span>
                    </button>
                  </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[14px]">
                  {currentSubtypes.map((sub) => (
                    <div key={sub.code} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between hover:bg-white transition-all">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold rounded">
                          {sub.code}
                        </span>
                        <span className="font-bold text-slate-800">{sub.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingType({ categoryCode: selectedCatCodeForType, code: sub.code, name: sub.name })}
                          title="แก้ไขชนิดย่อย"
                          className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteType && (
                          <button
                            onClick={() => onDeleteType(selectedCatCodeForType, sub.code)}
                            title="ลบชนิดย่อย"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= PANEL 2: DEPARTMENTS & RESPONSIBLE CODES ================= */}
          {activeSubMenu === 'departments' && (
            <div className="space-y-5">
              {/* Department Section */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-[16px] text-slate-900 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>จัดการรายชื่อหน่วยงาน / ฝ่าย (Department List)</span>
                  </h3>
                  <span className="text-[14px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold border border-blue-200">
                    ทั้งหมด {departments.length} หน่วยงาน
                  </span>
                </div>

                <form onSubmit={handleCreateDepartment} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-[14px]">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">รหัสย่อหน่วยงาน:</label>
                    <input
                      type="text"
                      value={newDeptCode}
                      onChange={(e) => setNewDeptCode(e.target.value)}
                      placeholder="เช่น สทส., สลข., สนอ."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ชื่อเต็มหน่วยงาน:</label>
                    <input
                      type="text"
                      value={newDeptTitle}
                      onChange={(e) => setNewDeptTitle(e.target.value)}
                      placeholder="เช่น สำนักเทคโนโลยีสารสนเทศ..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[14px] font-bold shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ เพิ่มหน่วยงาน</span>
                    </button>
                  </div>
                </form>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={deptSearch}
                    onChange={(e) => setDeptSearch(e.target.value)}
                    placeholder="ค้นหารหัสหรือชื่อหน่วยงาน..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-[14px] focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[14px] max-h-72 overflow-y-auto pr-1">
                  {filteredDepts.map((d) => (
                    <div key={d.code} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-blue-300 transition-all">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-900 font-bold rounded">
                          {d.code}
                        </span>
                        <span className="font-bold text-slate-800">{d.fullTitle}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingDepartment({ code: d.code, fullTitle: d.fullTitle })}
                          title="แก้ไขหน่วยงาน"
                          className="p-1 text-slate-400 hover:text-blue-600 rounded"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteDepartment && (
                          <button
                            onClick={() => onDeleteDepartment(d.code)}
                            title="ลบหน่วยงาน"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Responsible Codes Section */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-[16px] text-slate-900 flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-indigo-600" />
                    <span>จัดการรหัสผู้รับผิดชอบ (Responsible Codes - สูตรสร้างรหัสครุภัณฑ์)</span>
                  </h3>
                </div>

                <form onSubmit={handleCreateRespCode} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-[14px]">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">รหัสผู้รับผิดชอบ (2 หลัก):</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={newRespCode}
                      onChange={(e) => setNewRespCode(e.target.value)}
                      placeholder="เช่น 24"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ชื่อผู้รับผิดชอบ / สาขา:</label>
                    <input
                      type="text"
                      value={newRespName}
                      onChange={(e) => setNewRespName(e.target.value)}
                      placeholder="เช่น ท่าเทียบเรือประมงใหม่..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[14px] font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ เพิ่มรหัสผู้รับผิดชอบ</span>
                    </button>
                  </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[14px] max-h-60 overflow-y-auto pr-1">
                  {responsibleCodes.map((r) => (
                    <div key={r.code} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div className="font-bold text-slate-800">{r.name}</div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingRespCode({ code: r.code, name: r.name })}
                          title="แก้ไขรหัสผู้รับผิดชอบ"
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteResponsibleCode && (
                          <button
                            onClick={() => onDeleteResponsibleCode(r.code)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= PANEL 3: SUPPLY CATEGORIES & UNITS ================= */}
          {activeSubMenu === 'supplies' && (
            <div className="space-y-5">
              {/* Supply Categories Section */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-[16px] text-slate-900 flex items-center space-x-2">
                    <Boxes className="w-4 h-4 text-blue-600" />
                    <span>จัดการหมวดหมู่วัสดุสิ้นเปลือง (Supply Categories)</span>
                  </h3>
                </div>

                <form onSubmit={handleCreateSupplyCat} className="flex gap-3 text-[14px]">
                  <input
                    type="text"
                    value={newSupCatName}
                    onChange={(e) => setNewSupCatName(e.target.value)}
                    placeholder="พิมพ์ชื่อหมวดหมู่วัสดุสิ้นเปลือง เช่น วัสดุทำความสะอาด..."
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[14px] font-bold shadow-md shadow-blue-600/20 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ เพิ่มหมวดหมู่</span>
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 text-[14px]">
                  {supplyCategories.map((cat) => (
                    <div key={cat} className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-900 font-bold rounded-xl flex items-center space-x-2">
                      <span>{cat}</span>
                      <button onClick={() => setEditingSupplyCat({ oldName: cat, newName: cat })} title="แก้ไขหมวดหมู่" className="text-slate-400 hover:text-blue-600">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteSupplyCategory && (
                        <button onClick={() => onDeleteSupplyCategory(cat)} title="ลบหมวดหมู่" className="text-slate-400 hover:text-rose-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Supply Units Section */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-[16px] text-slate-900 flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>จัดการหน่วยนับพัสดุ (Units of Measurement)</span>
                  </h3>
                </div>

                <form onSubmit={handleCreateSupplyUnit} className="flex gap-3 text-[14px]">
                  <input
                    type="text"
                    value={newSupUnitName}
                    onChange={(e) => setNewSupUnitName(e.target.value)}
                    placeholder="พิมพ์หน่วยนับใหม่ เช่น แฟ้ม, ม้วน, แท่ง..."
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[14px] font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ เพิ่มหน่วยนับ</span>
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 text-[14px]">
                  {supplyUnits.map((unit) => (
                    <div key={unit} className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold rounded-xl flex items-center space-x-2">
                      <span>{unit}</span>
                      <button onClick={() => setEditingSupplyUnit({ oldName: unit, newName: unit })} title="แก้ไขหน่วยนับ" className="text-slate-400 hover:text-emerald-600">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteSupplyUnit && (
                        <button onClick={() => onDeleteSupplyUnit(unit)} title="ลบหน่วยนับ" className="text-slate-400 hover:text-rose-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= PANEL 4: DEPRECIATION & STATUS SETTINGS ================= */}
          {activeSubMenu === 'depreciation' && (
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-[16px] text-slate-900 flex items-center space-x-2">
                    <TrendingDown className="w-4 h-4 text-blue-600" />
                    <span>การตั้งค่าอัตราค่าเสื่อมราคาและอายุการใช้งานมาตรฐาน</span>
                  </h3>
                </div>

                <form onSubmit={handleSaveConfigForm} className="space-y-4 text-[14px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">อายุการใช้งานมาตรฐาน (ปี):</label>
                      <input
                        type="number"
                        value={usefulLife}
                        onChange={(e) => setUsefulLife(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">วิธีการคำนวณค่าเสื่อมราคามาตรฐาน:</label>
                      <input
                        type="text"
                        value={depreciationRate}
                        onChange={(e) => setDepreciationRate(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[14px] font-bold shadow-md shadow-blue-600/20 flex items-center space-x-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>บันทึกการตั้งค่าค่าเสื่อม</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Status Definitions Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-bold text-[16px] text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <Tag className="w-4 h-4 text-amber-500" />
                  <span>คำนิยามสถานะครุภัณฑ์ในระบบ (Asset Status Definitions)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px]">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                    <div className="font-bold text-emerald-900">🟢 ใช้งานปกติ (Active)</div>
                    <div className="text-slate-600">ครุภัณฑ์สภาพดี พร้อมใช้งานประจำวัน</div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                    <div className="font-bold text-amber-900">🟡 ส่งซ่อม (Repair)</div>
                    <div className="text-slate-600">อยู่ระหว่างส่งซ่อมแซมศูนย์บริการ</div>
                  </div>

                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                    <div className="font-bold text-rose-900">🔴 ชำรุดรอจำหน่าย (Damaged)</div>
                    <div className="text-slate-600">ชำรุดไม่คุ้มซ่อมแซม รอดำเนินการตัดจำหน่าย</div>
                  </div>

                  <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl space-y-1">
                    <div className="font-bold text-slate-900">⚪ ตัดจำหน่ายแล้ว (Disposed)</div>
                    <div className="text-slate-600">อนุมัติตัดจำหน่ายออกจากทะเบียนพัสดุองค์กรแล้ว</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PANEL 5: ORGANIZATION & APPROVERS PROFILE ================= */}
          {activeSubMenu === 'organization' && (
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-[16px] text-slate-900 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>ข้อมูลองค์กรและผู้อนุมัติเอกสารพัสดุ</span>
                  </h3>
                </div>

                <form onSubmit={handleSaveConfigForm} className="space-y-4 text-[14px]">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ชื่อหน่วยงาน / องค์กรหลัก:</label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">ปีงบประมาณปัจจุบัน:</label>
                      <input
                        type="text"
                        value={fiscalYear}
                        onChange={(e) => setFiscalYear(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">ตำแหน่งผู้อนุมัติโอนย้าย/ตัดจำหน่าย:</label>
                      <input
                        type="text"
                        value={defaultApprover}
                        onChange={(e) => setDefaultApprover(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[14px] font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[14px] font-bold shadow-md shadow-blue-600/20 flex items-center space-x-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>บันทึกข้อมูลองค์กร</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* --- EDIT MODALS --- */}
      {/* 1. Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-[16px] flex items-center gap-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>แก้ไขหมวดหมู่ครุภัณฑ์ ({editingCategory.code})</span>
              </h3>
              <button onClick={() => setEditingCategory(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-[14px]">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">รหัสหมวดหมู่ (2 หลัก):</label>
                <input type="text" value={editingCategory.code} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-500" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ชื่อหมวดหมู่:</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-[14px] font-bold"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (onUpdateCategory && editingCategory.name.trim()) {
                    onUpdateCategory(editingCategory.code, editingCategory.name.trim());
                    onTriggerToast('success', 'แก้ไขหมวดหมู่สำเร็จ!', `อัปเดต ${editingCategory.code} เรียบร้อยแล้ว`);
                  }
                  setEditingCategory(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[14px] font-bold shadow-md"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Edit Subtype Modal */}
      {editingType && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-[16px] flex items-center gap-2">
                <Pencil className="w-4 h-4 text-emerald-600" />
                <span>แก้ไขชนิดครุภัณฑ์ย่อย ({editingType.code})</span>
              </h3>
              <button onClick={() => setEditingType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-[14px]">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">รหัสชนิด (3 หลัก):</label>
                <input type="text" value={editingType.code} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-500" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ชื่อชนิดครุภัณฑ์ย่อย:</label>
                <input
                  type="text"
                  value={editingType.name}
                  onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingType(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-[14px] font-bold"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (onUpdateType && editingType.name.trim()) {
                    onUpdateType(editingType.categoryCode, editingType.code, editingType.name.trim());
                    onTriggerToast('success', 'แก้ไขชนิดย่อยสำเร็จ!', `อัปเดต ${editingType.code} เรียบร้อยแล้ว`);
                  }
                  setEditingType(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[14px] font-bold shadow-md"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Edit Department Modal */}
      {editingDepartment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-[16px] flex items-center gap-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>แก้ไขหน่วยงาน ({editingDepartment.code})</span>
              </h3>
              <button onClick={() => setEditingDepartment(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-[14px]">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">รหัสย่อหน่วยงาน:</label>
                <input type="text" value={editingDepartment.code} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-500" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ชื่อเต็มหน่วยงาน:</label>
                <input
                  type="text"
                  value={editingDepartment.fullTitle}
                  onChange={(e) => setEditingDepartment({ ...editingDepartment, fullTitle: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingDepartment(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-[14px] font-bold"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (onUpdateDepartment && editingDepartment.fullTitle.trim()) {
                    onUpdateDepartment(editingDepartment.code, editingDepartment.fullTitle.trim());
                    onTriggerToast('success', 'แก้ไขหน่วยงานสำเร็จ!', `อัปเดตหน่วยงาน ${editingDepartment.code} เรียบร้อยแล้ว`);
                  }
                  setEditingDepartment(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[14px] font-bold shadow-md"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Edit Responsible Code Modal */}
      {editingRespCode && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-[16px] flex items-center gap-2">
                <Pencil className="w-4 h-4 text-indigo-600" />
                <span>แก้ไขรหัสผู้รับผิดชอบ ({editingRespCode.code})</span>
              </h3>
              <button onClick={() => setEditingRespCode(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-[14px]">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">รหัสผู้รับผิดชอบ (2 หลัก):</label>
                <input type="text" value={editingRespCode.code} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-500" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ชื่อผู้รับผิดชอบ / สาขา:</label>
                <input
                  type="text"
                  value={editingRespCode.name}
                  onChange={(e) => setEditingRespCode({ ...editingRespCode, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingRespCode(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-[14px] font-bold"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (onUpdateResponsibleCode && editingRespCode.name.trim()) {
                    onUpdateResponsibleCode(editingRespCode.code, editingRespCode.name.trim());
                    onTriggerToast('success', 'แก้ไขรหัสผู้รับผิดชอบสำเร็จ!', `อัปเดต ${editingRespCode.code} เรียบร้อยแล้ว`);
                  }
                  setEditingRespCode(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[14px] font-bold shadow-md"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Edit Supply Category Modal */}
      {editingSupplyCat && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-[16px] flex items-center gap-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>แก้ไขหมวดหมู่วัสดุสิ้นเปลือง</span>
              </h3>
              <button onClick={() => setEditingSupplyCat(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-[14px]">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ชื่อหมวดหมู่เดิม:</label>
                <input type="text" value={editingSupplyCat.oldName} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-500" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ชื่อหมวดหมู่ใหม่:</label>
                <input
                  type="text"
                  value={editingSupplyCat.newName}
                  onChange={(e) => setEditingSupplyCat({ ...editingSupplyCat, newName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingSupplyCat(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-[14px] font-bold"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (onUpdateSupplyCategory && editingSupplyCat.newName.trim()) {
                    onUpdateSupplyCategory(editingSupplyCat.oldName, editingSupplyCat.newName.trim());
                    onTriggerToast('success', 'แก้ไขหมวดหมู่วัสดุสำเร็จ!', `อัปเดตเป็น ${editingSupplyCat.newName.trim()} เรียบร้อยแล้ว`);
                  }
                  setEditingSupplyCat(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[14px] font-bold shadow-md"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Edit Supply Unit Modal */}
      {editingSupplyUnit && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-[16px] flex items-center gap-2">
                <Pencil className="w-4 h-4 text-emerald-600" />
                <span>แก้ไขหน่วยนับพัสดุ</span>
              </h3>
              <button onClick={() => setEditingSupplyUnit(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-[14px]">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ชื่อหน่วยนับเดิม:</label>
                <input type="text" value={editingSupplyUnit.oldName} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-500" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ชื่อหน่วยนับใหม่:</label>
                <input
                  type="text"
                  value={editingSupplyUnit.newName}
                  onChange={(e) => setEditingSupplyUnit({ ...editingSupplyUnit, newName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingSupplyUnit(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-[14px] font-bold"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (onUpdateSupplyUnit && editingSupplyUnit.newName.trim()) {
                    onUpdateSupplyUnit(editingSupplyUnit.oldName, editingSupplyUnit.newName.trim());
                    onTriggerToast('success', 'แก้ไขหน่วยนับสำเร็จ!', `อัปเดตเป็น ${editingSupplyUnit.newName.trim()} เรียบร้อยแล้ว`);
                  }
                  setEditingSupplyUnit(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[14px] font-bold shadow-md"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
