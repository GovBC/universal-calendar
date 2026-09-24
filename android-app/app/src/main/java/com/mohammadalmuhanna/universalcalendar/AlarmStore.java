package com.mohammadalmuhanna.universalcalendar;

import android.app.*;
import android.content.*;
import android.content.pm.PackageManager;
import android.os.Build;
import org.json.*;
import java.io.*;
import java.util.*;

public final class AlarmStore {
 public static final String CHANNEL="prayer_alarms_v2";
 private static final String PREFS="native_prayer_alarms";
 private static SharedPreferences prefs(Context c){return c.getSharedPreferences(PREFS,Context.MODE_PRIVATE);}
 public static void channel(Context c){
  NotificationChannel ch=new NotificationChannel(CHANNEL,"منبّه الصلوات",NotificationManager.IMPORTANCE_HIGH);
  ch.setDescription("تنبيهات محلية بصوت مستقل لكل صلاة");
  ch.enableVibration(true);ch.setVibrationPattern(new long[]{0,300,150,300});
  ch.setSound(null,null);
  c.getSystemService(NotificationManager.class).createNotificationChannel(ch);
 }
 public static boolean notificationsAllowed(Context c){
  if(Build.VERSION.SDK_INT>=33 && c.checkSelfPermission("android.permission.POST_NOTIFICATIONS")!=PackageManager.PERMISSION_GRANTED)return false;
  NotificationManager nm=c.getSystemService(NotificationManager.class);
  NotificationChannel ch=nm.getNotificationChannel(CHANNEL);
  return nm.areNotificationsEnabled()&&(ch==null||ch.getImportance()!=NotificationManager.IMPORTANCE_NONE);
 }
 public static boolean exactAllowed(Context c){return Build.VERSION.SDK_INT<31||c.getSystemService(AlarmManager.class).canScheduleExactAlarms();}
 private static JSONArray events(Context c){try{return new JSONArray(prefs(c).getString("events","[]"));}catch(JSONException e){return new JSONArray();}}
 private static PendingIntent alarmIntent(Context c,int id,long at){
  Intent i=new Intent(c,AlarmReceiver.class).setAction(id==2?"calendar.TEST":"calendar.PRAYER");i.putExtra("at",at);
  return PendingIntent.getBroadcast(c,id,i,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
 }
 private static PendingIntent openIntent(Context c){return PendingIntent.getActivity(c,0,new Intent(c,MainActivity.class).putExtra("worship",true).setFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);}
 public static synchronized void setEnabled(Context c,boolean enabled){
  prefs(c).edit().putBoolean("enabled",enabled).commit();
  if(!enabled){c.getSystemService(AlarmManager.class).cancel(alarmIntent(c,2,0));prefs(c).edit().remove("testAt").commit();}
  arm(c);
 }
 public static synchronized void invalidate(Context c){prefs(c).edit().putString("events","[]").putLong("validUntil",0).commit();arm(c);}
 public static synchronized void save(Context c,String payload)throws JSONException{
  if(payload.length()>3000000)throw new JSONException("Schedule too large");
  JSONObject input=new JSONObject(payload);JSONArray arr=input.getJSONArray("events");
  if(arr.length()>12000)throw new JSONException("Too many events");
  long now=System.currentTimeMillis(),validUntil=input.getLong("validUntil"),limit=now+370L*86400000;
  if(validUntil<=now||validUntil>limit)throw new JSONException("Invalid horizon");
  List<JSONObject> accepted=new ArrayList<>();Set<String> ids=new HashSet<>();
  for(int n=0;n<arr.length();n++){
   JSONObject e=arr.getJSONObject(n);long at=e.getLong("at");String title=e.getString("title");
   if(title.length()>180||at>validUntil)throw new JSONException("Invalid event");
   String soundKey=validPrayer(e.optString("soundKey",""))?e.optString("soundKey"):"default";
   if(at>now&&ids.add(at+"|"+title))accepted.add(new JSONObject().put("at",at).put("title",title).put("soundKey",soundKey));
  }
  accepted.sort(Comparator.comparingLong(e->e.optLong("at")));
  JSONArray clean=new JSONArray();for(JSONObject e:accepted)clean.put(e);
  String location=input.optString("location","");if(location.length()>100)throw new JSONException("Invalid location");
  if(!prefs(c).edit().putString("events",clean.toString()).putString("location",location).putLong("validUntil",validUntil).putLong("updatedAt",now).commit())throw new JSONException("Storage failed");
  arm(c);
 }
 public static synchronized void arm(Context c){
  AlarmManager manager=c.getSystemService(AlarmManager.class);manager.cancel(alarmIntent(c,1,0));
  if(!prefs(c).getBoolean("enabled",false)||!exactAllowed(c)||!notificationsAllowed(c))return;
  JSONArray arr=events(c);long[] times=new long[arr.length()];for(int n=0;n<arr.length();n++)times[n]=arr.optJSONObject(n).optLong("at");
  long at=AlarmQueue.next(times,System.currentTimeMillis(),prefs(c).getLong("deliveredThrough",0));
  if(at>0)try{manager.setAlarmClock(new AlarmManager.AlarmClockInfo(at,openIntent(c)),alarmIntent(c,1,at));}catch(SecurityException ignored){}
 }
 public static synchronized long test(Context c){
  if(!exactAllowed(c)||!notificationsAllowed(c))return 0;
  long at=System.currentTimeMillis()+60000;prefs(c).edit().putLong("testAt",at).commit();
  try{c.getSystemService(AlarmManager.class).setAlarmClock(new AlarmManager.AlarmClockInfo(at,openIntent(c)),alarmIntent(c,2,at));return at;}catch(SecurityException e){return 0;}
 }
 public static synchronized void receive(Context c,Intent intent){
  channel(c);long at=intent.getLongExtra("at",0),now=System.currentTimeMillis();
  if("calendar.TEST".equals(intent.getAction())){
   if(at==prefs(c).getLong("testAt",0)&&AlarmQueue.deliverable(at,now,0)){prefs(c).edit().remove("testAt").commit();show(c,"اختبار منبّه الصلاة","وصل التنبيه من نظام الهاتف دون الحاجة إلى فتح التطبيق.","fajr",902);}
   return;
  }
  if(!prefs(c).getBoolean("enabled",false))return;
  if(AlarmQueue.deliverable(at,now,prefs(c).getLong("deliveredThrough",0))){
   JSONArray arr=events(c);List<String> titles=new ArrayList<>();String soundKey="default";
   for(int n=0;n<arr.length();n++){JSONObject e=arr.optJSONObject(n);if(e.optLong("at")==at){titles.add(e.optString("title"));if(validPrayer(e.optString("soundKey")))soundKey=e.optString("soundKey");}}
   if(!titles.isEmpty()&&notificationsAllowed(c)){
    prefs(c).edit().putLong("deliveredThrough",at).commit();
    show(c,android.text.TextUtils.join(" • ",titles),prefs(c).getString("location","")+" • التقويم العالمي الشامل",soundKey,901);
   }
  }
  arm(c);
 }
 private static void show(Context c,String title,String body,String soundKey,int id){if(notificationsAllowed(c))AlarmSoundService.start(c,title,body,soundKey,id);}
 static boolean validPrayer(String key){return Arrays.asList("fajr","dhuhr","asr","maghrib","isha","rawatib","eclipse-lunar","eclipse-solar","jumuah","eid","iqamah","official-adhan","adhan-makkah","adhan-madinah","adhan-aqsa","iqamah-bell").contains(key);}
 static File soundFile(Context c,String prayer){return new File(new File(c.getFilesDir(),"alarm_sounds"),prayer+".audio");}
 public static synchronized boolean saveSound(Context c,String prayer,byte[] data,String mime){
  if(!validPrayer(prayer)||data==null||data.length==0||data.length>8*1024*1024||mime==null||!mime.startsWith("audio/"))return false;
  File file=soundFile(c,prayer);file.getParentFile().mkdirs();File temp=new File(file.getParentFile(),prayer+".tmp");
  try(FileOutputStream out=new FileOutputStream(temp)){out.write(data);out.getFD().sync();}catch(IOException e){temp.delete();return false;}
  if(file.exists()&&!file.delete()){temp.delete();return false;}if(!temp.renameTo(file)){temp.delete();return false;}prefs(c).edit().putBoolean("sound."+prayer,true).apply();return true;
 }
 public static synchronized void clearSound(Context c,String prayer){if(!validPrayer(prayer))return;soundFile(c,prayer).delete();prefs(c).edit().remove("sound."+prayer).apply();}
 static boolean hasSound(Context c,String prayer){return validPrayer(prayer)&&prefs(c).getBoolean("sound."+prayer,false)&&soundFile(c,prayer).isFile();}
 public static synchronized String status(Context c){
  try{
   JSONArray arr=events(c);long now=System.currentTimeMillis();int count=0;long next=Long.MAX_VALUE;
   for(int n=0;n<arr.length();n++){long at=arr.optJSONObject(n).optLong("at");if(at>now){count++;next=Math.min(next,at);}}
   return new JSONObject().put("enabled",prefs(c).getBoolean("enabled",false)).put("notifications",notificationsAllowed(c)).put("exact",exactAllowed(c)).put("count",count).put("next",next==Long.MAX_VALUE?0:next).put("validUntil",prefs(c).getLong("validUntil",0)).put("updatedAt",prefs(c).getLong("updatedAt",0)).put("location",prefs(c).getString("location","")).put("version","1.5.0").toString();
  }catch(JSONException e){return "{}";}
 }
}
