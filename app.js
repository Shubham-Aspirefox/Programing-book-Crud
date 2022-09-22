let tempData = "";

//onload createtable
$(document).ready(() => {
    if (localStorage.getItem('recList') != null) {
        if ($('#tbody').html() == "") {
            createTable();
        } else {
            $('#tbody').html("");
            createTable();
        }
    }
})

//onload jsondata 
$(document).ready(function () {
    $.getJSON("data.json", function (data) {
        tempData = data;
        let headArr = Object.keys(tempData[0]);
        console.log(headArr);

        const cardDiv = $('#divCard');
        for (let i = 0; i < tempData.length; i++) {
            const card = $('<div class="card  col-3  m-1"; id="cardUpd"; style="width":  align-content-start ;"></div>');
            const imgC = $("<img>");
            imgC.attr({
                class: "card-img-top  p-1 shadow",
                src: `${tempData[i].imgUrl}`,
                style: "width: 18vw; height: 22vh;"
            })
            const cardBody = $('<div></div>');
            cardBody.attr("class", "card-body  text-wrap text-dark  fst-italic bg-light");
            const p1 = $(`<p class="card-text ">Name: ${tempData[i].Name} </P>`);
            const p2 = $(`<p class="card-text ">Category: ${tempData[i].Category} </P>`);
            const p3 = $(`<p class="card-text ">Author: ${tempData[i].Author} </P>`);
            const p4 = $(`<p class="card-text ">Quantity: ${tempData[i].QuantityAvailable} </P>`);
            const p5 = $(`<p class="card-text ">Book Price: ${tempData[i].Price} </P>`);
            cardBody.append(p1);
            cardBody.append(p2);
            cardBody.append(p3);
            cardBody.append(p4);
            cardBody.append(p5);
            card.append(imgC)
            card.append(cardBody);
            cardDiv.append(card);
        }

    }).fail(function () {
        console.log("file not found.");
    });
})

// **************************
//Show borrower modal Add borrower section
$('#showModal').click(function () {
    $('#dob').change(function () {
        $('#SelectBook').html("");
        for (let i = 0; i < tempData.length; i++) {
            if (calAge($('#dob').val()) <= 18 && calAge($('#dob').val()) >0) {
                if (tempData[i].Category!= "Hacking") {
                    const opt = $(`<option></option>`);
                    opt.attr({
                        value: `${tempData[i].Name}`,
                    });
                    opt.text(`${tempData[i].Name}`);
                    $('#SelectBook').append(opt)
                }
            } else {
                const opt = $(`<option></option>`);
                opt.attr({
                    value: `${tempData[i].Name}`,
                });
                opt.text(`${tempData[i].Name}`);
                $('#SelectBook').append(opt)
            }
        }
    })


    $('#SelectBook').change(() => {
        $('#priceCal').text(findPrice($('#SelectBook').val()))
    })
    //click submit button
    $('#saveBtn').click(function () {
        let newObj = {};
        newObj.id = maxID();
        let theadArr = ["name", "phoneNo", "dob", "address", "SelectBook", "totalPrice"];
        for (let i = 0; i < 6; i++) {
            if (i == 4) {
                if ($(`#${theadArr[i]}`).val() != "") {
                    let newArr = [];
                    newArr.unshift($(`#${theadArr[i]}`).val())
                    newObj[`${theadArr[i]}`] = newArr;
                } else {
                    return
                }
            } else if (i == 5) {

                if ($('#SelectBook').val() != "") {
                    let price = findPrice($('#SelectBook').val());
                    // console.log(price);
                    newObj["totalPrice"] = price
                } else {
                    return;
                }
            } else {
                if ($(`#${theadArr[i]}`).val() != "") {
                    newObj[theadArr[i]] = $(`#${theadArr[i]}`).val();
                } else {
                    return;
                }
            }
        }
        //create table
        if (localStorage.getItem('recList') == null) {
            let newData = [];
            //create table
            newData.unshift(newObj);
            localStorage.setItem('recList', JSON.stringify(newData));
            console.log(JSON.parse(localStorage.getItem('recList')));
            if ($('#tbody').html() == "") {
                createTable();
            } else {
                $('#tbody').html("");
                createTable();
            }
        } else {
            let currRec = JSON.parse(localStorage.getItem('recList'))
            currRec.unshift(newObj);
            localStorage.setItem('recList', JSON.stringify(currRec));
            if ($('#tbody').html() == "") {
                createTable();
            } else {
                $('#tbody').html("");
                createTable();
            }
        }
    });

    // validation form
    $("#addBorrowerForm").validate({
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            phoneNo: {
                required: true,
                number: true,
                minlength: 10
            },
            dob: {
                required: true
            },
            address: {
                required: true
            },
            SelectBook: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Please enter you name",
                minlength: "length of name must be 5"
            },
            phoneNo: {
                required: "please enter you 10 digit mobile no.",
                minlength: "Enter valid mob no.",
                number: "mobile no. shoud be in numeric"
            },
            dob: {
                required: "Please enter you date of birth"
            },
            address: {
                required: "Please enter your resident address"
            },
            SelectBook: {
                required: "please select a book."
            }
        }
    });
});
// Calculate age
function calAge(str) {
    let year = new Date(str).getFullYear();
    let today = new Date().getFullYear();
    return today - year;
}
//calTotalPrice
function findPrice(str) {
    for (let i = 0; i < tempData.length; i++) {
        if (tempData[i].Name == str) {
            return tempData[i].Price;
        }
    }
}
// *************************************working*************

