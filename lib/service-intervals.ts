import type { ServiceInterval, ServiceType, Vehicle, VehicleType } from "@/lib/types";

type IntervalTemplate = {
  serviceType: ServiceType;
  customServiceName: string;
  intervalMileage: number;
  intervalMonths: number;
};

export const defaultIntervalsByVehicleType: Record<VehicleType, IntervalTemplate[]> = {
  Motorcycle: [
    { serviceType: "engine oil", customServiceName: "", intervalMileage: 3000, intervalMonths: 3 },
    { serviceType: "gear oil", customServiceName: "", intervalMileage: 6000, intervalMonths: 6 },
    { serviceType: "air filter", customServiceName: "", intervalMileage: 10000, intervalMonths: 6 },
    { serviceType: "spark plug", customServiceName: "", intervalMileage: 10000, intervalMonths: 12 },
    { serviceType: "CVT belt", customServiceName: "", intervalMileage: 20000, intervalMonths: 18 },
    { serviceType: "rollers", customServiceName: "", intervalMileage: 15000, intervalMonths: 12 },
    { serviceType: "brake pad", customServiceName: "", intervalMileage: 12000, intervalMonths: 12 },
    { serviceType: "tire", customServiceName: "", intervalMileage: 20000, intervalMonths: 24 },
    { serviceType: "coolant", customServiceName: "", intervalMileage: 20000, intervalMonths: 24 },
    { serviceType: "battery", customServiceName: "", intervalMileage: 20000, intervalMonths: 24 }
  ],
  Car: [
    { serviceType: "engine oil", customServiceName: "", intervalMileage: 10000, intervalMonths: 6 },
    { serviceType: "gear oil", customServiceName: "", intervalMileage: 40000, intervalMonths: 36 },
    { serviceType: "air filter", customServiceName: "", intervalMileage: 20000, intervalMonths: 12 },
    { serviceType: "spark plug", customServiceName: "", intervalMileage: 30000, intervalMonths: 24 },
    { serviceType: "CVT belt", customServiceName: "", intervalMileage: 80000, intervalMonths: 60 },
    { serviceType: "rollers", customServiceName: "", intervalMileage: 80000, intervalMonths: 60 },
    { serviceType: "brake pad", customServiceName: "", intervalMileage: 30000, intervalMonths: 24 },
    { serviceType: "tire", customServiceName: "", intervalMileage: 40000, intervalMonths: 36 },
    { serviceType: "coolant", customServiceName: "", intervalMileage: 40000, intervalMonths: 36 },
    { serviceType: "battery", customServiceName: "", intervalMileage: 30000, intervalMonths: 24 }
  ]
};

export function getVehicleIntervals(vehicle: Vehicle, intervals: ServiceInterval[]) {
  const savedIntervals = intervals.filter((interval) => interval.vehicleId === vehicle.id);

  const defaultRows = defaultIntervalsByVehicleType[vehicle.type].map((template) => {
    const saved = savedIntervals.find(
      (interval) => interval.serviceType === template.serviceType && interval.customServiceName === ""
    );
    return saved ?? {
      id: `${vehicle.id}-${template.serviceType}`,
      userId: vehicle.userId,
      vehicleId: vehicle.id,
      ...template
    };
  });

  const customRows = savedIntervals.filter(
    (interval) => interval.serviceType === "other" && interval.customServiceName.trim().length > 0
  );

  return [...defaultRows, ...customRows];
}
