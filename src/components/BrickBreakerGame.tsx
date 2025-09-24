import * as React from "react";
import levelsData, { Level, BrickSpec } from "@/data/levels";
import { showSuccess, showError } from "@/utils/toast";

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  sticky?: boolean;
  stuckToPaddle?: boolean;
  speed: number;
  color?: string;
};

type Paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
};

type Brick = BrickSpec & {
  id: string;
  px: number;
  py: number;
};

const CANVAS_BG = "#071024";

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

/**
 * Simple key state handler (global within this module instance)
 */
const keyState: Record<string, boolean> = {};

export default function BrickBreakerGame({ levelId }: { levelId?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const [score, setScore] = React.useState(0);
  const [lives, setLives] = React.useState(3);
  const [currentLevel, setCurrentLevel] = React.useState<Level | null>(null);
  const bricksRef = React.useRef<Brick[]>([]);
  const ballsRef = React.useRef<Ball[]>([]);
  const paddleRef = React.useRef<Paddle>({
    x: 0,
    y: 0,
    width: 140,
    height: 12,
    speed: 8,
  });
  const mouseXRef = React.useRef<number | null>(null);
  const lastTimeRef = React.useRef<number | null>(null);
  const [paused, setPaused] = React.useState(false);

  // Load chosen or default level
  React.useEffect(() => {
    const id = levelId || new URLSearchParams(window.location.search).get("level") || "1";
    const found = levelsData.find((l) => l.id === id) || levelsData[0];
    setCurrentLevel(found);
  }, [levelId]);

  // Core lifecycle: initialize canvas, game objects, input
  React.useEffect(() => {
    if (!currentLevel) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const DPR = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      const parent = canvas.parentElement ?? document.body;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * DPR;
      canvas.height = Math.max(480, rect.height * DPR);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${Math.max(480, rect.height)}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    // Build bricks
    const bricks: Brick[] = currentLevel.bricks.map((b, i) => ({
      ...b,
      id: `${currentLevel.id}-${i}`,
      px: b.x,
      py: b.y,
    }));
    bricksRef.current = bricks;

    // Paddle & balls
    const padd = paddleRef.current;
    padd.width = 140;
    padd.height = 12;
    padd.x = (canvas.width / DPR) / 2 - padd.width / 2;
    padd.y = (canvas.height / DPR) - 60;
    padd.speed = 8;

    ballsRef.current = [
      {
        x: (canvas.width / DPR) / 2,
        y: padd.y - 12,
        vx: 0,
        vy: -4,
        radius: 8,
        speed: 5,
        sticky: false,
        stuckToPaddle: true,
        color: "#FFFFFF",
      },
    ];

    setScore(0);
    setLives(3);
    setPaused(false);
    lastTimeRef.current = null;

    // Keyboard handlers
    const onKeyDown = (e: KeyboardEvent) => {
      keyState[e.key] = true;
      // space to launch
      if (e.key === " " || e.key === "Spacebar") {
        ballsRef.current.forEach((b) => {
          if (b.stuckToPaddle) {
            b.stuckToPaddle = false;
            b.vx = (Math.random() * 2 - 1) * 3;
            b.vy = -Math.abs(b.speed);
          }
        });
      }
      if (e.key === "p") {
        setPaused((s) => !s);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keyState[e.key] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Touch controls
    const onTouch = (ev: TouchEvent) => {
      const t = ev.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = (t.clientX - rect.left);
      paddleRef.current.x = clamp(x - padd.width / 2, 0, canvas.width / DPR - padd.width);
      mouseXRef.current = x;
    };
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("touchstart", onTouch, { passive: true });

    // Mouse move
    const onMouse = (ev: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      mouseXRef.current = x;
    };
    canvas.addEventListener("mousemove", onMouse);

    // Tilt controls
    const onTilt = (ev: DeviceOrientationEvent) => {
      if (typeof ev.gamma === "number") {
        const ratio = clamp((ev.gamma + 30) / 60, 0, 1);
        paddleRef.current.x = ratio * ((canvas.width / DPR) - paddleRef.current.width);
      }
    };
    window.addEventListener("deviceorientation", onTilt);

    // Main loop
    const loop = (t: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = t;
      const dt = Math.min(32, t - lastTimeRef.current);
      lastTimeRef.current = t;

      if (!paused) {
        update(dt / 16.6667, canvas, ctx, DPR, padd, bricks);
      }

      render(ctx, canvas, DPR, padd, bricks);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("mousemove", onMouse);
      window.removeEventListener("deviceorientation", onTilt);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel, paused]);

  function spawnPowerup(x: number, y: number, type: NonNullable<BrickSpec["powerup"]>) {
    if (type === "multi") {
      const existing = ballsRef.current[0];
      const newBall: Ball = {
        x: existing.x + 16 * (Math.random() > 0.5 ? 1 : -1),
        y: existing.y,
        vx: (Math.random() * 2 - 1) * 3,
        vy: -Math.abs(existing.speed),
        radius: 8,
        speed: existing.speed,
        sticky: false,
        stuckToPaddle: false,
      };
      ballsRef.current.push(newBall);
      showSuccess("Multi-ball activated!");
    } else if (type === "big") {
      paddleRef.current.width = clamp(paddleRef.current.width * 1.5, 100, 300);
      setTimeout(() => {
        paddleRef.current.width = 140;
      }, 12000);
      showSuccess("Bigger paddle!");
    } else if (type === "sticky") {
      ballsRef.current.forEach((b) => (b.sticky = true));
      setTimeout(() => {
        ballsRef.current.forEach((b) => (b.sticky = false));
      }, 10000);
      showSuccess("Sticky ball enabled!");
    } else if (type === "laser") {
      showSuccess("Laser fired!");
      const arr = bricksRef.current.filter((b) => b.hits > 0);
      if (arr.length > 0) {
        const pick = arr[Math.floor(Math.random() * arr.length)];
        pick.hits = 0;
      }
    }
  }

  function update(
    dt: number,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    DPR: number,
    paddle: Paddle,
    bricks: Brick[]
  ) {
    const width = canvas.width / DPR;
    const height = canvas.height / DPR;

    // Paddle movement: follow mouseX if present, otherwise keyboard
    if (mouseXRef.current !== null) {
      paddle.x = clamp(mouseXRef.current - paddle.width / 2, 0, width - paddle.width);
    } else {
      // keyboard
      if (keyState["ArrowLeft"] || keyState["a"]) {
        paddle.x = clamp(paddle.x - paddle.speed * dt, 0, width - paddle.width);
      } else if (keyState["ArrowRight"] || keyState["d"]) {
        paddle.x = clamp(paddle.x + paddle.speed * dt, 0, width - paddle.width);
      }
    }

    // Ball physics and collisions
    const balls = ballsRef.current;
    for (let bi = balls.length - 1; bi >= 0; bi--) {
      const ball = balls[bi];

      if (ball.stuckToPaddle) {
        ball.x = paddle.x + paddle.width / 2;
        ball.y = paddle.y - ball.radius - 2;
        continue;
      }

      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      // Wall collisions
      if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius;
        ball.vx = Math.abs(ball.vx);
      } else if (ball.x + ball.radius >= width) {
        ball.x = width - ball.radius;
        ball.vx = -Math.abs(ball.vx);
      }
      if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        ball.vy = Math.abs(ball.vy);
      }

      // Paddle collision
      if (ball.y + ball.radius >= paddle.y && ball.y - ball.radius < paddle.y + paddle.height) {
        if (ball.x >= paddle.x && ball.x <= paddle.x + paddle.width && ball.vy > 0) {
          const relative = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2); // -1..1
          const maxAngle = (75 * Math.PI) / 180;
          const angle = relative * maxAngle;
          const speed = Math.max(4, Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy));
          ball.vx = speed * Math.sin(angle);
          ball.vy = -Math.abs(speed * Math.cos(angle));

          if ((ball.sticky || ball.stuckToPaddle) && !ball.stuckToPaddle) {
            ball.stuckToPaddle = true;
          }
        }
      }

      // Brick collisions (AABB vs circle)
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        if (b.hits <= 0) continue;

        // brick layout math
        const brickW = Math.max(30, width / Math.max(12, 14));
        const brickH = 22;
        const bx = b.x * brickW + 20;
        const by = 40 + b.y * (brickH + 6);

        const closestX = clamp(ball.x, bx, bx + brickW - 2);
        const closestY = clamp(ball.y, by, by + brickH - 2);
        const dx = ball.x - closestX;
        const dy = ball.y - closestY;
        const dist2 = dx * dx + dy * dy;
        if (dist2 <= ball.radius * ball.radius) {
          // simple response: invert y or x depending on penetration
          const overlapX = Math.abs(dx);
          const overlapY = Math.abs(dy);
          if (overlapX > overlapY) {
            ball.vx = -ball.vx;
          } else {
            ball.vy = -ball.vy;
          }

          b.hits = Math.max(0, b.hits - 1);
          if (b.hits === 0) {
            setScore((s) => s + 100);
            if (b.powerup) {
              // spawn immediate powerup for demo
              spawnPowerup(bx + brickW / 2, by + brickH / 2, b.powerup);
            }
          } else {
            setScore((s) => s + 25);
          }
          break;
        }
      }

      // Ball fell below paddle
      if (ball.y - ball.radius > height) {
        // remove this ball
        balls.splice(bi, 1);
      }
    }

    // If no balls remain, lose a life and respawn a stuck ball
    if (ballsRef.current.length === 0) {
      setLives((l) => {
        const newLives = l - 1;
        if (newLives <= 0) {
          showError("Game over — out of lives");
          // restart level
          setTimeout(() => {
            window.location.reload();
          }, 800);
        } else {
          // respawn ball
          ballsRef.current.push({
            x: paddleRef.current.x + paddleRef.current.width / 2,
            y: paddleRef.current.y - 12,
            vx: 0,
            vy: -4,
            radius: 8,
            speed: 5,
            stuckToPaddle: true,
            sticky: false,
            color: "#fff",
          });
        }
        return newLives;
      });
    }

    // Win detection: all bricks with hits <= 0
    const remaining = bricksRef.current.some((b) => b.hits > 0);
    if (!remaining) {
      showSuccess("Level cleared!");
      // simple level progression: go to next level if available
      const idx = levelsData.findIndex((l) => l.id === (currentLevel?.id ?? ""));
      const next = levelsData[idx + 1];
      if (next) {
        setTimeout(() => {
          setCurrentLevel(next);
        }, 700);
      } else {
        showSuccess("You completed all levels!");
      }
    }
  }

  function render(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, DPR: number, paddle: Paddle, bricks: Brick[]) {
    const width = canvas.width / DPR;
    const height = canvas.height / DPR;

    // clear
    ctx.save();
    ctx.scale(DPR, DPR);
    // background gradient
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, CANVAS_BG);
    g.addColorStop(1, "#07182a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    // draw bricks
    const brickW = Math.max(30, width / Math.max(12, 14));
    const brickH = 22;
    for (let i = 0; i < bricks.length; i++) {
      const b = bricks[i];
      if (b.hits <= 0) continue;
      const bx = b.x * brickW + 20;
      const by = 40 + b.y * (brickH + 6);
      ctx.fillStyle = b.color ?? "#60a5fa";
      ctx.fillRect(bx, by, brickW - 2, brickH);
      // hits overlay
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.font = "12px system-ui";
      ctx.fillText(String(b.hits), bx + 6, by + 14);
      // powerup marker
      if (b.powerup) {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillRect(bx + (brickW - 8) - 6, by + 4, 8, 8);
      }
    }

    // draw paddle
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, paddle.x, paddle.y, paddle.width, paddle.height, 6);
    ctx.fill();

    // draw balls
    const balls = ballsRef.current;
    for (let i = 0; i < balls.length; i++) {
      const ball = balls[i];
      ctx.beginPath();
      ctx.fillStyle = ball.color ?? "#fff";
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // HUD
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "14px system-ui";
    ctx.fillText(`Score: ${score}`, 24, 24);
    ctx.fillText(`Lives: ${lives}`, width - 90, 24);
    if (paused) {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "28px system-ui";
      ctx.fillText("PAUSED", width / 2 - 48, height / 2);
    }

    ctx.restore();
  }

  // small helper to draw rounded rect path
  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const radius = Math.min(r, h / 2, w / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  return (
    <div className="w-full h-full relative text-white">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute left-4 top-4 text-sm pointer-events-none">{/* placeholder for additional UI */}</div>
      <div className="absolute right-4 top-4 text-sm pointer-events-none">Score: {score}</div>
    </div>
  );
}