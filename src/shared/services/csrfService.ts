// The-Human-Tech-Blog-React\src\shared\services\csrfService.ts
import api from '../utils/axios';

// Simple call to refresh CSRF token cookie
export async function refreshCsrfToken() {
  await api.get('/csrf-token');
}
