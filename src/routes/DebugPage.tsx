// src/routes/DebugPage.tsx
import { useParams, useLocation } from 'react-router-dom';
export default function DebugPage() {
  const params = useParams();
  const location = useLocation();
  return (
    <div>
      <pre>{JSON.stringify({ params, location }, null, 2)}</pre>
    </div>
  );
}
