const ENDPOINT = "http://localhost:3000";

const loadTable = () => {
    axios.get(`${ENDPOINT}/states`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                createTable(data)
            }
        })
};

loadTable();

const createTable = (data) => {
    var trHTML = '';
    data.forEach(element => {
        trHTML += '<tr style="border: solid 1px rgb(231, 226, 226);border-radius:10px;">';
        trHTML += '<td>' + element.id + '</td>';
        trHTML += '<td>' + element.name + '</td>';
        trHTML += '<td>' + element.province + '</td>';

        trHTML += '<td><img src="styles/lixeira.png" onclick="stateDelete(' + element.id + ')"></img>';
        trHTML += '<img src="styles/editar.png" onclick="showStateEditBox(' + element.id + ')"></img>';
        trHTML += "</tr>";
    });
    document.getElementById("mytable").innerHTML = trHTML;


}

const stateCreate = () => {
    const name = document.getElementById("name").value;
    const province = document.getElementById("province").value;


    axios.post(`${ENDPOINT}/states`, {
        name: name,
        province: province
    })
        .then((response) => {
            Swal.fire(`State ${response.data.name} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create state: ${error.response.data.error} `)
                .then(() => {
                    showStateCreateBox();
                })
        });
}

const getState = (id) => {
    return axios.get(`${ENDPOINT}/states/` + id);
}

const stateEdit = () => {
    const id = document.getElementById('id').value
    const name = document.getElementById("name").value;
    const province = document.getElementById("province").value;


    axios.put(`${ENDPOINT}/states/` + id, {
        name: name,
        province: province
    })
        .then((response) => {
            Swal.fire(`state ${response.data.name} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update state: ${error.response.data.error} `)
                .then(() => {
                    showStateEditBox(id);
                })
        });
}

const stateDelete = async (id) => {
    if (!confirm('Confirmar remoção?')) {
        return;
    }


    const state = await getState(id);
    const data = state.data;
    axios.delete(`${ENDPOINT}/states/` + id)
        .then((response) => {
            Swal.fire(`State ${data.name} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete state: ${error.response.data.error} `);
            loadTable();
        });
};

const showStateCreateBox = () => {
    Swal.fire({
        title: 'Create state',
        html:
            '<input id="id" type="hidden">' +
            '<input id="name" class="swal2-input" placeholder="Name">' +
            '<input id="province" class="swal2-input" placeholder="Province">',

        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            stateCreate();
        }
    });
}

const showStateEditBox = async (id) => {
    const state = await getState(id);
    const data = state.data;
    const cities = await axios.get(`${ENDPOINT}/cities/?StateId=` + id);
    const result = cities.data


    let trHTML = "";
    for (let i in result) {
        let element = result[i];
        trHTML += '<tr style="border: solid 1px rgb(231, 226, 226);border-radius:10px;  ">';
        trHTML += '<td>' + element.id + '</td>';
        trHTML += '<td>' + element.name + '</td>';
        trHTML += '<td>' + element.cep + '</td>';

        trHTML += '<td><img src="styles/lixeira.png" onclick="cityDelete(' + element.id + ')"></img>';
        trHTML += '<img src="styles/editar.png" onclick="showCityEditBox(' + element.id + ')"></img>';
        trHTML += "</tr>";
    }

    const table = `
    <h4 class="title-cities">Cities</h4>
    <button type="button" class="btn btn-primary" onclick="showCityCreateBox(${id})">Create</button>
    <div style="width:800px" class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th> Id</th>
                    <th> Name</th>
                    <th> CEP</th>
                    <th> Action</th>
                </tr>
            </thead>
            <tbody>
            ${trHTML}
            </tbody>
            </table>
        </div>`


    Swal.fire({
        title: 'Edit State',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="name" class="swal2-input" placeholder="Name" value="' + data.name + '">' +
            '<input id="province" class="swal2-input" placeholder="province" value="' + data.province + '">' +
            table,
        focusConfirm: false,
        showCancelButton: true,
        customClass: 'big-swal',
        preConfirm: () => {
            stateEdit();
        }
    });

}

const searchFor = async () => {
    const item = document.querySelector('#search').value
    const select = document.querySelector('#choice').value
    if (select === "name") {
        axios.get(`${ENDPOINT}/states/?name=${item}`)
            .then((response) => {
                const data = response.data;
                if (response.status === 200) {
                    createTable(data)
                }
            })

    } if (select === "province") {
        axios.get(`${ENDPOINT}/states/?province=${item}`)
            .then((response) => {
                const data = response.data;
                if (response.status === 200) {
                    createTable(data)
                }
            })
    } if (select === "all") {

        axios.get(`${ENDPOINT}/states`)
            .then((response) => {
                const data = response.data;
                if (response.status === 200) {
                    createTable(data)
                }
            })
    }
}