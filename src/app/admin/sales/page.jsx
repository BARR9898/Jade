'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function SalesList() {
  const [sales, setSales] = useState([]);
  const router = useRouter();

  // Función para obtener las ventas
  const fetchSales = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/sales");
      const data = await response.json();
      console.log('ventas', data);
      setSales(data);
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
    }
  };

  // Llamamos a fetchSales cuando el componente se monta
  useEffect(() => {
    fetchSales();
  }, []);

  // Manejador para eliminar una venta
  const handleDelete = async (ventaId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta venta?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/sales/${ventaId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Venta eliminada exitosamente");
        fetchSales(); // Volver a cargar la lista de ventas
      } else {
        const result = await response.json();
        alert(result.message || "Ocurrió un error al eliminar la venta");
      }
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
      alert("Error al eliminar la venta.");
    }
  };

  // Manejador para editar una venta
  const handleEdit = (ventaId) => {
    console.log('handleEdit ventaid', ventaId)
    router.push(`/admin/sales/return/${ventaId}`); // Redirigir al formulario de edición de venta
  };

  // Función para redirigir a la página de creación de venta
  const handleNewSale = () => {
    router.push("/admin/sales/new"); // Redirigir a la página de crear nueva venta
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center overflow-auto px-4">
      <div className="w-full sm:w-11/12 md:w-full  bg-white border-2 shadow-lg rounded-lg p-4">
        {/* Botón para crear nueva venta */}
        <div className="w-full h-28 flex justify-center items-start mb-4">
          <button
            onClick={handleNewSale}
            className="bg-blue-900 text-white px-6 py-3 rounded mb-4"
          >
            Nueva Venta
          </button>
        </div>

        <h1 className="text-blue-900 font-bold mb-4 text-2xl text-center">Lista de Ventas</h1>
        
        {/* Tabla de Ventas */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b p-2 text-left">ID Venta</th>
                <th className="border-b p-2 text-left">Autoparte</th>
                <th className="border-b p-2 text-left">Fecha</th>
                <th className="border-b p-2 text-left">Usuario</th>
                <th className="border-b p-2 text-left">Monto</th>
                <th className="border-b p-2 text-left">Devuelta</th>
                <th className="border-b p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.length > 0 ? (
                sales.map((venta) => (
                  <tr key={venta.id}>
                    <td className="border-b p-2">{venta.id}</td>
                    <td className="border-b p-2">{venta.autoparte}</td>
                    <td className="border-b p-2">{new Date(venta.fecha).toLocaleString()}</td>
                    <td className="border-b p-2">{venta.usuario?.nombre} {venta.usuario?.apellido_paterno} {venta.usuario?.apellido_materno}</td>
                    <td className="border-b p-2">{venta.monto.toFixed(2)}</td>
                    <td className="border-b p-2">{venta.devolucion ? 'Sí' : 'No'}</td>
                    <td className="border-b p-2">
                      <button
                        onClick={() => handleEdit(venta.id)}
                        className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                      >
                        Devolver
                      </button>
                      <button
                        onClick={() => handleDelete(venta.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">No hay ventas registradas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SalesList;
