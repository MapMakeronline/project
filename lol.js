const checkAuth = async () => {
  try {
    // Делаем запрос
    const response = await fetch('http://127.0.0.1:8000/api/auth/user/', {
    credentials: 'include',
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

    // Логируем статус и заголовки ответа
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));

    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data);
    } else {
      console.log('Response error:', response.statusText);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
};

// Вызываем функцию
checkAuth();