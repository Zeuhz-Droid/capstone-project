const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const btnSubmitSignupForm = document.querySelector('.btn--signup');
const formError = document.querySelector('.form__error');

let passwordValue;

password.addEventListener('input', (e) => {
  passwordValue = e.target.value;
});

password2.addEventListener('input', handleBtn);

function handleBtn(e) {
  if (e.target.value !== passwordValue) {
    formError.classList.remove('hide');
    btnSubmitSignupForm.setAttribute('disabled');
  } else {
    formError.classList.add('hide');
    btnSubmitSignupForm.removeAttribute('disabled');
  }
}
