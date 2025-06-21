import { Routes, Route } from 'react-router-dom';
import routes from './router/routes.jsx';
import './styles/global.css'

export default function App() {
    return (
        <Routes>
            {routes.map(({ path, element }, index) => (
                <Route key={index} path={path} element={element} />
            ))}
        </Routes>
    );
}