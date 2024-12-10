const form_ed = document.getElementById('formForEditing');
const id_ed = document.getElementById('edit-id');
const name_ed = document.getElementById('edit-first_name');
const lastname_ed = document.getElementById('edit-last_name');
const age_ed = document.getElementById('edit-age');
const email_ed = document.getElementById('edit-email');
const editModal = document.getElementById("editModal");
const closeEditButton = document.getElementById("editClose");
const validationMessages = document.getElementById('editFormError');
const bsEditModal = new bootstrap.Modal(editModal);

async function loadDataForEditModal(id) {
    const  urlDataEd = 'api/admins/users/' + id;
    let usersPageEd = await fetch(urlDataEd);
    if (usersPageEd.ok) {
        await usersPageEd.json().then(user => {
            id_ed.value = `${user.id}`;
            name_ed.value = `${user.firstName}`;
            lastname_ed.value = `${user.lastName}`;
            age_ed.value = `${user.age}`;
            email_ed.value = `${user.email}`;
        })
        console.log("id_ed: " + id_ed.value + " !!")
        bsEditModal.show();
    } else {
        alert(`Error, ${usersPageEd.status}`)
    }
}
async function editUser() {
    let urlEdit = 'api/admins/users/' + id_ed.value;
    let listOfRole = [];

    for (let i = 0; i < form_ed.roles.options.length; i++) {
        if (form_ed.roles.options[i].selected) {
            let tmp = {};
            tmp["id"] = form_ed.roles.options[i].value;
            listOfRole.push(tmp);
        }
    }

    let method = {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstName: form_ed.firstName.value,
            lastName: form_ed.lastName.value,
            age: form_ed.age.value,
            email: form_ed.email.value,
            password: form_ed.password.value,
            roles: listOfRole
        })
    };

    console.log(urlEdit, method);

    try {
        const response = await fetch(urlEdit, method);

        validationMessages.innerText = '';
        if (!response.ok) {
            const errorData = await response.json();

            for (const [field, message] of Object.entries(errorData)) {
                const errorMessage = `${message}`;
                validationMessages.innerText += errorMessage + '\n';
            }

            return;
        }

        closeEditButton.click();
        getAdminPage();
    } catch (error) {
    }
}
