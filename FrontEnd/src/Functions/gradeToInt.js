const gradeToInt = (data) => {
    // Grade
    if (data == "invalid") {
        return ("0");
    } else if (data == "First") {
        return ("1");
    } else if (data == "Second") {
        return ("2");
    } else if (data == "Third") {
        return ("3");
    } else if (data == "Fourth") {
        return ("4");
    } else if (data == "the fifth") {
        return ("5");
    } else if (data == "the sixth") {
        return ("6");
    } else if (data == "the seventh") {
        return ("7");
    } else if (data == "the eighth") {
        return ("8");
    } else if (data == "the ninth") {
        return ("9");
    } else if (data == "the tenth") {
        return ("10");
    } else if (data == "the eleventh") {
        return ("11");
    } else if (data == "twelfth") {
        return ("12");
    } else {
        return ('0');
    }

}


export default gradeToInt;