import confetti from 'canvas-confetti';

export const triggerNeonConfetti = () => {
  // Electric emerald & neon green palette
  const colors = ['#00ff66', '#10b981', '#34d399', '#a7f3d0', '#05df72', '#ffffff'];

  // Left burst
  confetti({
    particleCount: 40,
    angle: 60,
    spread: 55,
    origin: { x: 0.1, y: 0.8 },
    colors: colors,
    ticks: 200,
    gravity: 1.2,
    shapes: ['square', 'circle'],
    scalar: 0.9,
  });

  // Right burst
  confetti({
    particleCount: 40,
    angle: 120,
    spread: 55,
    origin: { x: 0.9, y: 0.8 },
    colors: colors,
    ticks: 200,
    gravity: 1.2,
    shapes: ['square', 'circle'],
    scalar: 0.9,
  });
};

