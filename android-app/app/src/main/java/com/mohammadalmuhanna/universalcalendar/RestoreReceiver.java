package com.mohammadalmuhanna.universalcalendar;
import android.content.*;
public final class RestoreReceiver extends BroadcastReceiver {
 @Override public void onReceive(Context context,Intent intent){AlarmStore.channel(context);AlarmStore.arm(context);}
}
