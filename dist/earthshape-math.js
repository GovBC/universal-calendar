// WGS 84 ellipsoid and measured EGM96 geoid undulations. Scene units: a = 1.
export const A = 6378137;
export const F = 1 / 298.257223563;
export const B = A * (1 - F);
const DEG = Math.PI / 180;

export function sampleGeoid(grid, lat, lon) {
  if (!grid || grid.length !== 181 * 360) throw new Error('Invalid EGM96 grid');
  const y = Math.max(0, Math.min(180, 90 - lat));
  const x = ((lon + 180) % 360 + 360) % 360;
  const x0 = Math.floor(x), x1 = (x0 + 1) % 360;
  const y0 = Math.floor(y), y1 = Math.min(180, y0 + 1);
  const u = x - x0, v = y - y0;
  return ((grid[y0 * 360 + x0] * (1 - u) + grid[y0 * 360 + x1] * u) * (1 - v)
    + (grid[y1 * 360 + x0] * (1 - u) + grid[y1 * 360 + x1] * u) * v) / 100;
}

export function earthPosition(lat, lon, mode = 'ellipsoid', factor = 1, undulation = 0, lift = 0) {
  // Geodetic coordinates: the geoid height is measured along the ellipsoid normal.
  const f = mode === 'ellipsoid' ? F * factor : F;
  const e2 = f * (2 - f), p = lat * DEG, l = lon * DEG;
  const s = Math.sin(p), c = Math.cos(p), n = 1 / Math.sqrt(1 - e2 * s * s);
  const h = (mode === 'geoid' ? undulation * factor / A : 0) + lift;
  return [(n + h) * c * Math.sin(l), (n * (1 - e2) + h) * s, (n + h) * c * Math.cos(l)];
}
