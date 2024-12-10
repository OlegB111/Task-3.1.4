const adminurl = '/api/admins';
const currentuserurl = '/api/user';

document.addEventListener('DOMContentLoaded', () => {

    fetch(currentuserurl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(user => {

            if (user) {
                let roles = '';
                if (user.roles && Array.isArray(user.roles)) {
                    user.roles.forEach(role => {
                        roles += ' ' + role.rolename; // Concatenate role names
                    });
                } else {
                    console.error('Roles is not defined or is not an array:', user.roles);
                }
                document.getElementById("navbar-email").innerHTML = user.email;
                document.getElementById("navbar-roles").innerHTML = roles;
            } else {
                console.error('No user found in the response.');
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
});

async function getAdminPage() {
    let page = await fetch(adminurl);

    if(page.ok) {
        let listAllUser = await page.json();
        loadTableData(listAllUser);
    } else {
        alert(`Error, ${page.status}`)
    }
}
function loadTableData(listAllUser) {
    const tableBody = document.getElementById('admintbody');
    let dataHtml = '';
    for (let user of listAllUser) {
        let roles = [];
        for (let role of user.roles) {
            roles.push(" " + role.rolename.toString()
                .replaceAll("ROLE_", ""))
        }
        dataHtml +=
            `<tr>
    <td>${user.id}</td>
    <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.age}</td>
    <td>${user.email}</td>
    <td>${roles}</td>
    <td>
        <button type="button" class="btn btn-primary" data-bs-toogle="modal"
        data-bs-target="#editModal" 
        onclick="loadDataForEditModal(${user.id})">Edit</button>
    </td>
        
    <td>
        <button class="btn btn-danger" data-bs-toogle="modal"
        data-bs-target="#deleteModal" 
        onclick="deleteModalData(${user.id})">Delete</button>
    </td>
   
</tr>`
    }
    tableBody.innerHTML = dataHtml;
}

getAdminPage();
getUserPage();
