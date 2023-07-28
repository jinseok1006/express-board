document.getElementById('editForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const id = document.getElementById('id').value;
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  const payload = JSON.stringify({ title, content });

  fetchData(id, payload);
});

async function fetchData(id, payload) {
  try {
    const response = await fetch(`/posts/${id}/`, {
      method: 'put',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const body = await response.json();
      return alert(body.message);
    }

    location.href = '/posts';
  } catch (e) {
    alert('error occuered');
    console.error(e);
  }
}
