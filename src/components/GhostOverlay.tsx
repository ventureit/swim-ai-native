import React from 'react';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';

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
  const direction = wx - sx >= 0 ? 1 : -1;

  let ghostElbowX = ex;
  let ghostElbowY = ey;
  let ghostWristX = wx;
  let ghostWristY = wy;

  if (errorType === 'late_catch') {
    const upperArmLength = Math.hypot(ex - sx, ey - sy);
    const forearmLength = Math.hypot(wx - ex, wy - ey);

    const midX = sx + (wx - sx) * 0.55;
    const midY = sy + (wy - sy) * 0.55;

    const dirX = (midX - sx) * direction;
    const dirY = midY - sy;

    const mag = Math.hypot(dirX, dirY);

    const nx = dirX / mag;
    const ny = dirY / mag;

    ghostElbowX = sx + (nx * direction) * upperArmLength;
    ghostElbowY = sy + ny * upperArmLength;

    const fx = (wx - ex) * direction;
    const fy = wy - ey;

    const fmag = Math.hypot(fx, fy);

    const fnx = fx / fmag;
    const fny = fy / fmag;

    const adjustedFx = fnx * 0.25;
    const adjustedFy = Math.abs(fny) * 1.8;

    const adjustedMag = Math.hypot(adjustedFx, adjustedFy);

    const dirFx = adjustedFx / adjustedMag;
    const dirFy = adjustedFy / adjustedMag;

    ghostWristX = ghostElbowX + (dirFx * direction) * forearmLength;
    ghostWristY = ghostElbowY + dirFy * forearmLength;
  } else if (errorType === 'dropped_elbow') {
    const upperArmLength = Math.hypot(ex - sx, ey - sy);
    const forearmLength = Math.hypot(wx - ex, wy - ey);

    const ux = 0.6 * direction;
    const uy = 0.8;

    const magU = Math.hypot(ux, uy) || 1;

    const dirUX = ux / magU;
    const dirUY = uy / magU;

    const gex = sx + dirUX * upperArmLength;
    const gey = sy + dirUY * upperArmLength;

    const fx = 0.2 * direction;
    const fy = 1;

    const magF = Math.hypot(fx, fy) || 1;

    const dirFX = fx / magF;
    const dirFY = fy / magF;

    const gwx = gex + dirFX * forearmLength;
    const gwy = gey + dirFY * forearmLength;

    ghostElbowX = gex;
    ghostElbowY = gey;

    ghostWristX = gwx;
    ghostWristY = gwy;
  } else {
    return null;
  }

  const gsx = sx;
  const gsy = sy;
  const gex = ghostElbowX;
  const gey = ghostElbowY;
  const gwx = ghostWristX;
  const gwy = ghostWristY;

  const differencePoints = `${sx},${sy} ${ex},${ey} ${wx},${wy} ${gwx},${gwy} ${gex},${gey} ${gsx},${gsy}`;

  const elbowColor = ey > ghostElbowY ? '#ef4444' : '#f472b6';

  return (
    <Svg
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
      }}>
      <Polygon
        points={differencePoints}
        fill="rgba(0,255,170,0.25)"
        stroke="rgba(0,255,170,0.18)"
        strokeWidth={1}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

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
        stroke="rgba(250,204,21,0.55)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1={ex}
        y1={ey}
        x2={wx}
        y2={wy}
        stroke="rgba(34,197,94,0.55)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Circle cx={sx} cy={sy} r={5} fill="#60a5fa" />
      <Circle cx={wx} cy={wy} r={5} fill="#fb923c" />
      <Circle
        cx={ex}
        cy={ey}
        r={8}
        fill="rgba(255, 80, 80, 0.35)"
        stroke="rgba(255, 80, 80, 0.6)"
        strokeWidth={1.5}
      />
    </Svg>
  );
};

export default React.memo(GhostOverlay);
