const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const btnSubmitSignupForm = document.querySelector('.btn--signup');
const formError = document.querySelector('.form__error');
const index = document.getElementById('index');

let passwordValue;

password.addEventListener('input', (e) => {
  passwordValue = e.target.value;
});

password2?.addEventListener('input', handleBtn);

function handleBtn(e) {
  if (e.target.value !== passwordValue) {
    formError?.classList.remove('hide');
    btnSubmitSignupForm?.setAttribute('disabled', '');
  } else {
    formError?.classList.add('hide');
    btnSubmitSignupForm?.removeAttribute('disabled');
  }
}

// toggle password functionality
document.addEventListener('change', togglePassword);

function togglePassword(e) {
  let elem;
  if (e.target.classList.contains('form__checkbox')) {
    elem = e.target.closest('.form__group');
    if (e.target.checked) {
      elem.querySelector('.showPassword').classList.add('hide');
      elem.querySelector('.hidePassword').classList.remove('hide');

      elem.querySelector('.form__input').type = 'text';
    } else {
      elem.querySelector('.showPassword').classList.remove('hide');
      elem.querySelector('.hidePassword').classList.add('hide');
      elem.querySelector('.form__input').type = 'password';
    }
  }
}

document.addEventListener('input', addtoggle);

function addtoggle(e) {
  if (!(e.target.type === 'password')) return;
  const elem = e.target
    .closest('.form__group')
    .querySelector('.form__checkPassword');

  e.target.type === 'password'
    ? elem.classList.remove('hide')
    : elem.classList.add('hide');
}

index?.addEventListener('click', handleDeleteLimoHistory);

function handleDeleteLimoHistory(e) {
  if (!e.target.classList.contains('btn--delete')) return;
  displayModal();
  // elem = e.target.classList.contains('btn--delete');
}

function displayModal() {}
