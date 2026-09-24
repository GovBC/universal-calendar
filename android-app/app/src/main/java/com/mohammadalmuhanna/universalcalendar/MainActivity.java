package com.mohammadalmuhanna.universalcalendar;

import android.Manifest;
import android.app.*;
import android.content.*;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.*;
import android.provider.Settings;
import android.util.Base64;
import android.view.*;
import android.webkit.*;
import android.widget.*;
import org.json.JSONObject;
import java.io.*;
import java.util.*;

public final class MainActivity extends Activity {
 private static final String HOST="appassets.androidplatform.net",START="https://"+HOST+"/assets/index.html";
 private WebView web;
 private GeolocationPermissions.Callback locationCallback;
 private String locationOrigin;
 private PermissionRequest mediaRequest;
 private byte[] exportBytes;
 private ValueCallback<Uri[]> fileCallback;
 private boolean loaded;
 private boolean trusted(String url){Uri u=Uri.parse(url);return "https".equals(u.getScheme())&&HOST.equals(u.getHost());}
 @Override public void onCreate(Bundle state){
  super.onCreate(state);AlarmStore.channel(this);
  FrameLayout root=new FrameLayout(this);root.setBackgroundColor(0xff07111f);
  root.setOnApplyWindowInsetsListener((v,insets)->{v.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());return insets.consumeSystemWindowInsets();});
  web=new WebView(this);root.addView(web,new FrameLayout.LayoutParams(-1,-1));setContentView(root);
  web.setBackgroundColor(0xff07111f);WebSettings s=web.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setGeolocationEnabled(true);s.setAllowFileAccess(false);s.setAllowContentAccess(false);s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);s.setMediaPlaybackRequiresUserGesture(true);s.setSupportMultipleWindows(false);
  web.addJavascriptInterface(new PhoneBridge(),"AndroidCalendar");
  web.setWebViewClient(new WebViewClient(){
   @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
    Uri u=request.getUrl();if(!HOST.equals(u.getHost()))return null;
    if(!"https".equals(u.getScheme())||!"GET".equals(request.getMethod()))return missing();
    String path=u.getPath();if(path==null||!path.startsWith("/assets/")||path.contains("..")||path.contains("\\")||path.indexOf(0)>=0)return missing();
    String file=path.substring(8);if(file.isEmpty())file="index.html";
    try{
     String mime=mime(file);Map<String,String> headers=new HashMap<>();headers.put("Cache-Control","no-store");headers.put("X-Content-Type-Options","nosniff");
     headers.put("Content-Security-Policy","default-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https:; media-src 'self' blob:; frame-src 'none'; object-src 'none'; base-uri 'self'");
     return new WebResourceResponse(mime,mime.startsWith("text/")||mime.contains("javascript")||mime.contains("json")?"UTF-8":null,200,"OK",headers,getAssets().open(file));
    }catch(IOException ex){return missing();}
   }
   @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){
    String url=request.getUrl().toString();if(trusted(url))return false;
    if(request.isForMainFrame())external(request.getUrl());return true;
   }
   @Override public void onPageFinished(WebView view,String url){if(trusted(url)){loaded=true;refreshStatus();if(getIntent().getBooleanExtra("worship",false)){web.evaluateJavascript("location.hash='worship'",null);getIntent().removeExtra("worship");}}}
   @Override public void onReceivedError(WebView view,WebResourceRequest req,WebResourceError error){if(req.isForMainFrame())Toast.makeText(MainActivity.this,"تعذّر فتح الصفحة. أغلق التطبيق وافتحه مجددًا.",Toast.LENGTH_LONG).show();}
  });
  web.setWebChromeClient(new WebChromeClient(){
   @Override public void onGeolocationPermissionsShowPrompt(String origin,GeolocationPermissions.Callback callback){
    if(!trusted(origin)){callback.invoke(origin,false,false);return;}
    if(checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION)==PackageManager.PERMISSION_GRANTED){callback.invoke(origin,true,false);return;}
    if(locationCallback!=null)locationCallback.invoke(locationOrigin,false,false);
    locationCallback=callback;locationOrigin=origin;
    requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION,Manifest.permission.ACCESS_COARSE_LOCATION},100);
   }
   @Override public void onPermissionRequest(PermissionRequest request){runOnUiThread(()->{
    List<String> resources=Arrays.asList(request.getResources());boolean video=resources.contains(PermissionRequest.RESOURCE_VIDEO_CAPTURE),audio=resources.contains(PermissionRequest.RESOURCE_AUDIO_CAPTURE);
    if(!trusted(request.getOrigin().toString())||(!video&&!audio)||resources.stream().anyMatch(r->!PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(r)&&!PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r))){request.deny();return;}
    List<String> permissions=new ArrayList<>();if(video&&checkSelfPermission(Manifest.permission.CAMERA)!=PackageManager.PERMISSION_GRANTED)permissions.add(Manifest.permission.CAMERA);if(audio&&checkSelfPermission(Manifest.permission.RECORD_AUDIO)!=PackageManager.PERMISSION_GRANTED)permissions.add(Manifest.permission.RECORD_AUDIO);
    if(permissions.isEmpty())request.grant(request.getResources());
    else {if(mediaRequest!=null)mediaRequest.deny();mediaRequest=request;requestPermissions(permissions.toArray(new String[0]),101);}
   });}
   @Override public void onPermissionRequestCanceled(PermissionRequest request){if(mediaRequest==request)mediaRequest=null;}
   @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params){
    if(fileCallback!=null)fileCallback.onReceiveValue(null);fileCallback=callback;
    try{startActivityForResult(params.createIntent(),201);}catch(ActivityNotFoundException e){fileCallback=null;callback.onReceiveValue(null);}return true;
   }
  });
  web.setDownloadListener((url,ua,disposition,type,length)->{if(url.startsWith("https://"))external(Uri.parse(url));});
  if(Build.VERSION.SDK_INT>=33)getOnBackInvokedDispatcher().registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,this::handleBack);
  web.loadUrl(START);
 }
 private WebResourceResponse missing(){return new WebResourceResponse("text/plain","UTF-8",404,"Not Found",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
 private static String mime(String path){
  if(path.endsWith(".js")||path.endsWith(".mjs"))return "application/javascript";
  if(path.endsWith(".html"))return "text/html";if(path.endsWith(".css"))return "text/css";
  if(path.endsWith(".svg"))return "image/svg+xml";if(path.endsWith(".json")||path.endsWith(".geojson")||path.endsWith(".webmanifest"))return "application/json";
  if(path.endsWith(".woff2"))return "font/woff2";if(path.endsWith(".png"))return "image/png";if(path.endsWith(".jpg"))return "image/jpeg";if(path.endsWith(".m4a"))return "audio/mp4";return "application/octet-stream";
 }
 private void external(Uri uri){String scheme=uri.getScheme();if(!"https".equals(scheme)&&!"http".equals(scheme)&&!"mailto".equals(scheme))return;try{startActivity(new Intent(Intent.ACTION_VIEW,uri));}catch(ActivityNotFoundException e){Toast.makeText(this,"لا يوجد تطبيق مناسب لفتح الرابط",Toast.LENGTH_SHORT).show();}}
 private void refreshStatus(){if(loaded)web.evaluateJavascript("window.dispatchEvent(new Event('android-resume'))",null);}
 @Override public void onResume(){super.onResume();AlarmSoundService.stop(this);if(web!=null)web.onResume();AlarmStore.arm(this);refreshStatus();}
 @Override public void onPause(){if(web!=null)web.onPause();super.onPause();}
 @Override protected void onNewIntent(Intent intent){super.onNewIntent(intent);setIntent(intent);if(web!=null&&intent.getBooleanExtra("worship",false)){web.evaluateJavascript("location.hash='worship'",null);intent.removeExtra("worship");}}
 private void handleBack(){web.evaluateJavascript("(()=>{const d=document.querySelector('dialog[open]');if(d){d.close();return true;}if(location.hash&&location.hash!=='#today'){location.hash='today';return true;}return false;})()",value->{if(!"true".equals(value))finish();});}
 @Override public void onBackPressed(){handleBack();}
 @Override public void onRequestPermissionsResult(int code,String[] permissions,int[] results){
  super.onRequestPermissionsResult(code,permissions,results);
  if(code==100&&locationCallback!=null){locationCallback.invoke(locationOrigin,checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION)==PackageManager.PERMISSION_GRANTED,false);locationCallback=null;}
  if(code==101&&mediaRequest!=null){List<String> granted=new ArrayList<>();for(String resource:mediaRequest.getResources()){if(PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(resource)&&checkSelfPermission(Manifest.permission.CAMERA)==PackageManager.PERMISSION_GRANTED)granted.add(resource);if(PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource)&&checkSelfPermission(Manifest.permission.RECORD_AUDIO)==PackageManager.PERMISSION_GRANTED)granted.add(resource);}if(granted.size()==mediaRequest.getResources().length)mediaRequest.grant(granted.toArray(new String[0]));else mediaRequest.deny();mediaRequest=null;}
  AlarmStore.arm(this);refreshStatus();
 }
 @Override protected void onActivityResult(int code,int result,Intent data){
  super.onActivityResult(code,result,data);
  if(code==201&&fileCallback!=null){fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result,data));fileCallback=null;}
  if(code==200){byte[] bytes=exportBytes;exportBytes=null;if(result==RESULT_OK&&data!=null&&data.getData()!=null&&bytes!=null){
   try(OutputStream out=getContentResolver().openOutputStream(data.getData())){if(out==null)throw new IOException();out.write(bytes);Toast.makeText(this,"تم حفظ الملف",Toast.LENGTH_SHORT).show();}catch(IOException e){Toast.makeText(this,"تعذّر حفظ الملف",Toast.LENGTH_LONG).show();}
  }}
 }
 @Override protected void onDestroy(){if(locationCallback!=null)locationCallback.invoke(locationOrigin,false,false);if(mediaRequest!=null)mediaRequest.deny();if(fileCallback!=null)fileCallback.onReceiveValue(null);web.removeJavascriptInterface("AndroidCalendar");web.destroy();super.onDestroy();}
 public final class PhoneBridge {
  @JavascriptInterface public String status(){return AlarmStore.status(MainActivity.this);}
  @JavascriptInterface public String setEnabled(boolean enabled){AlarmStore.setEnabled(MainActivity.this,enabled);return status();}
  @JavascriptInterface public void invalidateSchedule(){AlarmStore.invalidate(MainActivity.this);}
  @JavascriptInterface public String saveSchedule(String json){try{AlarmStore.save(MainActivity.this,json);return status();}catch(Exception e){return "{\"error\":\"تعذّر حفظ المواعيد على الهاتف\"}";}}
  @JavascriptInterface public long testAlarm(){return AlarmStore.test(MainActivity.this);}
  @JavascriptInterface public void previewAlarmSound(String soundKey){if(AlarmStore.validPrayer(soundKey))AlarmSoundService.preview(MainActivity.this,soundKey);}
  @JavascriptInterface public boolean saveAlarmSound(String prayer,String base64,String mime){try{return AlarmStore.saveSound(MainActivity.this,prayer,Base64.decode(base64,Base64.DEFAULT),mime);}catch(IllegalArgumentException e){return false;}}
  @JavascriptInterface public void clearAlarmSound(String prayer){AlarmStore.clearSound(MainActivity.this,prayer);}
  @JavascriptInterface public void requestNotifications(){runOnUiThread(()->{
   if(Build.VERSION.SDK_INT>=33&&checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS},102);
   else notificationSettings();
  });}
  @JavascriptInterface public void requestExactAlarms(){runOnUiThread(()->{
   if(Build.VERSION.SDK_INT>=31&&!AlarmStore.exactAllowed(MainActivity.this))try{startActivity(new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM,Uri.parse("package:"+getPackageName())));}catch(ActivityNotFoundException e){startActivity(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,Uri.parse("package:"+getPackageName())));}
   else refreshStatus();
  });}
  @JavascriptInterface public void soundSettings(){runOnUiThread(()->notificationSettings());}
  @JavascriptInterface public void saveFile(String name,String mime,String base64){
   if(base64.length()>16000000)return;try{final byte[] bytes=Base64.decode(base64,Base64.DEFAULT);runOnUiThread(()->{
    if(exportBytes!=null){Toast.makeText(MainActivity.this,"أكمل حفظ الملف السابق أولًا",Toast.LENGTH_SHORT).show();return;}
    exportBytes=bytes;Intent i=new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType(mime.matches("[a-zA-Z0-9.+-]+/[a-zA-Z0-9.+-]+")?mime:"application/octet-stream").putExtra(Intent.EXTRA_TITLE,name.replaceAll("[/\\\\]","_").substring(0,Math.min(name.length(),100)));
    try{startActivityForResult(i,200);}catch(ActivityNotFoundException e){exportBytes=null;Toast.makeText(MainActivity.this,"لم تتوفر نافذة حفظ الملفات",Toast.LENGTH_SHORT).show();}
   });}catch(IllegalArgumentException ignored){}
  }
 }
 private void notificationSettings(){Intent i=new Intent(Settings.ACTION_CHANNEL_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE,getPackageName()).putExtra(Settings.EXTRA_CHANNEL_ID,AlarmStore.CHANNEL);try{startActivity(i);}catch(ActivityNotFoundException ignored){}}
}
