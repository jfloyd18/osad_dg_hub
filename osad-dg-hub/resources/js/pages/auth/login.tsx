import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
                <div className="flex w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-xl">
                    {/* Left Column: Logo and Title */}
                    <div className="hidden w-1/2 flex-col items-center justify-center bg-white p-10 md:flex">
                        <img
                            src="/path/to/your/uic-logo.png" // Replace with the correct path to your logo
                            alt="University of the Immaculate Conception Logo"
                            className="h-48 w-48 object-contain"
                        />
                        <h1 className="mt-8 text-center text-xl font-bold text-gray-800">OSAD Digital Hub</h1>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Empowering Student Organizations Through Digital Compliance
                        </p>
                    </div>

                    {/* Right Column: Login Form */}
                    <div className="w-full p-8 md:w-1/2 md:p-16">
                        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="mt-2 text-gray-600">
                            Log in to manage activities, submissions, and compliance.
                        </p>
                        {status && (
                            <div className="mt-4 text-center text-sm font-medium text-green-600">{status}</div>
                        )}

                        <form className="mt-8 space-y-6" onSubmit={submit}>
                            {/* Email Input Field */}
                            <div>
                                <Label htmlFor="email" className="font-semibold text-gray-700">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="e.g., yourname@uic.edu.ph"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 placeholder-gray-400
                                               text-gray-900
                                               transition-all duration-300 ease-in-out
                                               focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password Input Field */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="font-semibold text-gray-700">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink href={route('password.request')} className="text-sm text-pink-600 hover:underline">
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 placeholder-gray-400
                                               text-gray-900
                                               transition-all duration-300 ease-in-out
                                               focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Remember me checkbox and login button container */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onClick={() => setData('remember', !data.remember)}
                                        className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                    />
                                    <Label htmlFor="remember" className="text-sm font-medium text-gray-700">
                                        Remember me
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="flex w-full items-center justify-center rounded-md bg-pink-600 py-2 text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    LOGIN
                                </Button>
                            </div>

                            {/* "Don't have an account?" link */}
                            <div className="mt-6 text-center text-sm text-gray-500">
                                Don't have an account?{' '}
                                <TextLink href={route('register')} className="text-pink-600 hover:underline">
                                    Register
                                </TextLink>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}