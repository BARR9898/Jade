import prisma from "../../../../libs/prisma";  // Asumimos que usas Prisma ORM para manejar la base de datos
import { NextResponse } from "next/server";

// Maneja las solicitudes GET para obtener la venta por ID
export async function GET(req, { params }) {
  const { id } = await params;  // Esperar `params` antes de usar el `id`

  try {
    // Buscar la venta por su ID
    const sale = await prisma.venta.findUnique({
      where: { id: parseInt(id) },  // Convertir `id` a número
    });

    if (!sale) {
      return NextResponse.json({ message: "Venta no encontrada" }, { status: 404 });
    }

    return NextResponse.json(sale);
  } catch (error) {
    return NextResponse.json({ message: "Error al obtener la venta" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;  // Esperar `params` antes de usar el `id`

  console.log('id sale to update', id);

  try {
    // Obtener los datos del cuerpo de la solicitud
    const data = await req.json();  // Usar await para esperar la respuesta

    const { monto, usuarioId, autoparte, motivoDevolucion, motivoDevolucionTexto } = data;

    console.log('data sale to update', data);

    // Validar los campos (opcional)
    if (!motivoDevolucionTexto) {
      return NextResponse.json({ message: "Motivo de devolución es requerido" }, { status: 400 });
    }

    // Actualizar la venta en la base de datos
    const updatedSale = await prisma.venta.update({
      where: { id: parseInt(id) },  // Convertir `id` a número
      data: {
        monto,
        usuarioId,
        autoparte,
        motivoDevolucion: motivoDevolucionTexto || "Devolución realizada",  // Si no hay texto, poner valor por defecto
        devolucion: motivoDevolucion,  // Asegurarse de que este campo esté correctamente incluido
      },
    });

    console.log('updated sale data', updatedSale);

    return NextResponse.json(updatedSale);  // Asegúrate de devolver un JSON válido con la venta actualizada
  } catch (error) {
    console.error("Error al actualizar la venta:", error);  // Imprimir el error para depuración
    return NextResponse.json({ message: "Error al actualizar la venta: " + error.message }, { status: 500 });
  }
}

// Maneja las solicitudes DELETE para eliminar una venta
export async function DELETE(req, { params }) {
  const { id } = await params;  // Esperar `params` antes de usar el `id`

  try {
    // Eliminar la venta de la base de datos
    const deletedSale = await prisma.venta.delete({
      where: { id: parseInt(id) },  // Convertir `id` a número
    });

    if (!deletedSale) {
      return NextResponse.json({ message: "Venta no encontrada" }, { status: 404 });
    }

    console.log('deleted sale data', deletedSale);

    return NextResponse.json({ message: "Venta eliminada exitosamente", deletedSale });  // Devolver el resultado de la venta eliminada
  } catch (error) {
    console.error("Error al eliminar la venta:", error);  // Imprimir el error para depuración
    return NextResponse.json({ message: "Error al eliminar la venta: " + error.message }, { status: 500 });
  }
}
