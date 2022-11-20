const ENDPOINT = "http://localhost:3000";

const states = () => {
    return axios.get(`${ENDPOINT}/states`)
}
const loadTable = () => {
    axios.get(`${ENDPOINT}/cities`)
        .then((response) => {
            if (response.status === 200) {
                const dados = response.data;
                createTable(dados)
            }
        })
};
loadTable();

const createTable = (dados) => {
    var trHTML = '';
    dados.forEach(function (element) {
        trHTML += '<tr style="border: solid 1px rgb(231, 226, 226);border-radius:10px;  ">';
        trHTML += '<td>' + element.id + '</td>';
        trHTML += '<td>' + element.name + '</td>';
        trHTML += '<td>' + element.State.name + '</td>';
        trHTML += '<td>' + element.cep + '</td>';

        trHTML += '<td><img src="styles/lixeira.png" onclick="cityDelete(' + element.id + ')"></img>';
        trHTML += '<img src="styles/editar.png" onclick="showCityEditBox(' + element.id + ')"></img>';
        trHTML += "</tr>";
    });
    document.getElementById("mytable").innerHTML = trHTML;
}



const searchFor = async () => {
    const item = document.querySelector('#search').value
    const select = document.querySelector('#choice').value
    if (select === "name") {
        axios.get(`${ENDPOINT}/cities/?name=${item}`)
        .then((response) => {
            const data = response.data;
            if (response.status === 200) {
                createTable(data)
            }})

            } if (select === "cep") {
                axios.get(`${ENDPOINT}/cities/?cep=${item}`)
                .then((response) => {
                    const data = response.data;
                    if (response.status === 200) {
                        createTable(data)
                    }})
            } if (select === "all") {

                axios.get(`${ENDPOINT}/cities`)
                .then((response) => {
                    const data = response.data;
                    if (response.status === 200) {
                        createTable(data)
                    }})
                }
}