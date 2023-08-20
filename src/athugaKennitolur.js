function athugaKennitolu(ssn) {
    // Check if the kennitala has 10 digits
    if (ssn.length !== 10) {
        return "Kennitala verður að vera 10 tölustafir, með engu bandstriki";
    }

    // Check if the last digit of kennitala is valid (0 or 9)
    const lastDigit = ssn.charAt(9);
    if (lastDigit !== "0" && lastDigit !== "9") {
        return "Þetta er ekki rétt kennitala";
    }

    return ""

    // Check if "vartala" is valid
};

export { athugaKennitolu };