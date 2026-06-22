import React from 'react';

/**
 * Test-only stub for `motion/react`.
 *
 * Framer Motion animations are expensive in jsdom and cause component tests to
 * approach or exceed Vitest's default 5s timeout. This mock renders the same
 * DOM elements but strips all animation props so tests focus on behavior,
 * not transitions.
 */

const strippedMotionProps = new Set([
  'initial',
  'animate',
  'exit',
  'whileHover',
  'whileTap',
  'whileInView',
  'whileFocus',
  'whileDrag',
  'transition',
  'viewport',
  'variants',
  'layout',
  'layoutId',
  'onAnimationStart',
  'onAnimationComplete',
]);

const motion = new Proxy(
  {},
  {
    get(_, tag) {
      const Tag = String(tag);
      const MotionComponent = React.forwardRef<HTMLElement, Record<string, unknown>>(
        function MotionStub(props, ref) {
          const rest: Record<string, unknown> = {};
          for (const key of Object.keys(props)) {
            if (!strippedMotionProps.has(key)) {
              rest[key] = props[key];
            }
          }
          return React.createElement(Tag as any, { ref, ...rest });
        }
      );
      MotionComponent.displayName = `Motion${String(tag)}`;
      return MotionComponent;
    },
  }
) as Record<string, React.ForwardRefExoticComponent<React.PropsWithoutRef<Record<string, unknown>> & React.RefAttributes<unknown>>>;

interface AnimatePresenceProps {
  children?: React.ReactNode;
}

const AnimatePresence: React.FC<AnimatePresenceProps> = ({ children }) => (
  <>{children}</>
);

// eslint-disable-next-line react-refresh/only-export-components
export { motion, AnimatePresence };
