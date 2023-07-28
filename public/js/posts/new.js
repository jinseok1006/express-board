const newPostForm = document.getElementById('newPostForm');

const fields = ['title', 'writer', 'content', 'password'];
const formElements = fields.map((field) => document.getElementById(field));

newPostForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (formElements.some((element) => !element.value)) {
    return alert('필드를 전부 채우세요.');
  }

  newPostForm.submit();
});
