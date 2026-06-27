/**
 * DNS Patcher — must be required BEFORE 'pg' or any network module.
 * On Windows, Node.js dns.lookup() uses the OS resolver which may fail
 * for hostnames that only have AAAA records or when UDP/53 is blocked.
 * This patches dns.lookup to fall back to PowerShell's Resolve-DnsName.
 */
import dns from 'dns';
import { execSync } from 'child_process';

const originalLookup = dns.lookup;

function resolveViaPS(hostname: string): { address: string; family: number } | null {
  try {
    // Try IPv4 first
    const ipv4 = execSync(
      `powershell -Command "Resolve-DnsName '${hostname}' -Type A -ErrorAction SilentlyContinue | Where-Object { $_.Type -eq 'A' } | Select-Object -First 1 -ExpandProperty IPAddress"`,
      { encoding: 'utf-8', timeout: 8000 }
    ).trim();
    if (ipv4 && ipv4.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      return { address: ipv4, family: 4 };
    }
  } catch { /* ignore */ }
  return null;
}

// Patch dns.lookup
(dns as any).lookup = function patchedLookup(
  hostname: string,
  options: any,
  callback: any
) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  // First try the original lookup (force IPv4)
  (originalLookup as any).call(dns, hostname, { ...options, family: 4 }, (err: any, address: string, family: number) => {
    if (!err && address) {
      callback(null, address, family);
      return;
    }

    // Fallback: try PowerShell DNS
    const resolved = resolveViaPS(hostname);
    if (resolved) {
      console.log(`[DNS] Resolved ${hostname} via PowerShell → ${resolved.address}`);
      callback(null, resolved.address, resolved.family);
    } else {
      // Last resort: try original without family restriction
      (originalLookup as any).call(dns, hostname, options, callback);
    }
  });
};

export {};
