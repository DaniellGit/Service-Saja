import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { mockProfile, mockReminders, mockServiceIntervals, mockServiceRecords, mockVehicles } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase";
import type {
  DatabaseReminder,
  DatabaseServiceRecord,
  DatabaseServiceInterval,
  DatabaseVehicle,
  Profile,
  Reminder,
  ServiceRecord,
  ServiceInterval,
  Vehicle
} from "@/lib/types";

export type AppData = {
  profile: Profile;
  vehicles: Vehicle[];
  records: ServiceRecord[];
  reminders: Reminder[];
  intervals: ServiceInterval[];
  isDemo: boolean;
  userId: string | null;
};

export function mapVehicle(row: DatabaseVehicle): Vehicle {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    plateNumber: row.plate_number,
    type: row.type,
    model: row.model,
    currentMileage: row.current_mileage,
    createdAt: row.created_at
  };
}

export function mapServiceRecord(row: DatabaseServiceRecord): ServiceRecord {
  return {
    id: row.id,
    userId: row.user_id,
    vehicleId: row.vehicle_id,
    date: row.service_date,
    mileage: row.mileage,
    serviceType: row.service_type,
    customServiceName: row.custom_service_name ?? "",
    cost: Number(row.cost),
    shopName: row.shop_name ?? "",
    notes: row.notes ?? "",
    createdAt: row.created_at
  };
}

export function mapReminder(row: DatabaseReminder): Reminder {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    serviceType: row.service_type,
    customServiceName: row.custom_service_name ?? "",
    dueMileage: row.due_mileage ?? 0,
    dueDate: row.due_date ?? "No date",
    status: row.status
  };
}

export function mapServiceInterval(row: DatabaseServiceInterval): ServiceInterval {
  return {
    id: row.id,
    userId: row.user_id,
    vehicleId: row.vehicle_id,
    serviceType: row.service_type,
    customServiceName: row.custom_service_name ?? "",
    intervalMileage: row.interval_mileage,
    intervalMonths: row.interval_months
  };
}

export async function getAppData(): Promise<AppData> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    return getDemoData();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("service-saja-access-token")?.value;

  if (!accessToken) {
    return getDemoData();
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    auth: {
      persistSession: false
    }
  });

  const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
  const user = authData.user;

  if (authError || !user) {
    return getDemoData();
  }

  const [profileResult, vehiclesResult, recordsResult, remindersResult, intervalsResult] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email").eq("id", user.id).maybeSingle(),
    supabase
      .from("vehicles")
      .select("id, user_id, name, plate_number, type, model, current_mileage, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("service_records")
      .select("id, user_id, vehicle_id, service_date, mileage, service_type, custom_service_name, cost, shop_name, notes, created_at")
      .eq("user_id", user.id)
      .order("service_date", { ascending: false }),
    supabase
      .from("reminders")
      .select("id, user_id, vehicle_id, service_type, custom_service_name, due_mileage, due_date, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("service_intervals")
      .select("id, user_id, vehicle_id, service_type, custom_service_name, interval_mileage, interval_months")
      .eq("user_id", user.id)
  ]);

  return {
    profile: {
      id: user.id,
      fullName: profileResult.data?.full_name ?? user.email ?? "Service Saja User",
      email: profileResult.data?.email ?? user.email ?? ""
    },
    vehicles: ((vehiclesResult.data ?? []) as DatabaseVehicle[]).map(mapVehicle),
    records: ((recordsResult.data ?? []) as DatabaseServiceRecord[]).map(mapServiceRecord),
    reminders: ((remindersResult.data ?? []) as DatabaseReminder[]).map(mapReminder),
    intervals: ((intervalsResult.data ?? []) as DatabaseServiceInterval[]).map(mapServiceInterval),
    isDemo: false,
    userId: user.id
  };
}

function getDemoData(): AppData {
  return {
    profile: mockProfile,
    vehicles: mockVehicles,
    records: mockServiceRecords,
    reminders: mockReminders,
    intervals: mockServiceIntervals,
    isDemo: true,
    userId: null
  };
}
