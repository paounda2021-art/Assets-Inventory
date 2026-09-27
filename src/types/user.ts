export type UserRole = 'admin' | 'approver' | 'staff';

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  roleName: string;
  department: string;
  position: string;
  avatarText: string;
}
