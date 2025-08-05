// src/components/Form/MultiStepProgress.jsx
import React from "react";

const MultiStepProgress = ({ currentStep, steps }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex gap-2 items-center">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300
                ${
                  currentStep > index + 1
                    ? "bg-[var(--color-primary)]"
                    : currentStep === index + 1
                    ? "bg-[var(--color-gold)]"
                    : "bg-[var(--color-grey4)]"
                }`}
            >
              {currentStep > index + 1 ? "✓" : index + 1}
            </div>
            <p
              className={`text-sm font-IBM-Plex font-semibold transition-all duration-300
                ${currentStep >= index + 1 ? "text-primary" : "text-grey5"}`}
            >
              {step.name}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-grow h-1 rounded-full mx-2 transition-all duration-300
                ${
                  currentStep > index + 1
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-grey6)]"
                }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MultiStepProgress;
