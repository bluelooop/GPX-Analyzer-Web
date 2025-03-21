import React from 'react';
import { GPXRoute } from '../../models.ts';
import { Grid, Header } from 'semantic-ui-react';

import './RoutePanel.scss';
import DesktopSegmentPanel from './DesktopSegmentPanel.tsx';

interface RoutePanelProps {
  route: GPXRoute;
}

const RoutePanel: React.FC<RoutePanelProps> = ({ route }) => {
  return (
    <div className="route-panel">
      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <Header as="h1">
              {route.name}
              <Header.Subheader>{route.description}</Header.Subheader>
            </Header>
          </Grid.Column>
        </Grid.Row>
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
            <DesktopSegmentPanel segments={route.segments} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default RoutePanel;
