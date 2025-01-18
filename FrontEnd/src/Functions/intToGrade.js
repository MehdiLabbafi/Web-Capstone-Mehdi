const intToGrade = (data) => {
    // Grade
    if (data == "0") {
        return ("invalid");
    } else if (data == "1") {
        return ("First");
    } else if (data == "2") {
        return ("Second");
    } else if (data == "3") {
        return ("Third");
    } else if (data == "4") {
        return ("Fourth");
    } else if (data == "5") {
        return ("the fifth");
    } else if (data == "6") {
        return ("the sixth");
    } else if (data == "7") {
        return ("the seventh");
    } else if (data == "8") {
        return ("the eighth");
    } else if (data == "9") {
        return ("the ninth");
    } else if (data == "10") {
        return ("the tenth");
    } else if (data == "11") {
        return ("the eleventh");
    } else if (data == "12") {
        return ("twelfth");
    } else {
        return ('invalid');
    }
}

export default intToGrade;