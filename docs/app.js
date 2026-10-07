// Arch Design - Interactive Miniature Model Controller

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

  // 2. Tab Switching in Demo Window (Interactive Canvas, JSON Schema, Agent & CLI Docs)
  const tabCanvas = document.getElementById('tabCanvas');
  const tabJson = document.getElementById('tabJson');
  const tabDocs = document.getElementById('tabDocs');
  const canvasView = document.getElementById('canvasView');
  const jsonView = document.getElementById('jsonView');
  const docsView = document.getElementById('docsView');
  const extToolbar = document.querySelector('.ext-toolbar');

  function selectDemoTab(tab) {
    if (tabCanvas) tabCanvas.classList.toggle('active', tab === 'canvas');
    if (tabJson) tabJson.classList.toggle('active', tab === 'json');
    if (tabDocs) tabDocs.classList.toggle('active', tab === 'docs');

    if (canvasView) canvasView.style.display = tab === 'canvas' ? 'block' : 'none';
    if (jsonView) jsonView.classList.toggle('active', tab === 'json');
    if (docsView) docsView.classList.toggle('active', tab === 'docs');

    if (extToolbar) {
      extToolbar.style.display = tab === 'canvas' ? 'flex' : 'none';
    }

    if (tab === 'canvas') {
      requestAnimationFrame(updateEdgePaths);
    }
  }

  if (tabCanvas) tabCanvas.addEventListener('click', () => selectDemoTab('canvas'));
  if (tabJson) tabJson.addEventListener('click', () => selectDemoTab('json'));
  if (tabDocs) tabDocs.addEventListener('click', () => selectDemoTab('docs'));

  // 2b. Documentation Center Tabs Navigation (#docs)
  const docsNavBtns = document.querySelectorAll('.docs-nav-btn');
  const docsPanels = document.querySelectorAll('.docs-content-panel');

  docsNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPanelId = btn.getAttribute('data-panel');
      if (!targetPanelId) return;

      docsNavBtns.forEach(b => b.classList.remove('active'));
      docsPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // 2c. Copy Buttons in Code Cards & Prompt Items
  const docsCopyBtns = document.querySelectorAll('.docs-code-copy-btn');
  docsCopyBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.innerText;
        btn.innerText = 'Copied!';
        btn.style.color = '#22c55e';
        btn.style.borderColor = 'rgba(34, 197, 94, 0.4)';
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text', err);
      }
    });
  });

  // 3. Real Extension Miniature Canvas Controller
  const canvasContainer = document.getElementById('canvasContainer');
  const nodesLayer = document.getElementById('nodesLayer');
  const focusBadge = document.getElementById('focusBadge');
  const focusBadgeTitle = document.getElementById('focusBadgeTitle');
  const focusInCount = document.getElementById('focusInCount');
  const focusOutCount = document.getElementById('focusOutCount');
  const btnFocusToggle = document.getElementById('btnFocusToggle');
  const btnAutoLayout = document.getElementById('btnAutoLayout');

  let focusModeEnabled = true;
  let activeFocusedNodeId = null;
  let currentZoom = 1.0;

  // Graph Edges definition (Child -> Parent Dependency Injection)
  const graphEdges = [
    { id: 'edge-s1-m1', source: 'card-s1', target: 'card-m1', pathId: 'edge-s1-m1' },
    { id: 'edge-f1-s1', source: 'card-f1', target: 'card-s1', pathId: 'edge-f1-s1' },
    { id: 'edge-e1-s1', source: 'card-e1', target: 'card-s1', pathId: 'edge-e1-s1' }
  ];

  function getCards() {
    return Array.from(document.querySelectorAll('.lld-card'));
  }

  function getEdgeElements() {
    return Array.from(document.querySelectorAll('.canvas-edge'));
  }

  // Calculate pixel center of a card's connection handle relative to canvasContainer
  function getHandleCenter(cardId, isRight) {
    const card = document.getElementById(cardId);
    if (!card || !canvasContainer) return null;
    const handle = card.querySelector(isRight ? '.rf-handle-right' : '.rf-handle-left');
    if (!handle) return null;

    const hRect = handle.getBoundingClientRect();
    const cRect = canvasContainer.getBoundingClientRect();

    return {
      x: (hRect.left + hRect.width / 2 - cRect.left) / currentZoom,
      y: (hRect.top + hRect.height / 2 - cRect.top) / currentZoom
    };
  }

  // Dynamically update SVG stepped paths so lines connect 100% pixel-perfect to handles
  function updateEdgePaths() {
    const m1Handle = getHandleCenter('card-m1', true);
    const s1LeftHandle = getHandleCenter('card-s1', false);
    const s1RightHandle = getHandleCenter('card-s1', true);
    const f1Handle = getHandleCenter('card-f1', false);
    const e1Handle = getHandleCenter('card-e1', false);

    // Edge 1: Service -> Module (injects)
    if (s1LeftHandle && m1Handle) {
      const p1 = document.getElementById('edge-s1-m1');
      if (p1) {
        const midX = (s1LeftHandle.x + m1Handle.x) / 2;
        p1.setAttribute('d', `M ${s1LeftHandle.x} ${s1LeftHandle.y} L ${midX} ${s1LeftHandle.y} L ${midX} ${m1Handle.y} L ${m1Handle.x} ${m1Handle.y}`);
      }
    }

    // Edge 2: Function -> Service (implements)
    if (f1Handle && s1RightHandle) {
      const p2 = document.getElementById('edge-f1-s1');
      if (p2) {
        const midX = (f1Handle.x + s1RightHandle.x) / 2;
        p2.setAttribute('d', `M ${f1Handle.x} ${f1Handle.y} L ${midX} ${f1Handle.y} L ${midX} ${s1RightHandle.y} L ${s1RightHandle.x} ${s1RightHandle.y}`);
      }
    }

    // Edge 3: External -> Service (injects)
    if (e1Handle && s1RightHandle) {
      const p3 = document.getElementById('edge-e1-s1');
      if (p3) {
        const midX = (e1Handle.x + s1RightHandle.x) / 2;
        p3.setAttribute('d', `M ${e1Handle.x} ${e1Handle.y} L ${midX} ${e1Handle.y} L ${midX} ${s1RightHandle.y} L ${s1RightHandle.x} ${s1RightHandle.y}`);
      }
    }
  }

  // Enable dragging on cards for realistic canvas feel
  function makeCardDraggable(card) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    const onPointerDown = (e) => {
      // Don't drag if clicking buttons or inputs
      if (e.target.closest('button') || e.target.closest('input')) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = parseFloat(card.style.left) || card.offsetLeft;
      initialTop = parseFloat(card.style.top) || card.offsetTop;

      card.style.zIndex = '50';
      card.style.cursor = 'grabbing';
      card.setPointerCapture(e.pointerId);

      e.stopPropagation();
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = (e.clientX - startX) / currentZoom;
      const dy = (e.clientY - startY) / currentZoom;

      card.style.left = `${Math.max(10, initialLeft + dx)}px`;
      card.style.top = `${Math.max(10, initialTop + dy)}px`;

      updateEdgePaths();
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      card.style.zIndex = '2';
      card.style.cursor = 'pointer';
      try {
        card.releasePointerCapture(e.pointerId);
      } catch (_) {}
      updateEdgePaths();
    };

    card.addEventListener('pointerdown', onPointerDown);
    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerup', onPointerUp);
    card.addEventListener('pointercancel', onPointerUp);
  }

  // Attach card click handlers
  function bindCardEvents(card) {
    makeCardDraggable(card);

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
          updateEdgePaths();
        }, 150);
      });
    }
  }

  getCards().forEach(bindCardEvents);

  // Apply Focus Mode Logic
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

  // Click background clears focus
  if (canvasView) {
    canvasView.addEventListener('click', (e) => {
      if (e.target === canvasView || e.target === canvasContainer || e.target.tagName === 'svg') {
        clearFocus();
      }
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

  // Auto Layout Animation (Dagre Simulation)
  if (btnAutoLayout) {
    btnAutoLayout.addEventListener('click', () => {
      clearFocus();
      const m1 = document.getElementById('card-m1');
      const s1 = document.getElementById('card-s1');
      const f1 = document.getElementById('card-f1');
      const e1 = document.getElementById('card-e1');

      if (m1) { m1.style.transition = 'all 0.3s ease'; m1.style.left = '40px'; m1.style.top = '60px'; }
      if (s1) { s1.style.transition = 'all 0.3s ease'; s1.style.left = '370px'; s1.style.top = '60px'; }
      if (f1) { f1.style.transition = 'all 0.3s ease'; f1.style.left = '700px'; f1.style.top = '30px'; }
      if (e1) { e1.style.transition = 'all 0.3s ease'; e1.style.left = '700px'; e1.style.top = '230px'; }

      // Update edges during transition
      let frames = 0;
      const step = () => {
        updateEdgePaths();
        if (++frames < 20) requestAnimationFrame(step);
        else {
          if (m1) m1.style.transition = '';
          if (s1) s1.style.transition = '';
          if (f1) f1.style.transition = '';
          if (e1) e1.style.transition = '';
        }
      };
      requestAnimationFrame(step);
    });
  }

  // Add Dynamic Nodes
  let newNodeCounter = 1;
  const addButtons = [
    { id: 'btnAddModule', type: 'module', label: 'OrderModule', badge: 'MODULE', badgeClass: 'badge-module', desc: 'Domain boundary for orders & transactions.' },
    { id: 'btnAddService', type: 'service', label: 'PaymentService', badge: 'SERVICE', badgeClass: 'badge-service', desc: 'Coordinates Stripe & PayPal webhook verifications.' },
    { id: 'btnAddFunction', type: 'function', label: 'chargeCustomer', badge: 'FUNCTION', badgeClass: 'badge-function', desc: 'Charges payment gateway and records order.' },
    { id: 'btnAddExternal', type: 'external', label: 'RedisCache', badge: 'EXTERNAL', badgeClass: 'badge-external', desc: 'Sub-millisecond cache for user session locks.' }
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
      newCard.setAttribute('data-title', `${cfg.label}`);
      newCard.style.left = `${120 + (newNodeCounter * 30) % 360}px`;
      newCard.style.top = `${200 + (newNodeCounter * 20) % 120}px`;

      newCard.innerHTML = `
        <div class="rf-handle rf-handle-left"></div>
        <div class="rf-handle rf-handle-right"></div>
        <div class="card-header">
          <div class="card-header-left">
            <span class="grip-dots" title="Drag card">&#8942;&#8942;</span>
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
      updateEdgePaths();
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
      setTimeout(updateEdgePaths, 220);
    });
  }

  if (ctrlZoomOut && canvasContainer) {
    ctrlZoomOut.addEventListener('click', () => {
      currentZoom = Math.max(0.7, currentZoom - 0.1);
      canvasContainer.style.transform = `scale(${currentZoom})`;
      setTimeout(updateEdgePaths, 220);
    });
  }

  if (ctrlFitView && canvasContainer) {
    ctrlFitView.addEventListener('click', () => {
      currentZoom = 1.0;
      canvasContainer.style.transform = 'scale(1.0)';
      setTimeout(updateEdgePaths, 220);
    });
  }

  // Initial path calculation on page load and window resize
  window.addEventListener('resize', updateEdgePaths);
  setTimeout(updateEdgePaths, 50);
  setTimeout(updateEdgePaths, 300);
});
