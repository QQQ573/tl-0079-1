import { useEffect, useCallback } from 'react';
import Toolbar from '@/components/Toolbar';
import AlertBanner from '@/components/AlertBanner';
import MatrixGrid from '@/components/MatrixGrid';
import ComparisonDrawer from '@/components/ComparisonDrawer';
import Legend from '@/components/Legend';
import { useAppStore } from '@/store/useAppStore';

export default function MatrixPage() {
  const { zoomLevel, setZoomLevel, drawerOpen } = useAppStore();

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setZoomLevel(zoomLevel + delta);
      }
    },
    [zoomLevel, setZoomLevel]
  );

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{
        background: '#FAF6F1',
        fontFamily: '"Source Han Sans CN", sans-serif',
      }}
    >
      <Toolbar />
      <AlertBanner />
      <div className="flex-1 flex overflow-hidden">
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            marginRight: drawerOpen ? '360px' : '0',
            transition: 'margin-right 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div id="matrix-container" className="flex-1 p-4 overflow-hidden">
            <MatrixGrid />
          </div>
          <Legend />
        </div>
      </div>
      <ComparisonDrawer />
    </div>
  );
}
