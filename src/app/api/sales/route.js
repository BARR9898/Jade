import { NextResponse } from 'next/server';
import prisma from "../../../libs/prisma"

export async function GET() {
  try {
    const ventas = await prisma.venta.findMany({
      include: {
        usuario: true, // Incluir los datos del usuario relacionado con la venta
      },
      where:{
        devolucion: false
      }
    });

    return NextResponse.json(ventas);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener las ventas: " + error.message },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    // Verificamos que el cuerpo no esté vacío
    const data = await request.json();

    // Si no recibimos datos en el cuerpo de la solicitud
    if (!data) {
      return NextResponse.json(
        { message: "No se recibieron datos." },
        { status: 400 }
      );
    }

    const { monto, usuarioId, autoparte } = data;

    // Validar los datos recibidos
    if (!monto || monto <= 0) {
      return NextResponse.json(
        { message: "El monto es requerido y debe ser positivo." },
        { status: 400 }
      );
    }

    if (!usuarioId) {
      return NextResponse.json(
        { message: "El ID del usuario es requerido." },
        { status: 400 }
      );
    }

    if (!autoparte || !autoparte.trim()) {
      return NextResponse.json(
        { message: "La autoparte es requerida." },
        { status: 400 }
      );
    }

    // Guardar la venta en la base de datos usando Prisma
    const venta = await prisma.venta.create({
      data: {
        monto,
        usuarioId,
        autoparte, // Guardamos la autoparte
      },
    });

    return NextResponse.json(venta);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al crear la venta: " + error.message },
      { status: 500 }
    );
  }
}
