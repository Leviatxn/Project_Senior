import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

const PetitionStepper = ({ steps, activeStep,isReject}) => {
  console.log(isReject)
  if(isReject){
    return (
      <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>

      <Stepper 
        activeStep={activeStep} 
        alternativeLabel
        sx={{
          flex:'5',
          '.MuiStepLabel-label': {
            color: '#1E1E1E',
            fontFamily: "Noto Sans Thai",
          },
          '.MuiStepIcon-root': {
            color: isReject ? '#ff6b6b' : '#d3d3d3', // เปลี่ยนสีวงกลมทั้งหมดเป็นแดงอ่อนเมื่อปฏิเสธ
          },
          '.Mui-active': {
            color: isReject ? '#ff0000' : '#006767', // สีแดงเข้มเมื่อปฏิเสธ
          },
          '.Mui-completed': {
            color: isReject ? '#ff6b6b' : '#00a6a2', // สีแดงอ่อนเมื่อปฏิเสธ
          },
          margin: '4%'
        }}
      >
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>
              {isReject && index === activeStep ? 'คำร้องถูกปฏิเสธ' : label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {(isReject)?(
          <div style={{flex:'2',textAlign:'center'}}>
            <p style={{color:'red'}}>กรุณา<a style={{color:'red'}}>ยกเลิกและยื่นคำร้องใหม่</a></p>
          </div>
        ):(
          <div>
          </div>
        )}
      </div>
  
    );
  }
  return (
    <div>
    <Stepper 
      activeStep={activeStep} 
      alternativeLabel
      sx={{
        flex:'10',
        '.MuiStepLabel-label': {
          color: '#1E1E1E',
          fontFamily: "Noto Sans Thai",
        },
        '.MuiStepIcon-root': {
          color: isReject ? '#ff6b6b' : '#d3d3d3', // เปลี่ยนสีวงกลมทั้งหมดเป็นแดงอ่อนเมื่อปฏิเสธ
        },
        '.Mui-active': {
          color: isReject ? '#ff0000' : '#006767', // สีแดงเข้มเมื่อปฏิเสธ
        },
        '.Mui-completed': {
          color: isReject ? '#ff6b6b' : '#00a6a2', // สีแดงอ่อนเมื่อปฏิเสธ
        },
        margin: '4%'
      }}
    >
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel>
            {isReject && index === activeStep ? 'คำร้องถูกปฏิเสธ' : label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
    </div>

  );
};
export default PetitionStepper;
