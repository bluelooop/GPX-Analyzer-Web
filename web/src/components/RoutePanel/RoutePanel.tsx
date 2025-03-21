import React from 'react';
import { GPXRoute } from '../../models.ts';
import { Grid } from 'semantic-ui-react';

import './RoutePanel.scss';
import SegmentsPanel from './SegmentsPanel.tsx';

interface RoutePanelProps {
  route: GPXRoute;
}

const RoutePanel: React.FC<RoutePanelProps> = ({ route }) => {
  return (
    <div className="route-panel">
      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <h1>{route.name}</h1>
          </Grid.Column>
        </Grid.Row>
        {route.description && (
          <Grid.Row>
            <Grid.Column>
              <h1>{route.description}</h1>
            </Grid.Column>
          </Grid.Row>
        )}
        <Grid.Row>
          <Grid.Column>
            <div className="route-stats">
              <span>
                <b>Distance</b>: {route.distance.toFixed(2)} km
              </span>
              <span>
                <b>D+</b>: {route.elevationGain.toFixed(2)} m
              </span>
              <span>
                <b>D-</b>: {route.elevationLoss.toFixed(2)} m
              </span>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <SegmentsPanel segments={route.segments} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default RoutePanel;
