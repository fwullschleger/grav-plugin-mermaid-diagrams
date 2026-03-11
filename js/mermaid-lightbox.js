(function () {
    'use strict';

    var overlay = null;
    var state = { scale: 1, translateX: 0, translateY: 0 };
    var drag = { active: false, startX: 0, startY: 0, startTx: 0, startTy: 0 };
    var container = null;
    var zoomLabel = null;

    function applyTransform() {
        container.style.transform =
            'translate(' + state.translateX + 'px, ' + state.translateY + 'px) scale(' + state.scale + ')';
        if (zoomLabel) {
            zoomLabel.textContent = Math.round(state.scale * 100) + '%';
        }
    }

    function zoom(delta, cx, cy) {
        var factor = delta > 0 ? 1.15 : 1 / 1.15;
        var newScale = Math.min(Math.max(state.scale * factor, 0.1), 10);
        // Zoom toward the cursor position
        state.translateX = cx - (cx - state.translateX) * (newScale / state.scale);
        state.translateY = cy - (cy - state.translateY) * (newScale / state.scale);
        state.scale = newScale;
        applyTransform();
    }

    function resetView() {
        var svg = container.querySelector('svg');
        if (!svg) return;
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var svgW = svg.getBoundingClientRect().width / state.scale || svg.viewBox.baseVal.width || vw;
        var svgH = svg.getBoundingClientRect().height / state.scale || svg.viewBox.baseVal.height || vh;
        // Use the viewBox dimensions if available for accuracy
        if (svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width) {
            svgW = svg.viewBox.baseVal.width;
            svgH = svg.viewBox.baseVal.height;
        }
        var padding = 60;
        var fitScale = Math.min((vw - padding) / svgW, (vh - padding) / svgH, 2);
        state.scale = fitScale;
        state.translateX = (vw - svgW * fitScale) / 2;
        state.translateY = (vh - svgH * fitScale) / 2;
        applyTransform();
    }

    function closeLightbox() {
        if (overlay) {
            overlay.remove();
            overlay = null;
            container = null;
            zoomLabel = null;
            document.body.style.overflow = '';
        }
    }

    function openLightbox(mermaidEl) {
        var svg = mermaidEl.querySelector('svg');
        if (!svg) return;

        document.body.style.overflow = 'hidden';

        overlay = document.createElement('div');
        overlay.className = 'mermaid-lightbox-overlay';

        var closeBtn = document.createElement('button');
        closeBtn.className = 'mermaid-lightbox-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.title = 'Close (Esc)';
        closeBtn.addEventListener('click', closeLightbox);

        var controls = document.createElement('div');
        controls.className = 'mermaid-lightbox-controls';

        var zoomOut = document.createElement('button');
        zoomOut.textContent = '\u2212';
        zoomOut.title = 'Zoom out';
        zoomOut.addEventListener('click', function () {
            zoom(-1, window.innerWidth / 2, window.innerHeight / 2);
        });

        zoomLabel = document.createElement('span');
        zoomLabel.className = 'zoom-level';

        var zoomIn = document.createElement('button');
        zoomIn.textContent = '+';
        zoomIn.title = 'Zoom in';
        zoomIn.addEventListener('click', function () {
            zoom(1, window.innerWidth / 2, window.innerHeight / 2);
        });

        var fitBtn = document.createElement('button');
        fitBtn.textContent = 'Fit';
        fitBtn.title = 'Fit to screen';
        fitBtn.addEventListener('click', resetView);

        controls.appendChild(zoomOut);
        controls.appendChild(zoomLabel);
        controls.appendChild(zoomIn);
        controls.appendChild(fitBtn);

        container = document.createElement('div');
        container.className = 'mermaid-lightbox-container';
        container.appendChild(svg.cloneNode(true));

        // Set explicit pixel dimensions from viewBox so the SVG renders in the lightbox
        var clonedSvg = container.querySelector('svg');
        clonedSvg.style.maxWidth = 'none';
        clonedSvg.style.maxHeight = 'none';
        var vb = clonedSvg.viewBox && clonedSvg.viewBox.baseVal;
        if (vb && vb.width && vb.height) {
            clonedSvg.setAttribute('width', vb.width);
            clonedSvg.setAttribute('height', vb.height);
        } else {
            // Fallback: use the original's rendered size
            var rect = svg.getBoundingClientRect();
            clonedSvg.setAttribute('width', rect.width);
            clonedSvg.setAttribute('height', rect.height);
        }
        // Update internal <style> selectors to match the new ID to avoid duplicate-ID issues
        var origId = clonedSvg.id;
        var newId = origId + '-lightbox';
        clonedSvg.id = newId;
        var styles = clonedSvg.querySelectorAll('style');
        styles.forEach(function (styleEl) {
            styleEl.textContent = styleEl.textContent.split(origId).join(newId);
        });

        overlay.appendChild(container);
        overlay.appendChild(closeBtn);
        overlay.appendChild(controls);
        document.body.appendChild(overlay);

        state = { scale: 1, translateX: 0, translateY: 0 };
        resetView();

        // Mouse wheel zoom
        overlay.addEventListener('wheel', function (e) {
            e.preventDefault();
            zoom(e.deltaY < 0 ? 1 : -1, e.clientX, e.clientY);
        }, { passive: false });

        // Pan via mouse drag
        overlay.addEventListener('mousedown', function (e) {
            if (e.target === closeBtn || e.target.closest('.mermaid-lightbox-controls')) return;
            drag.active = true;
            drag.startX = e.clientX;
            drag.startY = e.clientY;
            drag.startTx = state.translateX;
            drag.startTy = state.translateY;
            overlay.classList.add('grabbing');
            e.preventDefault();
        });

        overlay.addEventListener('mousemove', function (e) {
            if (!drag.active) return;
            state.translateX = drag.startTx + (e.clientX - drag.startX);
            state.translateY = drag.startTy + (e.clientY - drag.startY);
            applyTransform();
        });

        overlay.addEventListener('mouseup', function () {
            drag.active = false;
            overlay.classList.remove('grabbing');
        });

        // Touch support for mobile
        var lastTouchDist = 0;
        overlay.addEventListener('touchstart', function (e) {
            if (e.touches.length === 1) {
                drag.active = true;
                drag.startX = e.touches[0].clientX;
                drag.startY = e.touches[0].clientY;
                drag.startTx = state.translateX;
                drag.startTy = state.translateY;
            } else if (e.touches.length === 2) {
                drag.active = false;
                var dx = e.touches[0].clientX - e.touches[1].clientX;
                var dy = e.touches[0].clientY - e.touches[1].clientY;
                lastTouchDist = Math.sqrt(dx * dx + dy * dy);
            }
        }, { passive: true });

        overlay.addEventListener('touchmove', function (e) {
            e.preventDefault();
            if (e.touches.length === 1 && drag.active) {
                state.translateX = drag.startTx + (e.touches[0].clientX - drag.startX);
                state.translateY = drag.startTy + (e.touches[0].clientY - drag.startY);
                applyTransform();
            } else if (e.touches.length === 2) {
                var dx = e.touches[0].clientX - e.touches[1].clientX;
                var dy = e.touches[0].clientY - e.touches[1].clientY;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (lastTouchDist > 0) {
                    var cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                    var cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                    zoom(dist > lastTouchDist ? 1 : -1, cx, cy);
                }
                lastTouchDist = dist;
            }
        }, { passive: false });

        overlay.addEventListener('touchend', function () {
            drag.active = false;
            lastTouchDist = 0;
        }, { passive: true });

        // Close on overlay background click (not on SVG drag)
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closeLightbox();
            }
        });
    }

    // Keyboard handler
    document.addEventListener('keydown', function (e) {
        if (!overlay) return;
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === '+' || e.key === '=') {
            zoom(1, window.innerWidth / 2, window.innerHeight / 2);
        } else if (e.key === '-') {
            zoom(-1, window.innerWidth / 2, window.innerHeight / 2);
        } else if (e.key === '0') {
            resetView();
        }
    });

    // Attach click handlers once mermaid has rendered
    function attachHandlers() {
        var diagrams = document.querySelectorAll('.mermaid[data-processed="true"]');
        diagrams.forEach(function (el) {
            if (el.dataset.lightboxBound) return;
            el.dataset.lightboxBound = 'true';
            el.addEventListener('click', function () {
                openLightbox(el);
            });
        });
    }

    // Wait for mermaid to finish rendering, then attach
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(attachHandlers, 500);
        });
    } else {
        setTimeout(attachHandlers, 500);
    }

    // Also observe for dynamically rendered diagrams
    var observer = new MutationObserver(function () {
        attachHandlers();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-processed'] });
})();
