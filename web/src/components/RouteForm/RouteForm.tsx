import React, { ChangeEvent, useCallback, useState } from 'react';
import { Form, FormButton, FormField, FormInput, Grid, Input, Message } from 'semantic-ui-react';
import { isValidRouteURL } from '../../utils.ts';

interface RouteFormProps {

  onVerifyRouteURL: (routeURL: string) => Promise<boolean>;
  onAnalyzeRouteClick: (routeURL: string, splitBy: number) => Promise<boolean>;
}

const RouteForm: React.FC<RouteFormProps> = ({ onVerifyRouteURL, onAnalyzeRouteClick }) => {
    const [routeURL, setRouteURL] = useState<string>('');
    const [splitBy, setSplitBy] = useState<string>('');

    const [routeURLError, setRouteURLError] = useState<boolean>(false);
    const [splitByError, setSplitByError] = useState<boolean>(false);

    const [feedbackMessages, setFeedbackMessages] = useState<string[]>([]);

  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [verifyingRouteURL, setVerifyingRouteURL] = useState<boolean>(false);

  const validatingForm = useCallback((): [boolean, string[]] => {
      let formValid = true;
      let feedbackMessage = [];

      setRouteURLError(false);
      setSplitByError(false);

      if (!routeURL) {
        formValid = false;
        setRouteURLError(true);
        feedbackMessage.push('Route URL is required');
      } else {
        if (!isValidRouteURL(routeURL)) {
          formValid = false;
          setRouteURLError(true);
          feedbackMessage.push('Route URL is not valid');
        }

      }

      if (!splitBy) {
        formValid = false;
        setSplitByError(true);
        feedbackMessage.push('Split by is required');
      } else {
        const splitByNumber = parseInt(splitBy);
        if (isNaN(splitByNumber)) {
          formValid = false;
          setSplitByError(true);
          feedbackMessage.push('Split by must be a number');
        }

        if (splitByNumber <= 0) {
          formValid = false;
          setSplitByError(true);
          feedbackMessage.push('Split by must be greater than 0');
        }
      }

      return [formValid, feedbackMessage];
    }, [routeURL, splitBy]);

    const handleOnRouteURLChange = useCallback((e: ChangeEvent) => {
      const inputElement = (e.target as HTMLInputElement);
      const value = inputElement.value;

      setRouteURL(value);

      if (value.length > 0) {
        setVerifyingRouteURL(true);

        onVerifyRouteURL(value).then(verified => {
          if (verified) {
            setVerifyingRouteURL(false);
          }
        });
      }
    }, []);

    const handleAnalyzeRouteClick = useCallback(() => {
      const [validated, feedbackMessages] = validatingForm();

      if (!validated) {
        setFeedbackMessages(feedbackMessages);
      }

      if (validated) {
        setAnalyzing(true);
        onAnalyzeRouteClick(routeURL as string, parseInt(splitBy)).then(success => {
          if (success) {
            setRouteURL('');
            setSplitBy('');
            setAnalyzing(false);
            setFeedbackMessages([]);
          }
        });
      }
    }, [routeURL, splitBy]);

    return (
      <Form className="route-form" loading={analyzing}>
        <Grid stackable>
          <Grid.Row columns={2}>
            <Grid.Column width={12}>
              <FormInput
                control={Input}
                placeholder="Paste your strava route url here"
                label="URL"
                loading={verifyingRouteURL}
                value={routeURL}
                onChange={handleOnRouteURLChange}
                error={routeURLError}
              />
            </Grid.Column>
            <Grid.Column width={2}>
              <FormField error={splitByError}>
                <label htmlFor="split-by">Split by</label>
                <Input
                  id="split-by"
                  label={{ content: 'km' }}
                  labelPosition="right"
                  value={splitBy}
                  onChange={(_, { value }) => setSplitBy(value)}
                  placeholder="5"
                />
              </FormField>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <FormButton className="ui primary button" onClick={handleAnalyzeRouteClick}>Analyze</FormButton>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Message visible={splitByError || routeURLError}
                       error
                       header="Oops... something went wrong"
                       list={feedbackMessages}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    )
      ;
  }
;

export default RouteForm;