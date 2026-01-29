// Helper function to format dates
export function formatDateCustom(date: Date, format: string): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const day = date.getDate();
    const dayPadded = String(day).padStart(2, '0');
    const month = date.getMonth() + 1;
    const monthPadded = String(month).padStart(2, '0');
    const year = date.getFullYear();
    const monthShort = months[date.getMonth()];
    const monthFullStr = monthsFull[date.getMonth()];

    return format
        .replace('YYYY', String(year))
        .replace('MMMM', monthFullStr)
        .replace('MMM', monthShort)
        .replace('MM', monthPadded)
        .replace('DD', dayPadded)
        .replace('D', String(day));
}
