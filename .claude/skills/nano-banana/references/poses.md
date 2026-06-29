# J-Poses Library

A library of refined, elegant photography poses inspired by Japanese editorial
styles. Each pose describes silhouette, line, and mood only — it does **not**
specify character appearance or environment. Append a chosen pose to a `--prompt`
(optionally combined with the `j-idol` preset) to direct framing and posture.

| Pose | Description |
|------|-------------|
| Sultry Seated Lean | Seated on a low chair, legs crossed elegantly, one arm resting on the top leg, upper body leaning slightly toward the lens for intimacy. |
| Over-the-Shoulder Glance | Standing with back to camera, head turned to the lens, one hand lightly on the hip, emphasizing the curve of the back. |
| Reclining Sofa Pose | Lying on a sofa on one side, propped on an elbow, the other hand on hip or thigh, legs slightly staggered for depth. |
| Graceful Tatami Kneel | Kneeling with hips on heels, back slightly arched, hands softly on the lap or brushing hair from the face. |
| Window-side Contemplation | Leaning a hip against a window sill, one arm raised touching the frame, gazing out with a soft, dreamy expression. |
| Side-Saddle Floor Sit | Sitting on the floor, both legs tucked to one side, one hand supporting weight behind, the other on the knee, creating a long flowing line. |
| Arching Stand | Standing tall, hands clasped behind the back, chest forward and back arched for a sophisticated, confident silhouette. |
| Soft Approach | Captured mid-stride toward the camera, gaze lowered with a subtle smile, one hand adjusting a sleeve or accessory. |
| Table-side Intimacy | Sitting at a cafe table, chin resting on a palm, the other arm across the table, drawing the viewer into personal space. |
| Languid Supine View | Lying flat on the back on a soft surface, head tilted slightly toward camera, arms loosely above the head, relaxed and elegant. |
| S-Curve Arch | Kneeling on a soft surface, torso twisted toward the camera, one hand pulling back hair, the other on the thigh, emphasizing the waist–hip line. |
| Asymmetrical Femoral-Cross | Seated upright, legs crossed (right over left), torso rotated slightly left, left hand on thigh, right hand at the collarbone, head tilted, gazing forward. |
| Affectionate Tuck | Seated, knees pulled to chest and hugged, gazing affectionately at the viewer. |
| Soft Embrace | Standing or kneeling, arms crossed at the waist, fingers lightly grazing the upper arms or shoulders. |
| Seated Recline | Sitting sideways with legs tucked, one arm supporting weight behind, the other resting on the waist, creating a dynamic diagonal line. |

Usage example:

```bash
python scripts/generate.py --preset j-idol --image char.png \
  --prompt "Pose: Graceful Tatami Kneel" --pro
```