//create table
function createTable() {
    let localData = JSON.parse(localStorage.getItem('recList'));
    let headerArr = Object.keys(localData[0]);
    for (let i = 0; i < localData.length; i++) {
        const row = $('<tr></tr>');
        row.attr({
            id: `${localData[i].id}`
        });
        for (let j = 0; j < headerArr.length; j++) {
            const td = $('<td></td>');
            td.text(localData[i][headerArr[j]]);
            row.append(td);
        }
        //return and add btn
        const actRow = $('<td></td>')
        const rtnBtn = $('<button class="bg-success border-0 rounded-5 text-light" id="rtnModal">Return Book</button>');
        rtnBtn.attr('onclick', 'returnBookFun(this)')
        const addBookBtn = $('<button class="bg-danger border-0 rounded-5 text-light" id="addBookButton">Add Book </button>');
        addBookBtn.attr("onclick", "addBookFunction(this)")
        actRow.append(rtnBtn);
        actRow.append(addBookBtn);
        row.append(actRow);
        $('#tbody').append(row);
    }
    $('#myTable').DataTable();
}

// *************max function

function maxID() {
    let maxid = 0;
    if (localStorage.getItem('recList') != null) {
        let currData = JSON.parse(localStorage.getItem('recList'));
        for (let i = 0; i < currData.length; i++) {
            if (maxid < currData[i].id) {
                maxid = currData[i].id;
            }
        }
    }
    return maxid + 1;
}

// *******new**
//click add book button
function addBookFunction(e) {
    $('#addBook').modal('show');
    let bookList = tempData;
    let targetRow = $(e).parent().parent().attr("id");
    let tempRec = JSON.parse(localStorage.getItem('recList'));

    $('#selectAddBook').empty();
    for (let j = 0; j < bookList.length; j++) {
        let optionB = $(`<option value="${bookList[j].Name}"></option`);
        optionB.text(bookList[j].Name);
        $('#selectAddBook').append(optionB);
    }
    $('#selectAddBook').change(() => {
        $('#bKPrice').text(findPrice($('#selectAddBook').val()))
    })

    //click book button
    $('#addBook1').click(() => {
        console.log('clicked');
        // debugger;
        for (let i = 0; i < tempRec.length; i++) {
            if (tempRec[i].id == targetRow) {
                let bookArr = tempRec[i].SelectBook;
                let newBook = $('#selectAddBook').val();
                //todo
                bookArr.unshift(newBook)
                tempRec[i].SelectBook = bookArr;

                let bookcost = tempRec[i].totalPrice;
                let currBkPrice = findPrice($('#selectAddBook').val());
                let newp = bookcost + currBkPrice;
                tempRec[i].totalPrice = newp
                localStorage.setItem('recList', JSON.stringify(tempRec));
                //update table
                if ($('#tbody').html() == "") {
                    createTable();
                } else {
                    $('#tbody').html("");
                    createTable();
                }
            }
        }
        $('#addGun').modal('hide');
    })


}

let newTotalPrice = 0;
//return modal funciton
function returnBookFun(e) {
    $('#returnBook').modal('show');
    let tempRec = JSON.parse(localStorage.getItem('recList'));
    // let bookList = tempData;
    let targetRow = $(e).parent().parent().attr("id");
    for (let i = 0; i < tempRec.length; i++) {
        if (tempRec[i].id == targetRow) {
            let bookArra = tempRec[i].SelectBook;
            for (let j = 0; j < bookArra.length; j++) {
                const opt = $('<option></option>')
                opt.val(`${bookArra[j]}`);
                opt.text(`${bookArra[j]}`);
                $('#selectReturnBook').append(opt);
            }
            //update price
            $('#selectReturnBook').change(() => {
                let totalCost = parseInt(tempRec[i].totalPrice);
                let currBookPrice = findPrice($('#selectReturnBook').val());
                // console.log("bk price", currBookPrice);
                let newPrice = totalCost - currBookPrice;
                // console.log("new p",newPrice);
                $('#rtnPrice').text(newPrice);
            })
        }
    }

    $('#returnBtn').click(() => {
        for (let i = 0; i < tempRec.length; i++) {
            if (tempRec[i].id == targetRow) {
                let nbookList = tempRec[i].SelectBook;
                let currBook = $('#selectReturnBook').val();
                // debugger;
                for (let j = 0; j < nbookList.length; j++) {
                    if (nbookList[j] == currBook) {
                        nbookList.splice(j, 1);
                    }
                    tempRec[i].SelectBook = nbookList;
                    let ntotalPrice = parseInt($('#rtnPrice').text());
                    // debugger
                    tempRec[i].totalPrice = ntotalPrice;
                    //update table
                    localStorage.setItem('recList', JSON.stringify(tempRec));
                    if ($('#tbody').html() == "") {
                        createTable();
                    } else {
                        $('#tbody').html("");
                        createTable();
                    }
                }
            }
        }

        $('#returnBook').modal('hide');
    })
}

// ****Book Count***************