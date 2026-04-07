import { api } from "./api";

export type TripStopLocation = {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
};

export type TripStop = {
  stop_order: number;
  title: string;
  description: string;
  arrival_time?: string | null;
  duration_minutes?: number;
  location: TripStopLocation;
};

export type CreateTripPayload = {
  title: string;
  description: string;
  cover_image?: string;
  category: string;
  route_summary?: string;
  start_date: string;
  end_date?: string;
  price: string;
  currency: string;
  max_participants: number;
  min_participants?: number;
  status: "draft" | "published";
  difficulty: string;
  duration_hours: number;
  tags?: string[];
  languages?: string[];
  highlights?: string[];
  moderator_name?: string;
  stops: TripStop[];
};

export type TripListItem = {
  id: string;
  title: string;
  description: string;
  cover_image: string | null;
  category: string;
  route_summary: string | null;
  start_date: string;
  end_date: string | null;
  price: string;
  currency: string;
  max_participants: number;
  status: string;
  difficulty: string;
  duration_hours: number;
  tags: string | null;
  moderator_name: string | null;
  created_by: string;
  createdAt: string;
  updatedAt: string;
  creator?: { id: string; username: string; full_name: string };
  stops?: TripStop[];
};

export async function createTrip(payload: CreateTripPayload): Promise<unknown> {
  const { data } = await api.post<unknown>("/trips", payload);
  return data;
}

export async function getTrips(): Promise<TripListItem[]> {
  const { data } = await api.get<TripListItem[] | { data: TripListItem[] }>("/trips");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "data" in data && Array.isArray(data.data)) return data.data;
  return [];
}

export async function deleteTrip(id: string): Promise<void> {
  await api.delete(`/trips/${encodeURIComponent(id)}`);
}
