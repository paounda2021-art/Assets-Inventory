'use client';

import React, { useState, useEffect } from 'react';
import { 
  FolderPlus, 
  Layers, 
  Building2, 
  Plus, 
  Check, 
  Search, 
  Trash2, 
  Settings as SettingsIcon,
  Tag,
  AlertCircle
} from 'lucide-react';
import { ToastType } from '../ui/Toast';
import { DEPARTMENT_LIST, DepartmentItem } from '../../data/departments';

export interface CategoryOption {
  code: string;
  name: string;
}

export interface TypeOption {
  code: string;
  name: string;
}

interface SettingsViewProps {
  categories: CategoryOption[];
  typeCodesMap: Record<string, TypeOption[]>;
  departments: DepartmentItem[];
  onAddCategory: (category: CategoryOption) => void;
  onAddType: (categoryCode: string, typeItem: TypeOption) => void;
  onAddDepartment: (dept: DepartmentItem) => void;
  onTriggerToast: (type: ToastType, title: string, message?: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  categories,
  typeCodesMap,
  departments,
  onAddCategory,
  onAddType,
  onAddDepartment,
  onTriggerToast,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'departments'>('categories');

  // New Category Form State
  const [newCatCode, setNewCatCode] = useState<string>('');
  const [newCatName, setNewCatName] = useState<string>('');

  // New Subtype Form State
  const [selectedCatCodeForType, setSelectedCatCodeForType] = useState<string>(
    categories[0]?.code || '01'
  );
  const [newTypeCode, setNewTypeCode] = useState<string>('');
  const [newTypeName, setNewTypeName] = useState<string>('');

  // Auto calculate NEXT Category Code (e.g. 13)
  useEffect(() => {
    const maxCatNum = categories.reduce((max, cat) => {
      const num = parseInt(cat.code, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextCat = String(maxCatNum + 1).padStart(2, '0');
    setNewCatCode(nextCat);
  }, [categories]);

  // Auto calculate NEXT Subtype Code for selected category (e.g. 009)
  useEffect(() => {
    const currentSubtypes = typeCodesMap[selectedCatCodeForType] || [];
    const maxTypeNum = currentSubtypes.reduce((max, t) => {
      const num = parseInt(t.code, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextType = String(maxTypeNum + 1).padStart(3, '0');
    setNewTypeCode(nextType);
  }, [selectedCatCodeForType, typeCodesMap]);

  // New Department Form State
  const [newDeptCode, setNewDeptCode] = useState<string>('');
  const [newDeptTitle, setNewDeptTitle] = useState<string>('');
  const [deptSearch, setDeptSearch] = useState<string>('');

  // Filter Subtypes for selected Category
  const currentSubtypes = typeCodesMap[selectedCatCodeForType] || [];

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatCode.trim() || !newCatName.trim()) {
      onTriggerToast('warning', 'ข้อมูลไม่ครบถ้วน', 'กรุณาระบุทั้งรหัสประเภทและชื่อประเภท');
      return;
    }

    const formattedCode = newCatCode.padStart(2, '0');
    // Check duplicate
    if (categories.some(c => c.code === formattedCode)) {
      onTriggerToast('error', 'รหัสประเภทซ้ำ', `รหัสประเภท ${formattedCode} มีอยู่ในระบบแล้ว`);
      return;
    }

    const newCategory: CategoryOption = {
      code: formattedCode,
      name: `${formattedCode} ${newCatName.trim()}`,
    };

    onAddCategory(newCategory);
    onTriggerToast('success', 'เพิ่มประเภทครุภัณฑ์สำเร็จ', `เพิ่มหมวด ${newCategory.name} เรียบร้อยแล้ว`);
    setNewCatCode('');
    setNewCatName('');
  };

  const handleCreateType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeCode.trim() || !newTypeName.trim()) {
      onTriggerToast('warning', 'ข้อมูลไม่ครบถ้วน', 'กรุณาระบุทั้งรหัสชนิดและชื่อชนิดครุภัณฑ์');
      return;
    }

    const formattedCode = newTypeCode.padStart(3, '0');
    // Check duplicate
    if (currentSubtypes.some(t => t.code === formattedCode)) {
      onTriggerToast('error', 'รหัสชนิดซ้ำ', `รหัสชนิด ${formattedCode} มีในหมวดนี้แล้ว`);
      return;
    }

    const newTypeItem: TypeOption = {
      code: formattedCode,
      name: `${formattedCode} ${newTypeName.trim()}`,
    };

    onAddType(selectedCatCodeForType, newTypeItem);
    onTriggerToast('success', 'เพิ่มชนิดครุภัณฑ์สำเร็จ', `เพิ่มชนิด ${newTypeItem.name} ในหมวด ${selectedCatCodeForType} เรียบร้อยแล้ว`);
    setNewTypeCode('');
    setNewTypeName('');
  };

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptCode.trim() || !newDeptTitle.trim()) {
      onTriggerToast('warning', 'ข้อมูลไม่ครบถ้วน', 'กรุณาระบุตัวย่อและชื่อหน่วยงาน');
      return;
    }

    const code = newDeptCode.trim();
    if (departments.some(d => d.code.toLowerCase() === code.toLowerCase())) {
      onTriggerToast('error', 'ตัวย่อซ้ำ', `ตัวย่อหน่วยงาน ${code} มีในระบบแล้ว`);
      return;
    }

    const newDept: DepartmentItem = {
      code,
      fullTitle: `${code} - ${newDeptTitle.trim()}`,
    };

    onAddDepartment(newDept);
    onTriggerToast('success', 'เพิ่มหน่วยงานสำเร็จ', `เพิ่มตัวย่อ ${code} เข้าสู่ระบบเรียบร้อย`);
    setNewDeptCode('');
    setNewDeptTitle('');
  };

  const filteredDepartments = departments.filter(d =>
    d.code.toLowerCase().includes(deptSearch.toLowerCase()) ||
    d.fullTitle.toLowerCase().includes(deptSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold">⚙️ ตั้งค่าระบบและโครงสร้างข้อมูล (System Master Settings)</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            จัดการประเภทครุภัณฑ์ (Category), ชนิดครุภัณฑ์ (Subtype), และโครงสร้างตัวย่อหน่วยงาน/ผู้ถือครอง
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            ประเภทและชนิดครุภัณฑ์
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'departments'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            ตัวย่อหน่วยงาน ({departments.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Category & Subtype Manager */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Box 1: Categories Manager */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">1. จัดการประเภทครุภัณฑ์ (Category)</h3>
                  <p className="text-xs text-slate-500">รหัสประเภท 2 หลัก (เช่น 01, 02, 13)</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
                {categories.length} ประเภท
              </span>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleCreateCategory} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                เพิ่มประเภทครุภัณฑ์ใหม่
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">รหัส 2 หลัก</label>
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="เช่น 13"
                    value={newCatCode}
                    onChange={(e) => setNewCatCode(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">ชื่อประเภทครุภัณฑ์</label>
                  <input
                    type="text"
                    placeholder="เช่น ครุภัณฑ์สำรวจและวิจัย"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" />
                บันทึกเพิ่มประเภทครุภัณฑ์
              </button>
            </form>

            {/* Existing Categories List */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              <h4 className="text-xs font-semibold text-slate-600">รายการประเภทครุภัณฑ์ทั้งหมด</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {categories.map((cat) => (
                  <div key={cat.code} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-mono font-bold rounded">
                        {cat.code}
                      </span>
                      <span className="font-medium text-slate-800">{cat.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {(typeCodesMap[cat.code] || []).length} ชนิด
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Box 2: Subtypes Manager */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">2. จัดการชนิดครุภัณฑ์ (Subtype)</h3>
                  <p className="text-xs text-slate-500">รหัสชนิด 3 หลัก (เช่น 001, 002, 009)</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                {currentSubtypes.length} ชนิด
              </span>
            </div>

            {/* Select Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">เลือกประเภทครุภัณฑ์ที่ต้องการจัดการชนิด</label>
              <select
                value={selectedCatCodeForType}
                onChange={(e) => setSelectedCatCodeForType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map((cat) => (
                  <option key={cat.code} value={cat.code}>
                    {cat.name} (มี { (typeCodesMap[cat.code] || []).length } ชนิด)
                  </option>
                ))}
              </select>
            </div>

            {/* Add Subtype Form */}
            <form onSubmit={handleCreateType} className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-3">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                เพิ่มชนิดครุภัณฑ์ใหม่ในหมวด {selectedCatCodeForType}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">รหัส 3 หลัก</label>
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="เช่น 009"
                    value={newTypeCode}
                    onChange={(e) => setNewTypeCode(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">ชื่อชนิดครุภัณฑ์</label>
                  <input
                    type="text"
                    placeholder="เช่น โดรนสำรวจทางอากาศ"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" />
                บันทึกเพิ่มชนิดครุภัณฑ์
              </button>
            </form>

            {/* Existing Subtypes List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              <h4 className="text-xs font-semibold text-slate-600">ชนิดครุภัณฑ์ในหมวดนี้</h4>
              {currentSubtypes.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  ยังไม่มีชนิดครุภัณฑ์ในหมวดนี้ กดเพิ่มชนิดด้านบนได้ทันที
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {currentSubtypes.map((typeItem) => (
                    <div key={typeItem.code} className="p-2.5 bg-white hover:bg-slate-50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold rounded">
                          {typeItem.code}
                        </span>
                        <span className="font-medium text-slate-800">{typeItem.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Department Abbreviations Manager */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                รายชื่อหน่วยงานและผู้ถือครองจากไฟล์ .txt ({departments.length} รายการ)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                รายการตัวย่อในวงเล็บและตัวย่อแผนก สำหรับใช้เป็นตัวเลือก Dropdown ทั้งหมดในระบบ
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาตัวย่อ หรือชื่อหน่วยงาน..."
                value={deptSearch}
                onChange={(e) => setDeptSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Add Custom Department Form */}
          <form onSubmit={handleCreateDepartment} className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-3">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" />
              เพิ่มตัวย่อหน่วยงานใหม่
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">ตัวย่อ (เช่น ฝตน., สพด., ผสบ.)</label>
                <input
                  type="text"
                  placeholder="เช่น ฝสส."
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">ชื่อเต็มหน่วยงาน</label>
                <input
                  type="text"
                  placeholder="เช่น ฝ่ายส่งเสริมและพัฒนาประมง"
                  value={newDeptTitle}
                  onChange={(e) => setNewDeptTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 transition-colors ml-auto"
            >
              <Plus className="w-4 h-4" />
              บันทึกเพิ่มหน่วยงาน
            </button>
          </form>

          {/* Department List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
            {filteredDepartments.map((dept, idx) => (
              <div
                key={`${dept.code}-${idx}`}
                className="p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-xl flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-md shrink-0 shadow-xs">
                    {dept.code}
                  </span>
                  <span className="text-slate-700 truncate font-medium" title={dept.fullTitle}>
                    {dept.fullTitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
