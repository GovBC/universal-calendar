# Audio Platform Public Publish Policy Fix

- Fixed public phone publishing after upload by tightening the anonymous insert policy to safe generated paths.
- The storage upload policy now accepts only platform audio folders with generated UUID names.
- Public publishing explicitly requests no returned row data, keeping contact phone hidden.
- Refreshed the offline PWA cache.

# Audio Platform Public Session Fix

- Send public Supabase requests with the visitor authorization header.
- Load the community feed and leaderboard without touching old browser login sessions.
- Replaced the obsolete “session expired, sign in again” message for public access failures.
- Refreshed the offline PWA cache.

# Audio Platform Public Phone Publishing

- Removed the audio-platform login box entirely.
- Moved the phone number into the publishing form only.
- Publishing now uploads and creates the recording as a public visitor action without a Supabase Auth session.
- Store the phone number for follow-up while keeping it out of the public feed view.
- Refreshed the offline PWA cache.

# Audio Platform Phone-only Guest Login

- Changed the audio-platform account box to one phone field and one login button.
- Removed password, SMS sending, and OTP verification from the participation flow.
- Use Supabase anonymous sessions for publishing and likes while showing the phone number as unverified.
- Updated audio-platform policies so anonymous Supabase users can publish, like, and upload under their own account ID.
- Refreshed the offline PWA cache.

# Global Countries In The Dates Calendar

- Added a persistent country selector covering 195 states: 193 UN members plus Palestine and Vatican City.
- Kept Saudi Arabia as the default and preserved its 248-name, source-backed cultivar directory.
- Added a separate, explicit no-data state for every other country so Saudi cultivars and dates are never shown as another country's data.
- Refreshed the offline PWA cache.

# Audio Platform SMS Login

- Replaced the audio-platform email/password account box with phone-number SMS OTP.
- Added Saudi phone-number normalization, Arabic digit handling, and clear SMS-provider setup errors.
- Surface disabled SMS-provider errors directly inside the account form.
- Kept listening and manual sound import public while publishing and likes require a verified session.
- Refreshed the offline PWA cache.

# Calendar Month Lengths

- Added a small metadata line to calendar month cards showing the number of
  days in the displayed month.
- Added the same month-length and leap-year status to every calendar in the
  equivalent-calendars list.
- Refreshed the offline PWA cache.

# Today Preboot Refresh

- Added an early Today-page preboot so saved location, hour format, and date
  cards render before the heavier live calculations finish loading.
- Prevented the navigation script from briefly restoring the old static Today
  header during page refresh.
- Refreshed the offline PWA cache.

# Chinese Year Placement

- Removed the Chinese year name from the Gregorian Today card.
- Kept the Chinese year name only on the Chinese calendar display.
- Refreshed the offline PWA cache.

# Calendar Page Today Picker

- Moved the alternate Today calendar selector out of the Today date card and
  into the Calendar page.
- Restored the Today date ribbon to a cleaner two-card layout on mobile.
- Added a selected-state badge in the Calendar page for the calendar currently
  shown on the Today page.
- Refreshed the offline PWA cache.

# Today Date Format And Alternate Calendar

- Updated Today page date cards to use the requested slash format:
  day/month number with month name/year.
- The Gregorian card now shows the Arabic and English Gregorian month name and
  appends the Chinese year name.
- Added a Today page selector that replaces the Solar Hijri card with any
  calendar from the Calendar page's living-calendar list.
- Refreshed the offline PWA cache version.

# Prayer-specific alarm sounds

- Added an «الأصوات» tab with a distinct default tone for every obligatory prayer.
- Audio files and microphone recordings can be saved locally, previewed, deleted, and assigned independently to Fajr, Dhuhr, Asr, Maghrib, or Isha.
- Android 1.1.0 now copies the selected sound into protected app storage and plays it from a foreground alarm service when the local exact alarm fires.

Validation: all 65 web, calculation, schedule, offline-asset, and Android integration tests pass; the Android 1.1.0 APK compiles and verifies with v2/v3 signing.

