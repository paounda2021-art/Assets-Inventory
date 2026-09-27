import { UserAccount } from '../types/user';

export const OFFICIAL_USERS: UserAccount[] = [
  {
    id: 'usr-1',
    username: 'sakda.a',
    password: '07170195',
    name: 'นายศักดา อภิรัตนวรรณ',
    role: 'staff',
    roleName: 'เจ้าหน้าที่บริหารพัสดุ',
    department: 'สำนักงานบริหารการพัสดุ',
    position: 'เจ้าหน้าที่บริหารพัสดุ',
    avatarText: 'ศก'
  },
  {
    id: 'usr-2',
    username: 'saisunee.p',
    password: '07170029',
    name: 'นางสาวสายสุนีย์ พูลวณิชย์สกุล',
    role: 'approver',
    roleName: 'หัวหน้าสำนักงานบริหารการพัสดุ (ผู้อนุมัติ)',
    department: 'สำนักงานบริหารการพัสดุ',
    position: 'หัวหน้าสำนักงานบริหารการพัสดุ (ผู้อนุมัติ)',
    avatarText: 'สส'
  },
  {
    id: 'usr-3',
    username: 'ranida.c',
    password: '07170065',
    name: 'นางสาวรณิดา โชติธนาอุดม',
    role: 'admin',
    roleName: 'แอดมินหลัก',
    department: 'สำนักเทคโนโลยีสารสนเทศ (สทส.)',
    position: 'นักพัฒนาระบบ (แอดมินหลัก)',
    avatarText: 'รณ'
  },
  {
    id: 'usr-4',
    username: 'natanong.s',
    password: '07170183',
    name: 'นางสาวณัฐอนงค์ แสงจันทร์งาม',
    role: 'admin',
    roleName: 'แอดมินหลัก',
    department: 'สำนักเทคโนโลยีสารสนเทศ (สทส.)',
    position: 'เจ้าหน้าที่บริหารระบบ (แอดมินหลัก)',
    avatarText: 'ณฐ'
  }
];
