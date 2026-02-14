import { EventType } from '../backend';

export function getEventTypeLabel(eventType: EventType): string {
  switch (eventType) {
    case EventType.associationMeeting:
      return 'Monthly Association Meeting';
    case EventType.culturalProgram:
      return 'Cultural Programs and Festivals';
    case EventType.welfareDrive:
      return 'Welfare Drives and Community Service';
    default:
      return 'Event';
  }
}
