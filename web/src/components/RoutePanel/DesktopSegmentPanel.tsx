import React from 'react';
import { GPXSegment } from '../../models.ts';
import {
  Header,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from 'semantic-ui-react';

interface SegmentsPanelProps {
  segments: GPXSegment[];
}

const DesktopSegmentPanel: React.FC<SegmentsPanelProps> = ({ segments }) => {
  return (
    <Table celled striped structured color={'blue'}>
      <TableHeader>
        <TableRow>
          <TableHeaderCell rowSpan={2} textAlign="center">
            <b>Split</b>
          </TableHeaderCell>
          <TableHeaderCell colSpan={4} textAlign="center">
            <b>Elevations</b>
          </TableHeaderCell>
          <TableHeaderCell colSpan={3} textAlign="center">
            <b>Distances</b>
          </TableHeaderCell>
          <TableHeaderCell rowSpan={2} textAlign="center">
            <b>D+</b>
          </TableHeaderCell>
          <TableHeaderCell rowSpan={2} textAlign="center">
            <b>D-</b>
          </TableHeaderCell>
          <TableHeaderCell colSpan={3} textAlign="center">
            <b>Grades</b>
          </TableHeaderCell>
        </TableRow>
        <TableRow>
          <TableHeaderCell textAlign="center">
            <b>Start</b>
          </TableHeaderCell>
          <TableHeaderCell textAlign="center">
            <b>End</b>
          </TableHeaderCell>
          <TableHeaderCell textAlign="center">
            <b>Min</b>
          </TableHeaderCell>
          <TableHeaderCell textAlign="center">
            <b>Max</b>
          </TableHeaderCell>
          <TableHeaderCell textAlign="center">
            <b>Total</b>
          </TableHeaderCell>
          <TableHeaderCell textAlign="center">
            <b>Start</b>
          </TableHeaderCell>
          <TableHeaderCell textAlign="center">
            <b>End</b>
          </TableHeaderCell>
          <TableHeaderCell textAlign="center">
            <b>Min</b>
          </TableHeaderCell>
          <TableHeaderCell textAlign="center">
            <b>Avg</b>
          </TableHeaderCell>
          <TableHeaderCell textAlign="center">
            <b>Max</b>
          </TableHeaderCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {segments.map((segment) => (
          <TableRow key={segment.number}>
            <TableCell textAlign="center">
              <Header as="h3">{segment.number}</Header>
            </TableCell>
            <TableCell>{segment.startElevation.toFixed(2)} m</TableCell>
            <TableCell>{segment.endElevation.toFixed(2)} m</TableCell>
            <TableCell>{segment.minElevation.toFixed(2)} m</TableCell>
            <TableCell>{segment.maxElevation.toFixed(2)} m</TableCell>
            <TableCell>{segment.distance.toFixed(2)} km</TableCell>
            <TableCell>{segment.startDistance.toFixed(2)} km</TableCell>
            <TableCell>{segment.endDistance.toFixed(2)} km</TableCell>
            <TableCell>{segment.elevationGain.toFixed(2)} m</TableCell>
            <TableCell>{segment.elevationLoss.toFixed(2)} m</TableCell>
            <TableCell>{segment.minGrade.toFixed(2)} %</TableCell>
            <TableCell>{segment.avgGrade.toFixed(2)} %</TableCell>
            <TableCell>{segment.maxGrade.toFixed(2)} %</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DesktopSegmentPanel;
