import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    isLoading?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading,
    size = 'md',
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-tight transition-all duration-300 rounded-xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 overflow-hidden active:scale-[0.98]";

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-7 py-3 text-sm",
        lg: "px-10 py-4 text-lg"
    };

    const variants = {
        primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_-2px_rgba(37,99,235,0.5)] border border-blue-400/20",
        secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600 shadow-lg",
        danger: "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_-5px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_-2px_rgba(220,38,38,0.5)] border border-red-400/20",
        ghost: "bg-transparent hover:bg-white/5 text-slate-400 hover:text-white"
    };

    return (
        <button
            className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <span className="mr-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </span>
            )}
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
            {/* Subtle hover sweep effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[sweep_1.5s_infinite] pointer-events-none"></span>
        </button>
    );
};
