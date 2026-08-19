import { createSignal, onCleanup } from 'solid-js';

export const useMouse = () => {
  const [mouseX, setMouseX] = createSignal(0);
  const [mouseY, setMouseY] = createSignal(0);

  const handleMouseMove = (event: MouseEvent) => {
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  const handleTouchMove = ({ touches: [first] }: TouchEvent) => {
    setMouseX(first.clientX);
    setMouseY(first.clientY);
  };

  const reset = () => setMouseX(setMouseY(0));

  const listenerOptions = { passive: true };
  addEventListener('mousemove', handleMouseMove, listenerOptions);
  addEventListener('dragover', handleMouseMove, listenerOptions);
  addEventListener('touchstart', handleTouchMove, listenerOptions);
  addEventListener('touchmove', handleTouchMove, listenerOptions);
  addEventListener('mouseout', reset, listenerOptions);
  addEventListener('touchend', reset, listenerOptions);

  onCleanup(() => {
    removeEventListener('mousemove', handleMouseMove);
    removeEventListener('dragover', handleMouseMove);
    removeEventListener('touchstart', handleTouchMove);
    removeEventListener('touchmove', handleTouchMove);
    removeEventListener('mouseout', reset);
    removeEventListener('touchend', reset);
  });

  return [mouseX, mouseY];
};
