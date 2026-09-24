"""Sample the public-domain NGA EGM96 grid distributed by PROJ, without inventing data."""
from pathlib import Path
from PIL import Image
import hashlib
import json
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'research/egm96.tif'
im = Image.open(source)
assert im.size == (1440, 721)
assert im.tag_v2[33922] == (0., 0., 0., -180., 90., 0.)
assert im.tag_v2[33550][:2] == (.25, .25)
original = np.asarray(im)
assert np.isfinite(original).all()
sample = np.rint(original[::4, ::4] * 100).astype('<i2')
assert sample.shape == (181, 360)
assert np.ptp(sample[0]) == 0 and np.ptp(sample[-1]) == 0
out = ROOT / 'dist/data'
out.mkdir(exist_ok=True)
(out / 'egm96-1deg.bin').write_bytes(sample.tobytes())
metadata = {
    'model': 'EGM96', 'source': 'https://cdn.proj.org/us_nga_egm96_15.tif',
    'license': 'Public Domain', 'credit': 'NGA; GeoTIFF distribution by PROJ / OSGeo',
    'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
    'encoding': 'little-endian int16, centimetres; row-major north to south',
    'rows': 181, 'columns': 360, 'north': 90, 'west': -180, 'stepDegrees': 1,
    'sourceStepDegrees': .25, 'unitMetres': .01,
    'sampleMinMetres': float(sample.min() / 100), 'sampleMaxMetres': float(sample.max() / 100),
    'sourceMinMetres': float(original.min()), 'sourceMaxMetres': float(original.max()),
    'referenceEllipsoid': 'WGS 84', 'semiMajorAxisMetres': 6378137,
    'inverseFlattening': 298.257223563,
    'method': 'Every fourth source node retained, then rounded to centimetres. Bilinear interpolation at display time. Educational display, not surveying.'
}
(out / 'egm96-metadata.json').write_text(json.dumps(metadata, indent=2) + '\n')
print(json.dumps({'bytes':sample.nbytes,'rangeMetres':[metadata['sampleMinMetres'], metadata['sampleMaxMetres']]}))
