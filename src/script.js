import { getLansKjaraVisitala } from "./lanskjaravisitala.js";
import { athugaKennitolu } from "./athugaKennitolur.js";
import { calculateAgeAtDate, calculateMargfeldisstudull, calculateMiskabotValue } from "./calculations.js";

// Handle submit
document.getElementById('calc-form').addEventListener('submit',handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();

    const lawyerEmail = document.getElementById('lawyerEmail').value;
    const clientName = document.getElementById('clientName').value;
    const ssn = document.getElementById('ssn').value;
    const accidentDateInput = document.getElementById('accidentDate').value;

    const athugaKennitoluResult = athugaKennitolu(ssn)
    if (athugaKennitoluResult !== "") {
        alert(athugaKennitoluResult)
        return
    }

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

    // Calculate age at the time of the accident
    const birthDate = new Date(year, month - 1, day); // Construct birthDate from dob components
    const accidentDate = new Date(accidentYear, accidentMonth - 1, accidentDay); // Construct accidentDate from accidentDate components
    const ageAtAccident = calculateAgeAtDate(birthDate, accidentDate);

    //Checkboxin - fastar
    const compensationCheckbox = document.getElementById('compensationCheckbox').checked;
    const employmentLossCheckbox = document.getElementById('employmentLossCheckbox').checked;
    const permanentLossCheckbox = document.getElementById('permanentLossCheckbox').checked;
    const varanlegOrorkaCheckbox = document.getElementById('varanlegOrorkaCheckbox').checked;

    // Compensation calculation
    // Get LansKjaraVisitala from Hagstofa
    let lanskjaravisitala = 0; // Fallback value
    await getLansKjaraVisitala(accidentDate).then(json => {
        lanskjaravisitala = parseFloat(json.data[0].values[0]) / 3282;
    }).catch(err => {
        console.log(err);
    });

    // Calculate the compensation for sick days
    const sickDaysWithAccommodation = parseInt(document.getElementById('sickDaysWithAccommodation').value) || 0;
    const sickDaysWithoutAccommodation = parseInt(document.getElementById('sickDaysWithoutAccommodation').value) || 0;
    const uppreiknadBeturMeðRúmlegu = Math.round((1300 * lanskjaravisitala) /10 ) * 10;
    const uppreiknadBeturÁnRúmlegu = Math.round((700 * lanskjaravisitala) / 10) * 10;
    const heildarBeturMeðRúmlegu = uppreiknadBeturMeðRúmlegu * sickDaysWithAccommodation;
    const heildarBeturÁnRúmlegu = uppreiknadBeturÁnRúmlegu * sickDaysWithoutAccommodation;
    const heildarBótakrafaFyrirÞjáningabætur = heildarBeturMeðRúmlegu + heildarBeturÁnRúmlegu;

    let results = {};

    if (compensationCheckbox) {
        results = {...results, compensationResults: {
            sickDaysWithAccommodation: sickDaysWithAccommodation,
            sickDaysWithoutAccommodation: sickDaysWithoutAccommodation,
            uppreiknadBeturMeðRúmlegu: uppreiknadBeturMeðRúmlegu,
            uppreiknadBeturÁnRúmlegu: uppreiknadBeturÁnRúmlegu,
            heildarBeturMeðRúmlegu: heildarBeturMeðRúmlegu,
            heildarBeturÁnRúmlegu: heildarBeturÁnRúmlegu,
            heildarBótakrafaFyrirÞjáningabætur: heildarBótakrafaFyrirÞjáningabætur,
            lanskjaravisitala: lanskjaravisitala
        }};
    }

    // Tímabundið atvinnutjón calculation
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

        results = {...results, employmentLossResults: {
            disabilityMonths: disabilityMonths,
            monthlyIncome: monthlyIncome,
            employerPensionContribution: employerPensionContribution,
            pensionFundPayments: pensionFundPayments,
            employerPayments: employerPayments,
            sicknessFundPayments: sicknessFundPayments,
            otherBenefits: otherBenefits,
            insuranceBenefits: insuranceBenefits,
            totalDisabilityCompensation: totalDisabilityCompensation,
            totalBenefits: totalBenefits,
            totalCompensationAfterBenefits: totalCompensationAfterBenefits
        }};
    }
    
    // Varanlegur miski calculation
    if (permanentLossCheckbox) {
        const permanentLossLevel = parseFloat(document.getElementById('permanentLossLevel').value) || 0;
        const miskabotValue = calculateMiskabotValue(ageAtAccident);

        // Calculate Miskabótagrundvöllur uppreiknaður sbr. 15. gr. skbl.
        const miskabotUppreiknadur = Math.round(miskabotValue * lanskjaravisitala);

        // Calculate Miskabótagrundvöllur uppreiknaður og námundaður, sbr. 1. mgr. 15. gr. skbl.
        const miskabotUppreiknadurNamundadur = Math.round(miskabotUppreiknadur / 500) * 500;

        // Calculate Heildarkrafa bóta vegna varanlegs miska
        const heildarkrafaBotaVegnaVaranlegsMiska = Math.round((permanentLossLevel / 100) * miskabotUppreiknadurNamundadur);

        results = {...results, permanentLossResults: {
            permanentLossLevel: permanentLossLevel,
            ageAtAccident: ageAtAccident,
            miskabotValue: miskabotValue,
            miskabotUppreiknadurNamundadur: miskabotUppreiknadurNamundadur,
            heildarkrafaBotaVegnaVaranlegsMiska: heildarkrafaBotaVegnaVaranlegsMiska
        }};
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

    // Calculate the margfeldisstuðull for the age at the time of the accident
    const margfeldisstudull = calculateMargfeldisstudull(ageAtAccident); // Pass the ageAtAccident object

    if (varanlegOrorkaCheckbox) {

        // Lágmark bótagrundvöllur uppreiknaður
        const lagmarkBotagrundvollurUppreiknadur = Math.round(1200000 * lanskjaravisitala);

        // Námundun, heill og hálfu þúsundi, skv. 1. mgr. 15. gr. skbl.:

        // Hámark bótagrundvöllds, uppreiknað:
        const hamarkBotagrundvollurUppreiknadur = Math.round(4500000 * lanskjaravisitala);

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
        let medaltalOgLifeyrir = medaltalTekna + lifeyrismotframlagVinnuveitanda;
        if (medaltalOgLifeyrir < lagmarkBotagrundvollurUppreiknadur) {
            medaltalOgLifeyrir = lagmarkBotagrundvollurUppreiknadur
        } else if (medaltalOgLifeyrir > hamarkBotagrundvollurUppreiknadur) {
            medaltalOgLifeyrir = hamarkBotagrundvollurUppreiknadur
        }

        // Bótakrafa varanlegrar örorku fyrir frádrátt
        const heildaraKrafaFyrirFradratt = margfeldisstudull * (disabilityLevel / 100) * medaltalOgLifeyrir

        // Eingreiddar örorkubætur almannatrygginga
        // Bætur frá slysatryggingum samkvæmt umferðarlögum
        // Bætur úr slysatryggingu launþega (bara ef bótakrafa er á VV)
        // Bætur samkvæmt lögum um sjúklingatryggingu
        // 40% af eingreiðsluverðmæti örorkulífeyris frá lífeyrissjóði

        results = {...results, permanentDisabilityResults: {
            lagmarkBotagrundvollurUppreiknadur: lagmarkBotagrundvollurUppreiknadur,
            hamarkBotagrundvollurUppreiknadur: hamarkBotagrundvollurUppreiknadur,
            tekjur1ArFyrirUppreiknad: tekjur1ArFyrirUppreiknad,
            tekjur2ArFyrirUppreiknad: tekjur2ArFyrirUppreiknad,
            tekjur3ArFyrirUppreiknad: tekjur3ArFyrirUppreiknad,
            medaltalTekna: medaltalTekna,
            lifeyrismotframlagVinnuveitanda: lifeyrismotframlagVinnuveitanda,
            medaltalOgLifeyrir: medaltalOgLifeyrir,
            disabilityLevel: disabilityLevel,
            heildaraKrafaFyrirFradratt: heildaraKrafaFyrirFradratt
        } };
    }

    results = {...results, lawyerEmail: lawyerEmail };
    results = {...results, clientName: clientName };
    results = {...results, ssn: ssn };
    results = {...results, formattedAccidentDate: formattedAccidentDate };
    results = {...results, formattedDateOfBirth: formattedDateOfBirth };
    results = {...results, margfeldisstudull: margfeldisstudull };

    console.log(results)
    sessionStorage.setItem("results", JSON.stringify(results));

    // Open new window with data
    const resultsWindow = window.open("../public/results.html", "_blank");
    resultsWindow.focus();
};
