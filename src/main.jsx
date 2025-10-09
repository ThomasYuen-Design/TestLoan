import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import LandingPage from './LandingPage.jsx'
import LocPortalApp from '../loc_customer_portal_active_member_mvp.jsx'
import EmploymentInfoStep from './EmploymentInfoStep.jsx'
import PaydateFlowClient from './PaydateFlowClient.jsx'
import Step1EmployerInfo from './steps/Step1EmployerInfo.jsx'
import Step2DirectDeposit from './steps/Step2DirectDeposit.jsx'
import Step3BankSelection from './steps/Step3BankSelection.jsx'
import Step4IncomeFrequency from './steps/Step4IncomeFrequency.jsx'
import Step5PaySchedule from './steps/Step5PaySchedule.jsx'
import Step6LastPaid from './steps/Step6LastPaid.jsx'

const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [employmentData, setEmploymentData] = useState(null);
  const [employmentDataSteps, setEmploymentDataSteps] = useState(null);
  
  // Step-by-step flow data
  const [stepsData, setStepsData] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    step6: {},
  });
  const [currentStepNumber, setCurrentStepNumber] = useState(1);

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view === 'application-steps') {
      setCurrentStepNumber(1);
      setStepsData({
        step1: {},
        step2: {},
        step3: {},
        step4: {},
        step5: {},
        step6: {},
      });
    }
  };

  const handleEmploymentContinue = (data) => {
    setEmploymentData(data);
    setCurrentView('paydate');
  };

  const handleEmploymentContinueSteps = (data) => {
    setEmploymentDataSteps(data);
    setCurrentView('paydate-steps');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleBackToEmployment = () => {
    setCurrentView('application');
  };

  const handleBackToEmploymentSteps = () => {
    setCurrentView('application-steps');
  };

  // Step navigation handlers
  const handleStep1Continue = (data) => {
    setStepsData(prev => ({ ...prev, step1: data }));
    setCurrentStepNumber(2);
  };

  const handleStep2Continue = (data) => {
    setStepsData(prev => ({ ...prev, step2: data }));
    setCurrentStepNumber(3);
  };

  const handleStep3Continue = (data) => {
    setStepsData(prev => ({ ...prev, step3: data }));
    setCurrentStepNumber(4);
  };

  const handleStep4Continue = (data) => {
    setStepsData(prev => ({ ...prev, step4: data }));
    const frequency = data.frequency;
    
    // If Semi-monthly or Monthly, skip to step 5
    if (frequency === "Semi-monthly" || frequency === "Monthly") {
      setCurrentStepNumber(5);
    } else {
      // For Weekly or Bi-weekly, go to step 5 first, then step 6
      setCurrentStepNumber(5);
    }
  };

  const handleStep5Continue = (data) => {
    setStepsData(prev => ({ ...prev, step5: data }));
    const frequency = stepsData.step4.frequency;
    
    // Only go to step 6 if Weekly or Bi-weekly
    if (frequency === "Weekly" || frequency === "Bi-weekly") {
      setCurrentStepNumber(6);
    } else {
      // Complete the flow
      console.log("Complete flow data:", { ...stepsData, step5: data });
      alert("Application complete! " + JSON.stringify({ ...stepsData, step5: data }, null, 2));
      setCurrentView('landing');
    }
  };

  const handleStep6Continue = (data) => {
    setStepsData(prev => ({ ...prev, step6: data }));
    console.log("Complete flow data:", { ...stepsData, step6: data });
    alert("Application complete! " + JSON.stringify({ ...stepsData, step6: data }, null, 2));
    setCurrentView('landing');
  };

  const handleStepBack = () => {
    if (currentStepNumber > 1) {
      setCurrentStepNumber(currentStepNumber - 1);
    } else {
      setCurrentView('landing');
    }
  };

  if (currentView === 'dashboard') {
    return <LocPortalApp />;
  }

  if (currentView === 'application') {
    return <EmploymentInfoStep onContinue={handleEmploymentContinue} onBack={handleBackToLanding} />;
  }

  if (currentView === 'paydate') {
    return <PaydateFlowClient employmentData={employmentData} onBack={handleBackToEmployment} />;
  }

  if (currentView === 'application-steps') {
    if (currentStepNumber === 1) {
      return <Step1EmployerInfo onContinue={handleStep1Continue} onBack={handleBackToLanding} initialData={stepsData.step1} />;
    }
    if (currentStepNumber === 2) {
      return <Step2DirectDeposit onContinue={handleStep2Continue} onBack={handleStepBack} initialData={stepsData.step2} />;
    }
    if (currentStepNumber === 3) {
      return <Step3BankSelection onContinue={handleStep3Continue} onBack={handleStepBack} initialData={stepsData.step3} />;
    }
    if (currentStepNumber === 4) {
      return <Step4IncomeFrequency onContinue={handleStep4Continue} onBack={handleStepBack} initialData={stepsData.step4} />;
    }
    if (currentStepNumber === 5) {
      return <Step5PaySchedule onContinue={handleStep5Continue} onBack={handleStepBack} frequency={stepsData.step4.frequency} initialData={stepsData.step5} />;
    }
    if (currentStepNumber === 6) {
      return <Step6LastPaid onContinue={handleStep6Continue} onBack={handleStepBack} frequency={stepsData.step4.frequency} weekday={stepsData.step5.weekday} initialData={stepsData.step6} />;
    }
  }

  if (currentView === 'paydate-steps') {
    return <PaydateFlowClient employmentData={employmentDataSteps} onBack={handleBackToEmploymentSteps} />;
  }

  return <LandingPage onNavigate={handleNavigate} />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
