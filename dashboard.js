let users = JSON.parse(localStorage.getItem("userList")) || [];

const tableBody = document.getElementById("table-body");
const searchBox = document.getElementById("search-box");
const paginationList = document.getElementById("pagination-list");

const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");

// Số user hiển thị trên 1 trang
const USERS_PER_PAGE = 5;
// Trang hiện tại
let currentPage = 1;
// Dữ liệu sau khi tìm kiếm
let filteredUsers = [...users];



// //********* tạo thẻ th 
// let th = document.createElement("th");
// // thêm nội dung "STT" cho thẻ th
// th.textContent = "STT";
// // gọi ra vị trí đầu tiên của thẻ tr trong bảng
// let tr = document.getElementsByTagName("tr")[0];
// // chèn thẻ th mới vào trước thẻ th đầu tiên trong tr
// tr.insertBefore(th, tr.firstChild);


let th = document.createElement("th");

let tr = document.getElementsByTagName("tr")[0];

th.textContent = "STT";

tr.appendChild(th);



// 1. Hiển thị phần giao diện bảng từ dữ liệu users trong Local Storage
function renderUsers() {
    tableBody.innerHTML = "";

    // Tính vị trí bắt đầu và kết thúc
    const start = (currentPage - 1) * USERS_PER_PAGE;
    const end = start + USERS_PER_PAGE;

    const usersOnPage = filteredUsers.slice(start, end);

    // Nếu không tìm thấy user
    if (usersOnPage.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">
                   Không tìm thấy người dùng
                </td>
            </tr>
        `;
        renderPagination();
        return;
    }

    // Tạo từng hàng
    usersOnPage.forEach((user, index) => {
        const row = document.createElement("tr");

        // Vị trí thật của user trong mảng filteredUsers
        const userIndex = start + index;

        row.innerHTML = `
            
            <td>${user.userCode || user.id || ""}</td>

            <td>${user.username || user.name || ""}</td>

            <td>${user.email || ""}</td>

            <td>${user.role || ""}</td>

            <td>${user.birthday || ""}</td>

            <td>${user.status || ""}</td>
            <td>${userIndex + 1 || ""}</td> 
            <td>
                <button 
                    class="edit-btn"
                    onclick="editUser(${userIndex})">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button 
                    class="delete-btn"
                    onclick="deleteUser(${userIndex})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    renderPagination();
}


// 2. Tính năng xoá từng hàng, từng bản ghi trong bảng dữ liệu users
function deleteUser(index) {
    const user = filteredUsers[index];

    const confirmDelete = confirm(
        `Bạn có chắc muốn xóa user "${user.username || user.name}" không?`
    );

    if (!confirmDelete) {
        return;
    }

    // Tìm user tương ứng trong mảng users
    const userIndex = users.indexOf(user);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
    }

    // Cập nhật Local Storage
    localStorage.setItem("userList", JSON.stringify(users));

    // Cập nhật lại dữ liệu tìm kiếm
    filteredUsers = [...users];

    // Nếu trang hiện tại không còn user
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }

    renderUsers();
}


//3. Tính năng tìm kiếm user theo name, hiển thị ra đúng bản ghi dữ liệu khi tìm thấy user

searchBox.addEventListener("input", function () {
    const keyword = searchBox.value.trim().toLowerCase();

    filteredUsers = users.filter(function (user) {
        const name = user.username || user.name || "";

        return name.toLowerCase().includes(keyword);
    });

    // Sau khi tìm kiếm quay về trang 1
    currentPage = 1;

    renderUsers();
});


// 4. Tính năng hiển thị số trang tương ứng 5 đối tượng trên 1 trang
function renderPagination() {
    paginationList.innerHTML = "";

    const totalPages = Math.ceil(
        filteredUsers.length / USERS_PER_PAGE
    );

    // Không có dữ liệu
    if (totalPages === 0) {
        arrowLeft.style.display = "none";
        arrowRight.style.display = "none";
        return;
    }

    arrowLeft.style.display = "block";
    arrowRight.style.display = "block";

    // Tạo số trang
    for (let page = 1; page <= totalPages; page++) {
        const li = document.createElement("li");

        li.textContent = page;

        li.classList.add("pagination-element");

        if (page === currentPage) {
            li.classList.add("active");
        }

        li.addEventListener("click", function () {
            currentPage = page;
            renderUsers();
        });

        paginationList.appendChild(li);
    }

    // Disable nút Previous
    if (currentPage === 1) {
        arrowLeft.classList.add("disabled");
    } else {
        arrowLeft.classList.remove("disabled");
    }

    // Disable nút Next
    if (currentPage === totalPages) {
        arrowRight.classList.add("disabled");
    } else {
        arrowRight.classList.remove("disabled");
    }
}

// 5. Tính năng điều hướng chuyển sang trang mới
arrowLeft.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        renderUsers();
    }
});


   // chuyển sang trang sau
arrowRight.addEventListener("click", function () {
    const totalPages = Math.ceil(
        filteredUsers.length / USERS_PER_PAGE
    );

    if (currentPage < totalPages) {
        currentPage++;
        renderUsers();
    }
});

// 6. Tính năng điều hướng sang trang chỉnh sửa (edit) thông tin người dùng

function editUser(index) {
    const user = filteredUsers[index];

    localStorage.setItem("editUserCode", user.userCode);

    window.location.href = "./edit-user.html";
}

renderUsers();