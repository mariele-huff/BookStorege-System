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



const cityEdit = () => {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const state_id = document.getElementById("select").value;
    const cep = document.getElementById("cep").value;

    axios.put(`${ENDPOINT}/cities/` + id, {
        name: name,
        StateId: state_id,
        cep: cep
    })
        .then((response) => {
            Swal.fire(`City ${response.data.name} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update city: ${error.response.data.error} `)
                .then(() => {
                    showCityCreateBox(id);
                })
        });
}

const cityDelete = async (id) => {
    const city = await getCity(id);
    const data = city.data;
    axios.delete(`${ENDPOINT}/cities/` + id)
        .then((response) => {
            Swal.fire(`City ${data.name} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete city: ${error.response.data.error} `);
            loadTable();
        });
};

const showCityCreateBox = async (StateId) => {
    const select = await createStatesCombo(StateId)
    Swal.fire({

        title: 'Create city',
        html:
            '<input id="id" type="hidden">' +
            '<input id="name" class="swal2-input" placeholder="Name">' +
            '<input id="cep" class="swal2-input" placeholder="CEP">' +
            select,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            await validaCep()
        }
    });

}

const validaCep = async () => {
    const cepVal = await document.querySelector("#cep").value
    await axios.get(`https://viacep.com.br/ws/${cepVal}/json/`)

        .then((response) => {

            if (response.data.localidade) {
                console.log(response.data)
                cityCreate();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'invalid CEP',

                })
            }
        }), (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'invalid CEP',

            })
            loadTable();
        }
}

const cityCreate = async () => {
    const name = document.getElementById("name").value;
    const state_id = document.getElementById("select").value;
    const cep = document.getElementById("cep").value;
    console.log(name)
    console.log(state_id)
    console.log(cep)

    await axios.post(`${ENDPOINT}/cities`, {
        name: name,
        StateId: state_id,
        cep: cep
    })
        .then(async (response) => {
            await Swal.fire(`City ${response.data.name} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create city: ${error.response.data.error} `)
                .then(() => {
                    showCityCreateBox();
                })
        });
}


const showCityEditBox = async (id) => {
    const select = await createStatesCombo()
    const city = await getCity(id);
    const data = city.data;
    Swal.fire({
        title: 'Edit city',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="name" class="swal2-input" placeholder="name" value="' + data.name + '">' +
            '<input id="cep" class="swal2-input" placeholder="cep" value="' + data.cep + '">' +

            select,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            await validaCep()
        }
    });

}

const getCity = (id) => {
    return axios.get(`${ENDPOINT}/cities/` + id);
}


const createStatesCombo = async (id) => {
    const state = await states();
    const data = state.data;

    var select = '<select class="swal2-input" id="select">'
    select+= `<option value= "">select a state`
    await data.forEach(function (item) {
        if (id === item.id) {
            select += `<option value= "${item.id}" selected >${item.name}`
        } else {
            select += `<option value= "${item.id}">${item.name}</option>`
        }
    })
    select += '</select>'
    return select;
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