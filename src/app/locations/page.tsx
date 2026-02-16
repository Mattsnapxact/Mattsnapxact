"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

export default function LocationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBuildingName, setNewBuildingName] = useState("");
  const [newRoomNames, setNewRoomNames] = useState<Record<string, string>>({});
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchBuildings = useCallback(async () => {
    try {
      const res = await fetch("/api/buildings");
      const data = await res.json();
      setBuildings(data.buildings || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchBuildings();
    }
  }, [session, fetchBuildings]);

  const handleAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuildingName.trim()) return;

    try {
      const res = await fetch("/api/buildings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBuildingName.trim() }),
      });
      if (!res.ok) throw new Error();
      setNewBuildingName("");
      fetchBuildings();
    } catch {
      alert("Failed to add building.");
    }
  };

  const handleDeleteBuilding = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" and all its rooms?`)) return;

    try {
      const res = await fetch(`/api/buildings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      if (expandedBuilding === id) setExpandedBuilding(null);
      fetchBuildings();
    } catch {
      alert("Failed to delete building.");
    }
  };

  const handleAddRoom = async (e: React.FormEvent, buildingId: string) => {
    e.preventDefault();
    const name = newRoomNames[buildingId]?.trim();
    if (!name) return;

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, buildingId }),
      });
      if (!res.ok) throw new Error();
      setNewRoomNames((prev) => ({ ...prev, [buildingId]: "" }));
      fetchBuildings();
    } catch {
      alert("Failed to add room.");
    }
  };

  const handleDeleteRoom = async (id: string, name: string) => {
    if (!confirm(`Delete room "${name}"?`)) return;

    try {
      const res = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      fetchBuildings();
    } catch {
      alert("Failed to delete room.");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-200 rounded w-48" />
          <div className="h-4 bg-surface-100 rounded w-64" />
          <div className="space-y-3 mt-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-surface-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Locations</h1>
        <p className="text-surface-500 mt-1">
          Set up buildings and rooms. These will appear as dropdowns when scanning.
        </p>
      </div>

      {/* Add building form */}
      <form onSubmit={handleAddBuilding} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newBuildingName}
          onChange={(e) => setNewBuildingName(e.target.value)}
          placeholder="New building name"
          className="flex-1 px-3 py-2 text-sm border border-surface-200 rounded-lg bg-white text-surface-800 placeholder-surface-400 focus:border-brand-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newBuildingName.trim()}
          className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-default disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Building
        </button>
      </form>

      {/* Buildings list */}
      {buildings.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-surface-700 mb-2">No buildings yet</h3>
          <p className="text-sm text-surface-500">
            Add a building above to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {buildings.map((building) => {
            const isExpanded = expandedBuilding === building.id;
            return (
              <div
                key={building.id}
                className="bg-white border border-surface-200 rounded-xl overflow-hidden"
              >
                {/* Building header */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-surface-50 transition-default"
                  onClick={() => setExpandedBuilding(isExpanded ? null : building.id)}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-surface-800">
                        {building.name}
                      </p>
                      <p className="text-xs text-surface-400">
                        {building.rooms.length} {building.rooms.length === 1 ? "room" : "rooms"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBuilding(building.id, building.name);
                      }}
                      className="text-surface-400 hover:text-red-500 transition-default p-1"
                      title="Delete building"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <svg
                      className={`w-4 h-4 text-surface-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Rooms (expanded) */}
                {isExpanded && (
                  <div className="border-t border-surface-200 px-5 py-4 bg-surface-50">
                    {/* Add room form */}
                    <form
                      onSubmit={(e) => handleAddRoom(e, building.id)}
                      className="flex gap-2 mb-3"
                    >
                      <input
                        type="text"
                        value={newRoomNames[building.id] || ""}
                        onChange={(e) =>
                          setNewRoomNames((prev) => ({
                            ...prev,
                            [building.id]: e.target.value,
                          }))
                        }
                        placeholder="New room name"
                        className="flex-1 px-3 py-1.5 text-sm border border-surface-200 rounded-lg bg-white text-surface-800 placeholder-surface-400 focus:border-brand-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!newRoomNames[building.id]?.trim()}
                        className="bg-surface-700 hover:bg-surface-800 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition-default disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Room
                      </button>
                    </form>

                    {/* Room list */}
                    {building.rooms.length === 0 ? (
                      <p className="text-xs text-surface-400 text-center py-3">
                        No rooms yet. Add one above.
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {building.rooms.map((room) => (
                          <div
                            key={room.id}
                            className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-surface-100"
                          >
                            <span className="text-sm text-surface-700">{room.name}</span>
                            <button
                              onClick={() => handleDeleteRoom(room.id, room.name)}
                              className="text-surface-400 hover:text-red-500 transition-default p-0.5"
                              title="Delete room"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
