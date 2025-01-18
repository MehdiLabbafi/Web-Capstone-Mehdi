const giveToday = (data) => {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = new Date();
    let dayName = days[d.getDay()];
    return (dayName);
}
const giveTodayShamsi = (data) => {
    switch (data) {
        case 1:
            return "Saturday";
        case 2:
            return "sunday";
        case 3:
            return "Monday";
        case 4:
            return "Tuesday";
        case 5:
            return "Wednesday";
        case 6:
            return "Thursday";
        case 7:
            return "Friday";

        default:
            break;
    }
}

const dayToint = (data) => {
    switch (data) {
        case 'Saturday':
            return 1;
        case "Sunday":
            return 2;
        case 'Monday':
            return 3;
        case 'Tuesday':
            return 4;
        case 'Wednesday':
            return 5;
        case 'Thursday':
            return 6;
        case 'Friday':
            return 7;
        default:
            break;
    }
}

export { giveToday, giveTodayShamsi, dayToint };