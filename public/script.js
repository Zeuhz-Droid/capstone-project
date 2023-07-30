const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const btnSubmitSignupForm = document.querySelector('.btn--signup');
const formError = document.querySelector('.form__error');
const indexPage = document.getElementById('index');

// MODAL EFFECT
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnDelete = document.querySelector('.btn--delete');
const btnCancel = document.querySelector('.btn--cancel');
const btnClose = document.querySelector('.btn--close');
const formDelLink = document.querySelector('.del-link');

let passwordValue, limoID;

password?.addEventListener('input', (e) => {
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

indexPage?.addEventListener('click', handleDeleteLimoHistory);

function handleDeleteLimoHistory(e) {
  // check clause
  if (!e.target.classList.contains('fa-trash-can')) return;

  // Get link history
  limoID = e.target.closest('.btn--trash').id;

  // insert id into action attribute on delete button
  modal.setAttribute('action', `/${limoID}?_method=DELETE`);

  // display modal for delete
  displayModal();
}

function displayModal() {
  overlay.classList.remove('hide');
  modal.classList.remove('pin');
}

function hideModal() {
  overlay.classList.add('hide');
  modal.classList.add('pin');
}

btnCancel?.addEventListener('click', hideModal);
btnClose?.addEventListener('click', hideModal);

// btnDelete?.addEventListener('click', handleDelLink);

// function handleDelLink() {
//   const url = `https://xixuz.onrender.com/delID/${limoID}`;
//   const options = {
//     method: 'DELETE',
//     mode: 'cors',
//     Headers: 'Access-Control-Allow-Origin',
//   };

//   fetch(url, options)
//     .then((res) => console.log(`successful: ${res.json()}`))
//     .catch((err) => console.log(err));
// }
