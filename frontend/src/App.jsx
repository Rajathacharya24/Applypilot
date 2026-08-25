import LoginPage from './pages/LoginPage';
import KanbanBoard from './pages/KanbanBoard';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <KanbanBoard /> : <LoginPage />;
}