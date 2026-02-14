import { NoticeCategory } from '../backend';

export function getNoticeCategoryLabel(category: NoticeCategory): string {
  switch (category) {
    case NoticeCategory.waterSupply:
      return 'Water Supply Schedules and Updates';
    case NoticeCategory.civicIssues:
      return 'Civic Issues and Resolutions';
    case NoticeCategory.meetings:
      return 'Association Meeting Minutes';
    case NoticeCategory.general:
      return 'Important Notices for Residents';
    default:
      return 'General';
  }
}
