import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./BirthdaySurprise.css";

/**
 * Surprise unlocks at the **start of this calendar day** (local time on your device).
 * Change the year if you re-use this for another year.
 * Note: this is only checked in the browser — not secure against devtools / clock changes.
 */
const BIRTHDAY_UNLOCK = new Date(2026, 3, 26, 0, 0, 0, 0);

function isPastUnlock() {
  return Date.now() >= BIRTHDAY_UNLOCK.getTime();
}
// asdfsadfsadfasfdasfdasfdsafdasdfasdf
function useUnlockState() {
  const [unlocked, setUnlocked] = useState(() => isPastUnlock());
  useEffect(() => {
    if (isPastUnlock()) {
      setUnlocked(true);
      return undefined;
    }
    const id = window.setInterval(() => {
      if (isPastUnlock()) {
        setUnlocked(true);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, []);
  return unlocked;
}

function CountdownToBirthday() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const target = BIRTHDAY_UNLOCK.getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 864e5);
  const hours = Math.floor((diff % 864e5) / 36e5);
  const minutes = Math.floor((diff % 36e5) / 6e4);
  const seconds = Math.floor((diff % 6e4) / 1e3);

  const n2 = (n) => String(n).padStart(2, "0");
  const dateLabel = BIRTHDAY_UNLOCK.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="birthday-locked-root" aria-label="Countdown to surprise">
      <div className="birthday-locked-veil" aria-hidden />
      <div className="birthday-locked-ambient" aria-hidden />
      <div className="birthday-locked-inner">
        <p className="birthday-locked-badge">a surprise is waiting for you</p>
        <h1 className="birthday-locked-title">Not quite yet, love</h1>
        <p className="birthday-locked-sub">
          Something beautiful is on its way. Come back when the day arrives.
        </p>
        <p className="birthday-locked-date">{dateLabel}</p>
        <div className="countdown-grid" role="timer" aria-live="polite">
          <div className="countdown-box">
            <span className="countdown-value">
              {days < 10 ? n2(days) : String(days)}
            </span>
            <span className="countdown-label">days</span>
          </div>
          <div className="countdown-sep" aria-hidden>
            :
          </div>
          <div className="countdown-box">
            <span className="countdown-value">{n2(hours)}</span>
            <span className="countdown-label">hours</span>
          </div>
          <div className="countdown-sep" aria-hidden>
            :
          </div>
          <div className="countdown-box">
            <span className="countdown-value">{n2(minutes)}</span>
            <span className="countdown-label">min</span>
          </div>
          <div className="countdown-sep" aria-hidden>
            :
          </div>
          <div className="countdown-box">
            <span className="countdown-value">{n2(seconds)}</span>
            <span className="countdown-label">sec</span>
          </div>
        </div>
        <p className="birthday-locked-hint">
          Until then, this page stays a secret. ♡
        </p>
      </div>
    </div>
  );
}

const BALLOON_MSGS = [
  { emoji: "💌", text: "You are my favourite notification." },
  { emoji: "🌹", text: "Every day with you is my best day." },
  { emoji: "✨", text: "You make my whole world brighter." },
  { emoji: "🦋", text: "My heart still skips when I see you." },
  { emoji: "🌙", text: "I fall for you more every single night." },
];

const BALLOON_COLORS = [
  "#e8446e",
  "#ff6b9d",
  "#c0244e",
  "#ff9bb5",
  "#8a1840",
  "#ffb3cc",
];

const REASONS = [
  ["01", "The way your eyes light up when you talk about things you love."],
  ["02", "Your laugh — it fills every room and reminds me why I fell for you."],
  [
    "03",
    "You care for everyone quietly, without asking for anything in return.",
  ],
  ["04", "You make me a better person just by being you. Every single day."],
  ["05", "Every moment with you still feels like the best moment of my day."],
];

/** Shown when the wheel always lands on ME! — a different message each spin */
const WHEEL_PRIZE_MESSAGES = [
  {
    emoji: "👨‍❤️‍👩",
    lead: "You got…",
    prize: "ME!",
    sub: "The wheel isn’t wrong — the universe just agrees with me. You’re my prize, every time. ♡",
  },
  {
    emoji: "🌹",
    lead: "Lucky you — it’s",
    prize: "ME",
    sub: "Every spin, every time. Some things aren’t left to chance — you’re the reason I still believe in fate. ♡",
  },
  {
    emoji: "✨",
    lead: "No surprise: it’s",
    prize: "ME!",
    sub: "Rigged? Maybe. But my heart was rigged for you the day we met. I’d choose you in every life. ♡",
  },
  {
    emoji: "💫",
    lead: "The treat is",
    prize: "ME",
    sub: "Cake, flowers, and diamonds can wait — the best gift in the room is still right here, loving you. ♡",
  },
  {
    emoji: "💋",
    lead: "Forever, it’s",
    prize: "ME & YOU",
    sub: "The wheel whispers what I scream in my head: I’m not going anywhere, love. We’re the jackpot. ♡",
  },
  {
    emoji: "🤍",
    lead: "Your soul prize:",
    prize: "ME",
    sub: "I’d let you “win” this a thousand times. You are my favourite plot twist, my home, my always. ♡",
  },
];

/** After the love meter shatters at 100% — romantic “infinite” lines */
const METER_SPARK_COUNT = 22;

const METER_INFINITE_MESSAGES = [
  {
    gasp: "Oh no… the meter can’t take it",
    line: "Your love doesn’t stop at 100% — it goes on forever, past every line I could ever draw. ♡",
  },
  {
    gasp: "Error: infinite love detected",
    line: "The gauge broke, but I’m not even surprised. My love for you was never made to be measured. ♡",
  },
  {
    gasp: "It shattered… in the best way",
    line: "There isn’t a bar long enough in this world. What I feel for you is endless, and I still find new ways to love you. ♡",
  },
  {
    gasp: "100%? That was just the start",
    line: "You overflow every boundary — in my heart, in my days, in every small moment we share. Infinite doesn’t even cover it. ♡",
  },
  {
    gasp: "The numbers gave up on us",
    line: "They were never going to be enough. You are more than a percentage — you’re my every tomorrow. ♡",
  },
  {
    gasp: "Oops — the meter’s gone eternal",
    line: "All that love had nowhere to go but everywhere. I’m still falling for you, and there’s no bottom. ♡",
  },
];

const WHEEL_SLICE_DATA = [
  { label: "🌸 Flowers", color: "#e8446e", deg: 52 },
  { label: "🎁 Gift", color: "#b01f45", deg: 52 },
  { label: "🍫 Chocolate", color: "#ff6b9d", deg: 52 },
  { label: "💐 Bouquet", color: "#7a1030", deg: 52 },
  { label: "💎 Jewellery", color: "#c0244e", deg: 52 },
  { label: "🧸 Teddy", color: "#6b1236", deg: 52 },
  { label: "🎂 Cake", color: "#d0305a", deg: 30 },
  { label: "ME!", color: "#ff9bb5", deg: 16, isMe: true },
];

const SIZE = 270;
const cx = 135;
const cy = 135;
const R = 128;

function polar(deg, r) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(s, e) {
  const p1 = polar(s, R);
  const p2 = polar(e, R);
  const large = e - s > 180 ? 1 : 0;
  return `M${cx},${cy} L${p1.x},${p1.y} A${R},${R} 0 ${large},1 ${p2.x},${p2.y} Z`;
}

function buildWheelSlices() {
  const slices = [];
  let cum = 0;
  WHEEL_SLICE_DATA.forEach((s) => {
    slices.push({
      ...s,
      start: cum,
      end: cum + s.deg,
      mid: cum + s.deg / 2,
    });
    cum += s.deg;
  });
  return slices;
}

/** White envelope with red heart — centered on the envelope (seal) */
function EnvelopeWithHeart() {
  return (
    <svg
      className="env-seal-icon"
      viewBox="0 0 80 64"
      width="72"
      height="56"
      aria-hidden
    >
      <title>Letter seal</title>
      <path
        fill="#faf8fa"
        stroke="#141018"
        strokeWidth="1.4"
        strokeLinejoin="round"
        d="M8 24h64v32H8V24z"
      />
      <path fill="#cde4f0" fillOpacity="0.9" d="M10 26h60v5H10z" />
      <path
        fill="#f4eef1"
        stroke="#141018"
        strokeWidth="1.2"
        strokeLinejoin="round"
        d="M8 24L40 44L72 24L40 8L8 24z"
      />
      <g filter="url(#envHeartShade)">
        <g transform="translate(23, -2) scale(1.35)">
          <path
            fill="#d81845"
            stroke="#120810"
            strokeWidth="0.5"
            d="M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z"
            transform="translate(0,2)"
          />
        </g>
      </g>
      <defs>
        <filter id="envHeartShade" x="-2" y="-4" width="40" height="40">
          <feDropShadow dx="0" dy="10" stdDeviation="1.1" floodOpacity="0.4" />
        </filter>
      </defs>
    </svg>
  );
}

function Petals() {
  const items = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const w = 10 + Math.random() * 8;
        const h = w * 1.4;
        return {
          id: i,
          w,
          h,
          left: 5 + Math.random() * 90,
          hue: 340 + Math.random() * 20,
          light: 56 + Math.random() * 16,
          rot: Math.random() * 360,
          duration: 7 + Math.random() * 8,
          delay: Math.random() * 10,
        };
      }),
    [],
  );

  return (
    <div className="petals" aria-hidden>
      {items.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            width: p.w,
            height: p.h,
            left: `${p.left}%`,
            background: `hsl(${p.hue}, 80%, ${p.light}%)`,
            transform: `rotate(${p.rot}deg)`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function Confetti({ pieces }) {
  if (!pieces.length) return null;
  return (
    <div className="confetti-wrap" aria-hidden>
      {pieces.map((d) => (
        <div
          key={d.id}
          className="confetti-piece"
          style={{
            left: `${d.left}%`,
            width: d.sz,
            height: d.sz,
            background: d.color,
            borderRadius: d.round ? "50%" : "2px",
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

const CONFETTI_COLORS = [
  "#e8446e",
  "#ff9bb5",
  "#ffb3cc",
  "#c0244e",
  "#ffd6e3",
  "#ff6b9d",
  "#fff0f5",
  "#f5c842",
];

/** Rich gold / starlight for “divine” moments */
const CONFETTI_DIVINE = [
  "#f5c842",
  "#fff8e7",
  "#ffd6a0",
  "#ffe4b5",
  "#ff9bb5",
  "#fff0f5",
  "#e8d4a8",
  "#ffffff",
];

const WISH_PILL_MESSAGES = [
  "Your name is the shape my prayers take. ♡",
  "If I could name one star, it would be yours. ✦",
  "In every world I’d still find the road back to you.",
  "This love isn’t a feeling — it’s a law of my universe. ♡",
  "The night sky learned how to smile when it saw you. ✦",
  "Forever is only the first word. The rest I whisper to you. ♡",
];

const SECRET_ROSE_BLESSING =
  "You weren’t just meant to be held — you were meant to be held like this, like forever isn’t long enough. ✦";

function useConfetti() {
  const [confettiPieces, setConfettiPieces] = useState([]);

  const triggerConfetti = useCallback((variant = "romantic") => {
    const colors = variant === "divine" ? CONFETTI_DIVINE : CONFETTI_COLORS;
    const n = variant === "divine" ? 64 : 50;
    setConfettiPieces(
      Array.from({ length: n }, (_, i) => {
        const sz = 6 + Math.random() * (variant === "divine" ? 9 : 8);
        return {
          id: `cf-${Date.now()}-${i}`,
          left: 5 + Math.random() * 90,
          sz,
          color: colors[Math.floor(Math.random() * colors.length)],
          round: Math.random() > 0.45,
          dur: 1.5 + Math.random() * 2,
          delay: Math.random() * 0.4,
        };
      }),
    );
    setTimeout(() => setConfettiPieces([]), 3800);
  }, []);

  return { confettiPieces, triggerConfetti };
}

function DivineAmbient() {
  const stars = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: ((i * 17.2) % 88) + 3,
        y: ((i * 13.7 + 5) % 90) + 2,
        s: 0.4 + (i % 4) * 0.2,
        d: 2.2 + (i % 5) * 0.5,
        op: 0.12 + (i % 5) * 0.06,
        delay: (i * 0.16) % 2.2,
      })),
    [],
  );
  return (
    <div className="divine-ambient" aria-hidden>
      {stars.map((s) => (
        <span
          key={s.id}
          className="divine-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s * 2.8,
            height: s.s * 2.8,
            opacity: s.op,
            animationDuration: `${s.d + 2.2}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function Reveal({
  as: Comp = "div",
  className = "",
  style,
  children,
  delay = 0,
}) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setOn(true);
          ob.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -2% 0px" },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  const st = { ...style, ...(delay ? { transitionDelay: `${delay}ms` } : {}) };
  return (
    <Comp
      ref={ref}
      className={`reveal${on ? " reveal--in" : ""} ${className}`.trim()}
      style={st}
    >
      {children}
    </Comp>
  );
}

function ScratchCanvas() {
  const canvasRef = useRef(null);
  const revealedRef = useRef(false);
  const [faded, setFaded] = useState(false);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let scratching = false;
    revealedRef.current = false;

    function drawLayer() {
      const w = canvas.offsetWidth || 290;
      const h = canvas.offsetHeight || 92;
      if (w === 0 || h === 0) return;
      canvas.width = w;
      canvas.height = h;
      ctx.fillStyle = "#5a1636";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,.22)";
      ctx.font = "bold 13px Georgia";
      ctx.textAlign = "center";
      ctx.fillText("✦  scratch me  ✦", w / 2, h / 2 + 5);
    }

    const t = setTimeout(drawLayer, 100);
    const ro = new ResizeObserver(() => {
      if (!revealedRef.current) drawLayer();
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    function getPos(e) {
      const r = canvas.getBoundingClientRect();
      const src = e.touches ? e.touches[0] : e;
      return [src.clientX - r.left, src.clientY - r.top];
    }

    function scratch(x, y) {
      if (revealedRef.current) return;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let cleared = 0;
      for (let i = 3; i < d.length; i += 4) {
        if (d[i] < 128) cleared += 1;
      }
      if (cleared / (canvas.width * canvas.height) > 0.45) {
        revealedRef.current = true;
        setFaded(true);
      }
    }

    const onDown = (e) => {
      scratching = true;
      scratch(...getPos(e));
    };
    const onMove = (e) => {
      if (scratching) scratch(...getPos(e));
    };
    const onUp = () => {
      scratching = false;
    };
    const onTouchStart = (e) => {
      e.preventDefault();
      scratching = true;
      scratch(...getPos(e));
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      if (scratching) scratch(...getPos(e));
    };
    const onTouchEnd = () => {
      scratching = false;
    };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      clearTimeout(t);
      ro.disconnect();
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="scratch-canvas"
      style={{ touchAction: "none", opacity: faded ? 0 : 1 }}
    />
  );
}

function WheelSvg({ wheelRot, transition }) {
  const slices = useMemo(() => buildWheelSlices(), []);

  return (
    <svg
      className="wheel-svg"
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{
        transform: `rotate(${wheelRot}deg)`,
        transition,
      }}
    >
      <circle
        cx={cx}
        cy={cy}
        r={R + 5}
        fill="none"
        stroke="rgba(232,68,110,.3)"
        strokeWidth="8"
      />
      {slices.map((s) => {
        const lp = s.isMe ? polar(s.mid, R * 0.78) : polar(s.mid, R * 0.65);
        return (
          <g key={s.label + s.start}>
            <path
              d={arcPath(s.start, s.end)}
              fill={s.color}
              stroke="#1a0a14"
              strokeWidth="1.5"
            />
            <text
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={s.isMe ? 11 : s.deg >= 50 ? 11 : 10}
              fill={s.isMe ? "#1a0a14" : "rgba(255,245,248,.93)"}
              fontFamily="sans-serif"
              fontWeight={s.isMe ? "bold" : "normal"}
            >
              {s.label}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="24" fill="#1a0a14" />
      <circle cx={cx} cy={cy} r="15" fill="#e8446e" />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fill="#fff5f8"
      >
        ♡
      </text>
    </svg>
  );
}

function BirthdaySurpriseInner() {
  const { confettiPieces, triggerConfetti } = useConfetti();

  const [envOpened, setEnvOpened] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const [balloonPhase, setBalloonPhase] = useState({});
  const [poppedCount, setPoppedCount] = useState(0);
  const msgCursorRef = useRef(0);
  const [popup, setPopup] = useState(null);

  const [meterPhase, setMeterPhase] = useState("idle");
  const [meterWidth, setMeterWidth] = useState(0);
  const [showMeterPct, setShowMeterPct] = useState(false);
  const [meterBarDone, setMeterBarDone] = useState(false);
  const [meterBroke, setMeterBroke] = useState(false);
  const [displayMeterIndex, setDisplayMeterIndex] = useState(0);
  const [meterStatusMode, setMeterStatusMode] = useState("hint");
  const [meterBtnText, setMeterBtnText] = useState("measure our love ♡");
  const [meterBtnDisabled, setMeterBtnDisabled] = useState(false);
  const meterIntervalRef = useRef(null);
  const meterMessageIndexRef = useRef(0);
  const wheelPrizeIndexRef = useRef(0);

  const [wheelRot, setWheelRot] = useState(0);
  const [wheelTransition, setWheelTransition] = useState("none");
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [showWheelResult, setShowWheelResult] = useState(false);
  const [wheelPrize, setWheelPrize] = useState(WHEEL_PRIZE_MESSAGES[0]);
  const [spinBtnText, setSpinBtnText] = useState("spin the wheel ♡");
  const wheelTotalRotRef = useRef(0);
  const [heroIn, setHeroIn] = useState(false);
  const [divineToast, setDivineToast] = useState(null);
  const roseBlessTimer = useRef(null);
  const skipNextRoseTap = useRef(false);

  const clearRoseBless = useCallback(() => {
    if (roseBlessTimer.current) {
      clearTimeout(roseBlessTimer.current);
      roseBlessTimer.current = null;
    }
  }, []);

  const onRoseBlessStart = useCallback(() => {
    clearRoseBless();
    roseBlessTimer.current = setTimeout(() => {
      roseBlessTimer.current = null;
      setDivineToast(SECRET_ROSE_BLESSING);
      triggerConfetti("divine");
      skipNextRoseTap.current = true;
      setTimeout(() => {
        skipNextRoseTap.current = false;
      }, 500);
    }, 1700);
  }, [clearRoseBless, triggerConfetti]);

  const onRoseQuickTap = useCallback(() => {
    if (skipNextRoseTap.current) return;
    triggerConfetti();
  }, [triggerConfetti]);

  const onRandomWish = useCallback(() => {
    setDivineToast(
      WISH_PILL_MESSAGES[Math.floor(Math.random() * WISH_PILL_MESSAGES.length)],
    );
    triggerConfetti();
  }, [triggerConfetti]);

  const openEnvelope = () => {
    if (envOpened) return;
    setEnvOpened(true);
    triggerConfetti();
    setTimeout(() => setShowLetter(true), 700);
  };

  const popBalloon = (i) => {
    if (balloonPhase[i] === "empty" || balloonPhase[i] === "burst") return;

    setBalloonPhase((p) => ({ ...p, [i]: "burst" }));
    setPoppedCount((c) => c + 1);
    setTimeout(() => {
      setBalloonPhase((p) => ({ ...p, [i]: "empty" }));
    }, 300);

    const msg = BALLOON_MSGS[msgCursorRef.current % BALLOON_MSGS.length];
    msgCursorRef.current += 1;
    setPopup(msg);
    triggerConfetti();
  };

  const clearMeter = useCallback(() => {
    if (meterIntervalRef.current) {
      clearInterval(meterIntervalRef.current);
      meterIntervalRef.current = null;
    }
  }, []);

  useEffect(() => () => clearMeter(), [clearMeter]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHeroIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!divineToast) return undefined;
    const t = setTimeout(() => setDivineToast(null), 5200);
    return () => clearTimeout(t);
  }, [divineToast]);

  const runMeter = useCallback(() => {
    clearMeter();
    setMeterBroke(false);
    setMeterPhase("filling");
    setMeterWidth(0);
    setMeterBarDone(false);
    setShowMeterPct(false);
    setMeterBtnDisabled(true);
    setMeterBtnText("measuring our love…");
    setMeterStatusMode("measuring");

    let v = 0;
    meterIntervalRef.current = setInterval(() => {
      v += Math.random() * 6 + 3;
      if (v >= 100) {
        v = 100;
        clearMeter();
        setMeterWidth(100);
        setShowMeterPct(true);
        setMeterPhase("full-wait");
        setMeterBtnText("100%… wait… 👀");
        setMeterStatusMode("full-wait");

        setTimeout(() => {
          setMeterBroke(true);
          setMeterPhase("breaking");
          setMeterStatusMode("breaking");
          triggerConfetti();
        }, 380);

        setTimeout(() => {
          const idx =
            meterMessageIndexRef.current % METER_INFINITE_MESSAGES.length;
          meterMessageIndexRef.current += 1;
          setDisplayMeterIndex(idx);
          setMeterPhase("done");
          setMeterBarDone(true);
          setMeterStatusMode("result");
          setMeterBroke(true);
          setMeterBtnDisabled(false);
          setMeterBtnText("measure again ♡");
          triggerConfetti();
        }, 1120);
      } else {
        v = Math.round(v);
        setMeterWidth(v);
        setShowMeterPct(v > 15);
        setMeterBtnText("measuring our love…");
      }
    }, 55);
  }, [clearMeter, triggerConfetti]);

  const handleMeterClick = () => {
    if (
      meterPhase === "filling" ||
      meterPhase === "full-wait" ||
      meterPhase === "breaking"
    )
      return;
    if (meterPhase === "done") {
      setMeterWidth(0);
      setShowMeterPct(false);
      setMeterBarDone(false);
      setMeterBroke(false);
      setMeterStatusMode("hint");
      setMeterBtnText("measure our love ♡");
    }
    if (meterPhase === "done" || meterPhase === "idle") {
      runMeter();
    }
  };

  const spinWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    setShowWheelResult(false);
    setSpinBtnText("spinning… 🌀");
    setWheelTransition("transform 4.2s cubic-bezier(0.17,0.67,0.08,1)");
    const TARGET_MOD = 8;
    const fullSpins = 6 + Math.floor(Math.random() * 3);
    const currentMod = ((wheelTotalRotRef.current % 360) + 360) % 360;
    let extra = (TARGET_MOD - currentMod + 360) % 360;
    if (extra === 0) extra = 360;
    const newRot = wheelTotalRotRef.current + fullSpins * 360 + extra;
    wheelTotalRotRef.current = newRot;
    setWheelRot(newRot);

    setTimeout(() => {
      const pi = wheelPrizeIndexRef.current % WHEEL_PRIZE_MESSAGES.length;
      wheelPrizeIndexRef.current += 1;
      setWheelPrize(WHEEL_PRIZE_MESSAGES[pi]);
      setWheelSpinning(false);
      setWheelTransition("none");
      setShowWheelResult(true);
      setSpinBtnText("spin again ♡");
      triggerConfetti();
    }, 4300);
  };

  const balloonHintText =
    poppedCount === 0
      ? "tap each balloon ♡"
      : poppedCount < 6
        ? `${poppedCount} of 6 — keep going!`
        : "you found all the love! 🎉";

  return (
    <div className="birthday-surprise-root">
      <div className="divine-vignette" aria-hidden />
      <div className="divine-atmosphere" aria-hidden />
      <DivineAmbient />
      <Petals />
      <Confetti pieces={confettiPieces} />

      {divineToast && (
        <div className="divine-toast" role="status">
          <p className="divine-toast-text">{divineToast}</p>
          <button
            type="button"
            className="divine-toast-close"
            onClick={() => setDivineToast(null)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <button
        type="button"
        className="divine-wish-pill"
        onClick={onRandomWish}
        title="A whispered wish for you"
      >
        <span className="divine-wish-ico" aria-hidden>
          ✦
        </span>
        <span>make a wish</span>
      </button>

      {popup && (
        <div
          className="balloon-popup-overlay"
          role="dialog"
          onClick={(e) => e.target === e.currentTarget && setPopup(null)}
        >
          <div className="balloon-popup">
            <button
              type="button"
              className="popup-close"
              onClick={() => setPopup(null)}
              aria-label="Close"
            >
              🌹
            </button>
            <span className="popup-emoji">{popup.emoji}</span>
            <p className="popup-msg">{popup.text}</p>
          </div>
        </div>
      )}

      <div className="page">
        <div className={`hero${heroIn ? " hero--in" : ""}`}>
          <p className="hero-verse" aria-hidden>
            the universe left the best for last — you.
          </p>
          <div
            className="hero-rose-wrap"
            onClick={onRoseQuickTap}
            onKeyDown={(e) => e.key === "Enter" && onRoseQuickTap()}
            onMouseDown={onRoseBlessStart}
            onMouseUp={clearRoseBless}
            onMouseLeave={clearRoseBless}
            onTouchStart={onRoseBlessStart}
            onTouchEnd={clearRoseBless}
            role="button"
            tabIndex={0}
          >
            <div className="hero-rose-pulse">
              <div className="hero-rose">🌹</div>
            </div>
            <span className="hero-rose-hint">
              tap · hold to unlock something sacred
            </span>
          </div>
          <span className="hero-badge">a surprise, just for you</span>
          <h1 className="hero-title">
            Happy Birthday,
            <br />
            <em>My Love</em>
          </h1>
          <p className="hero-sub">
            Today the whole world celebrates the day you arrived in it — and I
            celebrate the day my life got infinitely better.
          </p>
        </div>

        <Reveal as="section" className="card" delay={50}>
          <span className="card-label">a letter from my heart</span>
          <div className="envelope-wrap">
            <div
              className="envelope"
              onClick={openEnvelope}
              onKeyDown={(e) => e.key === "Enter" && openEnvelope()}
              role="button"
              tabIndex={0}
            >
              <div className="env-body" />
              <div className={`env-flap${envOpened ? " open" : ""}`} />
              <div className="env-left" />
              <div className="env-right" />
              {!envOpened && (
                <div className="env-heart" aria-hidden>
                  <EnvelopeWithHeart />
                </div>
              )}
            </div>
            {!envOpened && <p className="env-hint">tap the envelope ♡</p>}
            {showLetter && (
              <div className="letter">
                <p className="letter-dear">My dearest,</p>
                <p className="letter-body">
                  Every morning I wake up grateful that I get to share this life
                  with you. You make ordinary days feel magical, and every
                  birthday you have is a reminder of how lucky I am to love you.
                  <br />
                  <br />
                  You are my favourite person in every room, in every moment, in
                  every universe where we could exist. Today is all about you —
                  just like every day in my heart is.
                </p>
                <p className="letter-sign">Forever yours ♡</p>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal as="section" className="card" delay={90}>
          <span className="card-label">pop for love messages</span>
          <p className="balloon-hint">{balloonHintText}</p>
          <div className="balloons-row">
            {BALLOON_COLORS.map((color, i) => {
              if (balloonPhase[i] === "empty") {
                return <div key={i} className="balloon-placeholder" />;
              }
              return (
                <div
                  key={i}
                  className="balloon-wrap"
                  onClick={() => popBalloon(i)}
                  onKeyDown={(e) => e.key === "Enter" && popBalloon(i)}
                  role="button"
                  tabIndex={0}
                >
                  <div
                    className={`balloon-body${
                      balloonPhase[i] === "burst" ? " burst" : ""
                    }`}
                    style={{ background: color }}
                  >
                    <div className="balloon-shine" />
                    <div
                      className="balloon-knot"
                      style={{ borderTop: `8px solid ${color}` }}
                    />
                  </div>
                  <div className="balloon-string" />
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal as="section" className="card" delay={120}>
          <span className="card-label">scratch to reveal a secret</span>
          <div className="scratch-inner">
            <div className="scratch-reveal">
              <div className="scratch-reveal-inner">
                <div className="scratch-emoji">💍</div>
                <p className="scratch-text">You are the love of my life</p>
              </div>
            </div>
            <ScratchCanvas />
          </div>
        </Reveal>

        <Reveal as="section" className="card" delay={150}>
          <span className="card-label">love meter</span>
          <p className="meter-legend" aria-hidden>
            even the stars asked for a bigger scale ✦
          </p>
          <div
            className={[
              "meter-arena",
              meterStatusMode === "full-wait" && !meterBroke
                ? "meter-arena--hold"
                : "",
              meterStatusMode === "breaking" ? "meter-arena--shatter" : "",
              meterStatusMode === "result" ? "meter-arena--bloom" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="meter-aura" aria-hidden />
            <div className="meter-orbit" aria-hidden>
              {meterStatusMode === "full-wait" && !meterBroke && (
                <>
                  <span className="meter-charge-orb meter-charge-orb--a" />
                  <span className="meter-charge-orb meter-charge-orb--b" />
                </>
              )}
            </div>
            <div
              className={[
                "meter-bar-wrap",
                meterBroke ? "meter-broken" : "",
                meterBroke && meterStatusMode === "result"
                  ? "meter-broken--settled"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {meterBroke && (
                <div className="meter-crack" aria-hidden>
                  <span className="meter-crack-line" />
                </div>
              )}
              <div
                className={`meter-bar${meterBarDone ? " done" : ""}${
                  meterBroke ? " meter-burst" : ""
                }${meterBroke && meterStatusMode === "result" ? " meter-burst--glow" : ""}`}
                style={
                  meterBroke ? { width: "100%" } : { width: `${meterWidth}%` }
                }
              >
                {showMeterPct && !meterBroke && (
                  <span className="meter-bar-pct">{meterWidth}%</span>
                )}
                {meterBroke && (
                  <span className="meter-bar-pct meter-bar-pct--over meter-omega">
                    ∞
                  </span>
                )}
              </div>
              {meterBroke && (
                <div className="meter-sparks" aria-hidden>
                  {Array.from({ length: METER_SPARK_COUNT }, (_, i) => (
                    <span
                      key={i}
                      className="meter-spark"
                      style={{
                        "--a": `${(360 / METER_SPARK_COUNT) * i}deg`,
                        "--i": i,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="meter-status">
            {meterStatusMode === "hint" && (
              <p className="meter-state-text meter-state-text--mute">
                tap to measure our love
              </p>
            )}
            {meterStatusMode === "measuring" && (
              <p className="meter-state-text">measuring…</p>
            )}
            {meterStatusMode === "full-wait" && (
              <p className="meter-full-wait meter-full-wait-anim">
                100%… but our love won&apos;t stay inside the lines ♡
              </p>
            )}
            {meterStatusMode === "breaking" && (
              <p className="meter-breaking">
                <span className="meter-breaking-line1">
                  The numbers are blushing…
                </span>
                <span className="meter-breaking-line2">
                  Even heaven ran out of room for you in my heart. ♡
                </span>
              </p>
            )}
            {meterStatusMode === "result" && (
              <div className="meter-result meter-result--infinite">
                <div className="meter-floating-hearts" aria-hidden>
                  <span>♡</span>
                  <span>♡</span>
                  <span>♡</span>
                </div>
                <p className="meter-result-emoji" aria-hidden>
                  ✦
                </p>
                <p className="meter-gasp">
                  {
                    (
                      METER_INFINITE_MESSAGES[displayMeterIndex] ||
                      METER_INFINITE_MESSAGES[0]
                    ).gasp
                  }
                </p>
                <p className="meter-infinite-line">
                  {
                    (
                      METER_INFINITE_MESSAGES[displayMeterIndex] ||
                      METER_INFINITE_MESSAGES[0]
                    ).line
                  }
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            className="meter-btn"
            disabled={meterBtnDisabled}
            onClick={handleMeterClick}
          >
            {meterBtnText}
          </button>
        </Reveal>

        <Reveal
          as="section"
          className="card"
          style={{ textAlign: "center" }}
          delay={100}
        >
          <span className="card-label">spin for your birthday treat</span>
          <p className="wheel-sub">✦ something special might just land ✦</p>
          <div className="wheel-wrap">
            <div className="wheel-pointer" aria-hidden>
              ▼
            </div>
            <WheelSvg wheelRot={wheelRot} transition={wheelTransition} />
          </div>
          {showWheelResult && wheelPrize && (
            <div className="wheel-result">
              <p className="wheel-prize-emoji" aria-hidden>
                {wheelPrize.emoji}
              </p>
              <p className="wheel-prize-line">
                {wheelPrize.lead}{" "}
                <strong className="wheel-prize-strong">
                  {wheelPrize.prize}
                </strong>
              </p>
              <p className="wheel-prize-sub">{wheelPrize.sub}</p>
            </div>
          )}
          <button
            type="button"
            className="spin-btn"
            disabled={wheelSpinning}
            onClick={spinWheel}
          >
            {spinBtnText}
          </button>
        </Reveal>

        <Reveal
          as="section"
          className="reasons-reveal"
          style={{ marginBottom: 16 }}
          delay={80}
        >
          <span
            className="card-label"
            style={{ display: "block", textAlign: "center" }}
          >
            reasons I love you
          </span>
          <div>
            {REASONS.map((r, i) => (
              <div
                key={r[0]}
                className="reason-item"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="reason-num">{r[0]}</span>
                <p className="reason-text">{r[1]}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="card" delay={110}>
          <span className="card-label">our little world</span>
          <div className="mem-grid">
            <div className="mem-card">
              <span className="mem-icon">🌅</span>
              <p className="mem-title">Our sunrises</p>
              <p className="mem-desc">
                Every morning better because you&apos;re in it
              </p>
            </div>
            <div className="mem-card">
              <span className="mem-icon">🌙</span>
              <p className="mem-title">Late nights</p>
              <p className="mem-desc">Talking about everything and nothing</p>
            </div>
            <div className="mem-card">
              <span className="mem-icon">☕</span>
              <p className="mem-title">Morning rituals</p>
              <p className="mem-desc">Quiet moments that mean the world</p>
            </div>
            <div className="mem-card">
              <span className="mem-icon">✈️</span>
              <p className="mem-title">Adventures</p>
              <p className="mem-desc">Everywhere is home with you beside me</p>
            </div>
          </div>
        </Reveal>

        <Reveal as="div" className="celestial-reveal" delay={60}>
          <p className="celestial-note">
            <span className="celestial-ornament" aria-hidden>
              ☽
            </span>
            In every love story the stars ever held their breath for — you are
            my favourite chapter.
            <span className="celestial-ornament" aria-hidden>
              ☾
            </span>
          </p>
        </Reveal>

        <Reveal as="footer" className="footer" delay={40}>
          <div className="footer-badge">
            <p style={{ fontSize: 20, fontWeight: 600 }}>🎂 Happy Birthday!</p>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,245,248,.75)",
                marginTop: 3,
                letterSpacing: 1,
                fontWeight: 300,
              }}
            >
              Wishing you all the love in the world
            </p>
          </div>
          <p className="footer-quote">
            &quot;In all the world, there is no heart for me like yours.
            <br />
            In all the world, there is no love for you like mine.&quot;
          </p>
        </Reveal>
      </div>
    </div>
  );
}

export default function BirthdaySurprise() {
  const unlocked = useUnlockState();
  if (!unlocked) {
    return <CountdownToBirthday />;
  }
  return <BirthdaySurpriseInner />;
}
