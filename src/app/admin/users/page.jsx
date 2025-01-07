"use client";

import { useState, useEffect } from "react";
import UserCard from "../(components)/UserCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic"; // Forzar comportamiento dinámico



function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

async function fetchUsers() {
  const res = await fetch("http://localhost:3000/api/users");
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return res.json();
}

const handleDelete = async (id) => {
  const confirmed = confirm("¿Estás seguro de que deseas eliminar este usuario?");
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al eliminar usuario");
    }

    alert("Usuario eliminado exitosamente.");
    fetchUsers(); // Llama a la función para recargar usuarios
  } catch (error) {
    console.error("Error al eliminar usuario:", error.message);
    alert("No se pudo eliminar el usuario.");
  }
};

const handleEdit = (id) => {
  router.push(`/admin/users/edit/${id}`);
};



  const reloadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await fetchUsers();
      console.log('users',fetchedUsers);
      
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadUsers();
  }, []);

  return (
    <div className="flex flex-col">
      {/* HEADER */}
      <section className="w-full h-9 p-2 flex items-center justify-center my-2">
        <h1 className="text-3xl font-bold">Usuarios</h1>
      </section>

      {/* BOTÓN CREAR USUARIO */}
      <section className="w-full h-9 flex justify-center items-center mt-[30px]">
        <Link href="/admin/users/new">
          <button className="w-[200px] font-bold h-16 bg-blue-900 hover:bg-opacity-70 text-white rounded-lg shadow-md p-2 flex items-center justify-center">
            Nuevo Usuario
          </button>
        </Link>
      </section>

      <div className="overflow-x-auto w-full mt-10">
        {loading && <p>Cargando usuarios...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && users.length === 0 && <p>No hay usuarios disponibles.</p>}

        {!loading && !error && users.length > 0 && (
          <table className="min-w-full table-auto border-collapse ">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 ">ID</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Correo Electrónico</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 text-sm text-gray-700">{user.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{user.nombre} {user.apellido_paterno} {user.apellido_materno}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{user.email}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 flex justify-center items-center space-x-3">

                  <button
                      onClick={() => handleEdit(user.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>

    
                  </td>


                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

export default Users;
