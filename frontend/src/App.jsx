import { Routes, Route } from 'react-router-dom';
import routes from './router/routes.jsx';
import './styles/global.css';
import { CatalogueProvider } from './context/CatalogueContext.jsx'; // import the provider

export default function App() {
    return (
        <CatalogueProvider>
            <Routes>
                {routes.map(({ path, element }, index) => (
                    <Route key={index} path={path} element={element} />
                ))}
            </Routes>
        </CatalogueProvider>
    );
}
