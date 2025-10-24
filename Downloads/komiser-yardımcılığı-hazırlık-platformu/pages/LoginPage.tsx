
import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import { MailIcon, LockClosedIcon } from '../components/Icons';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic validation for demonstration
        if (!email || !password) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }

        // Simulate a successful login
        console.log('Logging in with:', { email, password });
        onLoginSuccess();
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-lg rounded-xl shadow-2xl p-8 space-y-8 border border-gray-700">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">
                        <span className="text-indigo-400">Pro</span>Sınav'a Hoş Geldiniz
                    </h1>
                    <p className="mt-2 text-gray-400">Hesabınıza giriş yaparak öğrenmeye başlayın.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MailIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                            placeholder="E-posta adresiniz"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                            placeholder="Şifreniz"
                        />
                    </div>
                    
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-500 rounded bg-gray-700" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">Beni Hatırla</label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300">Şifremi Unuttum?</a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors"
                        >
                            Giriş Yap
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-400">
                    Hesabın yok mu?{' '}
                    <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300">
                        Kayıt Ol
                    </a>
                </p>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
