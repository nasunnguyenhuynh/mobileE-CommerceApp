const remainDateTime = (startDateStr: string): string => {
    // Convert dd/mm/yyyy hh:mm:ss to yyyy-mm-ddThh:mm:ss (ISO 8601 format)
    const [day, month, yearAndTime] = startDateStr.split('/');
    const [year, time] = yearAndTime.split(' ');
    const formattedStartDateStr = `${year}-${month}-${day}T${time}`;

    const startDate = new Date(formattedStartDateStr);
    const currentDate = new Date();

    if (currentDate.getTime() >= startDate.getTime()) {
        return "Time has passed.";
    }

    const diff = startDate.getTime() - currentDate.getTime();

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let remainingTime = "Remaining time: ";
    if (years > 0) return `${years} years `;
    if (months > 0) return `${months} months `;
    if (days > 0) return `${days} days `;
    if (hours > 0) return `${hours} hours `;
    if (minutes > 0) return `${minutes} minutes `;
    if (seconds > 0) return `${seconds} seconds`;

    return remainingTime;
}

export default remainDateTime
// Example usage
const startDate = "18/08/2024 00:00:00";
console.log(remainDateTime(startDate));
