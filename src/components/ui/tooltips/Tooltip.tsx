import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  cloneElement,
  isValidElement,
} from 'react';
import { createPortal } from 'react-dom';

// ─── Types ───────────────────────────────────────────────────────────────────

export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: TooltipPlacement;
  delay?: number;
  hideDelay?: number;
  disabled?: boolean;
  maxWidth?: number;
  arrow?: boolean;
  interactive?: boolean;
  className?: string;
  'aria-label'?: string;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

  .tooltip-portal {
    pointer-events: none;
    position: fixed;
    z-index: 99999;
    font-family: 'DM Sans', sans-serif;
  }

  .tooltip-portal--interactive {
    pointer-events: auto;
  }

  .tooltip-box {
    position: relative;
    padding: 7px 11px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 8px;
    color: #e2e8f0;
    font-size: 0.78rem;
    font-weight: 400;
    line-height: 1.5;
    box-shadow:
      0 4px 20px rgba(0,0,0,0.5),
      0 1px 4px rgba(0,0,0,0.3);
    white-space: pre-line;
    word-break: break-word;
    animation: tooltip-in 0.13s cubic-bezier(0.4, 0, 0.2, 1) both;
    backdrop-filter: blur(4px);
  }

  @keyframes tooltip-in {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
  }

  /* Arrow */
  .tooltip-arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #1e293b;
    border: 1px solid #334155;
    transform: rotate(45deg);
  }

  .tooltip-arrow--top    { bottom: -5px; border-top: none; border-left: none; }
  .tooltip-arrow--bottom { top: -5px; border-bottom: none; border-right: none; }
  .tooltip-arrow--left   { right: -5px; border-left: none; border-bottom: none; }
  .tooltip-arrow--right  { left: -5px; border-right: none; border-top: none; }

  .tooltip-arrow--top,
  .tooltip-arrow--bottom { left: 50%; margin-left: -4px; }
  .tooltip-arrow--left,
  .tooltip-arrow--right  { top: 50%; margin-top: -4px; }

  .tooltip-arrow--top-start,
  .tooltip-arrow--bottom-start { left: 14px; margin-left: 0; }
  .tooltip-arrow--top-end,
  .tooltip-arrow--bottom-end { left: auto; right: 14px; margin-left: 0; }
`;

let styleInjected = false;
function injectStyles() {
  if (styleInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = styles;
  document.head.appendChild(el);
  styleInjected = true;
}

// ─── Positioning ─────────────────────────────────────────────────────────────

const GAP = 8;

function getPosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  placement: TooltipPlacement,
): { top: number; left: number } {
  const { top: tT, left: tL, right: tR, bottom: tB, width: tW, height: tH } = triggerRect;
  const { width: ttW, height: ttH } = tooltipRect;
  const midX = tL + tW / 2 - ttW / 2;
  const midY = tT + tH / 2 - ttH / 2;

  const positions: Record<TooltipPlacement, { top: number; left: number }> = {
    top: { top: tT - ttH - GAP, left: midX },
    'top-start': { top: tT - ttH - GAP, left: tL },
    'top-end': { top: tT - ttH - GAP, left: tR - ttW },
    bottom: { top: tB + GAP, left: midX },
    'bottom-start': { top: tB + GAP, left: tL },
    'bottom-end': { top: tB + GAP, left: tR - ttW },
    left: { top: midY, left: tL - ttW - GAP },
    right: { top: midY, left: tR + GAP },
  };

  const { top, left } = positions[placement];

  // Clamp to viewport
  const vW = window.innerWidth;
  const vH = window.innerHeight;
  return {
    top: Math.max(4, Math.min(top, vH - ttH - 4)),
    left: Math.max(4, Math.min(left, vW - ttW - 4)),
  };
}

function arrowPlacementClass(placement: TooltipPlacement): string {
  if (placement.startsWith('top')) return `tooltip-arrow--top ${placement !== 'top' ? `tooltip-arrow--${placement}` : ''}`;
  if (placement.startsWith('bottom')) return `tooltip-arrow--bottom ${placement !== 'bottom' ? `tooltip-arrow--${placement}` : ''}`;
  if (placement === 'left') return 'tooltip-arrow--left';
  if (placement === 'right') return 'tooltip-arrow--right';
  return '';
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 220,
  hideDelay = 100,
  disabled = false,
  maxWidth = 240,
  arrow = true,
  interactive = false,
  className = '',
  'aria-label': ariaLabel,
}) => {
  injectStyles();

  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [ready, setReady] = useState(false);

  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).slice(2)}`);

  const clearTimers = () => {
    clearTimeout(showTimer.current);
    clearTimeout(hideTimer.current);
  };

  const show = useCallback(() => {
    if (disabled) return;
    clearTimers();
    showTimer.current = setTimeout(() => {
      setVisible(true);
      setReady(false);
    }, delay);
  }, [disabled, delay]);

  const hide = useCallback(() => {
    clearTimers();
    hideTimer.current = setTimeout(() => setVisible(false), hideDelay);
  }, [hideDelay]);

  // Compute position when tooltip becomes visible
  useEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return;
    const tRect = triggerRef.current.getBoundingClientRect();
    const ttRect = tooltipRef.current.getBoundingClientRect();
    const pos = getPosition(tRect, ttRect, placement);
    setPosition(pos);
    setReady(true);
  }, [visible, placement]);

  useEffect(() => () => clearTimers(), []);

  if (!isValidElement(children)) return children as any;

  const child = cloneElement(children as React.ReactElement<any>, {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent) => {
      (children as any).props.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      (children as any).props.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: React.FocusEvent) => {
      (children as any).props.onFocus?.(e);
      show();
    },
    onBlur: (e: React.FocusEvent) => {
      (children as any).props.onBlur?.(e);
      hide();
    },
    'aria-describedby': visible ? tooltipId.current : undefined,
  });

  return (
    <>
      {child}
      {visible &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId.current}
            role="tooltip"
            aria-label={typeof content === 'string' ? content : ariaLabel}
            className={[
              'tooltip-portal',
              interactive ? 'tooltip-portal--interactive' : '',
              className,
            ].filter(Boolean).join(' ')}
            style={{
              top: position.top,
              left: position.left,
              maxWidth,
              opacity: ready ? 1 : 0,
              transition: 'opacity 0.05s',
            }}
            onMouseEnter={interactive ? () => clearTimers() : undefined}
            onMouseLeave={interactive ? hide : undefined}
          >
            <div className="tooltip-box">
              {content}
              {arrow && (
                <span
                  className={`tooltip-arrow ${arrowPlacementClass(placement)}`}
                  aria-hidden="true"
                />
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default Tooltip;