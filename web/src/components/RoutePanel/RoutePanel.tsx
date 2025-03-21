import React from 'react';
import { GPXRoute } from '../../models.ts';
import { Grid, Header } from 'semantic-ui-react';

import './RoutePanel.scss';
import DesktopSegmentPanel from './DesktopSegmentPanel.tsx';
import DesktopAIPanel from './DesktopAIPanel.tsx';
import MobileSegmentPanel from './MobileSegmentPanel.tsx';

interface RoutePanelProps {
  route: GPXRoute;
}

const RoutePanel: React.FC<RoutePanelProps> = ({ route }) => {
  return (
    <section className="route-panel">
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
            <section className="desktop-segment-panel">
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <DesktopSegmentPanel segments={route.segments} />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <DesktopAIPanel segments={route.segments} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </section>
            <section className="mobile-segment-panel">
              <MobileSegmentPanel segments={route.segments} />
            </section>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </section>
  );
};

export default RoutePanel;
