"use client";

import Image from 'next/image';
import { Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "sonner"
import loginAccount from '@/lib/loginAccount';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
    const [hidePassword, sethidePassword] = useState(true);
    const router = useRouter();
    const { login } = useAuth();

    const submitForm = async (formData: FormData) => {
      try {
            const data = Object.fromEntries(formData.entries());
            const res = await loginAccount({
                email: data.email as string,
                password: data.password as string,
            });
            login(res);
            toast.success("Connexion réussie");
            router.push("/admin");
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Une erreur inconnue s'est produite";
            toast("Erreur lors de la connexion", {
                description: message,
            });
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-gray-100">

            <Image
                src="/logPicture.png"
                alt="Arrière-plan Tili"
                fill
                className="object-cover blur-md scale-105"
                priority
            />



            <div className="absolute inset-0 flex items-center justify-center z-10 p-4">

                <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl w-full max-w-[420px]">
                    <div className="text-center mb-8 flex flex-col items-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        submitForm(formData);
                    }}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                name='email'
                                placeholder="Email"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 outline-none transition-all text-sm text-gray-800" 
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={hidePassword ? "password" : "text"}
                                    name='password'
                                    placeholder="Mot de passe"
                                    className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 outline-none transition-all text-sm text-gray-800" 
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors">
                                    <button type="button" onClick={() => sethidePassword(!hidePassword)} className="">
                                        {hidePassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all">
                                    Mot de passe oublié ?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#1e1e24] text-white py-3 px-4 rounded-xl hover:bg-black transition-colors font-medium text-sm mt-4 shadow-md"
                        >
                            Se connecter
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Vous n'avez pas de compte ? <Link href="/register" className="text-[#1e1e24] hover:underline">S'inscrire</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
