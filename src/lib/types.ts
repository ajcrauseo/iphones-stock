export interface Branch {
  id: number;
  name: string;
  code: string;
}

export interface Iphone {
  id: number;
  model: string;
  capacity: string;
  color: string | null;
  imei: string | null;
  batteryStatus: string;
  batteryPercentage: number | null;
  price: number;
  discountType: string;
  observations: string | null;
  branchId: number;
  createdAt: Date;
  updatedAt: Date;
}
