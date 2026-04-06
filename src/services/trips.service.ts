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

export async function createTrip(payload: CreateTripPayload): Promise<unknown> {
  const { data } = await api.post<unknown>("/trips", payload);
  return data;
}
