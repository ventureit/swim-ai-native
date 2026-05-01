import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

type Point = { x: number; y: number };
type ErrorType = 'none' | 'dropped_elbow' | 'late_catch';

interface GhostOverlayProps {
  keypoints: {
    shoulder: Point;
    elbow: Point;
    wrist: Point;
  };
  errorType: ErrorType;
  width: number | string;
  height: number | string;
}

const GhostOverlay: React.FC<GhostOverlayProps> = ({ keypoints, errorType, width, height }) => {
  const { shoulder, elbow, wrist } = keypoints;

  const sx = shoulder.x;
  const sy = shoulder.y;
  const ex = elbow.x;
  const ey = elbow.y;
  const wx = wrist.x;
  const wy = wrist.y;

  let ghostElbowX = ex;
  let ghostElbowY = ey;
  let ghostWristX = wx;
  let ghostWristY = wy;

  switch (errorType) {
    case 'dropped_elbow':
      {
        const upperArmLength = Math.hypot(ex - sx, ey - sy);
        const forearmLength = Math.hypot(wx - ex, wy - ey);

        const dx = wx - sx;
        const dy = wy - sy;
        const mag = Math.hypot(dx, dy) || 1;

        const nx = dx / mag;
        const ny = dy / mag;

        const adjustedY = ny * 0.2;
        const adjustedMag = Math.hypot(nx, adjustedY) || 1;

        const dirX = nx / adjustedMag;
        const dirY = adjustedY / adjustedMag;

        ghostElbowX = sx + dirX * upperArmLength * 0.9;
        ghostElbowY = sy + dirY * upperArmLength;

        const fx = wx - ex;
        const fy = wy - ey;
        const fmag = Math.hypot(fx, fy) || 1;

        const fnx = fx / fmag;
        const fny = fy / fmag;

        const adjustedFx = fnx * 0.3;
        const adjustedFy = Math.abs(fny) * 1.0;
        const forearmAdjustedMag = Math.hypot(adjustedFx, adjustedFy) || 1;

        const dirFx = adjustedFx / forearmAdjustedMag;
        const dirFy = adjustedFy / forearmAdjustedMag;

        ghostWristX = ghostElbowX + dirFx * forearmLength;
        ghostWristY = ghostElbowY + dirFy * forearmLength;
      }
      break;
    case 'none':
    default:
      break;
  }
  const elbowColor = ey > ghostElbowY ? '#ef4444' : '#f472b6';

  return (
    <Svg
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0.9,
      }}>
      <Line
        x1={sx}
        y1={sy}
        x2={ghostElbowX}
        y2={ghostElbowY}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={3}
        strokeDasharray="4,6"
        strokeLinecap="round"
      />
      <Line
        x1={ghostElbowX}
        y1={ghostElbowY}
        x2={ghostWristX}
        y2={ghostWristY}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={3}
        strokeDasharray="4,6"
        strokeLinecap="round"
      />

      <Line
        x1={sx}
        y1={sy}
        x2={ex}
        y2={ey}
        stroke="#facc15"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Line
        x1={ex}
        y1={ey}
        x2={wx}
        y2={wy}
        stroke="#22c55e"
        strokeWidth={3}
        strokeLinecap="round"
      />

      <Circle cx={sx} cy={sy} r={5} fill="#60a5fa" />
      <Circle cx={ex} cy={ey} r={5} fill={elbowColor} />
      <Circle cx={wx} cy={wy} r={5} fill="#fb923c" />
    </Svg>
  );
};

export default React.memo(GhostOverlay);
