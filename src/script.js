//import { getLansKjaraVisitala } from "./lanskjaravisitala";

// getLansKjaraVisitala();

document.getElementById('calc-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const lawyerEmail = document.getElementById('lawyerEmail').value;
    const clientName = document.getElementById('clientName').value;
    const ssn = document.getElementById('ssn').value;
    const accidentDateInput = document.getElementById('accidentDate').value;

    // Check if the kennitala has 10 digits
    if (ssn.length !== 10) {
        alert("Kennitala verður að vera 10 tölustafir, með engu bandstriki");
        return;
    }

    // Check if the last digit of kennitala is valid (0 or 9)
    const lastDigit = ssn.charAt(9);
    if (lastDigit !== "0" && lastDigit !== "9") {
        alert("Þetta er ekki rétt kennitala");
        return;
    }

    // Check if "vartala" is valid


    // Extract the components for the date of birth
    const dobDigits = ssn.substr(0, 6);
    const yearPrefix = ssn.charAt(9) === "9" ? "19" : "20"; // Check the last digit
    const year = yearPrefix + dobDigits.substr(4, 2);
    const month = dobDigits.substr(2, 2);
    const day = dobDigits.substr(0, 2);
    const formattedDateOfBirth = `${day}/${month}/${year}`;

    

    // Convert the input accident date to the required format (dd/mm/yyyy)
    const accidentDateComponents = accidentDateInput.split("-");
    const accidentDay = accidentDateComponents[2];
    const accidentMonth = accidentDateComponents[1];
    const accidentYear = accidentDateComponents[0];
    const formattedAccidentDate = `${accidentDay}/${accidentMonth}/${accidentYear}`;


    //Checkboxin - fastar
    const compensationCheckbox = document.getElementById('compensationCheckbox').checked;
    const employmentLossCheckbox = document.getElementById('employmentLossCheckbox').checked;
    const permanentLossCheckbox = document.getElementById('permanentLossCheckbox').checked;
    const varanlegOrorkaCheckbox = document.getElementById('varanlegOrorkaCheckbox').checked;



    // Compensation calculation
    const sickDaysWithAccommodation = parseInt(document.getElementById('sickDaysWithAccommodation').value) || 0;
    const sickDaysWithoutAccommodation = parseInt(document.getElementById('sickDaysWithoutAccommodation').value) || 0;
    const loanInterestRate = parseFloat(document.getElementById('loanInterestRate').value) || 0;
    const uppreiknadBeturMeðRúmlegu = Math.round((1300 * (loanInterestRate / 3282)) /10 ) * 10;
    const uppreiknadBeturÁnRúmlegu = Math.round((700 * (loanInterestRate / 3282)) / 10) * 10;
    const heildarBeturMeðRúmlegu = uppreiknadBeturMeðRúmlegu * sickDaysWithAccommodation;
    const heildarBeturÁnRúmlegu = uppreiknadBeturÁnRúmlegu * sickDaysWithoutAccommodation;
    const heildarBótakrafaFyrirÞjáningabætur = heildarBeturMeðRúmlegu + heildarBeturÁnRúmlegu;

    let compensationResults = '';
    if (compensationCheckbox) {
        compensationResults = `
            <h3>Þjáningabætur</h3>
            <p><strong>Fjöldi daga veikinda með rúmlegu:</strong> ${sickDaysWithAccommodation}</p>
            <p><strong>Fjöldi daga veikinda án rúmlegu:</strong> ${sickDaysWithoutAccommodation}</p>
            <p><strong>Uppreiknaðar bætur fyrir veikindi með rúmlegu:</strong> ${uppreiknadBeturMeðRúmlegu}</p>
            <p><strong>Uppreiknaðar bætur fyrir veikindi án rúmlegu:</strong> ${uppreiknadBeturÁnRúmlegu}</p>
            <p><strong>Heildarbætur fyrir veikindi með rúmlegu:</strong> ${heildarBeturMeðRúmlegu}</p>
            <p><strong>Heildarbætur fyrir veikindi án rúmlegu:</strong> ${heildarBeturÁnRúmlegu}</p>
            <p><strong>Heildarbótakrafa fyrir þjáningabætur:</strong> ${heildarBótakrafaFyrirÞjáningabætur}</p>
        `;
    }

    // Tímabundið atvinnutjón calculation
    let employmentLossResults = '';
    if (employmentLossCheckbox) {
        const disabilityMonths = parseInt(document.getElementById('disabilityMonths').value) || 0;
        const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value) || 0;
        const employerPensionContribution = parseFloat(document.getElementById('employerPensionContribution').value) || 0;
        const pensionFundPayments = parseFloat(document.getElementById('pensionFundPayments').value) || 0;
        const employerPayments = parseFloat(document.getElementById('employerPayments').value) || 0;
        const sicknessFundPayments = parseFloat(document.getElementById('sicknessFundPayments').value) || 0;
        const otherBenefits = parseFloat(document.getElementById('otherBenefits').value) || 0;
        const insuranceBenefits = parseFloat(document.getElementById('insuranceBenefits').value) || 0;

        const totalDisabilityCompensation = (disabilityMonths * monthlyIncome) + (disabilityMonths * monthlyIncome) * (employerPensionContribution / 100);
        const totalBenefits = pensionFundPayments + employerPayments + sicknessFundPayments + otherBenefits + insuranceBenefits;
        const totalCompensationAfterBenefits = totalDisabilityCompensation - totalBenefits;

        employmentLossResults = `
            <h3>Tímabundið atvinnutjón</h3>
            <p><strong>Fjöldi mánaða óvinnufærni:</strong> ${disabilityMonths}</p>
            <p><strong>Mánaðartekjur:</strong> ${monthlyIncome}</p>
            <p><strong>Lífeyrismótframlag vinnuveitenda:</strong> ${employerPensionContribution}%</p>
            <p><strong>Dagpeningar frá lífeyrissjóði:</strong> ${pensionFundPayments}</p>
            <p><strong>Greiðsla frá vinnuveitanda:</strong> ${employerPayments}</p>
            <p><strong>Greiðsla frá sjúkrasjóði:</strong> ${sicknessFundPayments}</p>
            <p><strong>Aðrar bætur frá opinberum tryggingum:</strong> ${otherBenefits}</p>
            <p><strong>Vátryggingarbætur sem eru raunveruleg skaðabót og sambærilegar greiðslur:</strong> ${insuranceBenefits}</p>
            <p><strong>Heildarlaun fyrir tíma óvinnufærni:</strong> ${totalDisabilityCompensation}</p>
            <p><strong>Samtals frádráttur:</strong> ${totalBenefits}</p>
            <p><strong>Heildarbótakrafa fyrir tímabundið atvinnutjón:</strong> ${totalCompensationAfterBenefits}</p>
        `;
    }
    
    // Varanlegur miski calculation
    let permanentLossResults = '';
    if (permanentLossCheckbox) {
        const birthDate = new Date(year, month - 1, day); // Construct birthDate from dob components
        const accidentDate = new Date(accidentYear, accidentMonth - 1, accidentDay); // Construct accidentDate from accidentDate components
        const ageAtAccident = calculateAgeAtDate(birthDate, accidentDate);

        const permanentLossLevel = parseFloat(document.getElementById('permanentLossLevel').value) || 0;
        const miskabotValue = calculateMiskabotValue(ageAtAccident);

        // Calculate Miskabótagrundvöllur uppreiknaður sbr. 15. gr. skbl.
        const miskabotUppreiknadur = Math.round(miskabotValue * (loanInterestRate / 3282));

        // Calculate Miskabótagrundvöllur uppreiknaður og námundaður, sbr. 1. mgr. 15. gr. skbl.
        const miskabotUppreiknadurNamundadur = Math.round(miskabotUppreiknadur / 500) * 500;

        // Calculate Heildarkrafa bóta vegna varanlegs miska
        const heildarkrafaBotaVegnaVaranlegsMiska = Math.round((permanentLossLevel / 100) * miskabotUppreiknadurNamundadur);

        permanentLossResults = `
            <h3>Varanlegur miski</h3>
            <p><strong>Miskastig:</strong> ${permanentLossLevel}%</p>
            <p><strong>Aldur tjónþola á tjóndegi:</strong> ${ageAtAccident.years} ára og ${ageAtAccident.days} daga</p>
            <p><strong>Miskabótagrundvöllur m.v. aldur tjónþola á tjóndegi:</strong> ${miskabotValue}</p>
            <p><strong>Miskabótagrundvöllur uppreiknaður og námundaður, sbr. 1. mgr. 15. gr. skbl.:</strong> ${miskabotUppreiknadurNamundadur.toFixed(0)}</p>
            <p><strong>Heildarbótakrafa fyrir tímabundið atvinnutjón:</strong> ${heildarkrafaBotaVegnaVaranlegsMiska}</p>
        `;
    }

    //Varanleg örorka    
    const incomeBefore1Year = parseFloat(document.getElementById('incomeBefore1Year').value) || 0;
    const incomeBefore2Year = parseFloat(document.getElementById('incomeBefore2Years').value) || 0;
    const incomeBefore3Year = parseFloat(document.getElementById('incomeBefore3Years').value) || 0;
    const wageIndexAtClaim = parseFloat(document.getElementById('wageIndexAtClaim').value) || 0;
    const wageIndexAtSettlement = parseFloat(document.getElementById('wageIndexAtSettlement').value) || 0;
    const wageIndex1YearBeforeClaim = parseFloat(document.getElementById('wageIndex1YearBeforeClaim').value) || 0;
    const wageIndex2YearBeforeClaim = parseFloat(document.getElementById('wageIndex2YearsBeforeClaim').value) || 0;
    const wageIndex3YearBeforeClaim = parseFloat(document.getElementById('wageIndex3YearsBeforeClaim').value) || 0;
    const disabilityLevel = parseFloat(document.getElementById('disabilityLevel').value) || 0;

    let permanentDisabilityResults = '';
    if (varanlegOrorkaCheckbox) {

        // Lágmark bótagrundvöllur uppreiknaður
        const lagmarkBotagrundvollurUppreiknadur = Math.round(1200000 * (loanInterestRate / 3282));

        // Námundun, heill og hálfu þúsundi, skv. 1. mgr. 15. gr. skbl.:

        // Hámark bótagrundvöllds, uppreiknað:
        const hamarkBotagrundvollurUppreiknadur = Math.round(4500000 * (loanInterestRate / 3282));

        // Námundun, heill og hálfu þúsundi, skv. 1. mgr. 15. gr. skbl.

        // Uppreiknaðar tekjur 1 ár fyrir tjón
        const tekjur1ArFyrirUppreiknad = Math.round(incomeBefore1Year * (wageIndexAtSettlement / wageIndex1YearBeforeClaim));

        // Uppreiknaðar tekjur 2 ár fyrir tjón
        const tekjur2ArFyrirUppreiknad = Math.round(incomeBefore2Year * (wageIndexAtSettlement / wageIndex2YearBeforeClaim));

        // Uppreiknaðar tekjur 3 ár fyrir tjón
        const tekjur3ArFyrirUppreiknad = Math.round(incomeBefore3Year * (wageIndexAtSettlement / wageIndex3YearBeforeClaim));

        // Meðaltal tekna
        const medaltalTekna = Math.round((tekjur1ArFyrirUppreiknad + tekjur2ArFyrirUppreiknad + tekjur3ArFyrirUppreiknad) / 3);

        // Lífeyrismótframlag vinnuveitanda
        const lifeyrismotframlagVinnuveitanda = Math.round(medaltalTekna * (115 / 1000));

        // Meðaltal tekna + lífeyrismótframlag vinnuveitanda:
        const medaltalOgLifeyrir = medaltalTekna + lifeyrismotframlagVinnuveitanda;

        // Margfeldisstuðull:

        // Bótakrafa varanlegrar örorku fyrir frádrátt


        // Eingreiddar örorkubætur almannatrygginga
        // Bætur frá slysatryggingum samkvæmt umferðarlögum
        // Bætur úr slysatryggingu launþega (bara ef bótakrafa er á VV)
        // Bætur samkvæmt lögum um sjúklingatryggingu
        // 40% af eingreiðsluverðmæti örorkulífeyris frá lífeyrissjóði


        permanentDisabilityResults = `
            <h3>Varanleg örorka</h3>
            <p><strong>Lágmark bótagrundvölls, uppreiknað:</strong> ${lagmarkBotagrundvollurUppreiknadur}</p>
            <p><strong>Hámark bótagrundvölls, uppreiknað:</strong> ${hamarkBotagrundvollurUppreiknadur}</p>
            <p><strong>Tekjur 1 ár fyrir tjón, uppreiknaðar:</strong> ${tekjur1ArFyrirUppreiknad}</p>
            <p><strong>Tekjur 2 ár fyrir tjón, uppreiknaðar:</strong> ${tekjur2ArFyrirUppreiknad}</p>
            <p><strong>Tekjur 3 ár fyrir tjón, uppreiknaðar:</strong> ${tekjur3ArFyrirUppreiknad}</p>
            <p><strong>Meðaltal tekna:</strong> ${medaltalTekna}</p>
            <p><strong>Lífeyrismótframlag vinnuveitanda:</strong> ${lifeyrismotframlagVinnuveitanda}</p>
            <P><strong>Árslaunaviðmið </strong>(Meðaltal tekna + lífeyrismótframlag): ${medaltalOgLifeyrir}</p>
            <p><strong>Örorka:</strong> ${disabilityLevel}</p>


        `;
    }

    // Calculate age at the time of the accident
    const birthDate = new Date(year, month - 1, day); // Construct birthDate from dob components
    const accidentDate = new Date(accidentYear, accidentMonth - 1, accidentDay); // Construct accidentDate from accidentDate components
    const ageAtAccident = calculateAgeAtDate(birthDate, accidentDate);

    // Calculate the margfeldisstuðull for the age at the time of the accident
    const margfeldisstudull = calculateMargfeldisstudull(ageAtAccident); // Pass the ageAtAccident object

        
    // Update DOM to display results
    const resultDiv = document.createElement('div');
    resultDiv.innerHTML = `
        <h2>Niðurstöður</h2>
        <p><strong>Netfang lögmanns:</strong> ${lawyerEmail}</p>
        <p><strong>Nafn umbjóðanda:</strong> ${clientName}</p>
        <p><strong>Kennitala:</strong> ${ssn}</p>
        <p><strong>Tjóndagur:</strong> ${formattedAccidentDate}</p>
        <p><strong>Fæðingardagur:</strong> ${formattedDateOfBirth}</p>
        <p><strong>Margfeldisstuðull:</strong> ${margfeldisstudull}</p>
        ${compensationResults}
        ${employmentLossResults}
        ${permanentLossResults}
        ${permanentDisabilityResults}
    `;


    // Add the resultDiv to the DOM
    const calculatorScreen = document.querySelector('.calculator-screen');
    calculatorScreen.appendChild(resultDiv);
});

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

// Function to calculate the margfeldisstuðull
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
