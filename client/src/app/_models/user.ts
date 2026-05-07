export interface User {
  user: any;
  id: string;
  username: string;
  isAdmin: boolean;
  isActive: boolean;
  roleLevel: number;
  userLocation: { kantonCode: string; kantonName: string; bezirk: string; gemeinde: string } | string;
}