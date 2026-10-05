// Arch Promotional Landing Page - Interactive Script

document.addEventListener('DOMContentLoaded', () => {
  // 1. Copy Command to Clipboard
  const copyBtn = document.getElementById('copyBtn');
  const copyCmd = document.getElementById('installCmd');

  if (copyBtn && copyCmd) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copyCmd.innerText.trim());
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="16" height="16" fill="none" stroke="#22c55e" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span style="color:#22c55e;font-size:12px;margin-left:4px;">Copied!</span>
        `;
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2200);
      } catch (err) {
        console.error('Failed to copy command', err);
      }
    });
  }

  // 2. Tab Switching (Canvas vs. JSON)
  const tabCanvas = document.getElementById('tabCanvas');
  const tabJson = document.getElementById('tabJson');
  const canvasView = document.getElementById('canvasView');
  const jsonView = document.getElementById('jsonView');

  if (tabCanvas && tabJson && canvasView && jsonView) {
    tabCanvas.addEventListener('click', () => {
      tabCanvas.classList.add('active');
      tabJson.classList.remove('active');
      canvasView.style.display = 'flex';
      jsonView.classList.remove('active');
    });

    tabJson.addEventListener('click', () => {
      tabJson.classList.add('active');
      tabCanvas.classList.remove('active');
      canvasView.style.display = 'none';
      jsonView.classList.add('active');
    });
  }

  // 3. Interactive Focus Mode Simulation on Cards
  const cards = document.querySelectorAll('.arch-card');
  const focusRelations = {
    'card-module': ['card-module', 'card-service', 'card-external'],
    'card-service': ['card-module', 'card-service', 'card-func', 'card-external'],
    'card-func': ['card-service', 'card-func'],
    'card-external': ['card-module', 'card-service', 'card-external']
  };

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const cardId = card.id;

      if (card.classList.contains('focused')) {
        // Toggle off if already focused
        clearFocus();
        return;
      }

      const connected = focusRelations[cardId] || [cardId];
      cards.forEach(c => {
        if (connected.includes(c.id)) {
          c.classList.remove('dimmed');
          if (c.id === cardId) {
            c.classList.add('focused');
          } else {
            c.classList.remove('focused');
          }
        } else {
          c.classList.remove('focused');
          c.classList.add('dimmed');
        }
      });
    });
  });

  // Clicking background resets focus
  const viewport = document.getElementById('canvasView');
  if (viewport) {
    viewport.addEventListener('click', () => {
      clearFocus();
    });
  }

  function clearFocus() {
    cards.forEach(c => {
      c.classList.remove('focused');
      c.classList.remove('dimmed');
    });
  }
});
