# Earth shape: sources and rendering method

Retrieved / checked 2026-09-06.

## What is included

This app creates its own Three.js mesh. It does not redistribute NASA's GLB or
claim to be a NASA-certified model. The NASA source GLB returned HTTP 403 when
downloaded. The page links to the original visualization for comparison.

The WGS 84 reference ellipsoid has a = 6,378,137 m and 1/f = 298.257223563.
b = a(1-f), so the diameter difference is 42.76937151 km.

- https://epsg.org/ellipsoid_7030/WGS-84.html (EPSG:7030)
- https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84

## Measured geoid data

- Model: EGM96, NGA, distributed by the PROJ / OSGeo project.
- https://cdn.proj.org/us_nga_egm96_15.tif
- https://cdn.proj.org/us_nga_README.txt
- License: Public Domain. The source TIFF also records this in tag 33432.
- The unmodified source is retained in research/egm96.tif for reproducibility.
- scripts/prepare-earth-geoid.py retains every fourth grid node, yielding a
  1-degree grid with signed centimetre values. No synthetic undulations are used.
- dist/data/egm96-metadata.json includes the original SHA-256, extent, units,
  sampling and source range. Rendered vertex values use bilinear interpolation.
- Rows start at 90 N; columns start at 180 W and wrap after 179 E.
- The sampled range is -106.59 m to +84.23 m; this is not the range of the full
  EGM96 grid (-106.9911 m to +85.3909 m), nor of NASA's GOCO06s visualization.
- Geoid heights displace along the WGS 84 geodetic normal, not the geocentric
  radius. The ellipsoid stays at true flattening in geoid mode.
- The illustrative ellipsoid mode applies f_display = multiplier * f. A true
  scale button restores multiplier 1. Amplification badges stay visible.
- EGM96 is a static reference model, not live measurements or a terrain model.
- Coastal outlines reuse the app's bundled Natural Earth land.geojson.

## Explanation and NASA comparison

- https://oceanservice.noaa.gov/facts/geoid.html
- https://svs.gsfc.nasa.gov/5660/
  NASA / GSFC Scientific Visualization Studio, Mark SubbaRao; science advisor
  Scott Luthcke. NASA uses GOCO06s, not EGM96. Its illustrative height scale is
  10,000x; the page also provides a true-scale animation.
- https://essd.copernicus.org/articles/13/99/2021/
- https://www.nasa.gov/nasa-brand-center/images-and-media/
  Educational/informational reuse is generally permitted with source credit,
  without implying endorsement, subject to marked third-party exceptions.

The application has independent Arabic explanatory text and an independently
implemented viewer. The grid is reduced for a lightweight educational display,
not a survey-grade height conversion service.
