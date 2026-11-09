// Calendar utility supporting both Gregorian and Solar Hijri (Jalali / شمسی)

const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const PERSIAN_WEEKDAYS = ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش']; 
// In JS getDay(): 0=Sun (ی), 1=Mon (د), 2=Tue (س), 3=Wed (چ), 4=Thu (پ), 5=Fri (ج), 6=Sat (ش)

const GREGORIAN_WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function getCalendarDetails(calendarMode = 'gregorian', baseDate = new Date()) {
  if (calendarMode === 'jalali') {
    // Jalali (Solar Hijri)
    const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).formatToParts(baseDate);

    const map = {};
    parts.forEach((p) => {
      map[p.type] = p.value;
    });

    const year = parseInt(map.year, 10);
    const month = parseInt(map.month, 10);
    const currentDay = parseInt(map.day, 10);

    const monthNameFa = PERSIAN_MONTHS[month - 1] || 'آبان';
    const monthName = `${monthNameFa} ${year}`;

    // Days in Jalali month
    let daysInMonth = 30;
    if (month <= 6) {
      daysInMonth = 31;
    } else if (month <= 11) {
      daysInMonth = 30;
    } else {
      // Leap year check for Esfand
      const isLeap = (((((year - (year > 0 ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816 < 682;
      daysInMonth = isLeap ? 30 : 29;
    }

    const fullDateString = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(baseDate);

    // Weekday calculation for any day in this Jalali month
    const getDayLetter = (dayNumber) => {
      const targetDate = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + (dayNumber - currentDay)
      );
      const dayOfWeek = targetDate.getDay();
      return PERSIAN_WEEKDAYS[dayOfWeek];
    };

    return {
      calendarMode: 'jalali',
      year,
      month,
      currentDay,
      daysInMonth,
      monthName,
      monthTitle: monthNameFa,
      fullDateString,
      getDayLetter
    };
  }

  // Default: Gregorian
  const year = baseDate.getFullYear();
  const monthIndex = baseDate.getMonth();
  const currentDay = baseDate.getDate();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const monthName = baseDate.toLocaleString('en-US', { month: 'long' });
  const fullDateString = baseDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getDayLetter = (dayNumber) => {
    const targetDate = new Date(year, monthIndex, dayNumber);
    return GREGORIAN_WEEKDAYS[targetDate.getDay()];
  };

  return {
    calendarMode: 'gregorian',
    year,
    month: monthIndex + 1,
    currentDay,
    daysInMonth,
    monthName,
    monthTitle: monthName,
    fullDateString,
    getDayLetter
  };
}

