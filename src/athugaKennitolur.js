function athugaKennitolu(ssn) {
    // Check if the kennitala has 10 digits
    if (ssn.length < 10 || ssn.length > 12) {
        return "Kennitala verður að vera 10 tölustafir, með engu bandstriki";
    } 
    // Check for dash and remove it
    else if (ssn.charAt(6) === "-") {
        ssn = ssn.slice(0, 6) + ssn.slice(7);
    } else if (ssn.length === 11) {
        return "Kennitala verður að vera 10 tölustafir, með engu bandstriki";
    }

    // Check if the kennitala has only digits
    // and start array for the check digit
    let nums = [];
    for (let i = 0; i < ssn.length; i++) {
        const char = ssn.charAt(i);
        if (isNaN(char)) {
            return "Kennitala má aðeins vera tölustafir";
        }
        if (i < 8) {
            nums.push(parseInt(char));
        }
    }

    // Check if the last digit of kennitala is valid (0 or 9)
    const lastDigit = ssn.charAt(9);
    if (lastDigit !== "0" && lastDigit !== "9") {
        return "Þetta er ekki rétt kennitala";
    }

    // Check if "vartala" is valid    
    const vartala = ssn.charAt(8);

    // Keep checking for if result is 10
    while (true) {
        const reiknitala = multiplyArray(nums);

        // Check if the result is 11 then "vartala" must be 0
        if (reiknitala === 11) {
            if (vartala !== 0) {
                return "Þetta er ekki gild kennitala";
            }
            break;
        }
        // Check if the result is 10 then "vartala" is unusable 
        // and must be recalculated with an increased "radtala"
        if (reiknitala === 10) {
            radtala = nums.pop() + nums.pop() * 10 + 1;
            nums.push(radtala % 10);
            nums.push(Math.floor(radtala / 10));
            continue;
        }
        if (reiknitala !== parseInt(vartala)) {
            return "Þetta er ekki gild kennitala";
        }
        break;
    }
    
    return ""
};

function multiplyArray(nums) {
    const multipliers = [3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i] * multipliers[i];
    }
    const remainder = sum % 11;
    return 11 - remainder;
}

export { athugaKennitolu };