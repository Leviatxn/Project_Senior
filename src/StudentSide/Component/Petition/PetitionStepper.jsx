import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

const PetitionStepper = ({ steps, activeStep}) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel
    sx={{

        '.MuiStepLabel-label': { // เปลี่ยนสีข้อความ
          color: '#1E1E1E',
          fontFamily : "Noto Sans Thai",
        },
        '.MuiStepIcon-root': { // ไอคอนวงกลมทั้งหมด
          color: '#d3d3d3',
        },
        '.Mui-active': {
          color: '#006767',
        },
        '.Mui-completed': {
          color: '#00a6a2',
        },
        margin : '4%'
      }}>
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default PetitionStepper;
