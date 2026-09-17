/* antideleteConfig.js - Simple configuration for antidelete destinations */
export function getAntideleteDestination(jid, status = '') {
  // jid is a group JID (e.g., '1234567890-123456@g.us')
  // status is the antidelete mode string (e.g., 'gc-org', 'gc-pm')
  // Define specific groups where antidelete messages should be sent to the group itself
  const specificGroups = [];
  // If status explicitly requests group‑org, send to the same group
  if (status.includes('gc-org')) {
    return { type: 'group', jid };
  }
  // If status explicitly requests group‑pm, send to owner DM
  if (status.includes('gc-pm')) {
    return { type: 'owner_dm' };
  }
  // Legacy handling: if the JID is listed in specificGroups, treat as group destination
  if (specificGroups.includes(jid)) {
    return { type: 'group', jid };
  }
  // Default: send to bot owner's DM
  return { type: 'owner_dm' };
}
