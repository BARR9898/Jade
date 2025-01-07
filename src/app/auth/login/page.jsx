'use client';

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Login() {
   const { register, handleSubmit, formState: { errors } } = useForm();
   const router = useRouter();
   const [error, setError] = useState(null);

   const onSubmit = handleSubmit(async (data) => {
      console.log('auth login data', data);
      const res = await signIn('credentials', {
         email: data.email,
         password: data.password,
         redirect: false
      });

      console.log('login next auth response', res);

      if (!res.ok) {
         setError(res.error);
      } else {
         router.push('/admin/sales');
      }

      console.log('login next auth response', res);
   });

   return (
      <div className="h-[calc(100vh-7rem)] flex justify-center items-center p-4">
         <form className="w-full max-w-md bg-zinc-100 border-2 shadow-md rounded p-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
               <p className="bg-red-500 text-sm text-white p-3 rounded mb-4">
                  {error}
               </p>
            )}
            <h1 className="w-full flex justify-center my-2 font-bold mb-6 text-xl text-blue-900">Login</h1>

            {/* Email Field */}
            <label htmlFor="email" className="mb-2 block text-lg font-semibold text-blue-900">Correo</label>
            <input
               className="p-3 rounded block mb-4 border-2 border-blue-100 w-full"
               type="email"
               {...register("email", { required: { value: true, message: "Email is required" } })}
               placeholder="Email"
            />
            {errors.email && (
               <span className="text-red-500 text-sm mb-1">
                  {errors.email.message}
               </span>
            )}

            {/* Password Field */}
            <label htmlFor="password" className="text-blue-800 mb-2 block font-bold text-sm">Contraseña</label>
            <input
               className="p-3 rounded block mb-4 border-blue-100 w-full"
               type="password"
               {...register("password", { required: { value: true, message: "Password is required" } })}
               placeholder="******"
            />
            {errors.password && (
               <span className="text-red-500 text-sm">
                  {errors.password.message}
               </span>
            )}

            {/* Submit Button */}
            <section className="w-full h-auto flex items-center justify-center">
               <button className="mt-4 w-full bg-blue-900 bg-opacity-55 text-white font-bold p-3 rounded-lg shadow-md hover:bg-blue-700 transition-all" type="submit">
                  Login
               </button>
            </section>
         </form>
      </div>
   );
}

export default Login;
