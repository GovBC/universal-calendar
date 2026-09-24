package com.mohammadalmuhanna.universalcalendar;

import android.app.*;
import android.content.*;
import android.content.res.AssetFileDescriptor;
import android.media.*;
import android.os.*;
import java.io.*;

public final class AlarmSoundService extends Service {
 private static final String STOP="calendar.STOP_SOUND";
 private final Handler handler=new Handler(Looper.getMainLooper());
 private MediaPlayer player;private ToneGenerator tones;
 public static void start(Context c,String title,String body,String soundKey,int id){
  Intent intent=new Intent(c,AlarmSoundService.class).putExtra("title",title).putExtra("body",body).putExtra("soundKey",soundKey).putExtra("id",id);
  try{if(Build.VERSION.SDK_INT>=26)c.startForegroundService(intent);else c.startService(intent);}catch(RuntimeException ignored){}
 }
 public static void preview(Context c,String soundKey){start(c,"اختبار صوت المنبّه","اضغط «إيقاف الصوت» عند الانتهاء.",soundKey,903);}
 public static void stop(Context c){try{c.stopService(new Intent(c,AlarmSoundService.class));}catch(RuntimeException ignored){}}
 @Override public void onCreate(){super.onCreate();AlarmStore.channel(this);}
 @Override public int onStartCommand(Intent intent,int flags,int startId){
  if(intent==null||STOP.equals(intent.getAction())){stopSelf();return START_NOT_STICKY;}
  String title=intent.getStringExtra("title"),body=intent.getStringExtra("body"),key=intent.getStringExtra("soundKey");int id=intent.getIntExtra("id",901);
  startForeground(id,notification(title,body,id));play(key);return START_NOT_STICKY;
 }
 private Notification notification(String title,String body,int id){
  PendingIntent open=PendingIntent.getActivity(this,0,new Intent(this,MainActivity.class).putExtra("worship",true).setFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
  PendingIntent stop=PendingIntent.getService(this,id,new Intent(this,AlarmSoundService.class).setAction(STOP),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
  return new Notification.Builder(this,AlarmStore.CHANNEL).setSmallIcon(R.drawable.ic_notification).setContentTitle(title).setContentText(body).setStyle(new Notification.BigTextStyle().bigText(body)).setCategory(Notification.CATEGORY_ALARM).setOngoing(true).setAutoCancel(false).setContentIntent(open).addAction(0,"إيقاف الصوت",stop).setVisibility(Notification.VISIBILITY_PRIVATE).build();
 }
 private void play(String key){release();if(AlarmStore.hasSound(this,key)&&playFile(AlarmStore.soundFile(this,key)))return;if("official-adhan".equals(key)&&playAsset("audio/official-adhan.m4a"))return;playPattern(AlarmStore.validPrayer(key)?key:"fajr");}
 private boolean playAsset(String path){
  try(AssetFileDescriptor asset=getAssets().openFd(path)){player=new MediaPlayer();player.setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM).setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build());player.setDataSource(asset.getFileDescriptor(),asset.getStartOffset(),asset.getLength());player.prepare();player.setOnCompletionListener(value->stopSelf());player.setOnErrorListener((value,what,extra)->{stopSelf();return true;});player.start();return true;}catch(Exception e){if(player!=null){player.release();player=null;}return false;}
 }
 private boolean playFile(File file){
  try{player=new MediaPlayer();player.setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM).setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build());try(FileInputStream input=new FileInputStream(file)){player.setDataSource(input.getFD());player.prepare();}player.setOnCompletionListener(value->stopSelf());player.setOnErrorListener((value,what,extra)->{stopSelf();return true;});player.start();return true;}catch(Exception e){if(player!=null){player.release();player=null;}return false;}
 }
 private void playPattern(String key){
  final int[][] fajr={{ToneGenerator.TONE_PROP_BEEP,220},{ToneGenerator.TONE_PROP_BEEP2,260},{ToneGenerator.TONE_PROP_ACK,360}},dhuhr={{ToneGenerator.TONE_DTMF_5,180},{ToneGenerator.TONE_DTMF_8,180},{ToneGenerator.TONE_DTMF_0,360}},asr={{ToneGenerator.TONE_PROP_BEEP2,240},{ToneGenerator.TONE_PROP_BEEP,180},{ToneGenerator.TONE_PROP_BEEP2,340}},maghrib={{ToneGenerator.TONE_DTMF_9,200},{ToneGenerator.TONE_DTMF_6,240},{ToneGenerator.TONE_DTMF_3,380}},isha={{ToneGenerator.TONE_DTMF_1,260},{ToneGenerator.TONE_DTMF_2,260},{ToneGenerator.TONE_DTMF_3,420}},rawatib={{ToneGenerator.TONE_PROP_BEEP,180},{ToneGenerator.TONE_PROP_ACK,200},{ToneGenerator.TONE_PROP_BEEP,340}},lunar={{ToneGenerator.TONE_DTMF_2,260},{ToneGenerator.TONE_DTMF_1,260},{ToneGenerator.TONE_DTMF_2,380}},solar={{ToneGenerator.TONE_DTMF_7,180},{ToneGenerator.TONE_DTMF_9,220},{ToneGenerator.TONE_DTMF_P,380}},jumuah={{ToneGenerator.TONE_DTMF_5,180},{ToneGenerator.TONE_DTMF_8,180},{ToneGenerator.TONE_DTMF_0,360}},eid={{ToneGenerator.TONE_DTMF_6,150},{ToneGenerator.TONE_DTMF_8,180},{ToneGenerator.TONE_DTMF_P,200},{ToneGenerator.TONE_DTMF_8,360}},makkah={{ToneGenerator.TONE_DTMF_5,220},{ToneGenerator.TONE_DTMF_8,260},{ToneGenerator.TONE_DTMF_0,320},{ToneGenerator.TONE_DTMF_8,360}},madinah={{ToneGenerator.TONE_DTMF_3,240},{ToneGenerator.TONE_DTMF_5,260},{ToneGenerator.TONE_DTMF_8,320},{ToneGenerator.TONE_DTMF_5,360}},aqsa={{ToneGenerator.TONE_DTMF_1,240},{ToneGenerator.TONE_DTMF_4,260},{ToneGenerator.TONE_DTMF_7,320},{ToneGenerator.TONE_DTMF_4,360}},bell={{ToneGenerator.TONE_SUP_RINGTONE,150},{ToneGenerator.TONE_SUP_RINGTONE,150},{ToneGenerator.TONE_SUP_RINGTONE,260}};
  int[][] pattern="dhuhr".equals(key)?dhuhr:"asr".equals(key)?asr:"maghrib".equals(key)?maghrib:"isha".equals(key)?isha:"rawatib".equals(key)?rawatib:"eclipse-lunar".equals(key)?lunar:"eclipse-solar".equals(key)?solar:"jumuah".equals(key)?jumuah:"eid".equals(key)?eid:"adhan-makkah".equals(key)?makkah:"adhan-madinah".equals(key)?madinah:"adhan-aqsa".equals(key)?aqsa:"iqamah-bell".equals(key)||"iqamah".equals(key)?bell:fajr;tones=new ToneGenerator(AudioManager.STREAM_ALARM,92);runTone(pattern,0,0);
 }
 private void runTone(int[][] pattern,int index,int round){if(tones==null)return;if(round>=3){handler.postDelayed(this::stopSelf,450);return;}int[] item=pattern[index];tones.startTone(item[0],item[1]);int next=(index+1)%pattern.length,nextRound=next==0?round+1:round;handler.postDelayed(()->runTone(pattern,next,nextRound),item[1]+150);}
 private void release(){handler.removeCallbacksAndMessages(null);if(player!=null){try{player.stop();}catch(Exception ignored){}player.release();player=null;}if(tones!=null){tones.release();tones=null;}}
 @Override public void onDestroy(){release();stopForeground(true);super.onDestroy();}
 @Override public IBinder onBind(Intent intent){return null;}
}
