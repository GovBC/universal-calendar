import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

// This file is bundled only into the native asset copy, never into dist/.
const root = window;
const C = root.CalendarCore;
const L = root.LunarCalc;
const webPush = root.PrayerPush;
const MAX_PENDING = Capacitor.getPlatform() === 'ios' ? 60 : 240;
const IDS_KEY = 'calendar.nativeNotificationIds';
let permission = 'default';
let updateTimer;
let updateQueue = Promise.resolve();

const watches = new Map();
let nextWatch = 1;
function geoError(error) {
  const message = error?.message || 'تعذر تحديد الموقع';
  return { code: /denied|permission/i.test(message) ? 1 : /timeout/i.test(message) ? 3 : 2, message };
}
const geolocation = {
  getCurrentPosition(success, failure, options = {}) {
    Geolocation.getCurrentPosition(options).then(success).catch(error => failure?.(geoError(error)));
  },
  watchPosition(success, failure, options = {}) {
    const handle = nextWatch++;
    const nativeWatch = Geolocation.watchPosition(options, (position, error) => {
      if (error) failure?.(geoError(error));
      else if (position) success(position);
    });
    watches.set(handle, nativeWatch);
    return handle;
  },
  clearWatch(handle) {
    const nativeWatch = watches.get(handle);
    watches.delete(handle);
    nativeWatch?.then(id => Geolocation.clearWatch({ id })).catch(() => {});
  }
};

function savedIds() {
  try {
    const ids = JSON.parse(localStorage.getItem(IDS_KEY) || '[]');
    return Array.isArray(ids) ? ids.filter(Number.isInteger) : [];
  } catch { return []; }
}
function idFor(value) {
  let hash = 2166136261;
  for (const char of value) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return (hash >>> 1) || 1;
}
async function checkPermission(request = false) {
  const result = request ? await LocalNotifications.requestPermissions() : await LocalNotifications.checkPermissions();
  permission = result.display === 'granted' ? 'granted' : result.display === 'denied' ? 'denied' : 'default';
  root.dispatchEvent(new Event('calendar-native-permission'));
  return permission;
}
async function cancelManaged() {
  const ids = savedIds();
  if (ids.length) await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
  localStorage.removeItem(IDS_KEY);
}
function makeSchedule(days = 30) {
  const events = webPush.pushSchedule(C, L, {
    days,
    alerts: C.worshipAlerts(C.read('calendar.alerts', {})),
    mode: C.read('calendar.witrMode', 'after_isha'),
    offset: C.read('calendar.offset', 0)
  });
  const ids = new Set();
  return events.map(event => {
    const id = idFor(event.tag + '/' + event.at);
    return {
      id, title: event.title, body: event.body,
      schedule: { at: new Date(event.at), allowWhileIdle: true },
      sound: 'adhan_alert.wav',
      extra: { route: 'worship' }
    };
  }).filter(event => {
    if (ids.has(event.id)) return false;
    ids.add(event.id);
    return true;
  }).slice(0, MAX_PENDING);
}
async function replaceSchedule(days = 30) {
  if (await checkPermission() !== 'granted') throw Error('اسمح بإشعارات التطبيق من إعدادات الجهاز');
  const notifications = makeSchedule(days);
  // Only the identifiers created by this app are removed; test notifications
  // and any other plugin users are left alone.
  await cancelManaged();
  if (notifications.length) await LocalNotifications.schedule({ notifications });
  localStorage.setItem(IDS_KEY, JSON.stringify(notifications.map(event => event.id)));
  return { count: notifications.length, nextDueAt: notifications[0]?.schedule.at.toISOString() };
}
function enqueueUpdate(days = 30) {
  updateQueue = updateQueue.catch(() => {}).then(() => replaceSchedule(days));
  return updateQueue;
}
function deferUpdate() {
  clearTimeout(updateTimer);
  updateTimer = setTimeout(() => {
    const active = C.read('calendar.notifications', false) || C.read('calendar.pushNotifications', false);
    updateQueue = updateQueue.catch(() => {}).then(async () => {
      if (active && await checkPermission() === 'granted') await replaceSchedule();
      else await cancelManaged();
    }).catch(console.warn);
  }, 350);
}
async function test() {
  if (await checkPermission(true) !== 'granted') throw Error('لم يُمنح إذن الإشعارات');
  const at = new Date(Date.now() + 65000);
  await LocalNotifications.schedule({ notifications: [{
    id: idFor('calendar-native-test-' + Date.now()),
    title: 'اختبار تنبيه الخلفية', body: C.location.name + ' • التقويم العالمي الشامل',
    schedule: { at, allowWhileIdle: true }, sound: 'adhan_alert.wav', extra: { route: 'worship' }
  }] });
  return { at };
}
root.PrayerPush = {
  ...webPush,
  async enable(_core, _lunar, options = {}) {
    if (await checkPermission(true) !== 'granted') throw Error('لم يُمنح إذن الإشعارات');
    C.save('calendar.pushNotifications', true);
    return enqueueUpdate(options.days === 7 ? 7 : 30);
  },
  test,
  async disable() {
    C.save('calendar.pushNotifications', false);
    if (C.read('calendar.notifications', false)) await enqueueUpdate();
    else await cancelManaged();
    return true;
  }
};

// The existing UI uses Notification.permission and requestPermission. The
// native implementation keeps those controls while using device permissions.
class NativeNotification {
  static get permission() { return permission; }
  static requestPermission() { return checkPermission(true); }
  constructor(title, options = {}) {
    if (permission === 'granted') {
      LocalNotifications.schedule({ notifications: [{
        id: idFor(title + '/' + Date.now()), title, body: options.body || '',
        schedule: { at: new Date(Date.now() + 1000) }, sound: 'adhan_alert.wav', extra: { route: 'worship' }
      }] }).catch(console.warn);
    }
  }
}
root.Notification = NativeNotification;

async function shareFile(blob, filename) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  const name = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const result = await Filesystem.writeFile({
    path: 'exports/' + name, data: btoa(binary), directory: Directory.Cache, recursive: true
  });
  await Share.share({ title: filename, url: result.uri, dialogTitle: 'حفظ التقويم أو مشاركته' });
}
root.CalendarNative = { geolocation, shareFile, reschedule: enqueueUpdate };

const originalSave = C.save;
C.save = function (key, value) {
  const saved = originalSave.apply(this, arguments);
  if (['calendar.notifications', 'calendar.pushNotifications', 'calendar.alerts',
       'calendar.witrMode', 'calendar.offset', 'calendar.alarmTiming'].includes(key)) deferUpdate();
  return saved;
};
root.addEventListener('calendar-location', deferUpdate);
root.addEventListener('calendar-alarm-timing-change', deferUpdate);
document.addEventListener('visibilitychange', () => { if (!document.hidden) deferUpdate(); });
LocalNotifications.addListener('localNotificationActionPerformed', () => { location.hash = 'worship'; }).catch(console.warn);
checkPermission().then(() => deferUpdate()).catch(console.warn);
