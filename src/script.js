import { getLansKjaraVisitala } from "./lanskjaravisitala.js";
import { athugaKennitolu } from "./athugaKennitolur.js";
import { calculateAgeAtDate, calculateMargfeldisstudull, calculateMiskabotValue } from "./calculations.js";

// getLansKjaraVisitala();

document.getElementById('calc-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const lawyerEmail = document.getElementById('lawyerEmail').value;
    const clientName = document.getElementById('clientName').value;
    const ssn = document.getElementById('ssn').value;
    const accidentDateInput = document.getElementById('accidentDate').value;

    const athugaKennitoluResult = athugaKennitolu(ssn)
    if (athugaKennitoluResult !== "") {
        alert(athugaKennitoluResult)
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

    let results = {};

    let compensationResults = '';
    if (compensationCheckbox) {
        results = {...results, compensationResults: {
            sickDaysWithAccommodation: sickDaysWithAccommodation,
            sickDaysWithoutAccommodation: sickDaysWithoutAccommodation,
            uppreiknadBeturMeðRúmlegu: uppreiknadBeturMeðRúmlegu,
            uppreiknadBeturÁnRúmlegu: uppreiknadBeturÁnRúmlegu,
            heildarBeturMeðRúmlegu: heildarBeturMeðRúmlegu,
            heildarBeturÁnRúmlegu: heildarBeturÁnRúmlegu,
            heildarBótakrafaFyrirÞjáningabætur: heildarBótakrafaFyrirÞjáningabætur
        }}
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
        }}
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

        results = {...results, permanentLossResults: {
            permanentLossLevel: permanentLossLevel,
            ageAtAccident: ageAtAccident,
            miskabotValue: miskabotValue,
            miskabotUppreiknadurNamundadur: miskabotUppreiknadurNamundadur,
            heildarkrafaBotaVegnaVaranlegsMiska: heildarkrafaBotaVegnaVaranlegsMiska
        }}
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

    // Calculate age at the time of the accident
    const birthDate = new Date(year, month - 1, day); // Construct birthDate from dob components
    const accidentDate = new Date(accidentYear, accidentMonth - 1, accidentDay); // Construct accidentDate from accidentDate components
    const ageAtAccident = calculateAgeAtDate(birthDate, accidentDate);

    // Calculate the margfeldisstuðull for the age at the time of the accident
    const margfeldisstudull = calculateMargfeldisstudull(ageAtAccident); // Pass the ageAtAccident object

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

        results = {...results, permanentDisabilityResults: permanentDisabilityResults {
            
        } };
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
            <p><strong>Heildarkrafa fyrir varanlega Örorku fyrir frádrátt</strong> ${heildaraKrafaFyrirFradratt}

        `;
    }

    // Visualize data
    const resultsData = `
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

    console.log(results)

    // Open new window with data
    // const resultsWindow = window.open("../public/results.html", "_blank");
    // resultsWindow.focus();
});
