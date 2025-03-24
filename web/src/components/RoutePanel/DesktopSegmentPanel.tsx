import React, { useCallback, useState } from 'react';
import { GPXSegment } from '../../models.ts';
import { Grid, Header, Segment } from 'semantic-ui-react';
import GpxService from '../../services/GpxService.ts';

interface SegmentsPanelProps {
  segments: GPXSegment[];
}

const DesktopSegmentPanel: React.FC<SegmentsPanelProps> = ({ segments }) => {
  const [generalLoading, setGeneralLoading] = useState<boolean>(false);

  const [aiGpxSegmentDescriptions, setAiGpxSegmentDescriptions] =
    useState<Record<number, string>>();

  const handleExplainWithAIClick = useCallback(
    async (segment: GPXSegment) => {
      setGeneralLoading(true);
      let description = '';
      const currentSegmentData = { ...aiGpxSegmentDescriptions };

      try {
        const aiData = await GpxService.aiExplain(segment);
        description = aiData.description;
      } catch (error: Error | unknown) {
        description = (error as Error).message;
      } finally {
        currentSegmentData[segment.number] = description;
        setAiGpxSegmentDescriptions(currentSegmentData);

        setGeneralLoading(false);
      }
    },
    [aiGpxSegmentDescriptions],
  );

  return (
    <Grid stackable>
      <Header as="h3">Splits</Header>
      <Grid.Row>
        <Grid.Column>
          <Segment.Group>
            {segments.map((segment, index) => (
              <Segment key={index} color="blue">
                <Grid>
                  <Grid.Row columns={2} verticalAlign="middle">
                    <Grid.Column>
                      <Header as="h4">
                        Split {segment.number}
                        <Header.Subheader>
                          <span>
                            <b>D+: </b> {segment.elevationGain.toFixed(2)} m
                          </span>
                          <span> &bull; </span>
                          <span>
                            <b>D-: </b> {segment.elevationLoss.toFixed(2)} m
                          </span>
                          <span> &bull; </span>
                          <span>
                            <b>Avg Gradient: </b> {segment.avgGrade.toFixed(2)} %
                          </span>
                        </Header.Subheader>
                      </Header>
                    </Grid.Column>
                    <Grid.Column>
                      <button
                        onClick={() => handleExplainWithAIClick(segment)}
                        className={`ui green button right floated ${generalLoading && 'disabled loading'}`}
                        disabled={generalLoading}
                      >
                        Explain with AI
                      </button>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <b>Elevations</b>
                      <ul>
                        <li>
                          <b>Start:</b> {segment.startElevation.toFixed(2)} m
                        </li>
                        <li>
                          <b>End:</b> {segment.endElevation.toFixed(2)} m
                        </li>
                        <li>
                          <b>Min:</b> {segment.minElevation.toFixed(2)} m
                        </li>
                        <li>
                          <b>Max:</b> {segment.maxElevation.toFixed(2)} m
                        </li>
                      </ul>
                    </Grid.Column>
                    <Grid.Column>
                      <b>Distances</b>
                      <ul>
                        <li>
                          <b>Total:</b> {segment.distance.toFixed(2)} km
                        </li>
                        <li>
                          <b>Start:</b> {segment.startDistance.toFixed(2)} km
                        </li>
                        <li>
                          <b>End:</b> {segment.endDistance.toFixed(2)} km
                        </li>
                      </ul>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row verticalAlign="middle">
                    <Grid.Column>
                      {aiGpxSegmentDescriptions && aiGpxSegmentDescriptions[segment.number] && (
                        <Segment color="green">
                          <p>{aiGpxSegmentDescriptions[segment.number]}</p>
                        </Segment>
                      )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            ))}
          </Segment.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default DesktopSegmentPanel;
