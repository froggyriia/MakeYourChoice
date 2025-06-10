import { Routes, Route } from 'react-router-dom';
import routes from './router/routes.jsx';

// Главный компонент приложения с роутами
export default function App() {
    return (
        <Routes>
            {/* Пробегаемся по массиву маршрутов и создаем Route для каждого */}
            {routes.map(({ path, element }, index) => (
                <Route key={index} path={path} element={element} />
            ))}
        </Routes>
    );
}