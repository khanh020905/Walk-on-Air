import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, Lock, CheckCircle } from 'lucide-react';
import Footer from "../../layout/footer/footer";

const ForgotPasswordForm = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    // CHANGED: State variable is 'mail'
    const [mail, setMail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Handlers ---

    // Step 1: Send Email
    const handleSendEmail = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setIsSubmitting(true);

        try {
            // FIX: Use 'mail' variable here
            const url = `http://localhost:8080/api/user/forgot-password?email=${encodeURIComponent(mail)}`;

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const text = await res.text();

            if (res.ok) {
                setStatus({ type: 'success', message: 'OTP sent to your email.' });
                setTimeout(() => {
                    setStep(2);
                    setStatus({ type: '', message: '' });
                }, 1000);
            } else {
                setStatus({ type: 'error', message: text || 'Failed to send OTP.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to connect to server.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Step 2: Input OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (otp.length !== 6) {
            setStatus({ type: 'error', message: 'OTP must be 6 digits.' });
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/user/verify-otp', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    mail: mail, // FIX: Use 'mail' variable (Matches backend DTO 'mail' field)
                    otp: otp
                })
            })

            if (res.ok) {
                const data = await res.json();
                setTimeout(() => {
                    setStep(3);
                    setStatus({ type: 'success', message: 'Code Verified!' });
                }, 1000);
            } else {
                setStatus({ type: 'error', message: 'Invalid or expired OTP.' })
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Error verifying code' });
        }
    };

    // Step 3: Reset Password 
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('http://localhost:8080/api/user/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: mail, // FIX: Map 'mail' state to 'email' key (Backend PasswordReset DTO likely expects 'email')
                    otp: otp,
                    newPassword: password
                })
            });

            const data = await res.json();

            if (res.ok && data.code === 1000) {
                setStatus({ type: 'success', message: 'Password reset successful!' });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setStatus({ type: 'error', message: data.message || 'Failed to reset password.' });

                if (data.message && data.message.toLowerCase().includes('otp')) {
                    setTimeout(() => setStep(2), 2000);
                }
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Something went wrong.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render Helpers ---

    const renderStep1_Email = () => (
        <form onSubmit={handleSendEmail} className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                    <Mail size={32} />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Forgot Password?</h1>
                <p className="text-gray-500">Enter your email to receive a reset code.</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Mail size={20} /></div>
                    <input
                        type="email"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition text-gray-900 font-medium"
                        placeholder="Enter your email"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition transform active:scale-[0.98] shadow-lg shadow-blue-600/30 flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {isSubmitting ? 'Sending...' : 'Send Reset Code'}
            </button>
        </form>
    );

    const renderStep2_Otp = () => (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-6">
                    <KeyRound size={32} />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Enter OTP</h1>
                {/* FIX: Use 'mail' variable here */}
                <p className="text-gray-500">We sent a 6-digit code to <span className="font-semibold text-gray-700">{mail}</span></p>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">One-Time Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><KeyRound size={20} /></div>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition text-gray-900 font-medium tracking-widest text-center text-lg"
                        placeholder="123456"
                        maxLength={6}
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition transform active:scale-[0.98] shadow-lg shadow-purple-600/30 flex items-center justify-center"
            >
                Next Step
            </button>

            <div className="text-center mt-4">
                <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-800 font-medium">
                    Change Email for
                </button>
            </div>
        </form>
    );

    const renderStep3_Reset = () => (
        <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                    <Lock size={32} />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Reset Password</h1>
                <p className="text-gray-500">Enter your new password below.</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Lock size={20} /></div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition text-gray-900 font-medium"
                        placeholder="••••••••"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Lock size={20} /></div>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition text-gray-900 font-medium"
                        placeholder="••••••••"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition transform active:scale-[0.98] shadow-lg shadow-green-600/30 flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {isSubmitting ? 'Resetting...' : 'Set New Password'}
            </button>
        </form>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <div className="flex-grow flex items-center justify-center p-4 md:p-8">
                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-xl p-8 md:p-12 relative transition-all duration-300">

                    <button onClick={() => navigate('/login')} className="absolute top-8 left-8 text-gray-400 hover:text-gray-900 transition mb-6 flex items-center gap-2">
                        <ArrowLeft size={20} /> Back to Login
                    </button>

                    <div className="mt-8">
                        {status.message && (
                            <div className={`p-4 mb-6 rounded-xl text-sm font-medium flex items-center gap-2 animate-pulse ${status.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                }`}>
                                {status.message}
                            </div>
                        )}

                        {step === 1 && renderStep1_Email()}
                        {step === 2 && renderStep2_Otp()}
                        {step === 3 && renderStep3_Reset()}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPasswordForm;