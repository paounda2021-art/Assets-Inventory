'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Navbar, TabType } from '../components/layout/Navbar';
import { AssetTable } from '../components/assets/AssetTable';
import { NewAssetModal } from '../components/assets/NewAssetModal';
import { EditAssetModal } from '../components/assets/EditAssetModal';
import { ConfirmDeleteModal } from '../components/assets/ConfirmDeleteModal';
import { AssetDetailModal } from '../components/assets/AssetDetailModal';
import { QRCodePrintModal } from '../components/assets/QRCodePrintModal';
import { QRScannerModal } from '../components/audit/QRScannerModal';
import { ImportAssetModal } from '../components/assets/ImportAssetModal';
import { DashboardOverview } from '../components/dashboard/DashboardOverview';
import { SuppliesList } from '../components/inventory/SuppliesList';
import { MaintenanceList } from '../components/maintenance/MaintenanceList';
import { SettingsView, CategoryOption, TypeOption, ResponsibleOption } from '../components/settings/SettingsView';
import { TransactionsList } from '../components/transactions/TransactionsList';
import { TransferAssetModal } from '../components/transactions/TransferAssetModal';
import { ToastContainer, ToastMessage, ToastType } from '../components/ui/Toast';

import { INITIAL_SUPPLIES, INITIAL_MAINTENANCE } from '../data/mockAssets';
import { REAL_EXCEL_ASSETS } from '../data/excelAssets';
import { DEPARTMENT_LIST, DepartmentItem } from '../data/departments';
import { CATEGORY_CODES, TYPE_CODES, RESPONSIBLE_CODES } from '../lib/codeGenerator';
import { Asset, SupplyItem, MaintenanceRecord, AssetTransferRecord } from '../types/asset';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('assets');
  
  // Master Configuration State (Categories, Subtypes, Departments, Responsible Codes, Supply Masters, Config)
  const [categories, setCategories] = useState<CategoryOption[]>(CATEGORY_CODES);
  const [typeCodesMap, setTypeCodesMap] = useState<Record<string, TypeOption[]>>(TYPE_CODES);
  const [departments, setDepartments] = useState<DepartmentItem[]>(DEPARTMENT_LIST);
  const [responsibleCodes, setResponsibleCodes] = useState<ResponsibleOption[]>(RESPONSIBLE_CODES);
  const [supplyCategories, setSupplyCategories] = useState<string[]>(['วัสดุสำนักงาน', 'เครื่องเขียน', 'วัสดุคอมพิวเตอร์', 'วัสดุงานบ้านงานครัว', 'วัสดุไฟฟ้าและวิทยุ', 'วัสดุการเกษตร', 'อื่นๆ']);
  const [supplyUnits, setSupplyUnits] = useState<string[]>(['รีม', 'ด้าม', 'ตลับ', 'กล่อง', 'แผ่น', 'ชุด', 'เครื่อง', 'พวง', 'ม้วน', 'เล่ม', 'อัน', 'ขวด', 'ถุง']);
  const [systemConfig, setSystemConfig] = useState<Record<string, string>>({
    orgName: 'องค์การสะพานปลา (Fish Marketing Organization)',
    fiscalYear: '2569',
    defaultApprover: 'ผู้อำนวยการองค์การสะพานปลา',
    defaultDepreciationMethod: '20% ต่อปี (เส้นตรง)',
    defaultUsefulLife: '5'
  });

  // State Data (Only real 542 records from Excel file)
  const [assets, setAssets] = useState<Asset[]>(REAL_EXCEL_ASSETS);
  const [supplies, setSupplies] = useState<SupplyItem[]>(INITIAL_SUPPLIES);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(INITIAL_MAINTENANCE);
  const [transferRecords, setTransferRecords] = useState<AssetTransferRecord[]>([]);

  // Load initial data from SQLite via API endpoints
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Fetch Assets
        const resAssets = await fetch('/api/assets');
        const jsonAssets = await resAssets.json();
        if (jsonAssets.success && jsonAssets.data && jsonAssets.data.length > 0) {
          setAssets(jsonAssets.data);
        }

        // 2. Fetch Master Settings
        const resSettings = await fetch('/api/settings');
        const jsonSettings = await resSettings.json();
        if (jsonSettings.success && jsonSettings.data) {
          if (jsonSettings.data.categories?.length > 0) {
            setCategories(jsonSettings.data.categories);
          }
          if (Object.keys(jsonSettings.data.typeCodesMap || {}).length > 0) {
            setTypeCodesMap(jsonSettings.data.typeCodesMap);
          }
          if (jsonSettings.data.departments?.length > 0) {
            setDepartments(jsonSettings.data.departments);
          }
          if (jsonSettings.data.responsibleCodes?.length > 0) {
            setResponsibleCodes(jsonSettings.data.responsibleCodes);
          }
          if (jsonSettings.data.supplyCategories?.length > 0) {
            setSupplyCategories(jsonSettings.data.supplyCategories);
          }
          if (jsonSettings.data.supplyUnits?.length > 0) {
            setSupplyUnits(jsonSettings.data.supplyUnits);
          }
          if (jsonSettings.data.systemConfig) {
            setSystemConfig(jsonSettings.data.systemConfig);
          }
        }

        // 3. Fetch Transfers
        const resTransfers = await fetch('/api/transfers');
        const jsonTransfers = await resTransfers.json();
        if (jsonTransfers.success && jsonTransfers.data) {
          setTransferRecords(jsonTransfers.data);
        }

        // 4. Fetch Supplies
        const resSupplies = await fetch('/api/supplies');
        const jsonSupplies = await resSupplies.json();
        if (jsonSupplies.success && jsonSupplies.data && jsonSupplies.data.length > 0) {
          setSupplies(jsonSupplies.data);
        }
      } catch (err) {
        console.error('Failed to fetch initial data from SQLite backend:', err);
      }
    }
    loadData();
  }, []);

  // Transfer Modals State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [transferSelectedAssets, setTransferSelectedAssets] = useState<Asset[]>([]);

  const handleOpenTransferModal = (selected: Asset[] = []) => {
    setTransferSelectedAssets(selected);
    setIsTransferModalOpen(true);
  };

  const handleConfirmTransfer = async (record: AssetTransferRecord, updatedAssetItems: Asset[]) => {
    setTransferRecords(prev => [record, ...prev]);
    setAssets(prev => prev.map(ast => {
      const matched = updatedAssetItems.find(u => u.id === ast.id);
      return matched ? matched : ast;
    }));
    setIsTransferModalOpen(false);
    addToast('success', 'บันทึกการโอนย้ายสำเร็จ!', `ทำเรื่องโอนย้ายครุภัณฑ์ ${record.assetCodes.join(', ')} ไปยัง ${record.toDepartment} เรียบร้อยแล้ว`);

    // Sync to SQLite
    try {
      await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record, updatedAssets: updatedAssetItems })
      });
    } catch (err) {
      console.error('Failed to sync transfer to SQLite:', err);
    }
  };

  // Master Handlers
  const handleAddCategory = async (newCat: CategoryOption) => {
    setCategories(prev => [...prev, newCat]);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addCategory', data: newCat })
      });
    } catch (err) {
      console.error('Failed to sync new category:', err);
    }
  };

  const handleAddType = async (categoryCode: string, newTypeItem: TypeOption) => {
    setTypeCodesMap(prev => ({
      ...prev,
      [categoryCode]: [...(prev[categoryCode] || []), newTypeItem]
    }));
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addType', data: { categoryCode, type: newTypeItem } })
      });
    } catch (err) {
      console.error('Failed to sync new type:', err);
    }
  };

  const handleAddDepartment = async (newDept: DepartmentItem) => {
    setDepartments(prev => [newDept, ...prev]);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addDepartment', data: newDept })
      });
    } catch (err) {
      console.error('Failed to sync new department:', err);
    }
  };

  const handleDeleteCategory = async (code: string) => {
    setCategories(prev => prev.filter(c => c.code !== code));
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteCategory', data: { code } })
      });
    } catch (err) { console.error('Failed to delete category:', err); }
  };

  const handleDeleteType = async (categoryCode: string, code: string) => {
    setTypeCodesMap(prev => ({
      ...prev,
      [categoryCode]: (prev[categoryCode] || []).filter(t => t.code !== code)
    }));
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteType', data: { categoryCode, code } })
      });
    } catch (err) { console.error('Failed to delete type:', err); }
  };

  const handleDeleteDepartment = async (code: string) => {
    setDepartments(prev => prev.filter(d => d.code !== code));
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteDepartment', data: { code } })
      });
    } catch (err) { console.error('Failed to delete department:', err); }
  };

  const handleAddResponsibleCode = async (resp: ResponsibleOption) => {
    setResponsibleCodes(prev => [resp, ...prev]);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addResponsibleCode', data: resp })
      });
    } catch (err) { console.error('Failed to add responsible code:', err); }
  };

  const handleDeleteResponsibleCode = async (code: string) => {
    setResponsibleCodes(prev => prev.filter(r => r.code !== code));
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteResponsibleCode', data: { code } })
      });
    } catch (err) { console.error('Failed to delete responsible code:', err); }
  };

  const handleAddSupplyCategory = async (name: string) => {
    setSupplyCategories(prev => [...new Set([name, ...prev])]);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addSupplyCategory', data: { name } })
      });
    } catch (err) { console.error('Failed to add supply category:', err); }
  };

  const handleDeleteSupplyCategory = async (name: string) => {
    setSupplyCategories(prev => prev.filter(c => c !== name));
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteSupplyCategory', data: { name } })
      });
    } catch (err) { console.error('Failed to delete supply category:', err); }
  };

  const handleAddSupplyUnit = async (name: string) => {
    setSupplyUnits(prev => [...new Set([name, ...prev])]);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addSupplyUnit', data: { name } })
      });
    } catch (err) { console.error('Failed to add supply unit:', err); }
  };

  const handleDeleteSupplyUnit = async (name: string) => {
    setSupplyUnits(prev => prev.filter(u => u !== name));
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteSupplyUnit', data: { name } })
      });
    } catch (err) { console.error('Failed to delete supply unit:', err); }
  };

  const handleSaveConfig = async (key: string, value: string) => {
    setSystemConfig(prev => ({ ...prev, [key]: value }));
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'saveSystemConfig', data: { key, value } })
      });
    } catch (err) { console.error('Failed to save config:', err); }
  };

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Modals state
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null);
  const [isNewAssetOpen, setIsNewAssetOpen] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [qrPrintAssets, setQrPrintAssets] = useState<Asset[]>([]);
  const [isAuditScannerOpen, setIsAuditScannerOpen] = useState<boolean>(false);

  // Handlers with Toast Feedback & SQLite Sync
  const handleSaveNewAsset = async (newAsset: Asset) => {
    setAssets(prev => [newAsset, ...prev]);
    setIsNewAssetOpen(false);
    addToast('success', 'บันทึกสำเร็จ!', `ลงทะเบียนครุภัณฑ์ใหม่ ${newAsset.assetCode} เรียบร้อยแล้ว`);
    // Auto open QR print for newly registered asset
    setQrPrintAssets([newAsset]);

    try {
      await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAsset)
      });
    } catch (err) {
      console.error('Failed to sync new asset to SQLite:', err);
    }
  };

  const handleUpdateAsset = async (updatedAsset: Asset) => {
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
    setEditingAsset(null);
    addToast('success', 'อัปเดตข้อมูลสำเร็จ!', `ปรับปรุงข้อมูลครุภัณฑ์ ${updatedAsset.assetCode} เรียบร้อยแล้ว`);

    try {
      await fetch('/api/assets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAsset)
      });
    } catch (err) {
      console.error('Failed to sync updated asset to SQLite:', err);
    }
  };

  const handleConfirmDeleteAsset = async (id: string) => {
    const targetAsset = assets.find(a => a.id === id);
    setAssets(prev => prev.filter(a => a.id !== id));
    addToast('error', 'ลบรายการเรียบร้อย', `ลบรายการครุภัณฑ์ ${targetAsset?.assetCode || ''} ออกจากระบบแล้ว`);

    try {
      await fetch(`/api/assets?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to sync delete asset to SQLite:', err);
    }
  };

  const handleImportAssets = async (importedList: Asset[]) => {
    setAssets(prev => [...importedList, ...prev]);
    addToast('success', 'นำเข้าข้อมูลสำเร็จ!', `นำเข้าข้อมูลครุภัณฑ์ ${importedList.length} รายการเข้าสู่ระบบเรียบร้อย`);

    for (const item of importedList) {
      try {
        await fetch('/api/assets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      } catch (err) {
        console.error('Failed to import asset into SQLite:', err);
      }
    }
  };

  const handleAddSupply = async (newSupply: SupplyItem) => {
    setSupplies(prev => [newSupply, ...prev]);
    try {
      await fetch('/api/supplies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupply)
      });
    } catch (err) {
      console.error('Failed to save new supply to SQLite:', err);
    }
  };

  const handleUpdateSupply = async (updatedSupply: SupplyItem) => {
    setSupplies(prev => prev.map(s => s.id === updatedSupply.id ? updatedSupply : s));
    try {
      await fetch('/api/supplies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSupply)
      });
    } catch (err) {
      console.error('Failed to update supply in SQLite:', err);
    }
  };

  const handleDeleteSupply = async (id: string) => {
    setSupplies(prev => prev.filter(s => s.id !== id));
    try {
      await fetch(`/api/supplies?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to delete supply in SQLite:', err);
    }
  };

  const handleDisburseSupply = async (id: string, qty: number, requester?: string, department?: string, note?: string) => {
    let targetItem: SupplyItem | null = null;
    setSupplies(prev => prev.map(item => {
      if (item.id === id) {
        targetItem = {
          ...item,
          currentStock: Math.max(0, item.currentStock - qty)
        };
        return targetItem;
      }
      return item;
    }));

    if (targetItem) {
      try {
        await fetch('/api/supplies', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetItem)
        });
      } catch (err) {
        console.error('Failed to sync disburse supply:', err);
      }
    }
  };

  const handleRestockSupply = async (id: string, qty: number, unitPrice?: number, supplier?: string) => {
    let targetItem: SupplyItem | null = null;
    setSupplies(prev => prev.map(item => {
      if (item.id === id) {
        targetItem = {
          ...item,
          currentStock: item.currentStock + qty,
          unitPrice: (unitPrice && unitPrice > 0) ? unitPrice : item.unitPrice,
          lastRestockDate: new Date().toISOString().substring(0, 10)
        };
        return targetItem;
      }
      return item;
    }));

    if (targetItem) {
      try {
        await fetch('/api/supplies', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetItem)
        });
      } catch (err) {
        console.error('Failed to sync restock supply:', err);
      }
    }
  };

  const handleConfirmAudit = async (assetId: string, note: string) => {
    let updatedTargetAsset: Asset | null = null;
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        const auditLog = {
          id: `h-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          type: 'audit' as const,
          title: 'ตรวจนับประจำปี 2569 (Mobile QR)',
          by: 'กรรมการตรวจนับ (สแกนผ่าน Mobile Web Scanner)',
          detail: `ผลการตรวจ: ${note}`,
          statusBadge: '🟢 อยู่ในสภาพดี'
        };
        updatedTargetAsset = {
          ...a,
          history: [auditLog, ...a.history]
        };
        return updatedTargetAsset;
      }
      return a;
    }));
    addToast('success', 'บันทึกตรวจนับสำเร็จ!', 'อัปเดตประวัติการตรวจพบพัสดุเรียบร้อยแล้ว');

    if (updatedTargetAsset) {
      try {
        await fetch('/api/assets', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTargetAsset)
        });
      } catch (err) {
        console.error('Failed to sync audit to SQLite:', err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* System Header Bar */}
      <Header onOpenAuditScanner={() => setIsAuditScannerOpen(true)} />

      {/* Navigation Modules Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardOverview
            assets={assets}
            supplies={supplies}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAuditScanner={() => setIsAuditScannerOpen(true)}
          />
        )}

        {/* Tab 2: Master Asset Registry */}
        {activeTab === 'assets' && (
          <AssetTable
            assets={assets}
            onSelectAsset={(ast) => setSelectedAsset(ast)}
            onEditAsset={(ast) => setEditingAsset(ast)}
            onDeleteAsset={(ast) => setDeletingAsset(ast)}
            onOpenNewAssetModal={() => setIsNewAssetOpen(true)}
            onOpenImportModal={() => setIsImportOpen(true)}
            onOpenQRPrintModal={(selectedAssets) => setQrPrintAssets(selectedAssets)}
            onOpenTransferModal={handleOpenTransferModal}
            onTriggerToast={addToast}
          />
        )}

        {/* Tab 2.3: Office Supplies */}
        {activeTab === 'supplies' && (
          <SuppliesList
            supplies={supplies}
            onAddSupply={handleAddSupply}
            onUpdateSupply={handleUpdateSupply}
            onDeleteSupply={handleDeleteSupply}
            onDisburse={handleDisburseSupply}
            onRestock={handleRestockSupply}
            onTriggerToast={addToast}
          />
        )}

        {/* Tab 3: Transactions & Movement */}
        {activeTab === 'transactions' && (
          <TransactionsList
            assets={assets}
            transferRecords={transferRecords}
            onOpenTransferModal={handleOpenTransferModal}
            onTriggerToast={addToast}
          />
        )}

        {/* Tab 4: Maintenance */}
        {activeTab === 'maintenance' && (
          <MaintenanceList records={maintenanceRecords} />
        )}

        {/* Tab 5: Audit & Disposal */}
        {activeTab === 'audit' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
            <h3 className="text-base font-bold text-slate-800">📋 5. ตรวจนับและจำหน่ายพัสดุ (Audit & Disposal)</h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              โหมดการตรวจนับพัสดุประจำปี การขออนุมัติแทงจำหน่าย / ปลดระวาง และประวัติการจำหน่าย
            </p>
            <button 
              onClick={() => setIsAuditScannerOpen(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
            >
              📱 เปิดกล้อง Mobile QR Audit Scanner เพื่อเริ่มตรวจนับ
            </button>
          </div>
        )}

        {/* Tab 6: Settings */}
        {activeTab === 'settings' && (
          <SettingsView
            categories={categories}
            typeCodesMap={typeCodesMap}
            departments={departments}
            responsibleCodes={responsibleCodes}
            supplyCategories={supplyCategories}
            supplyUnits={supplyUnits}
            systemConfig={systemConfig}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddType={handleAddType}
            onDeleteType={handleDeleteType}
            onAddDepartment={handleAddDepartment}
            onDeleteDepartment={handleDeleteDepartment}
            onAddResponsibleCode={handleAddResponsibleCode}
            onDeleteResponsibleCode={handleDeleteResponsibleCode}
            onAddSupplyCategory={handleAddSupplyCategory}
            onDeleteSupplyCategory={handleDeleteSupplyCategory}
            onAddSupplyUnit={handleAddSupplyUnit}
            onDeleteSupplyUnit={handleDeleteSupplyUnit}
            onSaveConfig={handleSaveConfig}
            onTriggerToast={addToast}
          />
        )}

      </main>

      {/* Modals & Overlays */}
      <NewAssetModal
        isOpen={isNewAssetOpen}
        onClose={() => setIsNewAssetOpen(false)}
        onSave={handleSaveNewAsset}
        assets={assets}
        categories={categories}
        typeCodesMap={typeCodesMap}
        departments={departments}
      />

      <EditAssetModal
        asset={editingAsset}
        onClose={() => setEditingAsset(null)}
        onSave={handleUpdateAsset}
        departments={departments}
      />

      <ConfirmDeleteModal
        asset={deletingAsset}
        onClose={() => setDeletingAsset(null)}
        onConfirm={handleConfirmDeleteAsset}
      />

      <ImportAssetModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImportAssets}
      />

      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onOpenQRPrintModal={(selectedAssets) => setQrPrintAssets(selectedAssets)}
      />

      <QRCodePrintModal
        assets={qrPrintAssets}
        onClose={() => setQrPrintAssets([])}
      />

      <QRScannerModal
        isOpen={isAuditScannerOpen}
        onClose={() => setIsAuditScannerOpen(false)}
        assets={assets}
        onConfirmAudit={handleConfirmAudit}
      />

      <TransferAssetModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        selectedAssets={transferSelectedAssets}
        allAssets={assets}
        departments={departments}
        onConfirmTransfer={handleConfirmTransfer}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800 text-center mt-auto">
        <p>© 2026 Fixed Asset & Inventory Management System. All Rights Reserved.</p>
      </footer>

    </div>
  );
}
