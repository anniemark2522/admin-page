'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const doLogin = () => {
        // ตรวจสอบอีเมลและรหัส
        if (email === "admin" && password === "muaythaigyms") {
            router.push("/");
        } else {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden bg-red-900">
            <div className="w-full m-auto sm:max-w-lg px-4">
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Sign in</CardTitle>
                        <CardDescription className="text-center">
                            Enter your email and password to login
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className="text-red-900 text-sm text-center">{error}</p>}
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button className="w-full" type="button" onClick={doLogin}>Login</Button>
                        <p className="mt-2 text-xs text-center text-gray-700">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-blue-600 hover:underline">Sign up</Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
