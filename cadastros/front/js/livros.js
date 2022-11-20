const ENDPOINT = "http://localhost:3000";
const categories = () => {
    return axios.get(`${ENDPOINT}/categories`)
}
const publishers = () => {
    return axios.get(`${ENDPOINT}/publishers`)
}
const format = () => {
    return axios.get(`${ENDPOINT}/format`)
}
const loadTable = () => {
    axios.get(`${ENDPOINT}/books`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                createTable(data)
            }
        })
}
loadTable()

const createTable = async (data) => {
    var trHTML = '';
    await data.forEach(element => {

        trHTML += '<tr style="border: solid 1px rgb(231, 226, 226);border-radius:10px;  ">';
        trHTML += '<td>' + element.id + '</td>';
        trHTML += '<td>' + element.title + '</td>';
        trHTML += '<td>' + element.author + '</td>';
        trHTML += '<td>' + element.publication_year + '</td>';
        trHTML += '<td>' + element.pages + '</td>';
        trHTML += '<td>' + element.value + '</td>';
        trHTML += '<td>' + element.Category.description + '</td>';
        trHTML += '<td>' + element.Publisher.name + '</td>';
        trHTML += '<td>' + element.Format.description + '</td>';
        trHTML += '<td><img src="styles/lixeira.png" onclick="bookDelete(' + element.id + ')"></img>';
        trHTML += '<img src="styles/editar.png" onclick="showBookEditBox(' + element.id + ')"></img>';
        trHTML += "</tr>";
    })
    document.getElementById("mytable").innerHTML = trHTML;
}


const orderByPrice = async () => {
    axios.get(`${ENDPOINT}/books/?sort=value`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                createTable(data);
            }
        })
}
const orderByCategory = async () => {
    axios.get(`${ENDPOINT}/books/?sort=Category`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                createTable(data);
            }
        })
}
const orderByTitle = async () => {
    axios.get(`${ENDPOINT}/books/?sort=title`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                createTable(data);
            }
        })
}

const searchFor = async () => {

    const item = document.querySelector('#search').value
    const select = document.querySelector('#choice').value
    console.log(select)
    console.log(item)
    if (select === "title") {
        axios.get(`${ENDPOINT}/books/?title=${item}`)
            .then((response) => {
                const data = response.data;
                if (response.status === 200) {
                    createTable(data)
                }
            })

    } if (select === "author") {
        axios.get(`${ENDPOINT}/books/?author=${item}`)
            .then((response) => {
                const data = response.data;
                if (response.status === 200) {
                    createTable(data)

                }
            })
    } if (select === "publishing") {
        axios.get(`${ENDPOINT}/books/?publishers=${item}`)
            .then((response) => {
                const data = response.data;
                if (response.status === 200) {
                    createTable(data)

                }
            })


    } if (select === "all") {

        axios.get(`${ENDPOINT}/books`)
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    createTable(data)
                }
            })

    };
}


const bookCreate = async () => {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publication_year = document.getElementById("publication_year").value;
    const pages = document.getElementById("pages").value;
    const value = document.getElementById("price").value;
    const categories_id = document.getElementById("select1").value;
    const publishers_id = document.getElementById("select2").value;
    const format_id = document.getElementById("select3").value;
    console.log(title)

    axios.post(`${ENDPOINT}/books`, {
        title: title,
        author: author,
        publication_year: publication_year,
        pages: pages,
        value: value,
        PublisherId: publishers_id,
        CategoryId: categories_id,
        FormatId: format_id

    })
        .then((response) => {
            Swal.fire(`Book ${response.data.title} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create Book: ${error.response.data.error} `)
                .then(() => {
                    showBookCreateBox();
                })
        });
}

const getBook = (id) => {
    return axios.get(`${ENDPOINT}/books/` + id);
}

