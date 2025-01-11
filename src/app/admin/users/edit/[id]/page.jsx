"use client"; // Asegúrate de marcar el componente como cliente

import { useRouter } from "next/navigation"; // Usar 'next/navigation' para redirección
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import React from "react";

// Usamos 'React.use()' para obtener 'params' correctamente
function EditUser({ params }) {
  const { id } = React.use(params); // Desempaquetamos 'params' usando React.use()
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  console.log('params:', params); // Verifica que los params estén correctos
  console.log('id:', id); // Verifica que 'id' se esté obteniendo correctamente
  
  useEffect(() => {
    console.log('use effect id', id);

    if (id) {
      // Realiza la solicitud para obtener los datos del usuario por 'id'
      fetch(`/api/users/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
          // Poblamos los campos con los valores actuales del usuario
          setValue("nombre", data.user.nombre); 
          setValue("apellido_paterno", data.user.apellido_paterno);
          setValue("apellido_materno", data.user.apellido_materno);
          setValue("email", data.user.email); 
        })
        .catch((error) => {
          console.error("Error al obtener los datos del usuario:", error);
        });
    }
  }, [id]);

  const onSubmit = (data) => {
    console.log('onSubmit data', data);
    
    // Enviar los cambios al backend
    fetch(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre: data.nombre,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        email: data.email,
        password: data.password, // Se incluiría la nueva contraseña si se actualiza
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        router.push("/admin/users"); // Redirige al listado de usuarios
      } else {
        console.log("Error al actualizar el usuario");
      }
    });
  };

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center mt-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-full w-1/4 md:w-2/4 bg-opacity-30 border-2 shadow-lg bg-zinc-100 rounded-lg p-2"
      >
        <h1 className="text-blue-900 font-bold mb-4 text-2xl flex justify-center items-center">
          Editar Usuario
        </h1>

        {/* Campo para Nombre */}
        <label htmlFor="nombre" className="text-blue-900 mb-2 block text-sm">Nombre</label>
        <input
          className="p-3 rounded block mb-2 w-full shadow"
          type="text"
          {...register("nombre", { required: { value: true, message: "El nombre es requerido" } })}
          placeholder="Nombre"
        />
        {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre.message}</span>}

        {/* Campo para Apellido Paterno */}
        <label htmlFor="apellido_paterno" className="text-blue-900 mb-2 block text-sm">Apellido Paterno</label>
        <input
          className="p-3 rounded block mb-2 w-full shadow"
          type="text"
          {...register("apellido_paterno", { required: { value: true, message: "El apellido paterno es requerido" } })}
          placeholder="Apellido Paterno"
        />
        {errors.apellido_paterno && <span className="text-red-500 text-sm">{errors.apellido_paterno.message}</span>}

        {/* Campo para Apellido Materno */}
        <label htmlFor="apellido_materno" className="text-blue-900 mb-2 block text-sm">Apellido Materno</label>
        <input
          className="p-3 rounded block mb-2 w-full shadow"
          type="text"
          {...register("apellido_materno", { required: { value: true, message: "El apellido materno es requerido" } })}
          placeholder="Apellido Materno"
        />
        {errors.apellido_materno && <span className="text-red-500 text-sm">{errors.apellido_materno.message}</span>}

        {/* Campo para Correo Electrónico */}
        <label htmlFor="email" className="text-blue-900 mb-2 block text-sm">Correo Electrónico</label>
        <input
          className="p-3 rounded block mb-2 w-full shadow"
          type="email"
          {...register("email", { required: { value: true, message: "El correo electrónico es requerido" } })}
          placeholder="Email"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

        {/* Campo para Contraseña */}
        <label htmlFor="password" className="text-blue-900 mb-2 block text-sm">Contraseña</label>
        <input
          className="p-3 rounded block mb-2 w-full shadow"
          type="password"
          {...register("password")}
          placeholder="Nueva Contraseña (opcional)"
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

        {/* Botón de Enviar */}
        <button
          className="w-full bg-blue-900 bg-opacity-65 text-white p-3 rounded-lg mt-[60px]"
          type="submit"
        >
          Actualizar
        </button>
      </form>
    </div>
  );
}

export default EditUser;
