import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Form, FormButton, FormField, FormInput, Grid, Input } from 'semantic-ui-react';
import { isValidRouteURL } from '../../utils.ts';
import FeedbackMessageList from '../FeedbackMessage/FeedbackMessageList.tsx';

interface RouteFormProps {
  splitBy?: number;
  onVerifyRouteURL: (routeURL: string) => Promise<boolean | void>;
  onAnalyzeRouteClick: (routeURL: URL, splitBy: number) => Promise<boolean | void>;
}

const RouteForm: React.FC<RouteFormProps> = ({
  splitBy,
  onVerifyRouteURL,
  onAnalyzeRouteClick,
}) => {
  const [routeURL, setRouteURL] = useState<string>('');
  const [splitByValue, setSplitByValue] = useState<string>(splitBy ? splitBy.toString() : '');

  const [routeURLError, setRouteURLError] = useState<boolean>(false);
  const [splitByError, setSplitByError] = useState<boolean>(false);

  const [feedbackMessages, setFeedbackMessages] = useState<string[]>([]);

  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [verifyingRouteURL, setVerifyingRouteURL] = useState<boolean>(false);

  const validatingForm = useCallback((): [boolean, string[]] => {
    let formValid = true;
    const feedbackMessage = [];

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

    if (!splitByValue) {
      formValid = false;
      setSplitByError(true);
      feedbackMessage.push('Split by is required');
    } else {
      const splitByNumber = parseInt(splitByValue);
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
  }, [routeURL, splitByValue]);

  const handleOnRouteURLChange = useCallback(
    async (e: ChangeEvent) => {
      const inputElement = e.target as HTMLInputElement;
      const value = inputElement.value;

      setRouteURL(value);

      if (value.length > 0) {
        setRouteURLError(false);
        setVerifyingRouteURL(true);

        await onVerifyRouteURL(value);

        setVerifyingRouteURL(false);
      }
    },
    [onVerifyRouteURL],
  );

  const handleAnalyzeRouteClick = useCallback(async () => {
    const [validated, feedbackMessages] = validatingForm();

    if (!validated) {
      setFeedbackMessages(feedbackMessages);
    }

    if (validated) {
      setAnalyzing(true);

      await onAnalyzeRouteClick(new URL(routeURL), parseInt(splitByValue));

      setAnalyzing(false);
      setFeedbackMessages([]);
    }
  }, [onAnalyzeRouteClick, routeURL, splitByValue, validatingForm]);

  useEffect(() => {
    setSplitByValue(splitBy ? splitBy.toString() : '');
  }, [splitBy]);

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
                value={splitByValue}
                onChange={(_, { value }) => setSplitByValue(value)}
                placeholder="5"
              />
            </FormField>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <FormButton className="ui primary button" onClick={handleAnalyzeRouteClick}>
              Analyze
            </FormButton>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <FeedbackMessageList
              error
              visible={splitByError || routeURLError}
              title="Oops... something went wrong"
              messages={feedbackMessages}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  );
};

export default RouteForm;
