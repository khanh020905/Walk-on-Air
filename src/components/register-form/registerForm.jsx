import React, { useState } from 'react';
import {
    Eye,
    EyeOff,
    Rocket,
    Truck,
    Tag
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; 
import Footer from '../layout/footer/footer';
import { useAuth } from '../context/auth-context/authContext'; 
import { GoogleLogin } from '@react-oauth/google'; 

const RegisterForm = () => {
    const navigate = useNavigate(); 
    const { login } = useAuth(); 
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    // --- Google Login Handler ---
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await fetch('http://localhost:8080/api/user/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential })
            });

            const data = await res.json();

            if (res.ok) {
                login(data);
                setStatus({ type: 'success', message: 'Google Register/Login Successful!' });
                navigate("/");
            } else {
                throw new Error(data.message || "Google Login failed");
            }
        } catch (error) {
            console.error("Google Auth Error:", error);
            setStatus({ type: 'error', message: "Google Authentication failed" });
        }
    }

    const handleLoginFail = () => {
        setStatus({ type: 'error', message: 'Google Login Failed' })
    }
    // ---------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' })

        try {
            if (formData.confirmPassword !== formData.password) {
                throw new Error("Password and Confirm Password do not match");
            }

            const res = await fetch('http://localhost:8080/api/user/register', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                setStatus({ type: 'success', message: 'Registered successfully! Please Log In.' });
                console.log(data);

                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });

                // Optional: Redirect to login after a delay
                setTimeout(() => navigate('/login'), 1500);

            } else {
                const data = await res.json();
                setStatus({ type: 'error', message: data.message || 'Registration failed' });
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
            console.error("Registration Error: ", error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

            <div className="flex-grow flex items-center justify-center p-4 md:p-8">

                {/* Main Card Container */}
                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-6xl flex flex-col md:flex-row min-h-[750px]">

                    {/* --- Left Side: Form Section --- */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full">
                            <h1 className="text-3xl font-bold mb-2 text-gray-900">Create Account</h1>
                            <p className="text-gray-500 mb-8">Sign up to become a ShoeStore member.</p>

                            {/* Display Status Messages */}
                            {status.message && (
                                <div className={`p-4 mb-4 rounded-xl text-sm font-medium ${status.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                    }`}>
                                    {status.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                                    <input
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        value={formData.username}
                                        required
                                        type="text"
                                        placeholder="Enter your Username"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition placeholder-gray-400"
                                    />
                                </div>

                                {/* Email Address */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        value={formData.email}
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition placeholder-gray-400"
                                    />
                                </div>

                                {/* Password Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Password Field */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                        <div className="relative">
                                            <input
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                                value={formData.password}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create password"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition placeholder-gray-400"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm</label>
                                        <input
                                            required
                                            type="password"
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            value={formData.confirmPassword}
                                            placeholder="Confirm password"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Checkbox */}
                                <div className="flex items-start gap-3 mt-4">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terms"
                                            type="checkbox"
                                            className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </div>
                                    <label htmlFor="terms" className="text-sm text-gray-600 select-none">
                                        I agree to the <a href="#" className="text-blue-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 font-semibold hover:underline">Privacy Policy</a>.
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-600/30 mt-2">
                                    Create Account
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-400 font-medium">Or register with</span>
                                </div>
                            </div>

                            {/* Social Buttons - REPLACED WITH GOOGLE LOGIN */}
                            <div className="w-full">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleLoginFail}
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                />
                            </div>

                            <p className="text-center mt-8 text-gray-500">
                                Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
                            </p>
                        </div>
                    </div>

                    {/* --- Right Side: Visual Banner (Unchanged) --- */}
                    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#740000] to-[#2b0000] relative p-12 flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 -mr-20 -mt-20"></div>
                        <div className="relative z-10">
                            <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold tracking-widest text-white uppercase mb-6">
                                New Season
                            </span>
                        </div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] w-[110%] z-0 pointer-events-none">
                            <img
                                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
                                alt="Red Nike Shoe"
                                className="w-full drop-shadow-2xl -rotate-[20deg] scale-110 object-cover rounded-3xl"
                            />
                        </div>
                        <div className="relative z-10 mt-auto">
                            <h2 className="text-5xl font-extrabold text-white leading-tight mb-8">
                                Unlock Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                                    Full Potential
                                </span>
                            </h2>
                            <div className="space-y-6 mb-12">
                                <FeatureItem icon={<Rocket className="text-blue-300" size={24} />} title="Priority Access" desc="Be the first to cop limited drops." />
                                <FeatureItem icon={<Truck className="text-blue-300" size={24} />} title="Free Express Shipping" desc="On all orders over $150." />
                                <FeatureItem icon={<Tag className="text-blue-300" size={24} />} title="Member Rewards" desc="Earn points on every purchase." />
                            </div>
                            <div className="flex items-center gap-4 pt-8 border-t border-white/10">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <img key={i} className="w-10 h-10 rounded-full border-2 border-[#4a0000]" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    ))}
                                </div>
                                <div className="text-white text-sm">
                                    Join <span className="text-white font-bold">150k+ Sneakerheads</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// Helper Component for Features
const FeatureItem = ({ icon, title, desc }) => (
    <div className="flex items-start gap-4 group">
        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition">
            {icon}
        </div>
        <div>
            <h3 className="text-white font-bold text-lg">{title}</h3>
            <p className="text-white/90 text-sm font-medium">{desc}</p>
        </div>
    </div>
);

export default RegisterForm;