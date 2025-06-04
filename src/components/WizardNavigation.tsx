'use client';

import { WizardStep } from './LaunchWizard';

interface WizardNavigationProps {
  currentStep: WizardStep;
  isLaunching: boolean;
}

const steps = [
  { id: 'token-info', name: 'Token Info', description: 'Basic token details' },
  { id: 'liquidity', name: 'Liquidity', description: 'Pool configuration' },
  { id: 'review', name: 'Review', description: 'Confirm details' },
  { id: 'progress', name: 'Launch', description: 'Creating token' },
  { id: 'success', name: 'Complete', description: 'Token launched' },
];

export function WizardNavigation({ currentStep, isLaunching }: WizardNavigationProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, stepIndex) => {
            const status = getStepStatus(stepIndex);
            
            return (
              <li key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium
                    ${status === 'completed' 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : status === 'current'
                      ? 'bg-blue-50 border-blue-600 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500'
                    }
                    ${isLaunching && status === 'current' ? 'animate-pulse' : ''}
                  `}>
                    {status === 'completed' ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      stepIndex + 1
                    )}
                  </div>
                  
                  <div className="ml-3 hidden sm:block">
                    <div className={`text-sm font-medium ${
                      status === 'current' ? 'text-blue-600' : 
                      status === 'completed' ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.description}
                    </div>
                  </div>
                </div>
                
                {stepIndex < steps.length - 1 && (
                  <div className={`
                    hidden sm:block w-16 h-0.5 ml-4
                    ${stepIndex < currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'}
                  `} />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
