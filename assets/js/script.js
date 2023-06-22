var list = document.getElementById('list');
var items = list.getElementsByTagName('li');
var i;
for (i = 0; i < items.length; i++) {
    var listItem = items[i];
    var span = document.createElement("span");
    var txt = document.createTextNode("\u00D7");
    span.className = "btn-Delete";
    span.appendChild(txt);
    listItem.appendChild(span);
}

var list = document.querySelector('ul');
list.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
    }
}, false);

var close = document.getElementsByClassName("btn-Delete");
var i;
for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
        var div = this.parentElement;
        div.style.display = "none";
    }
}

var addListItem = document.getElementById("btn-input");
var inputList = document.getElementById("input-List");
addListItem.addEventListener('click', function (e) {
    inputList.style.display = "flex";
}, false)

function newElement() {
    var li = document.createElement("li");
    var inputValue = document.getElementById("input-List").value;
    var t = document.createTextNode(inputValue);
    console.log(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
        alert("You must write something!");
    } else {
        document.getElementById("list").appendChild(li);
    }
    document.getElementById("input-List").value = "";

    var span = document.createElement("span");
    var txt = document.createTextNode("\u00D7");
    span.className = "btn-Delete";
    span.appendChild(txt);
    li.appendChild(span);

    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            div.style.display = "none";
        }
    }
}

// var list = document.getElementById('list');
// var inputText = document.getElementById('input-List');
// var addButton = document.getElementById('addButton');
// var t = document.createTextNode(inputText);
// var li = document.createElement("li");
// // Sự kiện click cho nút "Thêm mục"
// addButton.addEventListener('click', function () {
//     // Lấy giá trị nhập liệu từ input
//     var inputValue = inputText.value;

//     // Tạo một phần tử li mới
//     var listItem = document.createElement('li');

//     listItem.appendChild(t);
//     if (inputValue === '') {
//         alert("You must write something!");
//     } else {
//         list.appendChild(li);
//     }

//     // Thiết lập nội dung cho phần tử li
//     listItem.textContent = inputValue;

//     var span = document.createElement("SPAN");
//     var txt = document.createTextNode("\u00D7");
//     span.className = "close";
//     span.appendChild(txt);
//     listItem.appendChild(span);

//     for (i = 0; i < close.length; i++) {
//         close[i].onclick = function() {
//           var div = this.parentElement;
//           div.style.display = "none";
//         }
//       }

// });