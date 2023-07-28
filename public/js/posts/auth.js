const authForm = document.getElementById('authForm');

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const postId = document.getElementById('postId').value;
  const password = document.getElementById('password').value;
  const actionType = document.getElementById('actionType').value;

  const body = { password };

  const response = await requestAuth(postId, body);
  if (!response.auth) {
    // 올바르지 않은 액션타입 검증
    return alert(response.message);
  }

  if (actionType === 'put') {
    window.location.href = `/posts/${postId}/edit`;
  } else if (actionType === 'delete') {
    deletePost(postId);
  }
});

async function requestAuth(postId, body) {
  try {
    const res = await fetch(`/posts/${postId}/auth`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      return { auth: false, message: error.message };
    }

    return { auth: true };
  } catch (e) {
    alert('error occured!');
    console.error(e);
  }
}

async function deletePost(postId) {
  if (!confirm('삭제하면 되돌릴 수 없습니다.')) return;
  const res = await fetch(`/posts/${postId}`, { method: 'delete' });

  if (!res.ok) {
    const error = await res.json();
    return alert(error.message);
  }

  // 삭제 성공
  alert('게시물이 삭제 되었습니다.');
  window.location.href = '/posts';
}
