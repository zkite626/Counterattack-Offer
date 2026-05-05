"use client";

import { type InputHTMLAttributes, forwardRef } from "react";
import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label}` : undefined);

    return (
      <div className={`input-group ${error ? "input-group--error" : ""}`}>
        {label && (
          <label className="input-group__label" htmlFor={inputId}>
            {label}
            {props.required && <span className="input-group__required">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input-group__input ${error ? "input-group__input--error" : ""} ${className}`}
          {...props}
        />
        {error && <span className="input-group__error">{error}</span>}
        {helper && !error && <span className="input-group__helper">{helper}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
