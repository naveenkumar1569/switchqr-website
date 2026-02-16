import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button Component - Design System
 * 
 * Unified button component with consistent styling across all variants.
 * Replaces inline button patterns throughout the app.
 * 
 * @example
 * <Button variant="primary" onClick={handleClick}>Save</Button>
 * <Button variant="danger" loading>Deleting...</Button>
 * <Button variant="outline" icon="add">Create New</Button>
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon = null,
    iconPosition = 'left',
    fullWidth = false,
    className = '',
    type = 'button',
    onClick,
    ...props
}) => {
    // Base styles (always applied)
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    // Variant styles
    const variantStyles = {
        primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-sm hover:shadow-md active:scale-95',
        secondary: 'bg-primary/20 text-primary hover:bg-primary/30 focus:ring-primary active:scale-95',
        outline: 'border-2 border-slate-200  text-slate-700  hover:bg-slate-50 :bg-slate-800 focus:ring-slate-400 active:scale-95',
        ghost: 'text-slate-500  hover:text-primary hover:bg-slate-50 :bg-slate-800 focus:ring-slate-400',
        danger: 'bg-red-600 text-white hover:bg-red-700  :bg-red-600 focus:ring-red-500 shadow-sm hover:shadow-md active:scale-95',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md active:scale-95',
    };

    // Size styles
    const sizeStyles = {
        sm: 'text-xs px-3 py-1.5 gap-1.5',
        md: 'text-sm px-6 py-2.5 gap-2',
        lg: 'text-base px-8 py-3 gap-2.5',
    };

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    // Loading spinner
    const LoadingSpinner = () => (
        <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    // Icon component (Material Symbols)
    const Icon = ({ name }) => (
        <span className="material-symbols-outlined text-base" aria-hidden="true">
            {name}
        </span>
    );

    // Combine all styles
    const combinedStyles = [
        baseStyles,
        variantStyles[variant] || variantStyles.primary,
        sizeStyles[size] || sizeStyles.md,
        widthStyles,
        className,
    ].join(' ');

    return (
        <button
            type={type}
            className={combinedStyles}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <LoadingSpinner />}
            {!loading && icon && iconPosition === 'left' && <Icon name={icon} />}
            {children}
            {!loading && icon && iconPosition === 'right' && <Icon name={icon} />}
        </button>
    );
};

Button.propTypes = {
    /** Button content */
    children: PropTypes.node.isRequired,

    /** Visual variant */
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger', 'success']),

    /** Button size */
    size: PropTypes.oneOf(['sm', 'md', 'lg']),

    /** Show loading spinner */
    loading: PropTypes.bool,

    /** Disable button */
    disabled: PropTypes.bool,

    /** Material icon name (optional) */
    icon: PropTypes.string,

    /** Icon position */
    iconPosition: PropTypes.oneOf(['left', 'right']),

    /** Make button full width */
    fullWidth: PropTypes.bool,

    /** Additional CSS classes */
    className: PropTypes.string,

    /** Button type */
    type: PropTypes.oneOf(['button', 'submit', 'reset']),

    /** Click handler */
    onClick: PropTypes.func,
};

export default Button;
