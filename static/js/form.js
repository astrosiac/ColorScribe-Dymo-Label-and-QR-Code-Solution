// document.addEventListener("DOMContentLoaded", () => {
//   //Clear form button
//   const clearFormButton = document.getElementById("clear-form");
//   const jobForm = document.getElementById("job-form");

//   clearFormButton.addEventListener("click", () => {
//     jobForm.reset();

//     // Ensure all number inputs are disabled after resetting the form
//     const numberInputs = document.querySelectorAll(".number-input");
//     numberInputs.forEach((input) => {
//       input.disabled = true;
//     });

//     // Uncheck all formula checkboxes after resetting the form
//     const formulaCheckboxes = document.querySelectorAll(".formula-checkbox");
//     formulaCheckboxes.forEach((checkbox) => {
//       checkbox.checked = false;
//     });

//     // Hide QR Code after clearing the form
//     const qrCode = document.getElementById("qr-code");
//     if (qrCode) {
//       qrCode.style.display = "none";
//     }
//   });
// });

// //Multiple checkboxes
// const checkboxes = document.querySelectorAll(".formula-checkbox");
// const numberInputs = document.querySelectorAll(".number-input");

// checkboxes.forEach((checkbox, index) => {
//   checkbox.addEventListener("change", () => {
//     numberInputs[index].disabled = !checkbox.checked;
//   });
// });
