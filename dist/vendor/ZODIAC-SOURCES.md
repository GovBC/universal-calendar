# Sky explorer data and calculation notes

Star positions (J2000) and visual magnitudes are from HYG through Olaf Frohn's
d3-celestial dataset, retrieved 2026-09-06. The bundled subset includes stars
to magnitude 5 and extra reference stars. No proper motion is applied.

- https://github.com/ofrohn/d3-celestial/tree/master/data
- https://github.com/astronexus/HYG-Database
- License: D3-CELESTIAL-LICENSE.txt

The thirteen ecliptic constellation line figures and J2000 boundary vertices
are from the same d3-celestial collection. Connecting lines are teaching aids;
the IAU defines constellation regions, not a unique connecting-line pattern.
Boundary vertices are connected approximately on the sphere. The Sun's current
constellation uses Astronomy Engine's IAU boundary classifier, not polygon
interpolation or a fixed calendar date table.

Lunar-mansion factual star memberships and traditional names were checked against
Khalid al-Ajaji's description of Arabic Lunar Stations in Stellarium:
https://github.com/Stellarium/stellarium-skycultures/blob/master/arabic_lunar_stations/description.md
and its factual HIP identifications in index.json. No illustrations or prose
from that skyculture are redistributed. Membership traditions vary, including
the two arms and bucket mouths. The app identifies a reference star explicitly.
Al-Baldah is an area, represented by an explicitly arbitrary J2000 point at
RA 285 degrees, declination -21 degrees. It is not described as a physical star.
The selected bright members do not exhaust star clusters.

Astronomy Engine provides precession/nutation and equatorial-to-local-horizon
rotations. Sun/Moon positions are topocentric. Displayed altitudes and horizon
crossings are geometric, with no atmospheric refraction, terrain or weather.
The lunar circle is the instantaneous osculating geocentric orbital plane from
GeoMoonState, not a prediction of the Moon's exact track throughout a month.
The Moon marker is topocentric and can therefore be slightly off that circle.
Date support is deliberately limited to 1900–2100.

- https://github.com/cosinekitty/astronomy/blob/master/source/js/README.md
- https://www.iau.org/IAU/IAU/Astronomy-FAQs/FAQs.aspx
- https://eclipse.gsfc.nasa.gov/SEhelp/moonorbit.html

The 12 tropical signs are equal 30-degree divisions of the true ecliptic of date
starting at the March equinox. The 13 physical constellations have unequal
boundaries. The 28 mansions are displayed as stellar groups, without imposing
equally spaced tropical boundaries or implying fixed annual rising dates.
