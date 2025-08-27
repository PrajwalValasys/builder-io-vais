import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import { loginValidation } from "../utils/validations";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, linkedinLogin } from "../store/slices/authSlice";
import { RootState, AppDispatch } from "../store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Brain } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Redux state
  const { isLoading, isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  
  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const initialValues = {
    username: "",
    password: "",
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle LinkedIn OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (code) {
      dispatch(linkedinLogin(code)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          navigate("/");
        }
      });
    }
  }, [location.search, dispatch, navigate]);

  // Redirect if already logged in and active
  useEffect(() => {
    if (isLoggedIn && user?.is_active) {
      navigate("/");
    }
  }, [isLoggedIn, user, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (values: { username: string; password: string }) => {
    const result = await dispatch(loginUser(values));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate("/");
    }
  };

  // LinkedIn OAuth configuration
  const clientId = import.meta.env.VITE_CLIENT_ID || process.env.REACT_APP_CLIENT_ID;
  const redirectUri = `${window.location.origin}/login`;
  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid,profile,email`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-valasys-gray-50 via-white to-valasys-orange/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background AI Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className={`absolute w-3 h-3 bg-valasys-orange/30 rounded-full animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${index * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="border-valasys-gray-200 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-valasys-orange rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">VAIS</span>
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold text-valasys-gray-900">
                Login
              </CardTitle>
              <p className="text-valasys-gray-600 text-sm mt-2">
                Elevate your business insights with precision. Log in to
                discover and refine your Ideal Customer Profiles effortlessly.
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Formik
              initialValues={initialValues}
              validationSchema={loginValidation}
              onSubmit={onSubmit}
            >
              {({
                values,
                handleChange,
                handleBlur,
                isValid,
                touched,
                errors,
              }) => (
                <Form className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-valasys-gray-700 flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>Email <span className="text-red-500">*</span></span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-valasys-gray-400" />
                      <Input
                        id="username"
                        name="username"
                        type="email"
                        placeholder="Enter your email"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="pl-10 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20"
                      />
                    </div>
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-valasys-gray-700 flex items-center space-x-1">
                      <Lock className="h-3 w-3" />
                      <span>Password <span className="text-red-500">*</span></span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-valasys-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="pl-10 pr-10 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 h-4 w-4 text-valasys-gray-400 hover:text-valasys-orange transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-valasys-orange hover:text-valasys-orange-light transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    ref={buttonRef}
                    disabled={!isValid || isLoading}
                    className="w-full bg-valasys-orange hover:bg-valasys-orange-light text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-102"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Login to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {/* Optional: LinkedIn Login - commented out but available */}
                  {/* 
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-valasys-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-valasys-gray-500">Or</span>
                    </div>
                  </div>

                  {clientId && (
                    <a
                      href={linkedinAuthUrl}
                      className="w-full inline-flex items-center justify-center px-4 py-3 border border-valasys-gray-300 rounded-lg text-sm font-medium text-valasys-gray-700 bg-white hover:bg-valasys-gray-50 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="#0077B5">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      Sign In with LinkedIn
                    </a>
                  )}
                  */}
                </Form>
              )}
            </Formik>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-valasys-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/sign-up-email"
                  className="font-medium text-valasys-orange hover:text-valasys-orange-light transition-colors"
                >
                  Start My Free Trial
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
