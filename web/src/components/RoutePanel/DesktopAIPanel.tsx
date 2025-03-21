import React, { useCallback, useState } from 'react';
import { AiGpxSegmentDescription, GPXSegment } from '../../models.ts';
import { Grid, Header, Segment } from 'semantic-ui-react';
import GpxService from '../../services/GpxService.ts';
import FeedbackMessage from '../FeedbackMessage/FeedbackMessage.tsx';

interface DesktopAIPanelProps {
  segments: GPXSegment[];
}

const DesktopAIPanel: React.FC<DesktopAIPanelProps> = ({ segments }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [aiGpxSegmentDescriptions, setAiGpxSegmentDescriptions] = useState<
    AiGpxSegmentDescription[]
  >([]);

  const [feedbackMessage, setFeedbackMessage] = useState<string>();

  const handleExplainWithAIClick = useCallback(async () => {
    setLoading(true);
    setFeedbackMessage('');

    try {
      const aiData = await GpxService.aiExplainSegments(segments);
      setAiGpxSegmentDescriptions(aiData);
    } catch (error: Error | unknown) {
      setFeedbackMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [segments]);

  return (
    <section className="ai-panel">
      <Segment vertical>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <button
                onClick={handleExplainWithAIClick}
                className={`ui green button ${loading && 'disabled loading'}`}
                disabled={loading}
              >
                Explain with AI
              </button>
            </Grid.Column>
          </Grid.Row>
          {loading && (
            <Grid.Row textAlign="center" verticalAlign="middle">
              <Grid.Column>
                <div className="ui active inverted dimmer">
                  <div className="ui text loader">Loading</div>
                </div>
              </Grid.Column>
            </Grid.Row>
          )}
          {!loading && (
            <Grid.Row>
              <Grid.Column>
                {aiGpxSegmentDescriptions &&
                  aiGpxSegmentDescriptions.length > 0 &&
                  aiGpxSegmentDescriptions.map((aiGpxSegmentDescription, index) => (
                    <Segment key={index} color={'green'}>
                      <Header as="h5">Split {aiGpxSegmentDescription.segmentNumber}</Header>
                      <p>{aiGpxSegmentDescription.description}</p>
                    </Segment>
                  ))}
                {feedbackMessage && (
                  <FeedbackMessage
                    error
                    title="Oops... something went wrong"
                    message={feedbackMessage}
                  />
                )}
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Segment>
    </section>
  );
};

export default DesktopAIPanel;
