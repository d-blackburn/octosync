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
import { FormikProps } from 'formik';
import {
  CheckOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
} from '@mui/icons-material';
import { ProcessStep } from '../../models/wizards/processStep';
import { templateSyncDataInitialState } from '../features/templateSync/models/templateSyncData';

export interface ProcessWizardProps {
  steps: ProcessStep[];
  onComplete: (data: any) => void;
}

const ProcessWizard: React.FC<ProcessWizardProps> = ({ steps, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const [data, setData] = useState<any>(templateSyncDataInitialState);

  const handleCompletion = useCallback(
    (dataComplete: any) => {
      onComplete(dataComplete);
    },
    [onComplete],
  );

  const handleSubmit = useCallback(
    (updatedData: any) => {
      setData(updatedData);
      setCurrentStepIndex((prevState) => {
        if (prevState === steps.length - 1) {
          handleCompletion(updatedData);
          return prevState;
        }

        return prevState + 1;
      });
    },
    [handleCompletion, steps.length],
  );

  const formikRef = useRef<FormikProps<any>>(null);

  const handleBackClick = useCallback(() => {
    setCurrentStepIndex((prevState) => prevState - 1);
  }, []);

  const handleNextClick = useCallback(() => {
    formikRef.current?.submitForm();
  }, [formikRef]);

  const CurrentStep = steps[currentStepIndex].component;

  const lastStep = currentStepIndex === steps.length - 1;

  return (
    <Grid2 container spacing={2} alignItems="center">
      <Grid2 container size={6} justifyContent="flex-end">
        <Grid2 size={8}>
          <Stepper orientation="vertical" activeStep={currentStepIndex}>
            {steps.map((step) => (
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
      <Grid2 container size="grow" height="100%">
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
          <Button
            variant="text"
            disabled={currentStepIndex === 0}
            startIcon={<ChevronLeftOutlined />}
            onClick={handleBackClick}
          >
            Back
          </Button>
        </Grid2>
        <Grid2>
          <Button
            color="success"
            startIcon={lastStep ? <CheckOutlined /> : <ChevronRightOutlined />}
            onClick={handleNextClick}
          >
            {lastStep ? 'Confirm' : 'Next'}
          </Button>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};
export { ProcessWizard };
