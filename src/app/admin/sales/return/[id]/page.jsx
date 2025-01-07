"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { use } from "react"; // Importa useParams()

function EditSale({ params }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [sale, setSale] = useState(null);
  const [motivoDevolucion, setMotivoDevolucion] = useState(true); // Casilla marcada por defecto

  // Usar React.use() para desempaquetar los parámetros
  const { id } = use(params);  // Desempaquetar la promesa `params`

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/sales/${id}`);
        
        // Verificar si la respuesta es exitosa (código 200)
        if (!response.ok) {
          throw new Error(`Error al obtener la venta: ${response.statusText}`);
        }

        // Intentar convertir la respuesta en JSON
        const data = await response.json();

        // Verificar si los datos tienen contenido
        if (!data) {
          throw new Error("No se recibió un objeto de venta válido.");
        }

        setSale(data);
        
        // Pre-poblar el formulario con los datos de la venta
        setValue("monto", data.monto);
        setValue("usuarioId", data.usuarioId);
        setValue("autoparte", data.autoparte);
        setValue("motivoDevolucion", true);  // Marcar "Devolver" por defecto como true
        setMotivoDevolucion(true);  // Mantener el estado como "true"
      } catch (error) {
        console.error("Error al obtener la venta:", error);
        alert("Ocurrió un error al obtener la venta.");
      }
    };

    // Llamar a la función fetchSale si el id es válido
    if (id) {
      fetchSale();
    }

  }, [id, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const monto = parseFloat(data.monto);
    if (isNaN(monto)) {
      alert("El monto no es válido.");
      return;
    }

    const usuarioId = parseInt(data.usuarioId);
    if (isNaN(usuarioId)) {
      alert("El ID del usuario no es válido.");
      return;
    }

    // Enviar la actualización al backend
    const response = await fetch(`http://localhost:3000/api/sales/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        monto,
        usuarioId,
        autoparte: data.autoparte,
        motivoDevolucion: motivoDevolucion,  // Siempre será true
        motivoDevolucionTexto: "Devolución realizada", // El texto siempre será el mismo
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Venta actualizada exitosamente");
      router.push("/admin/sales");
    } else {
      const result = await response.json();
      alert(result.message || "Ocurrió un error al actualizar la venta");
    }
  });

  if (!sale) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center overflow-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="h-100 w-1/4 md:w-2/4 bg-opacity-30 border-2 shadow-lg bg-zinc-100 rounded-lg p-2">
        <h1 className="text-blue-900 font-bold mb-4 text-2xl flex justify-center items-center">Editar Venta</h1>

        <label htmlFor="monto" className="text-blue-900 mb-2 block text-sm">Monto</label>
        <input
          className="p-3 rounded block mb-2 w-full shadow"
          type="number"
          step="0.01"
          value={sale.monto.toFixed(2)} // Mostrar el monto sin posibilidad de edición
          disabled
        />

        <label htmlFor="usuarioId" className="text-blue-900 mb-2 block text-sm">Usuario</label>
        <input
          className="p-3 rounded block mb-2 w-full shadow"
          value={users.find(user => user.id === sale.usuarioId)?.nombre || "Cargando..."} // Mostrar el nombre del usuario
          disabled
        />

        <label htmlFor="autoparte" className="text-blue-900 mb-2 block text-sm">Autoparte</label>
        <input
          className="p-3 rounded block mb-2 w-full shadow"
          value={sale.autoparte}
          disabled
        />

        <label htmlFor="motivoDevolucion" className="text-blue-900 mb-2 block text-sm">¿Devolver?</label>
        <input
          className="mr-2"
          type="checkbox"
          {...register("motivoDevolucion")}
          checked={motivoDevolucion}  // Casilla de devolución marcada por defecto
          onChange={() => setMotivoDevolucion(true)} // Siempre se mantiene en true
        />
        Sí, devolver

        {motivoDevolucion && (
          <>
            <label htmlFor="motivoDevolucionTexto" className="text-blue-900 mb-2 block text-sm mt-4">Motivo de Devolución</label>
            <textarea
              id="motivoDevolucionTexto"
              className="p-3 rounded block mb-2 w-full shadow"
              rows={4}
              {...register("motivoDevolucionTexto", { required: true })}
              defaultValue="Devolución realizada"  // El texto por defecto será "Devolución realizada"
              placeholder="Ingrese el motivo de la devolución"
            />
            {errors.motivoDevolucionTexto && <span className="text-red-500 text-sm">{errors.motivoDevolucionTexto.message}</span>}
          </>
        )}

        <button className="w-full bg-blue-900 bg-opacity-65 text-white p-3 rounded-lg mt-[60px]" type="submit">
          Actualizar Venta
        </button>
      </form>
    </div>
  );
}

export default EditSale;
