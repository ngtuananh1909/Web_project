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

  function togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const passwordToggleIcon = document.getElementById('passwordToggleIcon');

        if (passwordInput.type === 'password') {
            // Chuyển sang hiển thị mật khẩu
            passwordInput.type = 'text';
            passwordToggleIcon.src = '/img/eye1.png';
        } else {
            // Chuyển về ẩn mật khẩu
            passwordInput.type = 'password';
            passwordToggleIcon.src = '/img/eye2.png';
        }
    }
    // Khôi phục hàm togglePasswordCheck ban đầu
    function togglePasswordCheck() {
        const passwordCheck = document.getElementById("passwordCheck");
        passwordCheck.style.display = "flex";
    }

    // Khôi phục hàm confirmPassword ban đầu
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
                // Cho phép chỉnh sửa mật khẩu
                document.getElementById("password").readOnly = false;
                document.getElementById("password").focus();
                
                // Ẩn khung xác nhận
                document.getElementById("passwordCheck").style.display = "none";
                
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

    // Hàm lưu mật khẩu mới
    function saveNewPassword() {
        const newPassword = document.getElementById("password").value;
        
        // Kiểm tra độ dài mật khẩu
        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        fetch("/auth/updatePassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                newPassword: newPassword 
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Password updated successfully.");
                document.getElementById("password").readOnly = true;
                document.getElementById("password").value = "********";
            } else {
                alert(data.message || "Failed to update password.");
            }
        })
        .catch((error) => {
            console.error("Error updating password:", error);
            alert("An error occurred. Please try again later.");
        });
    }

    // Thêm event listener để lắng nghe khi mật khẩu được chỉnh sửa
    document.getElementById("password").addEventListener('change', function() {
        if (!this.readOnly) {
            // Nếu input không ở chế độ read-only, hiển thị nút lưu
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.className = 'setting-edit-btn';
            saveButton.onclick = saveNewPassword;
            
            // Thêm nút lưu ngay sau input
            this.parentNode.insertBefore(saveButton, this.nextSibling);
        }
    });
  function togglePasswordVisibility() {
      const passwordInput = document.getElementById('password');
      const passwordToggleIcon = document.getElementById('passwordToggleIcon');

      if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          passwordToggleIcon.src = '/img/eye1.png'; // Hiển thị icon mắt mở
      } else {
          passwordInput.type = 'password';
          passwordToggleIcon.src = '/img/eye2.png'; // Hiển thị icon mắt đóng
      }
  }

  function togglePasswordConfirmVisibility() {
      const passwordInput = document.getElementById('password-confirm');
      const passwordToggleIcon = document.getElementById('passwordConfirmToggleIcon');

      if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          passwordToggleIcon.src = '/img/eye1.png'; // Hiển thị icon mắt mở
      } else {
          passwordInput.type = 'password';
          passwordToggleIcon.src = '/img/eye2.png'; // Hiển thị icon mắt đóng
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
              document.getElementById("password").focus();
              
              document.getElementById("passwordCheck").style.display = "none";
              
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

