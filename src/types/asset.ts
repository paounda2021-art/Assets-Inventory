export type AssetStatus = 'active' | 'repair' | 'damaged' | 'pending_disposal' | 'disposed';

export interface AssetHistory {
  id: string;
  date: string;
  type: 'audit' | 'transfer' | 'registration' | 'repair' | 'disposal' | 'issuance';
  title: string;
  by: string;
  detail: string;
  documentNo?: string;
  attachmentName?: string;
  attachmentUrl?: string;
  statusBadge?: string;
}

export interface Asset {
  id: string;
  assetCode: string;
  name: string;
  spec: string;
  category: string;
  subCategory?: string;
  brand: string;
  model: string;
  serialNumber: string;
  department: string;
  custodian: string;
  location: string;
  budgetYear: string;
  acquisitionDate: string;
  poNumber: string;
  vendor: string;
  purchasePrice: number;
  usefulLifeYears: number;
  depreciationMethod: string;
  currentBookValue: number;
  status: AssetStatus;
  warrantyStart: string;
  warrantyEnd: string;
  imageUrl?: string;
  history: AssetHistory[];
}

export interface SupplyItem {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  minStock: number;
  currentStock: number;
  unitPrice: number;
  lastRestockDate: string;
}

export interface MaintenanceRecord {
  id: string;
  assetCode: string;
  assetName: string;
  requestDate: string;
  issue: string;
  reporter: string;
  technician?: string;
  cost?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

export interface AssetTransferRecord {
  id: string;
  documentNo: string;
  transferDate: string;
  assetIds: string[];
  assetCodes: string[];
  assetNames: string[];
  fromDepartment: string;
  toDepartment: string;
  fromCustodian: string;
  toCustodian: string;
  newLocation: string;
  reason: string;
  approvedBy: string;
  attachmentName?: string;
  attachmentUrl?: string;
  status: 'completed' | 'pending' | 'cancelled';
}
