export type VehicleType = "Motorcycle" | "Car";

export type ServiceType =
  | "engine oil"
  | "gear oil"
  | "air filter"
  | "spark plug"
  | "CVT belt"
  | "rollers"
  | "brake pad"
  | "tire"
  | "coolant"
  | "battery"
  | "other";

export type ReminderStatus = "due soon" | "overdue" | "completed";

export type Profile = {
  id: string;
  fullName: string;
  email: string;
};

export type Vehicle = {
  id: string;
  userId: string;
  name: string;
  plateNumber: string;
  type: VehicleType;
  model: string;
  currentMileage: number;
  createdAt: string;
};

export type ServiceRecord = {
  id: string;
  userId: string;
  vehicleId: string;
  date: string;
  mileage: number;
  serviceType: ServiceType;
  cost: number;
  shopName: string;
  notes: string;
  createdAt?: string;
};

export type Reminder = {
  id: string;
  vehicleId: string;
  serviceType: ServiceType;
  dueMileage: number;
  dueDate: string;
  status: ReminderStatus;
};

export type DatabaseVehicle = {
  id: string;
  user_id: string;
  name: string;
  plate_number: string;
  type: VehicleType;
  model: string;
  current_mileage: number;
  created_at: string;
};

export type DatabaseServiceRecord = {
  id: string;
  user_id: string;
  vehicle_id: string;
  service_date: string;
  mileage: number;
  service_type: ServiceType;
  cost: number;
  shop_name: string | null;
  notes: string | null;
  created_at: string;
};

export type DatabaseReminder = {
  id: string;
  user_id: string;
  vehicle_id: string;
  service_type: ServiceType;
  due_mileage: number | null;
  due_date: string | null;
  status: ReminderStatus;
};

export const serviceTypes: ServiceType[] = [
  "engine oil",
  "gear oil",
  "air filter",
  "spark plug",
  "CVT belt",
  "rollers",
  "brake pad",
  "tire",
  "coolant",
  "battery",
  "other"
];
