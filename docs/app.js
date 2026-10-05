// Arch Design - Interactive Miniature Model Script

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

  // 2. Tab Switching (Interactive Canvas vs. JSON Schema)
  const tabCanvas = document.getElementById('tabCanvas');
  const tabJson = document.getElementById('tabJson');
  const canvasView = document.getElementById('canvasView');
  const jsonView = document.getElementById('jsonView');

  if (tabCanvas && tabJson && canvasView && jsonView) {
    tabCanvas.addEventListener('click', () => {
      tabCanvas.classList.add('active');
      tabJson.classList.remove('active');
      canvasView.style.display = 'block';
      jsonView.classList.remove('active');
    });

    tabJson.addEventListener('click', () => {
      tabJson.classList.add('active');
      tabCanvas.classList.remove('active');
      canvasView.style.display = 'none';
      jsonView.classList.add('active');
    });
  }

  // 3. Real Extension Miniature Canvas Controller
  const canvasContainer = document.getElementById('canvasContainer');
  const nodesLayer = document.getElementById('nodesLayer');
  const edgesLayer = document.getElementById('edgesLayer');
  const focusBadge = document.getElementById('focusBadge');
  const focusBadgeTitle = document.getElementById('focusBadgeTitle');
  const focusInCount = document.getElementById('focusInCount');
  const focusOutCount = document.getElementById('focusOutCount');
  const btnFocusToggle = document.getElementById('btnFocusToggle');
  const btnAutoLayout = document.getElementById('btnAutoLayout');

  let focusModeEnabled = true;
  let activeFocusedNodeId = null;
  let currentZoom = 1.0;

  // Graph Definition mirroring Arch Design sample.arch
  const graphEdges = [
    { id: 'edge-m1-s1', source: 'card-m1', target: 'card-s1', pathId: 'edge-m1-s1' },
    { id: 'edge-s1-f1', source: 'card-s1', target: 'card-f1', pathId: 'edge-s1-f1' },
    { id: 'edge-s1-e1', source: 'card-s1', target: 'card-e1', pathId: 'edge-s1-e1' }
  ];

  // Helper to get all card elements
  function getCards() {
    return Array.from(document.querySelectorAll('.lld-card'));
  }

  // Helper to get all edge SVG path elements
  function getEdgeElements() {
    return Array.from(document.querySelectorAll('.canvas-edge'));
  }

  // Attach card click handlers
  function bindCardEvents(card) {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!focusModeEnabled) return;

      if (activeFocusedNodeId === card.id) {
        clearFocus();
      } else {
        applyFocus(card.id);
      }
    });

    // Delete button inside card
    const delBtn = card.querySelector('.btn-delete');
    if (delBtn) {
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.style.transform = 'scale(0.8)';
        card.style.opacity = '0';
        setTimeout(() => {
          card.remove();
          clearFocus();
        }, 200);
      });
    }
  }

  getCards().forEach(bindCardEvents);

  // Apply Focus Mode Logic (matching src/editor/App.tsx)
  function applyFocus(nodeId) {
    activeFocusedNodeId = nodeId;
    const cards = getCards();
    const edges = getEdgeElements();

    const incoming = [];
    const outgoing = [];
    const connectedNodeIds = new Set([nodeId]);

    graphEdges.forEach(edge => {
      if (edge.source === nodeId) {
        outgoing.push(edge);
        connectedNodeIds.add(edge.target);
      } else if (edge.target === nodeId) {
        incoming.push(edge);
        connectedNodeIds.add(edge.source);
      }
    });

    // Update Cards
    cards.forEach(c => {
      c.classList.remove('primary', 'connected', 'dimmed');
      if (c.id === nodeId) {
        c.classList.add('primary');
      } else if (connectedNodeIds.has(c.id)) {
        c.classList.add('connected');
      } else {
        c.classList.add('dimmed');
      }
    });

    // Update Edges
    edges.forEach(edgeEl => {
      edgeEl.classList.remove('incoming', 'outgoing', 'dimmed');
      const edgeDef = graphEdges.find(e => e.pathId === edgeEl.id);
      if (!edgeDef) return;

      if (edgeDef.source === nodeId) {
        edgeEl.classList.add('outgoing');
        edgeEl.setAttribute('marker-end', 'url(#arrow-outgoing)');
      } else if (edgeDef.target === nodeId) {
        edgeEl.classList.add('incoming');
        edgeEl.setAttribute('marker-end', 'url(#arrow-incoming)');
      } else {
        edgeEl.classList.add('dimmed');
        edgeEl.setAttribute('marker-end', 'url(#arrow-default)');
      }
    });

    // Update Toolbar Focus Badge
    const activeCard = document.getElementById(nodeId);
    if (activeCard && focusBadge) {
      const title = activeCard.getAttribute('data-title') || 'Card';
      focusBadgeTitle.innerText = title;
      focusInCount.innerText = `● ${incoming.length} in`;
      focusOutCount.innerText = `● ${outgoing.length} out`;
      focusBadge.classList.add('visible');
    }
  }

  // Clear Focus Mode
  function clearFocus() {
    activeFocusedNodeId = null;
    const cards = getCards();
    const edges = getEdgeElements();

    cards.forEach(c => c.classList.remove('primary', 'connected', 'dimmed'));
    edges.forEach(edgeEl => {
      edgeEl.classList.remove('incoming', 'outgoing', 'dimmed');
      edgeEl.setAttribute('marker-end', 'url(#arrow-default)');
    });

    if (focusBadge) {
      focusBadge.classList.remove('visible');
    }
  }

  // Click on canvas background clears focus
  if (canvasView) {
    canvasView.addEventListener('click', () => {
      clearFocus();
    });
  }

  // Toggle Focus Mode ON/OFF
  if (btnFocusToggle) {
    btnFocusToggle.addEventListener('click', () => {
      focusModeEnabled = !focusModeEnabled;
      if (focusModeEnabled) {
        btnFocusToggle.classList.add('active');
        btnFocusToggle.innerText = 'Focus Mode: ON';
      } else {
        btnFocusToggle.classList.remove('active');
        btnFocusToggle.innerText = 'Focus Mode: OFF';
        clearFocus();
      }
    });
  }

  // Auto Layout Simulation (Dagre Layout)
  if (btnAutoLayout) {
    btnAutoLayout.addEventListener('click', () => {
      clearFocus();
      const m1 = document.getElementById('card-m1');
      const s1 = document.getElementById('card-s1');
      const f1 = document.getElementById('card-f1');
      const e1 = document.getElementById('card-e1');

      if (m1) m1.style.transform = 'scale(0.97)';
      if (s1) s1.style.transform = 'scale(0.97)';
      if (f1) f1.style.transform = 'scale(0.97)';
      if (e1) e1.style.transform = 'scale(0.97)';

      setTimeout(() => {
        if (m1) { m1.style.left = '20px'; m1.style.top = '40px'; m1.style.transform = 'none'; }
        if (s1) { s1.style.left = '350px'; s1.style.top = '40px'; s1.style.transform = 'none'; }
        if (f1) { f1.style.left = '680px'; f1.style.top = '20px'; f1.style.transform = 'none'; }
        if (e1) { e1.style.left = '680px'; e1.style.top = '220px'; e1.style.transform = 'none'; }
      }, 150);
    });
  }

  // Add Dynamic Node Handler (+ Module, + Service, + Function, + External)
  let newNodeCounter = 1;
  const addButtons = [
    { id: 'btnAddModule', type: 'module', label: 'OrderModule', badge: 'MODULE', badgeClass: 'badge-module', desc: 'Domain boundary for orders & checkout transactions.' },
    { id: 'btnAddService', type: 'service', label: 'PaymentService', badge: 'SERVICE', badgeClass: 'badge-service', desc: 'Handles Stripe & PayPal webhook verifications.' },
    { id: 'btnAddFunction', type: 'function', label: 'chargeCustomer', badge: 'FUNCTION', badgeClass: 'badge-function', desc: 'Charges payment gateway and records transaction.' },
    { id: 'btnAddExternal', type: 'external', label: 'RedisCache', badge: 'EXTERNAL', badgeClass: 'badge-external', desc: 'Sub-millisecond in-memory cache for session locks.' }
  ];

  addButtons.forEach(cfg => {
    const btn = document.getElementById(cfg.id);
    if (!btn) return;

    btn.addEventListener('click', () => {
      const newCardId = `card-custom-${newNodeCounter++}`;
      const newCard = document.createElement('div');
      newCard.className = 'lld-card';
      newCard.id = newCardId;
      newCard.setAttribute('data-type', cfg.type);
      newCard.setAttribute('data-title', `${cfg.label} #${newNodeCounter}`);
      newCard.style.left = `${100 + (newNodeCounter * 25) % 400}px`;
      newCard.style.top = `${180 + (newNodeCounter * 20) % 150}px`;
      newCard.style.animation = 'fadeIn 0.25s ease';

      newCard.innerHTML = `
        <div class="rf-handle rf-handle-left"></div>
        <div class="rf-handle rf-handle-right"></div>
        <div class="card-header">
          <div class="card-header-left">
            <span class="grip-dots">&#8942;&#8942;</span>
            <span class="type-badge ${cfg.badgeClass}">${cfg.badge}</span>
            <span class="card-label">${cfg.label}</span>
          </div>
          <div class="card-header-actions">
            <button class="card-action-btn" title="Collapse">&#9662;</button>
            <button class="card-action-btn btn-delete" title="Delete">&times;</button>
          </div>
        </div>
        <div class="card-content">
          <div class="card-desc-box">${cfg.desc}</div>
        </div>
      `;

      nodesLayer.appendChild(newCard);
      bindCardEvents(newCard);
    });
  });

  // Zoom Controls
  const ctrlZoomIn = document.getElementById('ctrlZoomIn');
  const ctrlZoomOut = document.getElementById('ctrlZoomOut');
  const ctrlFitView = document.getElementById('ctrlFitView');

  if (ctrlZoomIn && canvasContainer) {
    ctrlZoomIn.addEventListener('click', () => {
      currentZoom = Math.min(1.3, currentZoom + 0.1);
      canvasContainer.style.transform = `scale(${currentZoom})`;
    });
  }

  if (ctrlZoomOut && canvasContainer) {
    ctrlZoomOut.addEventListener('click', () => {
      currentZoom = Math.max(0.7, currentZoom - 0.1);
      canvasContainer.style.transform = `scale(${currentZoom})`;
    });
  }

  if (ctrlFitView && canvasContainer) {
    ctrlFitView.addEventListener('click', () => {
      currentZoom = 1.0;
      canvasContainer.style.transform = 'scale(1.0)';
    });
  }
});
