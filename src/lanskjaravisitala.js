async function lansKjaraVisitalaFetch(date) {
    let dateValue = date.getFullYear() + "M" + (date.getMonth() + 1).toString().padStart(2, "0");
    const response = await fetch("https://px.hagstofa.is:443/pxis/api/v1/is/Efnahagur/visitolur/1_vnv/1_vnv/VIS01004.px", {
        method: "POST",
        //mode: "no-cors",
        headers: {
            "Content-Language": "is",
            "Accept-Language": "is",
        },
        body: JSON.stringify({
            "query": [
                {
                  "code": "Mánuður",
                  "selection": {
                    "filter": "item",
                    "values": [
                        dateValue
                    ]
                  }
                },
                {
                    "code": "Vísitala",
                    "selection": {
                        "filter": "item",
                        "values": [
                        "credit_terms_index"
                        ]
                    }
                }
              ],
              "response": {
                "format": "json"
              }
        })
    })
    return response;
}

async function getLansKjaraVisitala(date) {
    const json = await lansKjaraVisitalaFetch(date).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error("Network response was not ok.");
    }).catch(error => {
        console.error("There has been a problem with your fetch operation:", error);
    });
    return json;
}

export { getLansKjaraVisitala };