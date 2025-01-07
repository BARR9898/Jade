'use client';
import { useState } from 'react';
import { signOut } from "next-auth/react";
import Link from 'next/link';
import { GalleryHorizontal, Plus, LogOut, Users, List } from 'lucide-react';

export default function Admin({chiildren}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar el sidebar
  const handleLogout = () => {
    console.log('saliendo');
    signOut({ callbackUrl: "/auth/login" });
  }

  return (
    <div className="flex">
      {/* Sidenav para resoluciones pequeñas y medianas en adelante */}
      <div
        className={`fixed inset-0 z-50 md:z-auto md:relative md:flex md:flex-col md:w-64 bg-zinc-800 text-white transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          className="md:hidden absolute top-4 left-4 text-white text-2xl"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle sidebar
        >
          <List />
        </button>
        <ul className="space-y-6 mt-20 pl-4">
          <li>
            <Link href="/admin/tasks" className="flex items-center space-x-2 text-xl hover:bg-zinc-700 py-2 px-4 rounded">
              <List className="text-white" />
              <span>Tareas</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/tasks/new" className="flex items-center space-x-2 text-xl hover:bg-zinc-700 py-2 px-4 rounded">
              <Plus className="text-white" />
              <span>Crear Tarea</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="flex items-center space-x-2 text-xl hover:bg-zinc-700 py-2 px-4 rounded">
              <Users className="text-white" />
              <span>Usuarios</span>
            </Link>
          </li>
          <li>
            <button
              className="flex items-center space-x-2 text-xl hover:bg-zinc-700 py-2 px-4 rounded"
              onClick={handleLogout}
            >
              <LogOut className="text-white" />
              <span>Salir</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 ml-0 md:ml-64 h-screen bg-gray-100">
        {/* Aquí va el contenido de tu página */}
        <div className="p-4">
         {chiildren}
        </div>
      </div>
    </div>
  );
}
