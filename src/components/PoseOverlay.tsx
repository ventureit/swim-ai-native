import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

type Point = { x: number; y: number };

interface PoseOverlayProps {
  keypoints: {
    shoulder?: Point;
    elbow?: Point;
    wrist?: Point;
  };
  width: number;
  height: number;
  isMirrored?: boolean;
}

const mirrorX = (x: number, width: number, isMirrored?: boolean) => {
  return isMirrored ? width - x : x;
};

const PoseOverlay: React.FC<PoseOverlayProps> = ({
  keypoints,
  width,
  height,
  isMirrored = true,
}) => {
  const { shoulder, elbow, wrist } = keypoints;

  const sx = shoulder ? mirrorX(shoulder.x, width, isMirrored) : null;
  const sy = shoulder?.y ?? null;

  const ex = elbow ? mirrorX(elbow.x, width, isMirrored) : null;
  const ey = elbow?.y ?? null;

  const wx = wrist ? mirrorX(wrist.x, width, isMirrored) : null;
  const wy = wrist?.y ?? null;

  return (
    <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
      {/* Lines */}
      {sx != null && ex != null && (
        <Line
          x1={sx}
          y1={sy!}
          x2={ex}
          y2={ey!}
          stroke="#facc15"
          strokeWidth={4}
          strokeLinecap="round"
        />
      )}
      {ex != null && wx != null && (
        <Line
          x1={ex}
          y1={ey!}
          x2={wx}
          y2={wy!}
          stroke="#22c55e"
          strokeWidth={4}
          strokeLinecap="round"
        />
      )}

      {/* Points */}
      {sx != null && <Circle cx={sx} cy={sy!} r={6} fill="#38bdf8" />}
      {ex != null && <Circle cx={ex} cy={ey!} r={6} fill="#ec4899" />}
      {wx != null && <Circle cx={wx} cy={wy!} r={6} fill="#f97316" />}
    </Svg>
  );
};

export default React.memo(PoseOverlay);