document.addEventListener('DOMContentLoaded', function() {
    const form_new = document.getElementById('formForNewUser');
    
    form_new.addEventListener('submit', addNewUser);

    async function addNewUser(event) {
        event.preventDefault();
        const urlNew = 'api/admins/newAddUser';
        const role_new = document.querySelector('#roles').selectedOptions; // Move this inside the function to get the latest selected options
        let listOfRole = [];
        
        for (let i = 0; i < role_new.length; i++) {
            listOfRole.push({
                id: role_new[i].value
            });
        }
        
        let method = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: form_new.firstname.value,
                lastName: form_new.lastname.value,
                age: form_new.age.value,
                email: form_new.email.value,
                password: form_new.password.value,
                roles: listOfRole
            })
        };

        try {
            const response = await fetch(urlNew, method);

            document.getElementById('formError').innerText = '';

            if (!response.ok) {
                const errorData = await response.json();

                for (const [field, message] of Object.entries(errorData)) {
                    const errorMessage = `${message}`;
                    document.getElementById('formError').innerText += errorMessage + '\n'; // Append each error message
                }

                return;
            }

            form_new.reset();
            getAdminPage();

            var triggerTabList = [].slice.call(document.querySelectorAll('#Admin_panel-tab'));
            triggerTabList.forEach(function (triggerEl) {
                var tabTrigger = new bootstrap.Tab(triggerEl);
                triggerEl.addEventListener('click', function (event) {
                    event.preventDefault();
                    tabTrigger.show();
                });
            });

            var triggerEl = document.querySelector('#user_table-tab');
            tabInstance = new bootstrap.Tab(triggerEl);
            tabInstance.show();

        } catch (error) {
            console.error('Error adding new user:', error);
        }
    }
});
