import React, { useCallback, useRef, useState } from 'react';
import {
  Button,
  Grid2,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { templateSyncSteps } from '../features/templateSync/models/templateSyncSteps';
import { ProcessStep } from '../../models/wizards/processStep';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@mui/icons-material';
import { templateSyncDataInitialState } from '../features/templateSync/models/templateSyncData';
import { FormikProps } from 'formik';

export interface ProcessWizardProps {
  steps: ProcessStep[];
}

const ProcessWizard: React.FC<ProcessWizardProps> = ({ steps }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const [data, setData] = useState<any>(templateSyncDataInitialState);

  const handleCompletion = useCallback(() => {}, []);

  const handleSubmit = useCallback(
    (submittedData: any) => {
      console.log('Step Complete: ', submittedData);
      setData(submittedData);
      setCurrentStepIndex((prevState) => {
        if (prevState === steps.length - 1) {
          handleCompletion();
          return prevState;
        }

        return prevState + 1;
      });
    },
    [handleCompletion],
  );

  const formikRef = useRef<FormikProps<any>>(null);

  const validateCurrentStep = useCallback(() => {
    console.log('Next Pressed!');
    formikRef.current?.submitForm();
  }, [formikRef]);

  const CurrentStep = steps[currentStepIndex].component;

  return (
    <Grid2 container height="100%" spacing={2}>
      <Grid2 container size={6} justifyContent="flex-end">
        <Grid2 size={8}>
          <Stepper orientation="vertical" activeStep={currentStepIndex}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography color="textPrimary" variant="body1">
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography color="textSecondary" variant="body2">
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Grid2>
      </Grid2>
      <Grid2 container size="grow">
        <CurrentStep
          data={data}
          onSubmit={handleSubmit}
          formikRef={formikRef}
        />
      </Grid2>
      <Grid2
        container
        size={12}
        spacing={1}
        justifyContent="flex-end"
        alignItems="center"
      >
        <Grid2>
          <Button variant="text" startIcon={<ChevronLeftOutlined />}>
            Back
          </Button>
        </Grid2>
        <Grid2>
          <Button
            color="success"
            endIcon={<ChevronRightOutlined />}
            onClick={validateCurrentStep}
          >
            Next
          </Button>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};
export { ProcessWizard };
