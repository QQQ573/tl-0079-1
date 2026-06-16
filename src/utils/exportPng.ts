import { toPng } from 'html-to-image';

export async function exportMatrixToPng(element: HTMLElement | null): Promise<void> {
  if (!element) return;

  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#FAF6F1',
      pixelRatio: 2,
    });

    const link = document.createElement('a');
    link.download = `奶茶爆款矩阵_周报快照_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('PNG export failed:', err);
  }
}
