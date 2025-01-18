const infToField = (data) => {
    if (data == "1") {
        return("Mathematics");
    } else if (data == "2") {
        return("Experimental");
    } else if (data == "3") {
        return('Humanities');
    } else if (data == "4") {
        return("Art");
    } else {
        return("Invalid");
    }
}

export default infToField;