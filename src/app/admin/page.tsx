"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

interface Organization {
  id: string;
  name: string;
  createdAt: string;
  _count: { users: number; buildings: number; scans: number };
}

interface UserRecord {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
  isActive: boolean;
  organizationId: string | null;
  organization: { name: string } | null;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [orgFilter, setOrgFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Create org form
  const [newOrgName, setNewOrgName] = useState("");
  const [orgError, setOrgError] = useState("");
  const [orgCreating, setOrgCreating] = useState(false);

  // Create user form
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserOrgId, setNewUserOrgId] = useState("");
  const [userError, setUserError] = useState("");
  const [userCreating, setUserCreating] = useState(false);
  const [tempPassword, setTempPassword] = useState("");

  // Reset password
  const [resetUserId, setResetUserId] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  // Confirm disable
  const [confirmDisableId, setConfirmDisableId] = useState("");

  const fetchOrgs = useCallback(async () => {
    const res = await fetch("/api/admin/organizations");
    if (res.ok) {
      const data = await res.json();
      setOrgs(data.organizations);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    const url = orgFilter
      ? `/api/admin/users?organizationId=${orgFilter}`
      : "/api/admin/users";
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
  }, [orgFilter]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.isAdmin) {
      router.push("/scan");
      return;
    }
    setLoading(false);
    fetchOrgs();
    fetchUsers();
  }, [status, session, router, fetchOrgs, fetchUsers]);

  useEffect(() => {
    if (!loading) fetchUsers();
  }, [orgFilter, loading, fetchUsers]);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrgError("");
    setOrgCreating(true);
    try {
      const res = await fetch("/api/admin/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newOrgName }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setNewOrgName("");
      fetchOrgs();
    } catch (err) {
      setOrgError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setOrgCreating(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError("");
    setTempPassword("");
    setUserCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserEmail,
          name: newUserName || undefined,
          password: newUserPassword || undefined,
          organizationId: newUserOrgId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTempPassword(data.tempPassword);
      setNewUserEmail("");
      setNewUserName("");
      setNewUserPassword("");
      fetchUsers();
    } catch (err) {
      setUserError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setUserCreating(false);
    }
  };

  const handleToggleActive = async (userId: string, currentlyActive: boolean) => {
    if (currentlyActive && confirmDisableId !== userId) {
      setConfirmDisableId(userId);
      return;
    }
    setConfirmDisableId("");
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: currentlyActive ? "disable" : "enable" }),
    });
    fetchUsers();
  };

  const handleResetPassword = async (userId: string) => {
    setResetMsg("");
    if (!resetPassword || resetPassword.length < 8) {
      setResetMsg("Password must be at least 8 characters");
      return;
    }
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resetPassword", newPassword: resetPassword }),
    });
    if (res.ok) {
      setResetMsg("Password reset successfully");
      setResetPassword("");
      setTimeout(() => {
        setResetUserId("");
        setResetMsg("");
      }, 2000);
    } else {
      const data = await res.json();
      setResetMsg(data.error || "Failed to reset");
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-200 rounded w-48" />
          <div className="h-64 bg-surface-200 rounded" />
        </div>
      </div>
    );
  }

  if (!session?.user?.isAdmin) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      <h1 className="text-2xl font-bold text-surface-900">Admin Panel</h1>

      {/* ── Organisations ── */}
      <section>
        <h2 className="text-lg font-semibold text-surface-800 mb-4">Organisations</h2>
        <form onSubmit={handleCreateOrg} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            placeholder="Organisation name"
            required
            className="flex-1 px-3 py-2 text-sm border border-surface-300 rounded-lg bg-white text-surface-800"
          />
          <button
            type="submit"
            disabled={orgCreating}
            className="px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
          >
            {orgCreating ? "Creating..." : "Create"}
          </button>
        </form>
        {orgError && <p className="text-sm text-red-600 mb-2">{orgError}</p>}

        <div className="border border-surface-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-surface-600">Name</th>
                <th className="text-left px-4 py-2 font-medium text-surface-600">Users</th>
                <th className="text-left px-4 py-2 font-medium text-surface-600">Buildings</th>
                <th className="text-left px-4 py-2 font-medium text-surface-600">Scans</th>
                <th className="text-left px-4 py-2 font-medium text-surface-600">Created</th>
              </tr>
            </thead>
            <tbody>
              {orgs.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-surface-400">No organisations yet</td></tr>
              ) : (
                orgs.map((org) => (
                  <tr key={org.id} className="border-t border-surface-100">
                    <td className="px-4 py-2 font-medium text-surface-800">{org.name}</td>
                    <td className="px-4 py-2 text-surface-600">{org._count.users}</td>
                    <td className="px-4 py-2 text-surface-600">{org._count.buildings}</td>
                    <td className="px-4 py-2 text-surface-600">{org._count.scans}</td>
                    <td className="px-4 py-2 text-surface-500">{new Date(org.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Create User ── */}
      <section>
        <h2 className="text-lg font-semibold text-surface-800 mb-4">Create User</h2>
        <form onSubmit={handleCreateUser} className="space-y-3 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Email *</label>
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-surface-300 rounded-lg bg-white text-surface-800"
              placeholder="user@school.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Name</label>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-surface-300 rounded-lg bg-white text-surface-800"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Password</label>
            <input
              type="text"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-surface-300 rounded-lg bg-white text-surface-800"
              placeholder="Min 8 chars (leave blank to auto-generate)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Organisation *</label>
            <select
              value={newUserOrgId}
              onChange={(e) => setNewUserOrgId(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-surface-300 rounded-lg bg-white text-surface-800"
            >
              <option value="">Select organisation</option>
              {orgs.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
          {userError && <p className="text-sm text-red-600">{userError}</p>}
          {tempPassword && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
              <p className="font-medium text-green-800">User created. Temporary password:</p>
              <code className="block mt-1 text-green-900 bg-green-100 px-2 py-1 rounded select-all">{tempPassword}</code>
            </div>
          )}
          <button
            type="submit"
            disabled={userCreating}
            className="px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
          >
            {userCreating ? "Creating..." : "Create User"}
          </button>
        </form>
      </section>

      {/* ── Users List ── */}
      <section>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-lg font-semibold text-surface-800">Users</h2>
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-surface-300 rounded-lg bg-white text-surface-800"
          >
            <option value="">All organisations</option>
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>

        <div className="border border-surface-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-surface-600">Email</th>
                <th className="text-left px-4 py-2 font-medium text-surface-600">Name</th>
                <th className="text-left px-4 py-2 font-medium text-surface-600">Organisation</th>
                <th className="text-left px-4 py-2 font-medium text-surface-600">Status</th>
                <th className="text-left px-4 py-2 font-medium text-surface-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-surface-400">No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-surface-100">
                    <td className="px-4 py-2 text-surface-800">
                      {user.email}
                      {user.isAdmin && (
                        <span className="ml-1.5 text-xs bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded">admin</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-surface-600">{user.name || "—"}</td>
                    <td className="px-4 py-2 text-surface-600">{user.organization?.name || "—"}</td>
                    <td className="px-4 py-2">
                      {user.isActive ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Active</span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Disabled</span>
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      {confirmDisableId === user.id ? (
                        <span className="text-xs">
                          <span className="text-red-600 mr-1">Confirm?</span>
                          <button
                            onClick={() => handleToggleActive(user.id, true)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium mr-1"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDisableId("")}
                            className="text-xs text-surface-500 hover:text-surface-700"
                          >
                            No
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          className={`text-xs font-medium ${
                            user.isActive
                              ? "text-red-600 hover:text-red-800"
                              : "text-green-600 hover:text-green-800"
                          }`}
                        >
                          {user.isActive ? "Disable" : "Enable"}
                        </button>
                      )}

                      {resetUserId === user.id ? (
                        <span className="inline-flex items-center gap-1">
                          <input
                            type="text"
                            value={resetPassword}
                            onChange={(e) => setResetPassword(e.target.value)}
                            placeholder="New password"
                            className="w-28 px-2 py-0.5 text-xs border border-surface-300 rounded bg-white text-surface-800"
                          />
                          <button
                            onClick={() => handleResetPassword(user.id)}
                            className="text-xs text-brand-600 hover:text-brand-800 font-medium"
                          >
                            Set
                          </button>
                          <button
                            onClick={() => { setResetUserId(""); setResetPassword(""); setResetMsg(""); }}
                            className="text-xs text-surface-500 hover:text-surface-700"
                          >
                            Cancel
                          </button>
                          {resetMsg && <span className="text-xs text-green-600">{resetMsg}</span>}
                        </span>
                      ) : (
                        <button
                          onClick={() => { setResetUserId(user.id); setResetMsg(""); }}
                          className="text-xs text-surface-500 hover:text-surface-700 font-medium"
                        >
                          Reset password
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
