import { useCallback } from "react";

export function useTabKeyboardNavigation(
  tabs: string[],
  onTabChange: (tab: string) => void
) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, currentTab: string) => {
      const currentIndex = tabs.indexOf(currentTab);
      let newIndex = currentIndex;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          event.stopPropagation();
          newIndex = (currentIndex + 1) % tabs.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          event.stopPropagation();
          newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          event.preventDefault();
          event.stopPropagation();
          newIndex = 0;
          break;
        case "End":
          event.preventDefault();
          event.stopPropagation();
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      if (newIndex !== currentIndex) {
        const newTab = tabs[newIndex];
        onTabChange(newTab);

        // Focus le nouvel onglet après changement
        requestAnimationFrame(() => {
          document.getElementById(`tab-${newTab}`)?.focus();
        });
      }
    },
    [tabs, onTabChange]
  );

  return handleKeyDown;
}
