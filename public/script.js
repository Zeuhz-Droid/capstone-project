const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const btnSubmitSignupForm = document.querySelector('.btn--signup');
const formError = document.querySelector('.form__error');

const verifyPassword = (event) => {
  event.preventDefault();

  if (password.value !== password2.value) {
    formError.classList.remove('hide');
  } else {
    formError.classList.add('hide');
    btnSubmitSignupForm.removeEventListener('click', verifyPassword);
  }
};

btnSubmitSignupForm.addEventListener('click', verifyPassword);
