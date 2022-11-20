const ENDPOINT = "http://localhost:3000";

const loadTable = () => {
    axios.get(`${ENDPOINT}/categories`)
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
        trHTML += '<td>' + element.description + '</td>';
        trHTML += '<td><img src="styles/lixeira.png" onclick="categDelete(' + element.id + ')"></img>';
        trHTML += '<img src="styles/editar.png" onclick="showCategEditBox(' + element.id + ')"></img>';
        trHTML += "</tr>";
    });
    document.getElementById("mytable").innerHTML = trHTML;
}


const searchFor = async () => {

    const item = document.querySelector('#search').value
    const select = document.querySelector('#choice').value
    console.log(select)
    console.log(item)
    if (select === 'description') {
        axios.get(`${ENDPOINT}/categories/?description=${item}`)
            .then((response) => {
                const data = response.data;
                if (response.status === 200) {
                    createTable(data)
                }
            })
        
    } if (select === "all") {
        axios.get(`${ENDPOINT}/categories`)
            .then((response) => {
                const data = response.data;
                if (response.status === 200) {
                    createTable(data)

                }

            })
    }
}
const categCreate = () => {
    const description = document.getElementById("description").value;


    axios.post(`${ENDPOINT}/categories`, {
        description: description

    })
        .then((response) => {
            Swal.fire(`Categoria ${response.data.description} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create Categoria: ${error.response.data.error} `)
                .then(() => {
                    showUserCreateBox();
                })
        });
}

const categget = (id) => {
    return axios.get(`${ENDPOINT}/categories/` + id);
}

const categEdit = () => {
    const id = document.getElementById("id").value;
    const description = document.getElementById("description").value;


    axios.put(`${ENDPOINT}/categories/` + id, {
        description: description,

    })
        .then((response) => {
            Swal.fire(`User ${response.data.description} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update user: ${error.response.data.error} `)
                .then(() => {
                    showUserEditBox(id);
                })
        });
}

const categDelete = async (id) => {
    const categ = await categget(id);
    const data = categ.data;
    axios.delete(`${ENDPOINT}/categories/` + id)
        .then((response) => {
            Swal.fire(`User ${data.categ} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete user: ${error.response.data.error} `);
            loadTable();
        });
};

const showCategCreateBox = () => {
    Swal.fire({
        title: 'Create user',
        html:
            '<input id="id" type="hidden">' +
            '<input id="description" class="swal2-input" placeholder="description">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            categCreate();
        }
    });
}

const showCategEditBox = async (id) => {
    const categ = await categget(id);
    const data = categ.data;
    Swal.fire({
        title: 'Edit categ',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="description" class="swal2-input" placeholder="description" value="' + data.description + '">',

        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            categEdit();
        }
    });

}
