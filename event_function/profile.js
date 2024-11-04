var editModal = document.getElementById('editModal');
        editModal.addEventListener('show.bs.modal', function (event) {
            var button = event.relatedTarget;
            var field = button.getAttribute('data-bs-field');
            var value = button.closest('.row').querySelector('.text-muted').innerText;
            var modalTitle = editModal.querySelector('.modal-title');
            var modalInput = editModal.querySelector('#editField');
            var fieldNameInput = editModal.querySelector('#fieldName');

            modalTitle.textContent = 'Edit ' + field.charAt(0).toUpperCase() + field.slice(1);
            modalInput.value = value;
            fieldNameInput.value = field;
        });

        function saveChanges() {
            var field = document.getElementById('fieldName').value;
            var value = document.getElementById('editField').value;

            // Logic to save the changes to the server
            console.log('Field:', field, 'Value:', value);
            // After saving changes, you might want to update the displayed value
            // Close the modal
            var modal = bootstrap.Modal.getInstance(editModal);
            modal.hide();
        }

        function showTab(tabId) {
            document.getElementById('myProduct').classList.add('hidden');
            document.getElementById('boughtProduct').classList.add('hidden');
            
            document.getElementById(tabId).classList.remove('hidden');
        }