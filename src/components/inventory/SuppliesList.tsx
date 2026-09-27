'use client';

import React, { useState } from 'react';
import { SupplyItem } from '../../types/asset';
import { 
  Boxes, 
  Plus, 
  AlertTriangle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  X, 
  Check, 
  Package, 
  DollarSign, 
  Calendar, 
  Building2, 
  FileText
} from 'lucide-react';
import { DEPARTMENT_LIST, DepartmentItem } from '../../data/departments';

interface SuppliesListProps {
  supplies: SupplyItem[];
  departments?: DepartmentItem[];
  onAddSupply?: (newItem: SupplyItem) => void;
  onUpdateSupply?: (updatedItem: SupplyItem) => void;
  onDeleteSupply?: (id: string) => void;
  onDisburse: (id: string, qty: number, requester?: string, department?: string, note?: string) => void;
  onRestock?: (id: string, qty: number, unitPrice?: number, supplier?: string) => void;
  onTriggerToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}

const CATEGORY_OPTIONS = [
  'วัสดุสำนักงาน',
  'เครื่องเขียน',
  'วัสดุคอมพิวเตอร์',
  'วัสดุงานบ้านงานครัว',
  'วัสดุไฟฟ้าและวิทยุ',
  'วัสดุการเกษตร',
  'อื่นๆ'
];

const UNIT_OPTIONS = [
  'รีม',
  'ด้าม',
  'ตลับ',
  'กล่อง',
  'แผ่น',
  'ชุด',
  'เครื่อง',
  'พวง',
  'ม้วน',
  'เล่ม',
  'อัน',
  'ถุง',
  'ขวด'
];

