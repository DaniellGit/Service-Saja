import type { Profile, Reminder, ServiceInterval, ServiceRecord, Vehicle } from "@/lib/types";

export const mockProfile: Profile = {
  id: "demo-user",
  fullName: "Sample Family",
  email: "sample@servicesaja.demo"
};

export const mockVehicles: Vehicle[] = [
  {
    id: "veh-1",
    userId: "demo-user",
    name: "Example Scooter",
    plateNumber: "ABC 1234",
    type: "Motorcycle",
    model: "150cc Daily Ride",
    currentMileage: 28450,
    createdAt: "2026-05-02"
  },
  {
    id: "veh-2",
    userId: "demo-user",
    name: "Example Family Car",
    plateNumber: "XYZ 8899",
    type: "Car",
    model: "Compact Hatchback",
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
    customServiceName: "",
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
    customServiceName: "",
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
    customServiceName: "",
    cost: 165,
    shopName: "Hafiz Auto Care",
    notes: "Full oil service with filter."
  },
  {
    id: "rec-4",
    userId: "demo-user",
    vehicleId: "veh-2",
    date: "2026-06-20",
    mileage: 61900,
    serviceType: "other",
    customServiceName: "Wheel alignment",
    cost: 45,
    shopName: "City Tyre Shop",
    notes: "Custom service example with its own reminder schedule."
  }
];

export const mockReminders: Reminder[] = [
  {
    id: "rem-1",
    vehicleId: "veh-1",
    serviceType: "engine oil",
    customServiceName: "",
    dueMileage: 30000,
    dueDate: "2026-07-15",
    status: "due soon"
  },
  {
    id: "rem-2",
    vehicleId: "veh-2",
    serviceType: "other",
    customServiceName: "Wheel alignment",
    dueMileage: 62000,
    dueDate: "2026-06-25",
    status: "overdue"
  },
  {
    id: "rem-3",
    vehicleId: "veh-1",
    serviceType: "brake pad",
    customServiceName: "",
    dueMileage: 27500,
    dueDate: "2026-06-12",
    status: "completed"
  }
];

export const mockServiceIntervals: ServiceInterval[] = [
  {
    id: "int-1",
    userId: "demo-user",
    vehicleId: "veh-2",
    serviceType: "other",
    customServiceName: "Wheel alignment",
    intervalMileage: 10000,
    intervalMonths: 6
  }
];
