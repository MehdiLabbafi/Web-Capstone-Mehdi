const fieldToInt = (data) => {
    if (data == "Mathematics") {
        return ("1");
    } else if (data == "Experimental") {
        return ("2");
    } else if (data == "Humanities") {
        return ('3');
    } else if (data == "Art") {
        return ("4");
    } else {
        return ("0");
    }
}

export default fieldToInt;