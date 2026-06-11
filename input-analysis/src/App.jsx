import Notes from '../components/notes.jsx'
import Review from '../components/review.jsx'
import Save from '../components/save.jsx'
import { Navigate, NavLink, Routes, Route } from "react-router-dom";

export default function App() {
    return (
        <div className="body">
            <aside className='sidebar phoneBottom'>
                <NavLink 
                    to="/notes" 
                    className={({ isActive }) => isActive ? 'side active' : 'side'}
                >
                    随手记
                </NavLink>
                <NavLink 
                    to="/review" 
                    className={({ isActive }) => isActive ? 'side active' : 'side'}
                >
                    复盘
                </NavLink>
                <NavLink 
                    to="/save" 
                    className={({ isActive }) => isActive ? 'side active' : 'side'}
                >
                    留存
                </NavLink>
            </aside>
            <main className='contents'>
                <Routes>
                    <Route path="/" element={<Navigate to="/notes" replace />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/review" element={<Review />} />
                    <Route path="/save" element={<Save />} />
                </Routes>
            </main>
        </div>
    );
}

