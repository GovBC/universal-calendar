import com.mohammadalmuhanna.universalcalendar.AlarmQueue;
public class AlarmQueueTest {
 private static void equal(long wanted,long actual){if(wanted!=actual)throw new AssertionError(wanted+" != "+actual);}
 public static void main(String[] args){
  long[] times={3000,1000,2000,2000};
  equal(2000,AlarmQueue.next(times,1500,0));
  equal(3000,AlarmQueue.next(times,1500,2000));
  equal(0,AlarmQueue.next(times,3000,0));
  equal(0,AlarmQueue.next(new long[0],0,0));
  if(!AlarmQueue.deliverable(2000,2000,1000))throw new AssertionError("Due alarm was skipped");
  if(AlarmQueue.deliverable(2000,1999,0))throw new AssertionError("Early alarm");
  if(AlarmQueue.deliverable(2000,2000,2000))throw new AssertionError("Duplicate alarm");
  if(AlarmQueue.deliverable(2000,122000,0))throw new AssertionError("Stale alarm");
  System.out.println("Alarm selection: time changes, duplicates, stale alarms and empty schedules passed");
 }
}
