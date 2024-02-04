import React from 'react'
import './Onboarding.css'
import OnboardingForm from '../../components/onboarding/onboarding-form'

const Onboarding = () => {
  return (
    <div className='onboarding-page'>
      <div className="onboarding-page-wrapper">
        <OnboardingForm />
      </div>
    </div>
  )
}

export default Onboarding