# Correct local eclipse view

- The observer view now preserves the angular scale and the true apparent size
  ratio of the Sun and Moon instead of visually implying a local eclipse.
- Global eclipses that do not cross the selected location are explicitly marked
  “No eclipse occurs from your location,” with the measured gap between the two
  disc edges.
- The legend now contains only the objects present in the selected view, while
  below-horizon events and global-only peaks have distinct, accurate labels.
- Shadow-geometry descriptions now distinguish umbra, antumbra, and a partial
  eclipse whose central shadow axis misses Earth.

Validation: JavaScript syntax and all 36 astronomical, prayer, calendar,
visibility, and interaction tests pass.

# Mobile background-color control

- Restored the background-color button in the mobile top bar.
- Kept a full 42-pixel touch target and added a clear accessible label.

Validation: responsive styles, JavaScript syntax, static assets, and the complete test suite pass.

# 12/24-hour time display

- Added a top-bar control that switches every displayed time between the 12-hour and 24-hour systems.
- The selected format is saved on the device and applied to prayer times, eclipses, sky and moon views, GPS updates, and news timestamps.
- Twelve-hour Arabic times include the morning/evening marker to avoid ambiguity.

Validation: JavaScript syntax, the complete calculation suite, and static asset references pass.

# Scientifically corrected eclipse model

- Replaced the symbolic eclipse animation with the correct Sun–Moon–Earth and
  Sun–Earth–Moon alignments, including umbra, penumbra, and antumbra geometry.
- The observer view now uses calculated topocentric altitude, angular
  separation, apparent disc sizes, and instantaneous solar obscuration.
- Lunar shadow radii are derived from the live Sun, Earth, and Moon distances;
  phase labels now follow the calculated penumbral, partial, and total contacts.
- Global eclipses no longer fabricate local contacts or imply local visibility.

Validation: eclipse contact-order regressions, local-visibility fixtures,
JavaScript syntax, and the full calculation test suite pass.

# Eclipse model in the prayer page

- The complete solar- and lunar-eclipse schedule and 3D simulation now appear
  in the الصلاة page beside the prayer times and eclipse-prayer information.
- The previous عبادات placement is removed at runtime while preserving one
  shared model, controls, calculations, alerts, and selected-year state.

Validation: static entrypoint, local assets, JavaScript syntax, and existing
calculation/interaction tests remain valid.

# Correct whole-minute prayer times

- Prayer entry instants with remaining seconds now advance to the next complete
  minute instead of being displayed one minute early.
- The correction applies consistently to prayer cards, reminders, countdowns,
  worship events, and exported calendar entries.
- Added exact Mecca and Dammam fixtures to prevent the minute-loss regression.

Validation: prayer calculations and all application tests pass, including the
official-style whole-minute values visible in the reported Dammam example.

# Accurate prayer-page Sun path

- Replaced the fixed decorative arc with a live solar-altitude curve calculated
  from the selected location, date, sunrise, and sunset.
- Positioned the Sun by its current time and true altitude, and added live
  altitude and azimuth readings with clear pre-noon, post-noon, and night states.
- Updated the highlighted event in the prayer timeline and refreshed the
  offline application cache.

Validation: all 31 calculation and interaction tests pass; JavaScript syntax
and the prayer timeline's astronomical edge cases were checked.

# Automatic GPS location

- Requests the device location automatically on first use and applies it to
  prayer, sky, moon, eclipse, and calendar calculations.
- Keeps the location current while the app is open when automatic GPS is
  enabled.
- Adds a location panel with accuracy, last-update time, privacy status, retry
  controls, and a manual-location fallback.
- Preserves the user's choice locally and keeps the app usable when location
  permission is denied.

Validation: JavaScript syntax, local assets, calculations, and interaction
tests checked.

# Earth-season synchronization

- Kept the physical spin axis parallel in space while making its changing
  relationship to the Sun explicit throughout the orbit.
- Added a Sun-locked close view in which the Earth visibly leans toward the Sun
  in June, passes through the equinoxes, and leans away in December.
