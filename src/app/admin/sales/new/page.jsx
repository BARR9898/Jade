"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

function RegisterSale() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [users, setUsers] = useState([]); // Inicializamos el estado de los usuarios

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users"); // Cambia la URL si es necesario
        const data = await response.json();
        setUsers(data); // Suponiendo que 'data' es un array de usuarios
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    fetchUsers();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // Función para manejar el envío del formulario
  const onSubmit = handleSubmit(async (data) => {
    // Convertir el monto a float
    const monto = parseFloat(data.monto);
    if (isNaN(monto)) {
      alert("El monto no es válido.");
      return;
    }

    // Convertir usuarioId a entero (int)
    const usuarioId = parseInt(data.usuarioId);
    if (isNaN(usuarioId)) {
      alert("El ID del usuario no es válido.");
      return;
    }

    // Enviar los datos al backend
    const response = await fetch("http://localhost:3000/api/sales", {
      method: "POST",
      body: JSON.stringify({
        monto,         // Enviamos el monto como float
        usuarioId,     // Enviamos el usuarioId como int
        autoparte: data.autoparte,  // Campo autoparte
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Venta registrada exitosamente");
      router.push("/admin/sales");
    } else {
      const result = await response.json();
      alert(result.message || "Ocurrió un error al registrar la venta");
    }
  });

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center overflow-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="h-100 w-1/4 md:w-2/4 bg-opacity-30 border-2 shadow-lg bg-zinc-100 rounded-lg p-2">
        <section className="w-full h-8">
          <h1 className="text-blue-900 font-bold mb-4 text-2xl flex justify-center items-center">Registrar Venta</h1>
        </section>

        {/* Campo para Monto */}
        <label htmlFor="monto" className="text-blue-900 mb-2 block text-sm">Monto</label>
        <input
          className="p-3 rounded block mb-2 w-full shadow"
          type="number"
          step="0.01"  // Permite decimales
          {...register("monto", { required: { value: true, message: "El monto es requerido" } })}
          placeholder="Monto"
        />
        {errors.monto && <span className="text-red-500 text-sm">{errors.monto.message}</span>}

        {/* Campo para Usuario (ID del Usuario) */}
        <label htmlFor="usuarioId" className="text-blue-900 mb-2 block text-sm">Usuario</label>
        <select
          className="p-3 rounded block mb-2 w-full shadow"
          {...register("usuarioId", { required: { value: true, message: "El usuario es requerido" } })}
        >
          <option value="">Selecciona un usuario</option>
          {/* Solo mostramos los usuarios si 'users' tiene datos */}
          {users.length > 0 ? (
            users.map(user => (
              <option key={user.id} value={user.id}>{user.nombre}</option>
            ))
          ) : (
            <option value="" disabled>Cargando usuarios...</option>
          )}
        </select>
        {errors.usuarioId && <span className="text-red-500 text-sm">{errors.usuarioId.message}</span>}

        {/* Campo para Autoparte */}
        <label htmlFor="autoparte" className="text-blue-900 mb-2 block text-sm">Autoparte</label>
        <input
          className="p-3 rounded block mb-2 w-full shadow"
          type="text"
          {...register("autoparte", { required: { value: true, message: "La autoparte es requerida" } })}
          placeholder="Autoparte"
        />
        {errors.autoparte && <span className="text-red-500 text-sm">{errors.autoparte.message}</span>}

        {/* Botón de Enviar */}
        <button className="w-full bg-blue-900 bg-opacity-65 text-white p-3 rounded-lg mt-[60px]" type="submit">
          Registrar Venta
        </button>
      </form>
    </div>
  );
}

export default RegisterSale;
