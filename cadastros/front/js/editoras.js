const ENDPOINT = "http://localhost:3000";

const cities = () => {
    return axios.get(`${ENDPOINT}/cities`)
}

const loadTable = () => {
    axios.get(`${ENDPOINT}/publishers`)
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
        trHTML += '<td>' + element.name + '</td>';
        trHTML += '<td>' + element.City.name + '</td>';
        trHTML += '<td><img src="styles/lixeira.png" onclick="publiDelete(' + element.id + ')"></img>';
        trHTML += '<img src="styles/editar.png" onclick="showPubliEditBox(' + element.id + ')"></img>';
        trHTML += "</tr>";
    });
    document.getElementById("mytable").innerHTML = trHTML;

}



const searchFor = async () => {
    const item = document.querySelector('#search').value
    const select = document.querySelector('#choice').value

    if (select === "name") {
        axios.get(`${ENDPOINT}/publishers/?name=${item}`)
            .then((response) => {
                const data = response.data;
                if (response.status === 200) {
                    createTable(data)

                }
            })
    } if (select === "all") {
        axios.get(`${ENDPOINT}/publishers`)
            .then((response) => {
                const data = response.data;
                if (response.status === 200) {
                    createTable(data)

                }
            })
    }
}
    const publiCreate = () => {
        const name = document.getElementById("name").value;
        const CityId = document.getElementById("select").value;
        console.log(CityId)

        axios.post(`${ENDPOINT}/publishers`, {
            name: name,
            CityId: CityId

        })
            .then((response) => {
                Swal.fire(`Publishing ${response.data.name} created`);
                loadTable();
            }, (error) => {
                Swal.fire(`Error to create Publishing: ${error.response.data.error} `)
                    .then(() => {
                        showPubliCreateBox();
                    })
      });
    }


    const getPubl = (id) => {
        return axios.get(`${ENDPOINT}/publishers/` + id);
    }

    const publEdit = () => {
        const id = document.getElementById("id").value;
        const name = document.getElementById("name").value;
        const city_id = document.getElementById("select").value;
        axios.put(`${ENDPOINT}/publishers/` + id, {
            name: name,
            CityId: city_id
        })
            .then((response) => {
                Swal.fire(`Publishing ${response.data.name} updated`);
                loadTable();
            }, (error) => {
                Swal.fire(`Error to update publishers: ${error.response.data.error} `)
                    .then(() => {
                        showPubliEditBox(id);
                    })
            });
    }

    const publiDelete = async (id) => {
        const publi = await getPubl(id);
        const data = publi.data;
        axios.delete(`${ENDPOINT}/publishers/` + id)
            .then((response) => {
                Swal.fire(`Publishing ${data.publi} deleted`);
                loadTable();
            }, (error) => {
                Swal.fire(`Error to delete publishers: ${error.response.data.error} `);
                loadTable();
            });
    };

    const showPubliCreateBox = async () => {
        const select = await createPubliCombo()
        Swal.fire({
            title: 'Create publishers',
            html:
                '<input id="id" type="hidden">' +
                '<input id="name" class="swal2-input" placeholder="name">' +
                select,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                publiCreate();
            }
        });
    }

    const showPubliEditBox = async (id) => {
        const select = await createPubliCombo()
        const publi = await getPubl(id);
        const data = publi.data;
        Swal.fire({
            title: 'Edit publi',
            html:
                '<input id="id" type="hidden" value=' + data.id + '>' +
                '<input id="name" class="swal2-input" placeholder="name" value="' + data.name + '">' +
                select,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                publEdit();
            }
        });

    }
    const createPubliCombo = async (id) => {
        const city = await cities();
        const data = city.data;

        var select = '<select class="swal2-input" id="select">'

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

