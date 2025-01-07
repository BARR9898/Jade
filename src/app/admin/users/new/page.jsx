"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  // Función para manejar el envío del formulario
  const onSubmit = handleSubmit(async (data) => {
    // Verificar si las contraseñas coinciden
    if (data.password !== data.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log("Datos para guardar en la base de datos:", data); // Verificar los datos

    // Enviar los datos al backend
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        nombre: data.nombre,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verificar la respuesta del backend
    if (response.ok) {
      alert("Usuario registrado exitosamente");
      router.push("/admin/users"); // Redirigir a la página de usuarios después de registrar
    } else {
      const result = await response.json();
      alert(result.message || "Ocurrió un error al registrar el usuario");
    }
  });

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center overflow-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="h-100 w-1/4 md:w-2/4 bg-opacity-30 border-2 shadow-lg bg-zinc-100 rounded-lg p-2">
        <section className="w-full h-8">
          <h1 className="text-blue-900 font-bold mb-4 text-2xl flex justify-center items-center">Nuevo Usuario</h1>
        </section>

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
          {...register("password", { required: { value: true, message: "La contraseña es requerida" } })}
          placeholder="Contraseña"
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

        {/* Campo para Confirmar Contraseña */}
        <label htmlFor="confirmPassword" className="text-blue-900 mb-2 block text-sm">Confirmar Contraseña</label>
        <input
          className="p-3 rounded block mb-2 w-full shadow"
          type="password"
          {...register("confirmPassword", { required: { value: true, message: "Confirmar contraseña es requerido" } })}
          placeholder="Confirmar Contraseña"
        />
        {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}

        {/* Botón de Enviar */}
        <button className="w-full bg-blue-900 bg-opacity-65 text-white p-3 rounded-lg mt-[60px]" type="submit">
          Registrar
        </button>
      </form>
    </div>
  );
}

export default Register;
