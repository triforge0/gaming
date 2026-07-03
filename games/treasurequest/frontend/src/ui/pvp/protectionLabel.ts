export interface ProtectionFlags {
  shielded?: boolean;
  pvpCooldown?: boolean;
  stealImmune?: boolean;
}

export function formatProtectionLabel(flags: ProtectionFlags): string {
  const parts: string[] = [];
  if (flags.shielded) {
    parts.push('SHD');
  }
  if (flags.pvpCooldown) {
    parts.push('CD');
  }
  if (flags.stealImmune) {
    parts.push('IM');
  }
  return parts.join(' ');
}

export function protectionLabelColor(flags: ProtectionFlags): string {
  if (flags.shielded) {
    return '#4ecdc4';
  }
  if (flags.stealImmune) {
    return '#c77dff';
  }
  if (flags.pvpCooldown) {
    return '#ffd166';
  }
  return '#888888';
}
