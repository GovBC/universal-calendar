package com.mohammadalmuhanna.universalcalendar;
import android.content.*;
public final class AlarmReceiver extends BroadcastReceiver {
 @Override public void onReceive(Context context,Intent intent){AlarmStore.receive(context,intent);}
}
