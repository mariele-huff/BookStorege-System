const ENDPOINT = "http://localhost:3000";

const loadTable = () => {
    axios.get(`${ENDPOINT}/format`)
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
        trHTML += '<td><img src="styles/lixeira.png" onclick="formatDelete(' + element.id + ')"></img>';
        trHTML += '<img src="styles/editar.png" onclick="showFormatEditBox(' + element.id + ')"></img>';
        trHTML += "</tr>";
    });
    document.getElementById("mytable").innerHTML = trHTML;

}

const searchFor = async () => {

    const item = document.querySelector('#search').value
    const select = document.querySelector('#choice').value
    if (select === "description") {
        axios.get(`${ENDPOINT}/format/?description=${item}`)
            .then((response) => {
                const data = response.data;
                if (response.status === 200) {
                    createTable(data)
                }
            })

    } if (select === "all") {
        axios.get(`${ENDPOINT}/format`)
            .then((response) => {
                const data = response.data;
                if (response.status === 200) {
                    createTable(data)
                }
            })
    }

}

const formatCreate = () => {
    const description = document.getElementById("description").value;
    axios.post(`${ENDPOINT}/format`, {
        description: description
    })
        .then((response) => {
            Swal.fire(`Format ${response.data.description} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create format: ${error.response.data.error} `)
                .then(() => {
                    showFormatCreateBox();
                })
        });
}

const getFormat = (id) => {
    return axios.get(`${ENDPOINT}/format/` + id);
}

const formatEdit = () => {
    const id = document.getElementById('id').value
    const description = document.getElementById("description").value;



    axios.put(`${ENDPOINT}/format/` + id, {
        description: description

    })
        .then((response) => {
            Swal.fire(`format ${response.data.description} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update format: ${error.response.data.error} `)
                .then(() => {
                    showFormatEditBox(id);
                })
        });
}

const formatDelete = async (id) => {
    const format = await getFormat(id);
    const data = format.data;
    axios.delete(`${ENDPOINT}/format/` + id)
        .then((response) => {
            Swal.fire(`Format ${data.description} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete format: ${error.response.data.error} `);
            loadTable();
        });
};

const showFormatCreateBox = () => {
    Swal.fire({
        title: 'Create format',
        html:
            '<input id="id" type="hidden">' +
            '<input id="description" class="swal2-input" placeholder="Description">',


        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            formatCreate();
        }
    });
}

const showFormatEditBox = async (id) => {
    const format = await getFormat(id);
    const data = format.data;
    Swal.fire({
        title: 'Edit Format',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="description" class="swal2-input" placeholder="Description" value="' + data.description + '">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            formatEdit();
        }
    });

}