export const SuppliesList: React.FC<SuppliesListProps> = ({
  supplies,
  departments = DEPARTMENT_LIST,
  onAddSupply,
  onUpdateSupply,
  onDeleteSupply,
  onDisburse,
  onRestock,
  onTriggerToast
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('all');

  // Active Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<SupplyItem | null>(null);

  const [disburseItem, setDisburseItem] = useState<SupplyItem | null>(null);
  const [disburseQty, setDisburseQty] = useState<number>(1);
  const [disburseRequester, setDisburseRequester] = useState<string>('รณิดา โชติธนาอุดม');
  const [disburseDept, setDisburseDept] = useState<string>('ส่วนกลางและสะพานปลากรุงเทพ');
  const [disburseNote, setDisburseNote] = useState<string>('เบิกใช้ในงานสำนักงานประจำเดือน');

  const [restockItem, setRestockItem] = useState<SupplyItem | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);
  const [restockUnitPrice, setRestockUnitPrice] = useState<number>(0);
  const [restockSupplier, setRestockSupplier] = useState<string>('');

  const [deletingItem, setDeletingItem] = useState<SupplyItem | null>(null);

  // Form State for Add / Edit
  const [formCode, setFormCode] = useState<string>('');
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('วัสดุสำนักงาน');
  const [formUnit, setFormUnit] = useState<string>('รีม');
  const [formMinStock, setFormMinStock] = useState<number>(10);
  const [formCurrentStock, setFormCurrentStock] = useState<number>(50);
  const [formUnitPrice, setFormUnitPrice] = useState<number>(100);

  // Open Form Modal for Creating New Item
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormCode(`SUP-${Math.floor(100 + Math.random() * 900)}`);
    setFormName('');
    setFormCategory('วัสดุสำนักงาน');
    setFormUnit('รีม');
    setFormMinStock(10);
    setFormCurrentStock(50);
    setFormUnitPrice(100);
    setIsFormModalOpen(true);
  };

  // Open Form Modal for Editing Item
  const handleOpenEditModal = (item: SupplyItem) => {
    setEditingItem(item);
    setFormCode(item.code);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormUnit(item.unit);
    setFormMinStock(item.minStock);
    setFormCurrentStock(item.currentStock);
    setFormUnitPrice(item.unitPrice);
    setIsFormModalOpen(true);
  };

  // Save Add / Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formName.trim()) {
      onTriggerToast('error', 'กรอกข้อมูลไม่ครบถ้วน', 'กรุณากรอกรหัสวัสดุและชื่อรายการวัสดุ');
      return;
    }

    if (editingItem) {
      const updated: SupplyItem = {
        ...editingItem,
        code: formCode.trim(),
        name: formName.trim(),
        category: formCategory,
        unit: formUnit,
        minStock: Number(formMinStock) || 0,
        currentStock: Number(formCurrentStock) || 0,
        unitPrice: Number(formUnitPrice) || 0,
      };
      if (onUpdateSupply) {
        onUpdateSupply(updated);
      }
      onTriggerToast('success', 'บันทึกแก้ไขสำเร็จ!', `ปรับปรุงข้อมูลวัสดุ ${updated.code} เรียบร้อยแล้ว`);
    } else {
      const newItem: SupplyItem = {
        id: `sup-${Date.now()}`,
        code: formCode.trim(),
        name: formName.trim(),
        category: formCategory,
        unit: formUnit,
        minStock: Number(formMinStock) || 0,
        currentStock: Number(formCurrentStock) || 0,
        unitPrice: Number(formUnitPrice) || 0,
        lastRestockDate: new Date().toISOString().substring(0, 10),
      };
      if (onAddSupply) {
        onAddSupply(newItem);
      }
      onTriggerToast('success', 'ลงทะเบียนสำเร็จ!', `เพิ่มวัสดุใหม่ ${newItem.code} เข้าสู่คลังเรียบร้อยแล้ว`);
    }
    setIsFormModalOpen(false);
  };

  // Confirm Disburse
  const handleConfirmDisburse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disburseItem) return;

    if (disburseQty <= 0) {
      onTriggerToast('warning', 'จำนวนไม่ถูกต้อง', 'กรุณาระบุจำนวนที่ต้องการเบิกมากกว่า 0');
      return;
    }
    if (disburseQty > disburseItem.currentStock) {
      onTriggerToast('error', 'สต็อกไม่พอเบิก', `วัสดุคงเหลือเพียง ${disburseItem.currentStock} ${disburseItem.unit}`);
      return;
    }

    onDisburse(disburseItem.id, disburseQty, disburseRequester, disburseDept, disburseNote);
    onTriggerToast('success', 'เบิกจ่ายสำเร็จ!', `เบิกจ่าย ${disburseItem.name} จำนวน ${disburseQty} ${disburseItem.unit} เรียบร้อยแล้ว`);
    setDisburseItem(null);
  };

  // Confirm Restock
  const handleConfirmRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockItem) return;

    if (restockQty <= 0) {
      onTriggerToast('warning', 'จำนวนไม่ถูกต้อง', 'กรุณาระบุจำนวนที่ต้องการรับเข้ามากกว่า 0');
      return;
    }

    if (onRestock) {
      onRestock(restockItem.id, restockQty, restockUnitPrice || restockItem.unitPrice, restockSupplier);
    } else if (onUpdateSupply) {
      const updated: SupplyItem = {
        ...restockItem,
        currentStock: restockItem.currentStock + restockQty,
        unitPrice: restockUnitPrice > 0 ? restockUnitPrice : restockItem.unitPrice,
        lastRestockDate: new Date().toISOString().substring(0, 10)
      };
      onUpdateSupply(updated);
    }

    onTriggerToast('success', 'เติมสต็อกสำเร็จ!', `รับเข้า ${restockItem.name} เพิ่มจำนวน ${restockQty} ${restockItem.unit} เรียบร้อยแล้ว`);
    setRestockItem(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    if (onDeleteSupply) {
      onDeleteSupply(deletingItem.id);
    }
    onTriggerToast('error', 'ลบรายการสำเร็จ', `ลบรายการวัสดุ ${deletingItem.code} ออกจากระบบเรียบร้อย`);
    setDeletingItem(null);
  };

  // Filtered Supplies Calculation
  const filteredSupplies = supplies.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = item.code.toLowerCase().includes(q) ||
                          item.name.toLowerCase().includes(q) ||
                          item.category.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    let matchesStatus = true;
    if (stockStatusFilter === 'low') {
      matchesStatus = item.currentStock <= item.minStock;
    } else if (stockStatusFilter === 'normal') {
      matchesStatus = item.currentStock > item.minStock;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate Metrics
  const totalItemsCount = supplies.length;
  const lowStockItemsCount = supplies.filter(s => s.currentStock <= s.minStock).length;
  const totalInventoryValuation = supplies.reduce((sum, s) => sum + (s.currentStock * s.unitPrice), 0);

  return (
    <div className="space-y-5 text-slate-800">
      
      {/* Top Title & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <Boxes className="w-6 h-6 text-blue-600" />
            <span>2.3 ทะเบียนวัสดุสิ้นเปลือง / พัสดุคงคลัง (Office Supplies & Inventory)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            จัดการคลังวัสดุสิ้นเปลือง ควบคุมจุดสั่งซื้อ (Reorder Level) เติมสต็อก และบันทึกการเบิกจ่าย
          </p>
        </div>

        <button 
          onClick={handleOpenAddModal}
          className="flex items-center justify-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ เพิ่มวัสดุใหม่</span>
        </button>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">รายการวัสดุทั้งหมด</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {totalItemsCount.toLocaleString()} <span className="text-xs font-normal text-slate-500">รายการ</span>
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">เตือนต้องสั่งเพิ่ม (ต่ำกว่า Min)</div>
            <div className="text-xl font-extrabold text-rose-600 mt-1 flex items-center gap-2">
              {lowStockItemsCount.toLocaleString()} <span className="text-xs font-normal text-slate-500">รายการ</span>
              {lowStockItemsCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] bg-rose-100 text-rose-700 font-bold rounded-full animate-pulse">
                  Alert
                </span>
              )}
            </div>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">มูลค่าวัสดุในคลังรวม</div>
            <div className="text-xl font-extrabold text-emerald-700 mt-1">
              ฿{totalInventoryValuation.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหารหัส, ชื่อวัสดุ, หมวดหมู่..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>หมวดหมู่:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">-- ทุกหมวดหมู่ --</option>
            {CATEGORY_OPTIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">-- ทุกสถานะสต็อก --</option>
            <option value="low">🔴 ต่ำกว่าจุดสั่งซื้อ (Min Alert)</option>
            <option value="normal">🟢 สต็อกปกติ</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 text-slate-800 uppercase text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">รหัสวัสดุ</th>
                <th className="p-3">รายการวัสดุสิ้นเปลือง</th>
                <th className="p-3">หมวดหมู่</th>
                <th className="p-3 text-center">คงเหลือปัจจุบัน</th>
                <th className="p-3 text-center">จุดสั่งเพิ่ม (Min)</th>
                <th className="p-3 text-right">ราคา/หน่วย</th>
                <th className="p-3 text-center">ล่าสุดรับเข้า</th>
                <th className="p-3 text-center min-w-[200px]">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSupplies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                    ไม่พบข้อมูลวัสดุสิ้นเปลืองตามเงื่อนไขที่ค้นหา
                  </td>
                </tr>
              ) : (
                filteredSupplies.map((item) => {
                  const isLow = item.currentStock <= item.minStock;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-blue-700">{item.code}</td>
                      <td className="p-3 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3 text-slate-600">{item.category}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-bold inline-flex items-center space-x-1 ${
                          isLow 
                            ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          <span>{item.currentStock} {item.unit}</span>
                          {isLow && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        </span>
                      </td>
                      <td className="p-3 text-center font-semibold text-slate-500">{item.minStock} {item.unit}</td>
                      <td className="p-3 text-right font-bold text-slate-800">
                        ฿{item.unitPrice.toFixed(2)}
                      </td>
                      <td className="p-3 text-center text-slate-500 font-medium">
                        {item.lastRestockDate || '-'}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Restock Button */}
                          <button
                            onClick={() => {
                              setRestockItem(item);
                              setRestockQty(10);
                              setRestockUnitPrice(item.unitPrice);
                              setRestockSupplier('');
                            }}
                            title="รับเข้า / เติมสต็อก"
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded font-semibold text-[11px] inline-flex items-center space-x-1 transition-colors"
                          >
                            <ArrowUpRight className="w-3 h-3" />
                            <span>รับเข้า</span>
                          </button>

                          {/* Disburse Button */}
                          <button
                            onClick={() => {
                              setDisburseItem(item);
                              setDisburseQty(1);
                            }}
                            title="บันทึกเบิกจ่าย"
                            className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded font-semibold text-[11px] inline-flex items-center space-x-1 transition-colors"
                          >
                            <ArrowDownLeft className="w-3 h-3" />
                            <span>เบิกจ่าย</span>
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            title="แก้ไขรายการ"
                            className="p-1 bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700 rounded transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeletingItem(item)}
                            title="ลบรายการ"
                            className="p-1 bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-700 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------- MODAL 1: ADD / EDIT SUPPLY ITEM ----------------- */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Boxes className="w-5 h-5 text-blue-600" />
                <span>{editingItem ? '✏️ แก้ไขรายการวัสดุสิ้นเปลือง' : '📦 เพิ่มรายการวัสดุสิ้นเปลืองใหม่'}</span>
              </h3>
              <button 
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    <span className="text-red-500">*</span> รหัสวัสดุ:
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="เช่น SUP-A4-80G"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">หมวดหมู่:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  <span className="text-red-500">*</span> ชื่อรายการวัสดุสิ้นเปลือง:
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="เช่น กระดาษถ่ายเอกสาร A4 80 แกรม (Double A)"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">หน่วยนับ:</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-2 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {UNIT_OPTIONS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">สั่งเพิ่ม (Min):</label>
                  <input
                    type="number"
                    min={0}
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg px-2 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">คงเหลือเริ่มต้น:</label>
                  <input
                    type="number"
                    min={0}
                    value={formCurrentStock}
                    onChange={(e) => setFormCurrentStock(parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg px-2 py-2 text-xs font-bold text-emerald-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ราคา/หน่วย (฿):</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={formUnitPrice}
                    onChange={(e) => setFormUnitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg px-2 py-2 text-xs font-bold text-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-right"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/30 flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>บันทึกข้อมูล</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: DISBURSE SUPPLY ITEM ----------------- */}
      {disburseItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <ArrowDownLeft className="w-5 h-5 text-blue-600" />
                <span>📤 บันทึกการเบิกจ่ายวัสดุสิ้นเปลือง</span>
              </h3>
              <button 
                onClick={() => setDisburseItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-blue-950 text-sm">{disburseItem.name} ({disburseItem.code})</div>
              <div className="text-blue-800 font-semibold flex items-center justify-between">
                <span>คงเหลือพร้อมเบิก:</span>
                <span className="text-sm font-extrabold text-blue-900">{disburseItem.currentStock} {disburseItem.unit}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmDisburse} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  <span className="text-red-500">*</span> จำนวนที่ต้องการเบิก ({disburseItem.unit}):
                </label>
                <input 
                  type="number" 
                  min={1} 
                  max={disburseItem.currentStock} 
                  required
                  value={disburseQty} 
                  onChange={(e) => setDisburseQty(parseInt(e.target.value) || 1)}
                  className="w-full border border-blue-300 rounded-lg px-3 py-2 text-base font-extrabold text-blue-900 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ผู้ขอเบิก:</label>
                <input
                  type="text"
                  value={disburseRequester}
                  onChange={(e) => setDisburseRequester(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">หน่วยงานที่ขอเบิก:</label>
                <select
                  value={disburseDept}
                  onChange={(e) => setDisburseDept(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  {departments.map((dept, idx) => (
                    <option key={`${dept.code}-${idx}`} value={dept.fullTitle}>
                      {dept.fullTitle} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">หมายเหตุ / วัตถุประสงค์:</label>
                <input
                  type="text"
                  value={disburseNote}
                  onChange={(e) => setDisburseNote(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDisburseItem(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/30 flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>ยืนยันเบิกจ่าย</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 3: RESTOCK SUPPLY ITEM ----------------- */}
      {restockItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                <span>📥 รับเข้า / เติมสต็อกวัสดุสิ้นเปลือง</span>
              </h3>
              <button 
                onClick={() => setRestockItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-emerald-950 text-sm">{restockItem.name} ({restockItem.code})</div>
              <div className="text-emerald-800 font-semibold flex items-center justify-between">
                <span>คงเหลือเดิม:</span>
                <span className="text-sm font-extrabold text-emerald-900">{restockItem.currentStock} {restockItem.unit}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmRestock} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  <span className="text-red-500">*</span> จำนวนรับเข้าเพิ่ม ({restockItem.unit}):
                </label>
                <input 
                  type="number" 
                  min={1} 
                  required
                  value={restockQty} 
                  onChange={(e) => setRestockQty(parseInt(e.target.value) || 1)}
                  className="w-full border border-emerald-300 rounded-lg px-3 py-2 text-base font-extrabold text-emerald-800 text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ราคาต่อหน่วยใหม่ (บาท):</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={restockUnitPrice}
                  onChange={(e) => setRestockUnitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 text-right focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ผู้จัดจำหน่าย / เลขที่ PO-ใบสั่งซื้อ:</label>
                <input
                  type="text"
                  value={restockSupplier}
                  onChange={(e) => setRestockSupplier(e.target.value)}
                  placeholder="เช่น หจก. ทรัพย์อนันต์ เทรดดิ้ง (PO 43/2569)"
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRestockItem(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>บันทึกการรับเข้า</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 4: CONFIRM DELETE SUPPLY ITEM ----------------- */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-full">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">ยืนยันการลบรายการวัสดุ</h3>
                <p className="text-xs text-slate-500">ต้องการลบรายการนี้ออกจากคลังพัสดุใช่หรือไม่?</p>
              </div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-900">
              <div>รหัส: {deletingItem.code}</div>
              <div>รายการ: {deletingItem.name}</div>
              <div>คงเหลือ: {deletingItem.currentStock} {deletingItem.unit}</div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-xs"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-600/30 flex items-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>ยืนยันลบรายการ</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
