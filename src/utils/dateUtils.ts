export const formatDueDate = (dateStr?: string, timeStr?: string): { text: string; isOverdue: boolean; isToday: boolean; isTomorrow: boolean } => {
  if (!dateStr) {
    return { text: '', isOverdue: false, isToday: false, isTomorrow: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const timeDisplay = timeStr ? ` @ ${timeStr}` : '';

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return {
      text: `${daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`}${timeDisplay}`,
      isOverdue: true,
      isToday: false,
      isTomorrow: false
    };
  } else if (diffDays === 0) {
    return {
      text: `Today${timeDisplay}`,
      isOverdue: false,
      isToday: true,
      isTomorrow: false
    };
  } else if (diffDays === 1) {
    return {
      text: `Tomorrow${timeDisplay}`,
      isOverdue: false,
      isToday: false,
      isTomorrow: true
    };
  } else if (diffDays <= 7) {
    const weekday = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      text: `${weekday}${timeDisplay}`,
      isOverdue: false,
      isToday: false,
      isTomorrow: false
    };
  } else {
    const formatted = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      text: `${formatted}${timeDisplay}`,
      isOverdue: false,
      isToday: false,
      isTomorrow: false
    };
  }
};

