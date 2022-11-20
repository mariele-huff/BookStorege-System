const ENDPOINT = "http://localhost:3000";

const loadTable = () => {
    axios.get(`${ENDPOINT}/users`)
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
        trHTML += '<td>' + element.age + '</td>';
        trHTML += '<td>' + element.sex + '</td>';
        trHTML += '<td>' + element.email + '</td>';


        trHTML += '<td><img src="styles/lixeira.png" onclick="userDelete(' + element.id + ')"></img>';
        trHTML += '<img src="styles/editar.png" onclick="showUserEditBox(' + element.id + ')"></img>';
      ;
        trHTML += "</tr>";
    }); 
     trHTML += '<button class="pdf"onclick="gerarPdf()">Gerar PDF</button>'
     trHTML += '<button class="pdf"onclick="gerarCsv()">Baixar CSV</button>'
    document.getElementById("mytable").innerHTML = trHTML;

}
const gerarPdf = async ()=>{
window.open("http://localhost:3000/gerarPdf")

}

const gerarCsv = async ()=>{
    window.open("http://localhost:3000/gerarCsv")
    
    }
const searchFor = async () => {

    const item = document.querySelector('#search').value
    const select = document.querySelector('#choice').value
    if (select === 'name') {
        axios.get(`${ENDPOINT}/users/?name=${item}`)
            .then((response) => {
                const data = response.data;
                if (response.status === 200) {
                    createTable(data)
                }
            })

            } if (select === "age") {
                axios.get(`${ENDPOINT}/users/?age=${Number(item)}`)
                .then((response) => {
                    const data = response.data;
                    if (response.status === 200) {
                        createTable(data)
                    }
                })

           
                 
                    } if (select === "sex") {
                        axios.get(`${ENDPOINT}/users/?sex=${item}`)
                        .then((response) => {
                            const data = response.data;
                            if (response.status === 200) {
                                createTable(data)
                            }
                        })
                    
                }if (select === "all") {
                        axios.get(`${ENDPOINT}/users`)
                        .then((response) => {
                            const data = response.data;
                            if (response.status === 200) {
                                createTable(data)
                            }
                        })
                    }
                }
const userCreate = () => {
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const sex = document.getElementById("sex").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;
    if (password === password2) {
        axios.post(`${ENDPOINT}/users`, {
            name: name,
            age: age,
            sex: sex,
            email: email,
            password: password
        })
            .then((response) => {
                Swal.fire(`User ${response.data.name} created`);
                axios.get(`${ENDPOINT}/email/`+ email);
                
                
                loadTable();
            }, (error) => {
                Swal.fire(`Error to create user: ${error.response.data.error} `)
                    .then(() => {
                        showUserCreateBox();
                    })
            });
    }
    else {
        alert("as senhas devem ser iguais")
    }


}

const getUser = (id) => {
    return axios.get(`${ENDPOINT}/users/` + id);
}

const userEdit = () => {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const sex = document.getElementById("sex").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    axios.put(`${ENDPOINT}/users/` + id, {
        name: name,
        age: age,
        sex: sex,
        email: email,
        password: password,
    })
        .then((response) => {
            Swal.fire(`User ${response.data.name} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update user: ${error.response.data.error} `)
                .then(() => {
                    showUserEditBox(id);
                })
        });
}

const userDelete = async (id) => {
    const user = await getUser(id);
    const data = user.data;
    axios.delete(`${ENDPOINT}/users/` + id)
        .then((response) => {
            Swal.fire(`User ${data.name} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete user: ${error.response.data.error} `);
            loadTable();
        });
};

const showUserCreateBox = () => {
    Swal.fire({
        title: 'Create user',
        html:
            '<input id="id" type="hidden">' +
            '<input id="name" class="swal2-input" placeholder="Name">' +
            '<input id="age" class="swal2-input" placeholder="Age">' +
            '<input id="sex" class="swal2-input" placeholder="Sex">' +
            '<input id="email" class="swal2-input" placeholder="Email">' +
            '<input id="password" type="password" class="swal2-input" placeholder="Password">' +
            '<input id="password2" type="password" class="swal2-input" placeholder="Password2">',

        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            userCreate();
        }
    });
}

const showUserEditBox = async (id) => {
    const user = await getUser(id);
    const data = user.data;
    Swal.fire({
        title: 'Edit User',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="name" class="swal2-input" placeholder="Name" value="' + data.name + '">' +
            '<input id="age" class="swal2-input" placeholder="Age" value="' + data.age + '">' +
            '<input id="sex" class="swal2-input" placeholder="Sex" value="' + data.sex + '">' +
            '<input id="email" class="swal2-input" placeholder="Email" value="' + data.email + '">' +

            '<input id="password" type="password" class="swal2-input" placeholder="password" value="' + '">' +
            '<input id="password2" type="password" class="swal2-input" placeholder="confirm password" value="' + '">',
        focusConfirm: false,
        showCancelButton: true,

        preConfirm: () => {
            const password = document.getElementById("password").value;
            const password2 = document.getElementById("password2").value;
            if (password === password2) {
                userEdit();
            } else {
                alert("as senhas devem ser iguais")
            }
        }
    });

}
