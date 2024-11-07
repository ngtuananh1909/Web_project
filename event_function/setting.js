function toggleEditMode(field) {
    const inputField = document.getElementById(field);
    const editButton = inputField.nextElementSibling;
    if (inputField.readOnly) {
        inputField.readOnly = false;
        editButton.textContent = "Save";
    } else {
        inputField.readOnly = true;
        editButton.textContent = "Edit";
    }
}


      function togglePasswordCheck() {
        const passwordCheck = document.getElementById("passwordCheck");
        passwordCheck.style.display = "flex";
      }

      function confirmPassword() {
        const password = document.getElementById("password-confirm").value;
        fetch("/auth/verifyPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: password }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              document.getElementById("password").readOnly = false;
              alert("Password confirmed. You can now edit the password.");
            } else {
              alert("Incorrect password. Please try again.");
            }
          })
          .catch((error) => {
            console.error("Error verifying password:", error);
            alert("An error occurred. Please try again later.");
          });
      }