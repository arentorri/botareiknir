function calculateAgeAtDate(birthDate, accidentDate) {
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();
    
    const accidentYear = accidentDate.getFullYear();
    const accidentMonth = accidentDate.getMonth();
    const accidentDay = accidentDate.getDate();
    
    let ageYears = accidentYear - birthYear;
    let ageDays = 0;
    
    const lastBirthday = new Date(accidentYear, birthMonth, birthDay);
    const daysSinceLastBirthday = Math.floor((accidentDate - lastBirthday) / (24 * 60 * 60 * 1000));

    if (accidentMonth < birthMonth || (accidentMonth === birthMonth && accidentDay < birthDay)) {
        ageYears--;
        ageDays = daysSinceLastBirthday; // No need to limit to 365 here
    } else {
        ageDays = Math.floor((accidentDate - lastBirthday) / (24 * 60 * 60 * 1000));
    }
    
    return { years: ageYears, days: ageDays };
}

function calculateMiskabotValue(age) {
    // Define the mapping of age to Miskabótagrundvöllur
    const ageMiskabotMapping = {
        0: 4000000,
        1: 4000000,
        2: 4000000,
        50: 3960000,
        51: 3920000,
        52: 3880000,
        53: 3840000,
        54: 3800000,
        55: 3760000,
        56: 3720000,
        57: 3680000,
        58: 3640000,
        59: 3600000,
        60: 3560000,
        61: 3520000,
        62: 3480000,
        63: 3440000,
        64: 3400000,
        65: 3360000,
        66: 3320000,
        67: 3280000,
        68: 3240000,
        69: 3200000,
        70: 3160000,
        71: 3120000,
        72: 3080000,
        73: 3040000,
        98: 3000000,
        99: 3000000,
        100: 3000000,
    };

    if (age.years < 0 || age.years > 150) {
        return "Invalid age"; // Handle out-of-range age
    }
    if (age.years < 50) {
        return 4000000;
    } 
    if (age.years >= 74) {
        return 3000000;
    }

    // Calculate interpolated Miskabótagrundvöllur
    var fractionalDifference = age.days / 365;
    // Use decimal calculation and round to three decimal points
    return Math.round((ageMiskabotMapping[age.years] * fractionalDifference + 
        ageMiskabotMapping[age.years + 1] * (1 - fractionalDifference)) * 500) / 500;
}

function calculateMargfeldisstudull(age) {
    // Given age coefficients data
    var ageCoefficients = {
        0: 11.438,
        1: 11.746,
        2: 12.064,
        3: 12.389,
        4: 12.724,
        5: 13.067,
        6: 13.42,
        7: 13.782,
        8: 14.155,
        9: 14.537,
        10: 14.929,
        11: 15.332,
        12:15.745,
        13:	16.171,
        14:	16.608,
        15:	17.057,
        16:	17.517,
        17:	17.99,
        18:	18.476,
        19:	18.031,
        20:	17.572,
        21:	17.106,
        22:	16.626,
        23:	16.13,
        24:	15.619,
        25:	15.101,
        26:	14.567,
        27:	14.161,
        28:	13.75,
        29:	13.474,
        30:	12.813,
        31:	12.595,
        32:	12.367,
        33:	12.15,
        34:	11.915,
        35:	11.678,
        36:	11.433,
        37:	11.18,
        38:	10.988,
        39:	10.784,
        40:	10.577,
        41:	10.358,
        42:	10.083,
        43:	9.851,
        44:	9.565,
        45:	9.265,
        46:	9.014,
        47:	8.75,
        48:	8.44,
        49:	8.116,
        50:	7.834,
        51:	7.626,
        52:	7.37,
        53:	7.139,
        54:	6.932,
        55:	6.678,
        56:	6.378,
        57:	6.037,
        58:	5.687,
        59:	5.329,
        60:	4.96,
        61:	4.581,
        62:	4.211,
        63:	3.841,
        64:	3.451,
        65:	3.038,
        66:	2.567,
        67:	2.067,
        68:	1.994,
        69:	1.902,
        70:	1.783,
        71:	1.626,
        72:	1.412,
        73:	1.109,
        74: 0.667
    };

    // If 74 or older 0.667 is to be used
    if (age.years >= 74) {
        // use 0.667
        return 0.667
    }

    // Find the margfeldisstuðull values corresponding to the two nearest ages
    // Calculate the fractional difference between the two nearest ages
    var fractionalDifference = age.days / 365;

    // Use decimal calculation and round to three decimal points
    return Math.round((ageCoefficients[age.years] * fractionalDifference + 
                       ageCoefficients[age.years + 1] * (1 - fractionalDifference) + Number.EPSILON) * 1000) / 1000;
}

export { calculateAgeAtDate, calculateMargfeldisstudull, calculateMiskabotValue }