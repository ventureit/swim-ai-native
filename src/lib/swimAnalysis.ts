export type Phase = "Recovery" | "Catch" | "Pull";
export type Feedback = "Good Catch" | "Dropped Elbow" | null;

export interface Point2D {
  x: number;
  y: number;
}

export interface ArmKeypoints {
  shoulder: Point2D;
  elbow: Point2D;
  wrist: Point2D;
}

export interface SwimAnalysisState {
  phase: Phase;
  prevWrist: Point2D | null;
  prevElbowAngle: number | null;
}

export interface PhaseDetectionInput {
  keypoints: ArmKeypoints;
  previousState?: SwimAnalysisState;
}

export interface SwimAnalysisThresholds {
  recoveryToCatchMaxAngleDelta: number;
  catchToPullMaxAbsDy: number;
  catchToPullMaxDx: number;
  goodCatchMaxElbowAngle: number;
  droppedElbowMaxElbowAngle: number;
}

export interface SwimAnalysisResult {
  angle: number;
  phase: Phase;
  feedback: Feedback;
  nextState: SwimAnalysisState;
}

export const SWIM_ANALYSIS_THRESHOLDS: SwimAnalysisThresholds = {
  // Recovery -> Catch when angle is decreasing quickly.
  recoveryToCatchMaxAngleDelta: -5,
  // Catch -> Pull when wrist motion is mostly horizontal.
  catchToPullMaxAbsDy: 2,
  catchToPullMaxDx: -3,
  // Catch quality heuristics.
  goodCatchMaxElbowAngle: 120,
  droppedElbowMaxElbowAngle: 140,
};

export const INITIAL_SWIM_ANALYSIS_STATE: SwimAnalysisState = {
  phase: "Recovery",
  prevWrist: null,
  prevElbowAngle: null,
};

export function computeElbowAngle(
  shoulder: Point2D,
  elbow: Point2D,
  wrist: Point2D
): number {
  const v1x = shoulder.x - elbow.x;
  const v1y = shoulder.y - elbow.y;
  const v2x = wrist.x - elbow.x;
  const v2y = wrist.y - elbow.y;

  const dot = v1x * v2x + v1y * v2y;
  const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);

  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }

  const cos = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  const angleRad = Math.acos(cos);
  return (angleRad * 180) / Math.PI;
}

export function detectPhase(
  input: PhaseDetectionInput,
  angle: number,
  thresholds: SwimAnalysisThresholds = SWIM_ANALYSIS_THRESHOLDS
): Phase {
  const { keypoints, previousState = INITIAL_SWIM_ANALYSIS_STATE } = input;
  const { shoulder, wrist } = keypoints;

  const dx = previousState.prevWrist ? wrist.x - previousState.prevWrist.x : 0;
  const dy = previousState.prevWrist ? wrist.y - previousState.prevWrist.y : 0;
  const dAngle =
    previousState.prevElbowAngle != null ? angle - previousState.prevElbowAngle : 0;

  let phase = previousState.phase;

  if (
    phase === "Recovery" &&
    wrist.y > shoulder.y &&
    dAngle < thresholds.recoveryToCatchMaxAngleDelta
  ) {
    phase = "Catch";
  } else if (
    phase === "Catch" &&
    Math.abs(dy) < thresholds.catchToPullMaxAbsDy &&
    dx < thresholds.catchToPullMaxDx
  ) {
    phase = "Pull";
  } else if (phase === "Pull" && wrist.y < shoulder.y) {
    phase = "Recovery";
  }

  return phase;
}

export function getFeedback(
  angle: number,
  phase: Phase,
  keypoints: ArmKeypoints,
  thresholds: SwimAnalysisThresholds = SWIM_ANALYSIS_THRESHOLDS
): Feedback {
  const { shoulder, elbow, wrist } = keypoints;

  let feedback: Feedback = null;
  if (wrist.y > shoulder.y) {
    if (elbow.y < wrist.y && angle < thresholds.goodCatchMaxElbowAngle) {
      feedback = "Good Catch";
    } else if (
      elbow.y > wrist.y &&
      angle < thresholds.droppedElbowMaxElbowAngle
    ) {
      feedback = "Dropped Elbow";
    }
  }
  // phase is accepted as input so callers can keep decisions consistent
  // with their phase model, even though current feedback logic is geometry-based.
  void phase;

  return feedback;
}

export function analyzeSwimFrame(
  keypoints: ArmKeypoints,
  previousState: SwimAnalysisState = INITIAL_SWIM_ANALYSIS_STATE,
  thresholds: SwimAnalysisThresholds = SWIM_ANALYSIS_THRESHOLDS
): SwimAnalysisResult {
  const angle = computeElbowAngle(
    keypoints.shoulder,
    keypoints.elbow,
    keypoints.wrist
  );
  const phase = detectPhase({ keypoints, previousState }, angle, thresholds);
  const feedback = getFeedback(angle, phase, keypoints, thresholds);

  return {
    angle,
    phase,
    feedback,
    nextState: {
      phase,
      prevWrist: keypoints.wrist,
      prevElbowAngle: angle,
    },
  };
}
