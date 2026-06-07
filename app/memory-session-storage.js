// File: app/memory-session-storage.js
//
// Lightweight in-memory session store for the PWA proxy.
// Sessions are lost on cold starts, which is fine — this app only
// needs sessions for the initial OAuth flow with Shopify.

const sessions = new Map();

export class MemorySessionStorage {
  async storeSession(session) {
    sessions.set(session.id, { ...session });
    return true;
  }

  async loadSession(id) {
    const session = sessions.get(id);
    return session ? { ...session } : undefined;
  }

  async deleteSession(id) {
    return sessions.delete(id);
  }

  async deleteSessions(ids) {
    let deleted = true;
    for (const id of ids) {
      if (!sessions.delete(id)) deleted = false;
    }
    return deleted;
  }

  async findSessionsByShop(shop) {
    const results = [];
    for (const session of sessions.values()) {
      if (session.shop === shop) {
        results.push({ ...session });
      }
    }
    return results;
  }
}
