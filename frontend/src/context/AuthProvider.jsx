import { useState, useEffect, createContext } from 'react';
import {clienteAxios} from '../config/axios';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    // Estado para usuario autenticado
    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);
    
    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token');
            
            if(!token) {
                setCargando(false);
                return;
            }
            
            try {
                const { data } = await clienteAxios.get('/perfil', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setAuth(data);
            } catch (error) {
                console.error(error.response.data);
                setAuth({});
            } finally {
                setCargando(false);
            }
        }
        autenticarUsuario();
    }, []);
    
    const logout = () => {
        localStorage.removeItem('token');
        setAuth({});
    };
    
    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;