const bookEdit = () => {

    const id = document.getElementById('id').value
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publication_year = document.getElementById("publication_year").value;
    const pages = document.getElementById("pages").value;
    const value = document.getElementById("price").value;
    const categories_id = document.getElementById("select1").value;
    const publishers_id = document.getElementById("select2").value;
    const format_id = document.getElementById("select3").value;

    axios.put(`${ENDPOINT}/books/` + id, {
        title,
        author,
        publication_year,
        pages,
        value,
        CategoryId: categories_id,
        PublisherId: publishers_id,
        FormatId: format_id


    })
        .then((response) => {
            Swal.fire(`Book ${response.data.title} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update book: ${error.response.data.error} `)
                .then(() => {
                    showBookEditBox(id);
                })
        });
}

const bookDelete = async (id) => {
    const book = await getBook(id);
    const data = book.data;
    axios.delete(`${ENDPOINT}/books/` + id)
        .then((response) => {
            Swal.fire(`Book ${data.title} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete book: ${error.response.data.error} `);
            loadTable();
        });
};

const showBookCreateBox = async () => {
    const select1 = await createCategoriesCombo()
    const select2 = await createPublishersCombo()
    const select3 = await createFormatCombo()
    Swal.fire({
        title: 'Create book',
        html:
            '<input id="id" type="hidden">' +
            '<input id="title" class="swal2-input" placeholder="Title">' +
            '<input id="author" class="swal2-input" placeholder="Author">' +
            '<input id="publication_year" class="swal2-input" placeholder="Publication year">' +
            '<input id="pages" class="swal2-input" placeholder="Pages">' +
            '<input id="price" class="swal2-input" placeholder="price">' +
            select1 +
            select2 +
            select3,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            bookCreate();
        }
    });
}

const showBookEditBox = async (id) => {
    const book = await getBook(id);
    const data = book.data;
    const select1 = await createCategoriesCombo()
    const select2 = await createPublishersCombo()
    const select3 = await createFormatCombo()
    Swal.fire({
        title: 'Edit book',
        html:
            '<input id="id" type="hidden" value="' + data.id + '">' +
            '<input id="title" class="swal2-input" placeholder="title" value= "' + data.title + '">' +
            '<input id="author" class="swal2-input" placeholder="author" value="' + data.author + '">' +
            '<input id="publication_year" class="swal2-input" placeholder="publication year" value="' + data.publication_year + '">' +
            '<input id="pages" class="swal2-input" placeholder="pages" value="' +data.pages + '">' +
            '<input id="price" class="swal2-input" placeholder="price" value="' +data.value + '">' +
        
            select1 +
            select2 +
            select3,

        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            bookEdit();
        }
    });

}

const createCategoriesCombo = async (id) => {
    const categoriesData = await categories();
    const data = categoriesData.data;


    var select1 = '<select class="swal2-input" id="select1">'

    await data.forEach(function (item) {
        if (id === item.id) {
            select1 += `<option value= "${item.id}" selected >${item.description}`
        } else {
            select1 += `<option value= "${item.id}">${item.description}</option>`
        }

    })

    select1 += '</select>'
    return select1;


}

const createPublishersCombo = async (id) => {
    const publishersData = await publishers();
    const data = publishersData.data;


    var select2 = '<select class="swal2-input" id="select2">'
    select2 += `<option value= "">select a publisher`
            await data.forEach(function (item) {
        if (id === item.id) {
            select2 += `<option value= "${item.id}" selected >${item.name}`
        } else {
            select2 += `<option value= "${item.id}">${item.name}</option>`
        }

    })

    select2 += '</select>'
    return select2;


}

const createFormatCombo = async (id) => {
    const formatData = await format();
    const data = formatData.data;


    var select3 = '<select class="swal2-input" id="select3">'

    await data.forEach(function (item) {
        if (id === item.id) {
            select3 += `<option value= "${item.id}" selected >${item.description}`
        } else {
            select3 += `<option value= "${item.id}">${item.description}</option>`
        }

    })

    select3 += '</select>'
    return select3;


}

