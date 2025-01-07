import { NextResponse } from 'next/server';
import prisma from "../../../../libs/prisma"

export async function GET() {
    try {
      const ventas = await prisma.venta.findMany({
        include: {
          usuario: true, // Incluir los datos del usuario relacionado con la venta
        },
        where:{
          devolucion: true
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
  