import type { Profile, Reminder, ServiceRecord, Vehicle } from "@/lib/types";

export const mockProfile: Profile = {
  id: "demo-user",
  fullName: "Daniel Family",
  email: "demo@servicelog.local"
};

export const mockVehicles: Vehicle[] = [
  {
    id: "veh-1",
    userId: "demo-user",
    name: "Daily Scooter",
    plateNumber: "WXY 2481",
    type: "Motorcycle",
    model: "Yamaha NVX 155",
    currentMileage: 28450,
    createdAt: "2026-05-02"
  },
  {
    id: "veh-2",
    userId: "demo-user",
    name: "Family Car",
    plateNumber: "VBN 7742",
    type: "Car",
    model: "Perodua Myvi",
    currentMileage: 62100,
    createdAt: "2026-04-18"
  }
];

export const mockServiceRecords: ServiceRecord[] = [
  {
    id: "rec-1",
    userId: "demo-user",
    vehicleId: "veh-1",
    date: "2026-06-18",
    mileage: 28000,
    serviceType: "engine oil",
    cost: 48,
    shopName: "Azman Motor",
    notes: "Changed oil and checked brake pads."
  },
  {
    id: "rec-2",
    userId: "demo-user",
    vehicleId: "veh-1",
    date: "2026-05-22",
    mileage: 26500,
    serviceType: "CVT belt",
    cost: 180,
    shopName: "Azman Motor",
    notes: "Replaced belt and rollers."
  },
  {
    id: "rec-3",
    userId: "demo-user",
    vehicleId: "veh-2",
    date: "2026-06-05",
    mileage: 61500,
    serviceType: "engine oil",
    cost: 165,
    shopName: "Hafiz Auto Care",
    notes: "Full oil service with filter."
  }
];

export const mockReminders: Reminder[] = [
  {
    id: "rem-1",
    vehicleId: "veh-1",
    serviceType: "engine oil",
    dueMileage: 30000,
    dueDate: "2026-07-15",
    status: "due soon"
  },
  {
    id: "rem-2",
    vehicleId: "veh-2",
    serviceType: "tire",
    dueMileage: 62000,
    dueDate: "2026-06-25",
    status: "overdue"
  },
  {
    id: "rem-3",
    vehicleId: "veh-1",
    serviceType: "brake pad",
    dueMileage: 27500,
    dueDate: "2026-06-12",
    status: "completed"
  }
];
