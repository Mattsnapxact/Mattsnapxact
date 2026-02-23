"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Room {
  id: string;
  name: string;
  buildingId: string;
}

interface Building {
  id: string;
  name: string;
  rooms: Room[];
}

export interface SelectedLocation {
  buildingId: string;
  buildingName: string;
  roomId: string;
  roomName: string;
}

interface LocationPickerProps {
  value: SelectedLocation;
  onChange: (location: SelectedLocation) => void;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const { data: session } = useSession();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loaded, setLoaded] = useState(false);

  const fetchBuildings = useCallback(async () => {
    try {
      const res = await fetch("/api/buildings");
      if (!res.ok) return;
      const data = await res.json();
      setBuildings(data.buildings || []);
    } catch {
      // ignore
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchBuildings();
    } else {
      setLoaded(true);
    }
  }, [session, fetchBuildings]);

  if (!session) {
    return null;
  }

  if (!loaded) {
    return (
      <div className="animate-pulse flex gap-3">
        <div className="flex-1 h-10 bg-surface-100 rounded-lg" />
        <div className="flex-1 h-10 bg-surface-100 rounded-lg" />
      </div>
    );
  }

  if (buildings.length === 0) {
    return (
      <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 text-center">
        <p className="text-sm text-surface-500">
          No locations set up yet.{" "}
          <Link href="/locations" className="text-brand-600 hover:text-brand-700 font-medium">
            Add buildings & rooms
          </Link>{" "}
          to tag scans with a location.
        </p>
      </div>
    );
  }

  const selectedBuilding = buildings.find((b) => b.id === value.buildingId);
  const rooms = selectedBuilding?.rooms || [];

  const handleBuildingChange = (buildingId: string) => {
    const building = buildings.find((b) => b.id === buildingId);
    onChange({
      buildingId,
      buildingName: building?.name || "",
      roomId: "",
      roomName: "",
    });
  };

  const handleRoomChange = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    onChange({
      ...value,
      roomId,
      roomName: room?.name || "",
    });
  };

  return (
    <div className="flex gap-3">
      <div className="flex-1">
        <label className="block text-xs font-medium text-surface-500 mb-1">
          Building
        </label>
        <select
          value={value.buildingId}
          onChange={(e) => handleBuildingChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg bg-white text-surface-800 focus:border-brand-500 focus:outline-none"
        >
          <option value="">Select building...</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-surface-500 mb-1">
          Room
        </label>
        <select
          value={value.roomId}
          onChange={(e) => handleRoomChange(e.target.value)}
          disabled={!value.buildingId || rooms.length === 0}
          className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg bg-white text-surface-800 focus:border-brand-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {!value.buildingId
              ? "Select building first"
              : rooms.length === 0
              ? "No rooms"
              : "Select room..."}
          </option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
