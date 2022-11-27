import { DateTime } from 'luxon';

export const formatDate = (date: string) => DateTime.fromISO(date).toLocal().toFormat('yyyy LLL dd');

export default formatDate;