- Enlarged the four seasonal reference Earths, added their tilted equators, and
  color-coded the two poles by solar orientation.
- Marked the subsolar point and kept the illumination tied to the live orbital
  position.

Validation: all 30 calculation and interaction tests pass; JavaScript syntax,
local assets and whitespace checked.

# Worship reminders update

- Separated Ishraq and Duha reminders, preserving the old combined preference.
- Explained sunrise, early Duha (Ishraq), later Duha and their approximate times,
  with links to the relevant Ibn Baz rulings. Removed sunrise prayer reminders.
- Added Witr with its night window and a persisted choice of 30 minutes after
  Isha time or 30 minutes before Fajr, explicitly presented as reminder times.
- Included these reminders in the daily agenda and enabled weekly calendar
  exports, with alerts at the selected time for Ishraq, Duha and Witr.
- Updated offline assets. Notification delivery still requires the app open.

Validation: 16 passing calculation/export tests, including local midnight,
DST, polar missing events and preference migration; JavaScript syntax, HTML
IDs, local assets and whitespace checked. Browser QA was not requested.

# Release 27 — functional calendar and app repair

The app now uses one persisted observer for the dashboard, prayer calculations,
calendar settings, lunar tracker, constellation explorer and sky. Sky experiments
can still choose their own dates and local observer fields.

- Added reversible Gregorian, Persian and Umm al-Qura calendar conversion,
  real weekday grids, selected days, month navigation and validation.
- Added astronomical daily prayer times, dynamic countdowns, location/method
  settings, polar null results and midnight-DST handling.
- Replaced decorative sky stars with a draggable Three.js catalog sky and real
  solar/lunar positions, with a flat projection if WebGL is unavailable.
- Calculated global eclipses with local visibility clipping; fixed the 2031
  hybrid solar classification and real date/time slider readouts.
- Corrected seasonal labels, extended the seasonal schedule through 67 lunar
  years, and corrected the Earth orbit/declination and precession geometry.
- Implemented permission-based camera capture and manual shadow comparison.
- Implemented opt-in notifications while the app is open and seven-day ICS
  exports for importing reminders into the user's calendar. Preferences persist.
- Added app manifest and same-origin offline asset caching.
- Replaced the placeholder chat with an explicitly local calculation assistant.
- Replaced unverified award/competition placeholders with sourced records;
  persisted news filters and added a ten-minute refresh while news is visible.
- Fixed history, heritage empty/selected states, growth-stage dataset access,
  hidden canvas pointer interception, and organ-specific research links.

Validation: 23 passing Node tests; JavaScript syntax, manifest, HTML ID uniqueness,
local assets and Git whitespace checked. There is no compatible supervised
browser preview for this static checkout; no visual/device QA was claimed.

Scope boundaries: the assistant is deterministic and has no connected generative
AI service. Notifications require browser permission and an active app; background
push scheduling is not implemented. ICS reminders are managed by the destination
calendar. Camera analysis uses manually entered shadow measurements, not vision
inference. Some heritage/organ scenes are explicitly educational illustrations;
they do not prove historic sky coordinates or transplant-ready organs. News uses
an external RSS provider with a retry and source-link fallback. Selected results
are dated records, not a complete live results service.
# الإصدار 50 — أهم التقاويم الحيّة

- إضافة لوحة موحّدة تعرض التاريخ المختار في 14 تقويمًا حيًا.
- توسيع محوّل التاريخ ليقبل الميلادي، وأم القرى، والهجري الشمسي، والعبري، وساكا الهندي، والإثيوبي، والقبطي، والبوذي التايلندي.
- إضافة التقويم الصيني، والياباني، ومينغوو، واليولياني، والبيزنطي، والبهائي إلى عرض المقارنة.
- دعم الشهر الثالث عشر في التقويمين الإثيوبي والقبطي والسنة العبرية الكبيسة.
- تحسين العرض المتجاوب لبطاقات التقاويم على الهاتف.
