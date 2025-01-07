'use client';

import { useState, useEffect } from 'react';
import Sidebar from './(shared)/Navbar'; // Importamos el Sidebar
import { Menu, X, HandCoins, Undo2, User2, LogOut } from 'lucide-react'; // Importamos el icono LogOut
import Link from 'next/link';
import { signOut } from 'next-auth/react'; // Usamos NextAuth para cerrar sesión

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false); // Controla si el sidebar está abierto o colapsado
  const [isLargeScreen, setIsLargeScreen] = useState(false); // Controla si estamos en una pantalla grande
  const [isClient, setIsClient] = useState(false); // Aseguramos que esto solo se ejecute en el cliente

  // Aseguramos que el código relacionado con el navegador solo se ejecute en el cliente
  useEffect(() => {
    setIsClient(true); // Solo se ejecuta en el cliente
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // Pantallas grandes
        setIsLargeScreen(true);
      } else {
        setIsLargeScreen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Verifica el tamaño de la pantalla en el primer renderizado

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para alternar el estado de visibilidad del sidebar en pantallas pequeñas
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = (e) => {
    e.preventDefault(); // Prevenir la acción predeterminada del enlace
    signOut({ callbackUrl: '/auth/login' }); // Redirige a la página de login después de cerrar sesión
  };

  // Evitar renderizado en el servidor para las secciones dependientes del navegador
  if (!isClient) {
    return null; // Evita la renderización del lado del servidor
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-blue-600 text-white transition-all duration-300 ease-in-out ${isOpen || isLargeScreen ? 'w-64' : 'w-16'}`}
      >
        {/* Botón para mostrar/ocultar el sidebar en pantallas pequeñas */}
        <button
          className="p-4 text-white md:hidden"
          onClick={toggleSidebar}
        >
          {isOpen ? <X /> : <Menu />}
        </button>

        {/* Contenido del Sidebar */}
        <div className="flex flex-col items-center mt-8 space-y-4">
          <Link href="/admin/sales" className="w-full text-center flex justify-center items-center">
            <HandCoins />
            <span className={`${isOpen || isLargeScreen ? 'block' : 'hidden'} p-2`}>Ventas</span>
          </Link>
          <Link href="/admin/returns" className="w-full text-center flex justify-center items-center">
            <Undo2 />
            <span className={`${isOpen || isLargeScreen ? 'block' : 'hidden'} p-2`}>Devoluciones</span>
          </Link>
          <Link href="/admin/users" className="w-full text-center flex justify-center items-center">
            <User2 />
            <span className={`${isOpen || isLargeScreen ? 'block' : 'hidden'} p-2`}>Usuarios</span>
          </Link>

          {/* Cerrar sesión */}
          <Link href="#" className="w-full text-center flex justify-center items-center" onClick={handleLogout}>
            <LogOut />
            <span className={`${isOpen || isLargeScreen ? 'block' : 'hidden'} p-2`}>Cerrar Sesión</span>
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div
        className={`flex-1 ml-16 ${isOpen || isLargeScreen ? 'ml-64' : 'ml-16'} overflow-auto`}
      >
        {/* Aquí se renderiza el contenido */}
        <div className="min-h-full bg-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
