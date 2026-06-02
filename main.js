document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Set Current Year in Footer
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- STATE SYSTEM ---
  const state = {
    color: 'Off-White',
    hex: '#f5f5f7',
    blend: 'rgba(255, 255, 255, 0.15)',
    fabric: 'liso', // liso or textura
    size: 'M',
    qty: 1,
    cart: [],
    shippingCost: null,
    shippingZip: ''
  };

  // --- HTML ELEMENTS ---
  // Product gallery & Customizer (Vitrine SVG)
  const mainSvgBaseColor = document.getElementById('mainSvgBaseColor');
  const mainSvgTextureOverlay = document.getElementById('mainSvgTextureOverlay');
  const galleryFabricBadge = document.getElementById('galleryFabricBadge');
  const fabricCards = document.querySelectorAll('.fabric-card');
  const fabricLabel = document.getElementById('fabricLabel');
  const colorCircles = document.querySelectorAll('.color-picker-flex:not(.mini) .color-circle');
  const colorLabel = document.getElementById('colorLabel');
  const sizeBoxes = document.querySelectorAll('.size-box');
  const sizeLabel = document.getElementById('sizeLabel');
  const sizeFitAlert = document.getElementById('sizeFitAlert');
  const thumbBtns = document.querySelectorAll('.thumb-btn');

  // Quantity
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyVal = document.getElementById('qtyVal');
  const addToCartBtn = document.getElementById('addToCartBtn');

  // Cart elements
  const cartBtn = document.getElementById('cartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const overlayBackdrop = document.getElementById('overlayBackdrop');
  const cartBadge = document.getElementById('cartBadge');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartFooter = document.getElementById('cartFooter');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartShippingText = document.getElementById('cartShippingText');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // Shipping
  const cepInput = document.getElementById('cepInput');
  const calcShippingBtn = document.getElementById('calcShippingBtn');
  const cepError = document.getElementById('cepError');
  const shippingResults = document.getElementById('shippingResults');
  const pacCostEl = document.getElementById('pacCost');
  const sedexCostEl = document.getElementById('sedexCost');
  const freeShippingAlert = document.getElementById('freeShippingAlert');

  // Fitting Room Elements
  const userPhotoBackground = document.getElementById('userPhotoBackground');
  const clothingOverlay = document.getElementById('clothingOverlay');
  const svgBaseColor = document.getElementById('svgBaseColor');
  const svgTextureOverlay = document.getElementById('svgTextureOverlay');
  const fittingLoading = document.getElementById('fittingLoading');
  
  // Fitting Sync controls
  const fittingColorCircles = document.querySelectorAll('.color-picker-flex.mini .color-circle');
  const fittingFabricBtns = document.querySelectorAll('[data-sync="fabric"]');
  
  // Upload
  const photoUploadInput = document.getElementById('photoUploadInput');
  const triggerUploadBtn = document.getElementById('triggerUploadBtn');
  const uploadZone = document.getElementById('uploadZone');

  // Sliders
  const sliderScale = document.getElementById('sliderScale');
  const sliderX = document.getElementById('sliderX');
  const sliderY = document.getElementById('sliderY');
  const sliderRotate = document.getElementById('sliderRotate');
  const valScale = document.getElementById('valScale');
  const valX = document.getElementById('valX');
  const valY = document.getElementById('valY');
  const valRotate = document.getElementById('valRotate');
  const resetFittingControlsBtn = document.getElementById('resetFittingControlsBtn');

  // Size Advisor
  const advHeight = document.getElementById('advHeight');
  const advWeight = document.getElementById('advWeight');
  const btnAdvise = document.getElementById('btnAdvise');
  const advisorResult = document.getElementById('advisorResult');
  const recommendedSize = document.getElementById('recommendedSize');

  // Modals
  const sizeGuideBtn = document.getElementById('sizeGuideBtn');
  const sizeGuideModal = document.getElementById('sizeGuideModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  // --- MOBILE NAVBAR TOGGLE ---
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('open')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
      }
    });
  }

  // --- COLOR SELECTION UPDATER ---
  function updateColorState(colorName, hex, blend) {
    state.color = colorName;
    state.hex = hex;
    state.blend = blend || 'rgba(255, 255, 255, 0.1)';

    // Update labels
    if (colorLabel) colorLabel.textContent = colorName;

    // Update vitrine SVG coloring directly
    if (mainSvgBaseColor) {
      mainSvgBaseColor.setAttribute('fill', hex);
    }

    // Update fitting room SVG coloring
    if (svgBaseColor) {
      svgBaseColor.setAttribute('fill', hex);
    }
    
    // Sync active dots in Vitrine
    colorCircles.forEach(circle => {
      if (circle.getAttribute('data-color-name') === colorName) {
        circle.classList.add('active');
      } else {
        circle.classList.remove('active');
      }
    });

    // Sync active dots in Fitting Room
    fittingColorCircles.forEach(circle => {
      if (circle.getAttribute('data-color-name') === colorName) {
        circle.classList.add('active');
      } else {
        circle.classList.remove('active');
      }
    });
  }

  // Bind Vitrine color selection
  colorCircles.forEach(circle => {
    circle.addEventListener('click', () => {
      const colorName = circle.getAttribute('data-color-name');
      const hex = circle.getAttribute('data-hex');
      const blend = circle.getAttribute('data-blend');
      updateColorState(colorName, hex, blend);
    });
  });

  // Bind Fitting room color selection
  fittingColorCircles.forEach(circle => {
    circle.addEventListener('click', () => {
      const colorName = circle.getAttribute('data-color-name');
      const hex = circle.getAttribute('data-hex');
      
      // Look up blend from main color list to keep it uniform
      let blendVal = 'rgba(255,255,255,0.1)';
      colorCircles.forEach(c => {
        if (c.getAttribute('data-color-name') === colorName) {
          blendVal = c.getAttribute('data-blend');
        }
      });
      
      updateColorState(colorName, hex, blendVal);
    });
  });

  // --- FABRIC SELECTION UPDATER ---
  function updateFabricState(fabricType) {
    state.fabric = fabricType;

    // Update Text Labels
    if (fabricLabel) {
      fabricLabel.textContent = fabricType === 'liso' ? 'Algodão Egípcio Liso' : 'Canelado Texturizado';
    }
    if (galleryFabricBadge) {
      galleryFabricBadge.textContent = fabricType === 'liso' ? 'Tecido Liso' : 'Tecido Texturizado';
    }

    // Toggle ribbed pattern on vitrine SVG
    if (mainSvgTextureOverlay) {
      mainSvgTextureOverlay.style.display = fabricType === 'textura' ? 'block' : 'none';
    }

    // Toggle active classes on fabric cards (Vitrine)
    fabricCards.forEach(card => {
      if (card.getAttribute('data-fabric') === fabricType) {
        card.classList.add('active');
        const radioInput = card.querySelector('input');
        if (radioInput) radioInput.checked = true;
      } else {
        card.classList.remove('active');
      }
    });

    // Toggle active classes on thumbnail buttons (Vitrine)
    thumbBtns.forEach(btn => {
      if (btn.getAttribute('data-fabric') === fabricType) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('remove');
        btn.classList.remove('active');
      }
    });

    // Toggle active classes on mini toggle buttons (Fitting room)
    fittingFabricBtns.forEach(btn => {
      if (btn.getAttribute('data-fabric') === fabricType) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Sync fitting SVG Texture pattern
    if (svgTextureOverlay) {
      svgTextureOverlay.style.display = fabricType === 'textura' ? 'block' : 'none';
    }
  }

  // Bind Vitrine radio cards
  fabricCards.forEach(card => {
    card.addEventListener('click', () => {
      const fabricType = card.getAttribute('data-fabric');
      updateFabricState(fabricType);
    });
  });

  // Bind Vitrine thumbnails
  thumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const fabricType = btn.getAttribute('data-fabric');
      updateFabricState(fabricType);
    });
  });

  // Bind Fitting room sync buttons
  fittingFabricBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const fabricType = btn.getAttribute('data-fabric');
      updateFabricState(fabricType);
    });
  });

  // --- SIZE SELECTION ---
  sizeBoxes.forEach(box => {
    box.addEventListener('click', () => {
      sizeBoxes.forEach(b => b.classList.remove('active'));
      box.classList.add('active');
      
      const sizeVal = box.getAttribute('data-size');
      state.size = sizeVal;
      if (sizeLabel) sizeLabel.textContent = sizeVal;

      // Show specific size details or notices
      if (sizeFitAlert) {
        const plusSizes = ['G1', 'G2', 'G3', 'G4'];
        if (plusSizes.includes(sizeVal)) {
          sizeFitAlert.style.display = 'block';
          sizeFitAlert.textContent = `O tamanho ${sizeVal} é especialmente modelado com costura dupla lateral reforçada e ${plusSizes.indexOf(sizeVal) + 3}cm a mais de comprimento.`;
        } else {
          sizeFitAlert.style.display = 'block';
          sizeFitAlert.textContent = 'Modelagem padrão brasileira com alta elasticidade.';
        }
      }
    });
  });
  
  // Set default size active
  const defaultSizeBox = Array.from(sizeBoxes).find(b => b.getAttribute('data-size') === 'M');
  if (defaultSizeBox) defaultSizeBox.click();

  // --- QUANTITY SELECTOR ---
  if (qtyMinus && qtyPlus && qtyVal) {
    qtyMinus.addEventListener('click', () => {
      if (state.qty > 1) {
        state.qty--;
        qtyVal.textContent = state.qty;
      }
    });
    qtyPlus.addEventListener('click', () => {
      state.qty++;
      qtyVal.textContent = state.qty;
    });
  }

  // --- SHIPPING CALCULATOR (Simulated) ---
  // Input mask for ZIP code (00000-000)
  if (cepInput) {
    cepInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 5) {
        val = val.substring(0, 5) + '-' + val.substring(5, 8);
      }
      e.target.value = val;
    });
  }

  if (calcShippingBtn && cepInput) {
    calcShippingBtn.addEventListener('click', () => {
      const zip = cepInput.value;
      if (!/^\d{5}-\d{3}$/.test(zip)) {
        cepError.style.display = 'block';
        shippingResults.style.display = 'none';
        return;
      }
      
      cepError.style.display = 'none';
      
      // Simulate API call
      calcShippingBtn.disabled = true;
      calcShippingBtn.textContent = 'Calculando...';
      
      setTimeout(() => {
        calcShippingBtn.disabled = false;
        calcShippingBtn.textContent = 'Calcular';
        
        // Calculate simulated shipping costs based on the ZIP code prefix
        const firstDigit = parseInt(zip[0]);
        let pacPrice = 12.90 + firstDigit * 2;
        let sedexPrice = 24.50 + firstDigit * 3;
        
        let pacDays = 3 + firstDigit;
        let sedexDays = 1 + Math.ceil(firstDigit / 3);

        pacCostEl.textContent = `R$ ${pacPrice.toFixed(2).replace('.', ',')}`;
        sedexCostEl.textContent = `R$ ${sedexPrice.toFixed(2).replace('.', ',')}`;
        
        document.getElementById('pacDays').textContent = `${pacDays} a ${pacDays + 3} dias úteis`;
        document.getElementById('sedexDays').textContent = `${sedexDays} a ${sedexDays + 1} dias úteis`;

        state.shippingCost = pacPrice; // default selected cost
        state.shippingZip = zip;
        
        shippingResults.style.display = 'flex';
        
        // Check free shipping threshold (limit at R$ 200)
        const currentTotal = 79.90 * state.qty;
        if (currentTotal >= 200) {
          freeShippingAlert.innerHTML = `<i data-lucide="check-circle-2"></i> Parabéns! Sua compra se qualifica para <strong>Frete Grátis</strong>.`;
          pacCostEl.innerHTML = `<span style="text-decoration: line-through; font-size: 0.75rem; color: #a1a1aa; font-weight: normal; margin-right: 6px;">R$ ${pacPrice.toFixed(2).replace('.', ',')}</span> Grátis`;
          state.shippingCost = 0;
        } else {
          const needed = 200 - currentTotal;
          freeShippingAlert.innerHTML = `<i data-lucide="truck"></i> Adicione mais <strong>R$ ${needed.toFixed(2).replace('.', ',')}</strong> para ter <strong>Frete Grátis</strong>!`;
        }
        lucide.createIcons();
        
        // Update cart if open
        updateCartTotalSummary();
      }, 800);
    });
  }

  // --- VIRTUAL FITTING ROOM FITTING ENGINE ---
  // Sliders input events
  function updateClothingStyles() {
    const scale = sliderScale.value;
    const x = sliderX.value;
    const y = sliderY.value;
    const rot = sliderRotate.value;

    valScale.textContent = `${scale}%`;
    valX.textContent = `${x}px`;
    valY.textContent = `${y}px`;
    valRotate.textContent = `${rot}°`;

    // Apply values to HTML element styles using CSS variables
    clothingOverlay.style.setProperty('--cloth-scale', `${scale}%`);
    clothingOverlay.style.setProperty('--cloth-x', `${x}px`);
    clothingOverlay.style.setProperty('--cloth-y', `${y}px`);
    clothingOverlay.style.setProperty('--cloth-rotate', `${rot}deg`);
  }

  if (sliderScale && sliderX && sliderY && sliderRotate) {
    sliderScale.addEventListener('input', updateClothingStyles);
    sliderX.addEventListener('input', updateClothingStyles);
    sliderY.addEventListener('input', updateClothingStyles);
    sliderRotate.addEventListener('input', updateClothingStyles);
  }

  // Reset Adjustments
  if (resetFittingControlsBtn) {
    resetFittingControlsBtn.addEventListener('click', () => {
      sliderScale.value = 100;
      sliderX.value = 0;
      sliderY.value = 0;
      sliderRotate.value = 0;
      updateClothingStyles();
    });
  }

  // Image Upload System
  if (triggerUploadBtn && photoUploadInput) {
    // Make entire zone clickable
    uploadZone.addEventListener('click', (e) => {
      if (e.target !== triggerUploadBtn) {
        photoUploadInput.click();
      }
    });
    
    triggerUploadBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent double click triggers
      photoUploadInput.click();
    });

    photoUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        processUploadedPhoto(file);
      }
    });

    // Drag and Drop
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = '#fff';
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.style.borderColor = 'rgba(255,255,255,0.15)';
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = 'rgba(255,255,255,0.15)';
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        processUploadedPhoto(file);
      }
    });
  }

  function processUploadedPhoto(file) {
    const reader = new FileReader();
    
    // Show simulation loader
    if (fittingLoading) {
      fittingLoading.classList.add('active');
    }

    reader.onload = (event) => {
      setTimeout(() => {
        // Load target background img
        if (userPhotoBackground) {
          userPhotoBackground.src = event.target.result;
          userPhotoBackground.style.opacity = 1;
        }

        // Apply automatic preset fit values depending on scale
        sliderScale.value = 110;
        sliderX.value = 0;
        sliderY.value = 10;
        sliderRotate.value = 0;
        updateClothingStyles();

        if (fittingLoading) {
          fittingLoading.classList.remove('active');
        }
      }, 1500); // 1.5s delay to represent processing/calibration
    };

    reader.readAsDataURL(file);
  }

  // --- SIZE ADVISOR CALCULATION ---
  if (btnAdvise && advHeight && advWeight) {
    btnAdvise.addEventListener('click', () => {
      const height = parseFloat(advHeight.value);
      const weight = parseFloat(advWeight.value);

      if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert('Por favor, insira valores válidos para altura e peso.');
        return;
      }

      // Clothing size estimation logic (P to G4)
      let resultSize = 'M';
      
      if (weight < 54) {
        resultSize = 'P';
      } else if (weight >= 54 && weight < 64) {
        resultSize = 'M';
      } else if (weight >= 64 && weight < 76) {
        resultSize = 'G';
      } else if (weight >= 76 && weight < 88) {
        resultSize = 'GG';
      } else if (weight >= 88 && weight < 98) {
        resultSize = 'G1';
      } else if (weight >= 98 && weight < 108) {
        resultSize = 'G2';
      } else if (weight >= 108 && weight < 118) {
        resultSize = 'G3';
      } else {
        resultSize = 'G4';
      }

      recommendedSize.textContent = resultSize;
      
      // Update Vitrine select box
      const targetSizeBox = Array.from(sizeBoxes).find(b => b.getAttribute('data-size') === resultSize);
      if (targetSizeBox) {
        targetSizeBox.click();
      }

      advisorResult.style.display = 'flex';
    });
  }

  // --- SHOPPING BAG DRAWER SYSTEM ---
  function updateCartTotalSummary() {
    let subtotal = 0;
    state.cart.forEach(item => {
      subtotal += item.price * item.qty;
    });

    cartSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;

    if (state.shippingCost !== null) {
      if (state.shippingCost === 0) {
        cartShippingText.textContent = 'Grátis';
      } else {
        cartShippingText.textContent = `R$ ${state.shippingCost.toFixed(2).replace('.', ',')}`;
      }
      const total = subtotal + state.shippingCost;
      cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    } else {
      cartShippingText.textContent = 'Calcular na vitrine';
      cartTotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }

    // Set badge counter
    let totalItems = 0;
    state.cart.forEach(item => totalItems += item.qty);
    cartBadge.textContent = totalItems;
  }

  function renderCartItems() {
    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <i data-lucide="shopping-basket" class="empty-icon"></i>
          <p>Seu carrinho está vazio.</p>
        </div>
      `;
      cartFooter.style.display = 'none';
      lucide.createIcons();
      return;
    }

    cartFooter.style.display = 'flex';
    cartItemsContainer.innerHTML = '';

    state.cart.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      
      const thumbSrc = item.fabric === 'liso' ? 'assets/regata_lisa.png' : 'assets/regata_textura.png';
      
      // Get color blend for thumbnail tint overlay
      let blendVal = 'rgba(255,255,255,0)';
      colorCircles.forEach(c => {
        if (c.getAttribute('data-color-name') === item.color) {
          blendVal = c.getAttribute('data-blend');
        }
      });

      itemEl.innerHTML = `
        <div class="cart-item-thumb">
          <img src="${thumbSrc}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-color-tint" style="background-color: ${blendVal};"></div>
        </div>
        <div class="cart-item-details">
          <span class="cart-item-title">${item.title}</span>
          <span class="cart-item-meta">Tecido: ${item.fabric === 'liso' ? 'Liso' : 'Canelado'} | Cor: ${item.color} | Tam: ${item.size}</span>
          <div class="cart-item-price-row">
            <span class="cart-item-price">${item.qty}x R$ ${item.price.toFixed(2).replace('.', ',')}</span>
            <button class="btn-remove-item" data-index="${index}">Remover</button>
          </div>
        </div>
      `;

      cartItemsContainer.appendChild(itemEl);
    });

    // Bind remove button clicks
    const removeBtns = cartItemsContainer.querySelectorAll('.btn-remove-item');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        state.cart.splice(index, 1);
        renderCartItems();
        updateCartTotalSummary();
      });
    });

    lucide.createIcons();
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      // Add dynamic item
      const item = {
        title: 'Regata Gola Alta Essencial',
        color: state.color,
        hex: state.hex,
        fabric: state.fabric,
        size: state.size,
        qty: state.qty,
        price: 79.90
      };

      // Check if duplicate item exists (same color, fabric, and size)
      const duplicateIndex = state.cart.findIndex(i => 
        i.color === item.color && 
        i.fabric === item.fabric && 
        i.size === item.size
      );

      if (duplicateIndex > -1) {
        state.cart[duplicateIndex].qty += item.qty;
      } else {
        state.cart.push(item);
      }

      // Reset selection quantity back to 1
      state.qty = 1;
      if (qtyVal) qtyVal.textContent = 1;

      // Update, Render and Open Cart drawer
      renderCartItems();
      updateCartTotalSummary();
      
      cartSidebar.classList.add('active');
      overlayBackdrop.classList.add('active');
    });
  }

  // Open/Close Bag drawer triggers
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      renderCartItems();
      updateCartTotalSummary();
      cartSidebar.classList.add('active');
      overlayBackdrop.classList.add('active');
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      cartSidebar.classList.remove('active');
      overlayBackdrop.classList.remove('active');
    });
  }

  if (overlayBackdrop) {
    overlayBackdrop.addEventListener('click', () => {
      cartSidebar.classList.remove('active');
      if (sizeGuideModal) sizeGuideModal.classList.remove('active');
      overlayBackdrop.classList.remove('active');
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert('Seu pedido foi finalizado (Simulado)! Agradecemos a preferência pela Nélia Regatas.');
      state.cart = [];
      renderCartItems();
      updateCartTotalSummary();
      cartSidebar.classList.remove('active');
      overlayBackdrop.classList.remove('active');
    });
  }

  // --- MODAL DIALOG CONTROLLER (Tabela de Medidas) ---
  if (sizeGuideBtn && sizeGuideModal && closeModalBtn) {
    sizeGuideBtn.addEventListener('click', () => {
      sizeGuideModal.classList.add('active');
      overlayBackdrop.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
      sizeGuideModal.classList.remove('active');
      overlayBackdrop.classList.remove('active');
    });
  }

  // --- NEWSLETTER FORM SUBMIT ---
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterStatus = document.getElementById('newsletterStatus');
  if (newsletterForm && newsletterStatus) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const btn = newsletterForm.querySelector('button');
      const input = newsletterForm.querySelector('input');
      const originalText = btn.textContent;
      
      btn.disabled = true;
      btn.textContent = 'Enviando...';
      
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
        input.value = '';
        
        newsletterStatus.className = 'form-status success';
        newsletterStatus.textContent = 'Inscrição realizada com sucesso! Aproveite os descontos.';
        newsletterStatus.style.display = 'block';
        
        setTimeout(() => {
          newsletterStatus.style.display = 'none';
        }, 5000);
      }, 1200);
    });
  }

  // --- INITIAL RENDERING TRIGGER ---
  // Default values check-in
  updateColorState('Off-White', '#f5f5f7', 'rgba(255, 255, 255, 0.15)');
  updateFabricState('liso');
  updateClothingStyles();
});
