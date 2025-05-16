import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PanelVisibilityState {
  leftPanelVisible: boolean;
  middlePanelVisible: boolean;
  rightPanelVisible: boolean;
  setPanelVisibility: (
    panel: "left" | "middle" | "right",
    visible: boolean
  ) => void;
  togglePanel: (panel: "left" | "middle" | "right") => void;
}

export const usePanelVisibilityStore = create<PanelVisibilityState>()(
  persist(
    (set, get) => ({
      leftPanelVisible: true,
      middlePanelVisible: true,
      rightPanelVisible: true,

      setPanelVisibility: (panel, visible) => {
        // 최소 1개의 패널은 항상 표시되어야 함
        const { leftPanelVisible, middlePanelVisible, rightPanelVisible } =
          get();
        const currentVisibleCount = [
          panel === "left" ? visible : leftPanelVisible,
          panel === "middle" ? visible : middlePanelVisible,
          panel === "right" ? visible : rightPanelVisible,
        ].filter(Boolean).length;

        if (currentVisibleCount === 0) return;

        set({ [`${panel}PanelVisible`]: visible } as any);
      },

      togglePanel: (panel) => {
        const { leftPanelVisible, middlePanelVisible, rightPanelVisible } =
          get();

        // 현재 visible 패널 개수 확인
        const visibleCount = [
          leftPanelVisible,
          middlePanelVisible,
          rightPanelVisible,
        ].filter(Boolean).length;

        // 패널이 하나만 켜져 있고, 그게 현재 토글하려는 패널이면 토글하지 않음
        if (visibleCount === 1) {
          if (
            (panel === "left" && leftPanelVisible) ||
            (panel === "middle" && middlePanelVisible) ||
            (panel === "right" && rightPanelVisible)
          ) {
            return;
          }
        }

        // 토글
        if (panel === "left") {
          set({ leftPanelVisible: !leftPanelVisible });
        } else if (panel === "middle") {
          set({ middlePanelVisible: !middlePanelVisible });
        } else if (panel === "right") {
          set({ rightPanelVisible: !rightPanelVisible });
        }
      },
    }),
    {
      name: "panel-visibility-storage", // localStorage에 저장될 키
    }
  )
);
