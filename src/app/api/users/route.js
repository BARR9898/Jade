import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../libs/prisma"; // Verifica que la ruta sea correcta

export async function POST(request) {
    try {
        // Obtener los datos del body de la solicitud
        const data = await request.json();
        console.log("Data received:", data); // Verifica los datos que vienen del frontend

        // Validar los campos de entrada
        if (!data.email || !data.password || !data.nombre || !data.apellido_paterno || !data.apellido_materno) {
            return new NextResponse(
                JSON.stringify({ message: "Faltan campos requeridos" }),
                { status: 400 }
            );
        }

        // Verificar si el usuario ya existe en la base de datos
        const userFound = await prisma.usuario.findUnique({
            where: {
                email: data.email, // Buscamos el usuario por correo
            },
        });

        if (userFound) {
            return new NextResponse(
                JSON.stringify({ message: "Usuario ya existe" }),
                { status: 400 }
            );
        }

        // Encriptar la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Crear un nuevo usuario en la base de datos
        const newUser = await prisma.usuario.create({
            data: {
                email: data.email,
                nombre: data.nombre,
                apellido_paterno: data.apellido_paterno,
                apellido_materno: data.apellido_materno,
                password: hashedPassword, // Almacenamos la contraseña encriptada
            },
        });

        // Excluir el campo de la contraseña para la respuesta
        const { password: _, ...user } = newUser;

        // Retornar respuesta exitosa
        return new NextResponse(
            JSON.stringify({
                message: "Registro exitoso",
                newUser: user, // Devolvemos los datos del usuario sin la contraseña
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Error al crear usuario:', error); // Para ver más detalles en caso de error
        return new NextResponse(
            JSON.stringify({ message: error.message || "Ocurrió un error en el servidor" }),
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // Obtiene todos los usuarios desde la base de datos
        const users = await prisma.usuario.findMany();
        console.log("API GET users:", users);

        // Retorna los usuarios en formato JSON
        return NextResponse.json(users);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
