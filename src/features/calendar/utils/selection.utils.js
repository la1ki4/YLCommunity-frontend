export function toggleSelected(prev, value) {
    if (
        prev &&
        prev.year === value.year &&
        prev.monthIndex === value.monthIndex &&
        prev.day === value.day
    ) {
        return null;
    }
    return value;
}
