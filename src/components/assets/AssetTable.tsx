'use client';

import React, { useState, useMemo } from 'react';
import { formatThaiDate } from '../../lib/dateUtils';
import { DEPARTMENT_LIST } from '../../data/departments';
import { Asset, AssetStatus } from '../../types/asset';

import { 
  Search, 
  Filter, 
  Plus, 
  Printer, 
  Truck, 
  FileSpreadsheet, 
  Eye, 
  Edit3, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  Upload,
  Calendar
} from 'lucide-react';

interface AssetTableProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (asset: Asset) => void;
  onOpenNewAssetModal: () => void;
  onOpenImportModal: () => void;
  onOpenQRPrintModal: (assets: Asset[]) => void;
  onOpenTransferModal?: (assets: Asset[]) => void;
  onTriggerToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  onSelectAsset,
  onEditAsset,
  onDeleteAsset,
  onOpenNewAssetModal,
  onOpenImportModal,
  onOpenQRPrintModal,
  onOpenTransferModal,
  onTriggerToast,
}) => {
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter Logic
  const filteredAssets = useMemo(() => {
    return assets.filter((ast) => {
      if (selectedCategory !== 'all' && ast.category !== selectedCategory) return false;
      if (selectedDept !== 'all' && ast.department !== selectedDept) return false;
      if (selectedStatus !== 'all' && ast.status !== selectedStatus) return false;
      if (selectedYear !== 'all' && ast.budgetYear !== selectedYear) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchCode = ast.assetCode.toLowerCase().includes(q);
        const matchName = ast.name.toLowerCase().includes(q);
        const matchSN = ast.serialNumber.toLowerCase().includes(q);
        const matchCustodian = ast.custodian.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchSN && !matchCustodian) return false;
      }
      return true;
    });
  }, [assets, selectedCategory, selectedDept, selectedStatus, selectedYear, searchQuery]);

  // Checkbox handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredAssets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAssets.map(a => a.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectedAssetObjects = useMemo(() => {
    return assets.filter(a => selectedIds.includes(a.id));
  }, [assets, selectedIds]);

  // Status Badge Component
  const renderStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">[ใช้งาน]</span>;
      case 'repair':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">[ส่งซ่อม]</span>;
      case 'damaged':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-300">[ชำรุด] รอจำหน่าย</span>;
      case 'pending_disposal':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300">[รอจำหน่าย]</span>;
      case 'disposed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700 border border-slate-400">[ตัดจำหน่ายแล้ว]</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 font-medium flex items-center space-x-1">
        <span>หน้าหลัก</span>
        <span>&gt;</span>
        <span>ทะเบียนครุภัณฑ์</span>
        <span>&gt;</span>
        <span className="text-slate-800 font-semibold">รายการครุภัณฑ์ทั้งหมด</span>
      </div>

      {/* Advanced Filter Panel */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>🔍 ตัวกรองขั้นสูง (Advanced Filters)</span>
          </h2>
          <button 
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDept('all');
              setSelectedStatus('all');
              setSelectedYear('all');
              setSearchQuery('');
              onTriggerToast('info', 'ล้างตัวกรองแล้ว', 'แสดงผลรายการครุภัณฑ์ทั้งหมด');
            }}
            className="text-[11px] text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">หมวดหมู่:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">-- ทุกหมวดหมู่ --</option>
              <option value="คอมพิวเตอร์และอุปกรณ์ไอที">คอมพิวเตอร์และอุปกรณ์ไอที</option>
              <option value="สำนักงานและครุภัณฑ์">สำนักงานและครุภัณฑ์</option>
              <option value="ยานพาหนะและขนส่ง">ยานพาหนะและขนส่ง</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">สำนัก/ฝ่าย/ตัวย่อ:</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">-- ทุกหน่วยงาน ({DEPARTMENT_LIST.length}) --</option>
              {DEPARTMENT_LIST.map((dept, idx) => (
                <option key={`${dept.code}-${idx}`} value={dept.code}>
                  {dept.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">สถานะ:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">-- ทุกสถานะ --</option>
              <option value="active">ใช้งานปกติ</option>
              <option value="repair">ส่งซ่อม</option>
              <option value="damaged">ชำรุดรอจำหน่าย</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">ปีงบประมาณ:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">-- ทุกปีงบประมาณ --</option>
              <option value="2569">2569</option>
              <option value="2568">2568</option>
              <option value="2567">2567</option>
              <option value="2565">2565</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">ค้นหา:</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="พิมพ์รหัส, S/N, ผู้ถือครอง..."
                className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center space-x-2">
          <span className="text-xs text-slate-600 font-medium mr-1">
            การจัดการกลุ่ม: <span className="font-bold text-blue-600">เลือกแล้ว ({selectedIds.length})</span>
          </span>

          <button
            disabled={selectedIds.length === 0}
            onClick={() => onOpenQRPrintModal(selectedAssetObjects)}
            className={`flex items-center space-x-1.5 text-xs px-3 py-2 rounded-lg font-medium transition-all ${
              selectedIds.length > 0
                ? 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>🖨️ พิมพ์ QR Code ({selectedIds.length})</span>
          </button>

          <button
            disabled={selectedIds.length === 0}
            onClick={() => onOpenTransferModal ? onOpenTransferModal(selectedAssetObjects) : null}
            className={`flex items-center space-x-1.5 text-xs px-3 py-2 rounded-lg font-medium transition-all ${
              selectedIds.length > 0
                ? 'bg-amber-600 text-white hover:bg-amber-500 shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>🚚 ทำเรื่องโอนย้าย</span>
          </button>

          <button
            onClick={() => onTriggerToast('success', 'ส่งออกรายงานสำเร็จ', 'ดาวน์โหลดไฟล์รายงาน Excel/PDF สำเร็จแล้ว')}
            className="flex items-center space-x-1.5 text-xs px-3 py-2 rounded-lg font-medium bg-emerald-700 text-white hover:bg-emerald-600 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>📤 ส่งออกรายงาน (Excel/PDF)</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenImportModal}
            className="flex items-center space-x-1.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>📥 นำเข้าข้อมูล (CSV/Excel)</span>
          </button>

          <button
            onClick={onOpenNewAssetModal}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-blue-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>➕ ลงทะเบียนรับใหม่</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-800 uppercase text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 w-10 text-center">
                  <button onClick={handleSelectAll} className="text-slate-600 hover:text-blue-600">
                    {selectedIds.length === filteredAssets.length && filteredAssets.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3 font-semibold">หมายเลขครุภัณฑ์</th>
                <th className="p-3 font-semibold">รายการ / รายละเอียด</th>
                <th className="p-3 font-semibold">Serial Number</th>
                <th className="p-3 font-semibold whitespace-nowrap">วันที่ได้มา</th>
                <th className="p-3 font-semibold">หน่วยงาน / ผู้ถือครอง</th>
                <th className="p-3 font-semibold">สถานที่ตั้ง</th>
                <th className="p-3 font-semibold text-center">สถานะ</th>
                <th className="p-3 font-semibold text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    ไม่พบรายการครุภัณฑ์ที่ตรงตามเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const isChecked = selectedIds.includes(asset.id);
                  return (
                    <tr 
                      key={asset.id} 
                      className={`hover:bg-blue-50/50 transition-colors ${isChecked ? 'bg-blue-50/70' : ''}`}
                    >
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleToggleSelect(asset.id)}
                          className="text-slate-500 hover:text-blue-600"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      
                      <td className="p-3 font-bold text-blue-700 whitespace-nowrap">
                        {asset.assetCode}
                      </td>

                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{asset.name}</div>
                        <div className="text-[11px] text-slate-500">{asset.spec}</div>
                      </td>

                      <td className="p-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {asset.serialNumber}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span>{formatThaiDate(asset.acquisitionDate)}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-medium text-slate-800">{asset.department}</div>
                        <div className="text-[11px] text-slate-500">
                          {asset.custodian}
                        </div>
                      </td>

                      <td className="p-3 text-slate-600 font-medium">
                        {asset.location}
                      </td>

                      <td className="p-3 text-center whitespace-nowrap">
                        {renderStatusBadge(asset.status)}
                      </td>

                      <td className="p-3 text-center whitespace-nowrap space-x-1">
                        <button
                          onClick={() => onSelectAsset(asset)}
                          className="inline-flex items-center space-x-1 text-[11px] font-medium px-2.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>ดูประวัติ</span>
                        </button>
                        <button
                          onClick={() => onEditAsset(asset)}
                          className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-1.5 bg-amber-100 text-amber-900 hover:bg-amber-600 hover:text-white rounded transition-colors shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>แก้ไข</span>
                        </button>
                        <button
                          onClick={() => onDeleteAsset(asset)}
                          className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-1.5 bg-rose-100 text-rose-800 hover:bg-rose-600 hover:text-white rounded transition-colors shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ลบ</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="bg-slate-50 p-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
          <div>
            แสดงผล <span className="font-bold text-slate-800">1 - {filteredAssets.length}</span> จากทั้งหมด{' '}
            <span className="font-bold text-slate-800">{assets.length}</span> รายการ
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span>แสดงแถว:</span>
              <select className="bg-white border border-slate-300 rounded px-2 py-1 text-xs">
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <button className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-100">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium">หน้า 1 / {Math.ceil(filteredAssets.length / 25) || 1}</span>
              <button className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-100">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
