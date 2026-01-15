import type { Link } from '../types';

export interface ParsedDependency {
    taskNumber: number;
    type: 'FS' | 'SS' | 'FF' | 'SF';
    lag: number;
    lagUnit: 'day' | 'hour' | 'week' | 'month';
}

/**
 * Parse dependency shorthand notation
 * Examples: "3FS+10d", "5SS-2w", "2FF+1m", "7SF"
 */
export function parseDependencyString(input: string): ParsedDependency | null {
    if (!input || typeof input !== 'string') return null;

    const trimmed = input.trim();

    // Pattern: [number][FS|SS|FF|SF][optional: +/-][optional: number][optional: d|h|w|m]
    const pattern = /^(\d+)(FS|SS|FF|SF)(([+-])(\d+)([dhwm]))?$/i;
    const match = trimmed.match(pattern);

    if (!match) return null;

    const taskNumber = parseInt(match[1], 10);
    const type = match[2].toUpperCase() as 'FS' | 'SS' | 'FF' | 'SF';

    let lag = 0;
    let lagUnit: 'day' | 'hour' | 'week' | 'month' = 'day';

    if (match[3]) {
        const sign = match[4] === '-' ? -1 : 1;
        lag = parseInt(match[5], 10) * sign;

        const unitChar = match[6].toLowerCase();
        switch (unitChar) {
            case 'd': lagUnit = 'day'; break;
            case 'h': lagUnit = 'hour'; break;
            case 'w': lagUnit = 'week'; break;
            case 'm': lagUnit = 'month'; break;
        }
    }

    return { taskNumber, type, lag, lagUnit };
}

/**
 * Convert lag to days for internal storage
 */
export function convertLagToDays(lag: number, unit: 'day' | 'hour' | 'week' | 'month'): number {
    switch (unit) {
        case 'hour': return lag / 24;
        case 'day': return lag;
        case 'week': return lag * 7;
        case 'month': return lag * 30; // Approximate
        default: return lag;
    }
}

/**
 * Format dependency for display
 * Example: Task 3, FS, +10d → "3FS+10d"
 */
export function formatDependencyDisplay(link: Link, taskIndex: number): string {
    const typeMap: Record<Link['type'], string> = {
        'e2s': 'FS',
        's2s': 'SS',
        'e2e': 'FF',
        's2e': 'SF',
    };

    const type = typeMap[link.type];
    let result = `${taskIndex}${type}`;

    if (link.lag && link.lag !== 0) {
        const sign = link.lag > 0 ? '+' : '';
        const unit = link.lagUnit || 'day';
        const unitChar = unit.charAt(0);

        // Convert back from days if needed
        let displayLag = link.lag;
        if (link.lagUnit && link.lagUnit !== 'day') {
            switch (link.lagUnit) {
                case 'hour': displayLag = link.lag * 24; break;
                case 'week': displayLag = link.lag / 7; break;
                case 'month': displayLag = link.lag / 30; break;
            }
        }

        result += `${sign}${Math.round(displayLag)}${unitChar}`;
    }

    return result;
}

/**
 * Convert dependency type from shorthand to Link type
 */
export function convertDependencyType(shorthand: 'FS' | 'SS' | 'FF' | 'SF'): Link['type'] {
    const typeMap: Record<string, Link['type']> = {
        'FS': 'e2s',
        'SS': 's2s',
        'FF': 'e2e',
        'SF': 's2e',
    };
    return typeMap[shorthand];
}
