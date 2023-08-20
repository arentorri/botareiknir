export function getLansKjaraVisitala() {
    let heades = new Headers();

    headers.append("Content-Type", "application/json");
    
    headers.append("Access-Control-Allow-Origin", "http://localhost:3000");
    headers.append("Access-Control-Allow-Credentials", "true");
    headers.append("POST");

    fetch("https://px.hagstofa.is/pxis/api/v1/is/Efnahagur/visitolur/1_vnv/1_vnv/VIS01004.px", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            query: "query { allVisitala { id, heiti, fjoldi } }"
        })
    })
    .then(data => data.json())
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    });
}