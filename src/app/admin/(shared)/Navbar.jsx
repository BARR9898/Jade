'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut } from 'lucide-react'; // Usamos el icono de LogOut para el cierre de sesión
import { signOut } from 'next-auth/react'; // Si estás utilizando NextAuth.js para autenticación

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // Controla si el sidebar está abierto o colapsado
  const [isLargeScreen, setIsLargeScreen] = useState(false); // Controla si estamos en una pantalla grande

  // Actualizamos el estado `isLargeScreen` cuando el tamaño de la ventana cambie
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 750) { // Asumimos que >= 1024px es pantalla grande
        setIsLargeScreen(true);
      } else {
        setIsLargeScreen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Verifica el tamaño de la pantalla en el primer renderizado

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para alternar el estado de visibilidad del sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = (e) => {
    e.preventDefault();
    signOut({ callbackUrl: '/auth/login' }); // Redirige a la página de login después de cerrar sesión
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-blue-600 text-white ${isOpen || isLargeScreen ? 'w-64' : 'w-16'} transition-all`}>
      {/* Botón para mostrar/ocultar el sidebar en pantallas pequeñas */}
      <button
        className="p-4 text-white md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Contenido del Sidebar */}
      <div className={`flex flex-col items-center mt-8 space-y-4 ${isOpen || isLargeScreen ? 'w-64' : 'w-16'}`}>
        <Link href="/" className="w-full text-center">
          <span className={`${isOpen || isLargeScreen ? 'block' : 'hidden'} p-2`}>Home</span>
        </Link>
        <Link href="/admin/tasks" className="w-full text-center">
          <span className={`${isOpen || isLargeScreen ? 'block' : 'hidden'} p-2`}>Tasks</span>
        </Link>
        <Link href="/admin/users" className="w-full text-center">
          <span className={`${isOpen || isLargeScreen ? 'block' : 'hidden'} p-2`}>Users</span>
        </Link>

        <Link href="/admin/users" className="w-full text-center">
          <span className={`${isOpen || isLargeScreen ? 'block' : 'hidden'} p-2`}>Cerrar SESION</span>
        </Link>

        {/* Opción de Cerrar Sesión como un Link con Icono */}
        <Link 
          href="/auth/login" 
          onClick={handleLogout} 
          className={`flex items-center space-x-2 p-2 mt-4 text-white hover:bg-blue-500 rounded w-full ${isOpen || isLargeScreen ? 'block' : 'block'}`}
        >
          <LogOut className="text-white" />
          <span className={`${isOpen || isLargeScreen ? 'block' : 'block'}`}>Cerrar Sesión</span>
        </Link>
      </div>
    </div>
  );
}
