import { NextResponse } from "next/server";
import prisma from "../../../../libs/prisma"
import bcrypt from 'bcryptjs';


// Método PUT para actualizar usuario
export async function PUT(request, { params }) {
    // Asegúrate de que `params` esté resuelto antes de usarlo
    const { id } = await params;  // Esto es lo que necesitas para "esperar" a que `params` esté disponible
    const data = await request.json();  // Obtener los datos del cuerpo de la solicitud

    console.log('update user data', data);

    // Valida los campos requeridos
    if (!data.nombre || !data.apellido_paterno || !data.apellido_materno || !data.email) {
        return new NextResponse(
            JSON.stringify({ message: "Todos los campos son obligatorios" }),
            { status: 400 }
        );
    }

    let updateData = {
        nombre: data.nombre, // Actualizamos el nombre
        apellido_paterno: data.apellido_paterno, // Actualizamos el apellido paterno
        apellido_materno: data.apellido_materno, // Actualizamos el apellido materno
        email: data.email, // Actualizamos el email
    };

    try {
        // Si se proporciona una nueva contraseña, encriptarla
        if (data.password) {
            if (data.password.length < 6) {
                return new NextResponse(
                    JSON.stringify({ message: "La contraseña debe tener al menos 6 caracteres" }),
                    { status: 400 }
                );
            }
            const hashedPassword = await bcrypt.hash(data.password, 10); // Hash de la contraseña
            updateData.password = hashedPassword; // Asignamos la contraseña encriptada
        }

        // Actualizar el usuario con el ID correspondiente
        const updatedUser = await prisma.usuario.update({
            where: { id: parseInt(id) }, // Buscamos al usuario por ID
            data: updateData, // Pasamos los datos a actualizar
        });

        // Retornamos una respuesta exitosa
        return new NextResponse(
            JSON.stringify({
                message: "Usuario actualizado correctamente",
                updatedUser,
            }),
            { status: 200 } // Código de éxito
        );
    } catch (error) {
        console.error(error);
        return new NextResponse(
            JSON.stringify({ message: "No se pudo actualizar el usuario", error: error.message }),
            { status: 500 } // Código de error
        );
    }
}


export async function DELETE(request, { params }) {
    const { id } = params; // Obtener el ID del usuario desde los parámetros de la URL

    console.log('params id',id);
    
    try {
        // Intentar eliminar el usuario con el ID proporcionado
        const deletedUser = await prisma.usuario.delete({
            where: { id: parseInt(id) }, // Asegúrate de que el ID sea un número
        });

        return new NextResponse(
            JSON.stringify({
                message: 'Usuario eliminado correctamente',
                deletedUser,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return new NextResponse(
            JSON.stringify({ message: 'No se pudo eliminar al usuario', error: error.message }),
            { status: 500 }
        );
    }
}


// GET: Obtener un usuario por ID
export async function GET(request, { params }) {
    // Await params para asegurarnos de que esté resuelto
    const { id } = await params; // Ahora se espera la resolución de params
    
    try {
        // Obtener el usuario desde la base de datos
        const user = await prisma.usuario.findUnique({
            where: { id: parseInt(id) }, // Buscamos el usuario por ID
        });

        // Si el usuario no existe, retornar un error 404
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "Usuario no encontrado" }),
                { status: 404 }
            );
        }

        // Retornar el usuario encontrado
        return new NextResponse(
            JSON.stringify({ user }), // Respuesta con el usuario encontrado
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return new NextResponse(
            JSON.stringify({ message: "Error al obtener el usuario", error: error.message }),
            { status: 500 } // Código de error del servidor
        );
    }
}

