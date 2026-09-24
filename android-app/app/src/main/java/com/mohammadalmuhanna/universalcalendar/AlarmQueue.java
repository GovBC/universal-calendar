package com.mohammadalmuhanna.universalcalendar;
/** Time selection stays independent from Android so boundary cases can be tested. */
public final class AlarmQueue {
 private AlarmQueue() {}
 public static long next(long[] times, long now, long deliveredThrough) {
  long result=Long.MAX_VALUE;
  for(long at:times) if(at>now && at>deliveredThrough && at<result) result=at;
  return result==Long.MAX_VALUE?0:result;
 }
 public static boolean deliverable(long at,long now,long deliveredThrough) {
  return at>deliveredThrough && now>=at && now-at<120000;
 }
}
