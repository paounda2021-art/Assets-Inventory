'use client';

import React, { useState } from 'react';
import { Asset } from '../../types/asset';
import { X, Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImportAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (importedAssets: Asset[]) => void;
}

export const ImportAssetModal: React.FC<ImportAssetModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Partial<Asset>[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Sample CSV Download Generator
  const handleDownloadTemplate = () => {
    const csvHeader = "assetCode,name,spec,category,brand,model,serialNumber,department,custodian,location,budgetYear,purchasePrice\n";
    const sampleRow1 = "วศ.69-0012-010,เครื่องสำรองไฟ APC Smart-UPS 1500VA,1500VA / 900W LCD 230V,คอมพิวเตอร์และอุปกรณ์ไอที,APC,Smart-UPS 1500,AS2409871123,สำนักเทคโนโลยีสารสนเทศ,รณิดา โชติธนาอุดม,อาคาร 1 > ชั้น 2,2569,18500\n";
    const sampleRow2 = "สนง.69-0045-001,เก้าอี้ทำงานพนักพิงสูง ErgoFlex,เก้าอี้สุขภาพ เบาะผ้าปรับระดับได้,สำนักงานและครุภัณฑ์,ErgoFlex,Pro-V1,N/A,กองบริหารการคลัง,วัชรีวรรณ จันทร์เพ็ญ,อาคาร 1 > ชั้น 1,2569,4500\n";
    
    const blob = new Blob(["\uFEFF" + csvHeader + sampleRow1 + sampleRow2], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'แบบฟอร์มนำเข้าครุภัณฑ์_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock File Selection / Parsing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Generate realistic mock preview items from file
      const mockParsed: Partial<Asset>[] = [
        {
          assetCode: 'วศ.69-0012-010',
          name: 'เครื่องสำรองไฟ APC Smart-UPS 1500VA',
          spec: '1500VA / 900W LCD 230V',
          category: 'คอมพิวเตอร์และอุปกรณ์ไอที',
          brand: 'APC',
          model: 'Smart-UPS 1500',
          serialNumber: 'AS2409871123',
          department: 'สำนักเทคโนโลยีสารสนเทศ',
          custodian: 'รณิดา โชติธนาอุดม',
          location: 'อาคาร 1 > ชั้น 2 > Server Room',
          budgetYear: '2569',
          purchasePrice: 18500.00
        },
        {
          assetCode: 'สนง.69-0045-001',
          name: 'เก้าอี้ทำงานพนักพิงสูง ErgoFlex Pro',
          spec: 'เก้าอี้สุขภาพ เบาะผ้าปรับระดับได้',
          category: 'สำนักงานและครุภัณฑ์',
          brand: 'ErgoFlex',
          model: 'Pro-V1',
          serialNumber: 'ERG-2026-998',
          department: 'กองบริหารการคลัง',
          custodian: 'วัชรีวรรณ จันทร์เพ็ญ',
          location: 'อาคาร 1 > ชั้น 1 > แผนกบัญชี',
          budgetYear: '2569',
          purchasePrice: 4500.00
        }
      ];

      setPreviewData(mockParsed);
    }
  };

  const handleConfirmImport = () => {
    if (previewData.length === 0) return;

    const fullImported: Asset[] = previewData.map((item, idx) => ({
      id: `imported-${Date.now()}-${idx}`,
      assetCode: item.assetCode || `วศ.69-IMP-${idx+1}`,
      name: item.name || 'ครุภัณฑ์นำเข้า',
      spec: item.spec || '-',
      category: item.category || 'คอมพิวเตอร์และอุปกรณ์ไอที',
      brand: item.brand || '-',
      model: item.model || '-',
      serialNumber: item.serialNumber || `SN-IMP-${idx+1}`,
      department: item.department || 'สำนักเทคโนโลยีสารสนเทศ',
      custodian: item.custodian || 'เจ้าหน้าที่ระบบ',
      location: item.location || 'อาคาร 1 > ชั้น 1',
      budgetYear: item.budgetYear || '2569',
      acquisitionDate: new Date().toISOString().substring(0, 10),
      poNumber: 'นำเข้าจาก CSV/Excel',
      vendor: 'นำเข้าไฟล์ข้อมูล',
      purchasePrice: item.purchasePrice || 0,
      usefulLifeYears: 5,
      depreciationMethod: '20% ต่อปี (เส้นตรง)',
      currentBookValue: item.purchasePrice || 0,
      status: 'active',
      warrantyStart: new Date().toISOString().substring(0, 10),
      warrantyEnd: '2029-12-31',
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',
      history: [
        {
          id: `h-imp-${Date.now()}-${idx}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          type: 'registration',
          title: 'นำเข้าข้อมูลเข้าสู่ระบบ (Bulk CSV Import)',
          by: 'เจ้าหน้าที่พัสดุ (ผ่านไฟล์ CSV/Excel)',
          detail: `นำเข้าข้อมูลรายการ ${item.name}`
        }
      ]
    }));

    onImport(fullImported);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedFile(null);
      setPreviewData([]);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">📥 นำเข้าข้อมูลทะเบียนครุภัณฑ์ (CSV / Excel Import)</h3>
              <p className="text-xs text-slate-400">อัปโหลดไฟล์ CSV หรือ Excel เพื่อเพิ่มรายการครุภัณฑ์จำนวนมากพร้อมกัน</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          
          {isSuccess ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-emerald-900">นำเข้าข้อมูลสำเร็จแล้ว!</h4>
              <p className="text-slate-600">เพิ่มรายการครุภัณฑ์ {previewData.length} รายการเข้าสู่ทะเบียนเรียบร้อย</p>
            </div>
          ) : (
            <>
              {/* Step 1: Download Template */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">📄 แม่แบบไฟล์สำหรับนำเข้า (Template File)</h4>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    ดาวน์โหลดไฟล์แม่แบบ CSV ที่มีโครงสร้างคอลัมน์ถูกต้องเพื่อกรอกข้อมูลก่อนอัปโหลด
                  </p>
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-sm transition-all whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลดไฟล์แม่แบบ</span>
                </button>
              </div>

              {/* Step 2: Upload File Box */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-10 h-10 text-teal-600 mx-auto mb-2" />
                <p className="font-bold text-slate-800 text-sm">
                  {selectedFile ? `ไฟล์ที่เลือก: ${selectedFile.name}` : 'ลากไฟล์ CSV / Excel มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์'}
                </p>
                <p className="text-slate-400 text-[11px] mt-1">รองรับไฟล์ประเภท .csv, .xlsx (ขนาดสูงสุด 20MB)</p>
              </div>

              {/* Step 3: Preview Table */}
              {previewData.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-xs">
                      🔍 ตัวอย่างข้อมูลที่พบล่าสุด ({previewData.length} รายการ)
                    </h4>
                    <span className="text-emerald-600 font-semibold text-[11px]">✔ ตรวจสอบโครงสร้างไฟล์ถูกต้อง</span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                        <tr>
                          <th className="p-2.5">รหัสครุภัณฑ์</th>
                          <th className="p-2.5">รายการ</th>
                          <th className="p-2.5">S/N</th>
                          <th className="p-2.5">หน่วยงาน</th>
                          <th className="p-2.5 text-right">ราคาจัดซื้อ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-mono font-bold text-blue-700">{row.assetCode}</td>
                            <td className="p-2.5 font-medium text-slate-800">{row.name}</td>
                            <td className="p-2.5 font-mono text-slate-500">{row.serialNumber}</td>
                            <td className="p-2.5 text-slate-600">{row.department}</td>
                            <td className="p-2.5 text-right font-bold text-slate-800">฿{row.purchasePrice?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
            >
              ยกเลิก
            </button>
            <button
              disabled={previewData.length === 0}
              onClick={handleConfirmImport}
              className={`flex items-center space-x-1.5 px-5 py-2 rounded-lg font-bold text-white shadow-md transition-all ${
                previewData.length > 0
                  ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-600/30'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>📥 ยืนยันนำเข้าข้อมูล ({previewData.length} รายการ)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
