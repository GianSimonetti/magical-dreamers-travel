document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('#menu-toggle');
  const navLinks = document.querySelector('#nav-links');

  if (menuButton && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('is-open');
      menuButton.classList.remove('is-active');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menú');
      document.body.classList.remove('menu-open');
    };
    menuButton.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuButton.classList.toggle('is-active', isOpen);
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('menu-open', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  const slides = [...document.querySelectorAll('.hero-slide')];
  if (slides.length) {
    const slideButtons = [...document.querySelectorAll('.slider-dots button')];
    const destinationLabel = document.querySelector('#hero-destination');
    const destinations = ['Walt Disney World', 'La magia de Disney', 'Universal Orlando', 'Nuestro equipo en Universal'];
    let activeSlide = 0;
    let sliderTimer;
    const showSlide = index => {
      activeSlide = index;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      slideButtons.forEach((button, i) => button.classList.toggle('is-active', i === index));
      if (destinationLabel) destinationLabel.textContent = destinations[index];
    };
    const startSlider = () => {
      clearInterval(sliderTimer);
      sliderTimer = setInterval(() => showSlide((activeSlide + 1) % slides.length), 6500);
    };
    slideButtons.forEach(button => button.addEventListener('click', () => {
      showSlide(Number(button.dataset.slide));
      startSlider();
    }));
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) startSlider();
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -25px' });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  const testimonialTrack = document.querySelector('#testimonial-track');
  if (testimonialTrack) {
    const cards = [...testimonialTrack.querySelectorAll('.testimonial-card')];
    const reviewWindow = testimonialTrack.closest('.testimonial-window');
    const currentLabel = document.querySelector('#testimonial-current');
    const progressBar = document.querySelector('#testimonial-progress-bar');
    const modal = document.querySelector('#testimonial-modal');
    const modalImage = document.querySelector('#testimonial-modal-image');
    const modalTitle = document.querySelector('#testimonial-modal-title');
    let current = 0;

    const showReview = index => {
      current = (index + cards.length) % cards.length;
      testimonialTrack.style.transform = `translateX(-${current * 100}%)`;
      cards.forEach((card, cardIndex) => {
        const isActive = cardIndex === current;
        card.setAttribute('aria-hidden', String(!isActive));
        card.querySelector('.testimonial-media')?.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      if (currentLabel) currentLabel.textContent = String(current + 1).padStart(2, '0');
      if (progressBar) progressBar.style.width = `${((current + 1) / cards.length) * 100}%`;
    };

    const move = direction => showReview(current + direction);
    document.querySelector('#testimonial-prev')?.addEventListener('click', () => move(-1));
    document.querySelector('#testimonial-next')?.addEventListener('click', () => move(1));

    if (reviewWindow) {
      let pointerStart = 0;
      reviewWindow.setAttribute('tabindex', '0');
      reviewWindow.setAttribute('aria-label', 'Galería de reseñas. Usa las flechas izquierda y derecha para navegar.');
      reviewWindow.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') move(-1);
        if (event.key === 'ArrowRight') move(1);
      });
      reviewWindow.addEventListener('pointerdown', event => { pointerStart = event.clientX; });
      reviewWindow.addEventListener('pointerup', event => {
        const distance = event.clientX - pointerStart;
        if (Math.abs(distance) > 55) move(distance > 0 ? -1 : 1);
      });
    }

    cards.forEach(card => {
      const image = card.querySelector('.testimonial-image');
      const mediaButton = card.querySelector('.testimonial-media');
      image?.addEventListener('error', () => {
        card.classList.add('has-image-error');
        mediaButton?.setAttribute('disabled', '');
      });
      mediaButton?.addEventListener('click', () => {
        if (!modal || !modalImage || !image?.complete || !image.naturalWidth) return;
        modal.classList.toggle('is-landscape', image.naturalWidth >= image.naturalHeight);
        modal.classList.toggle('is-portrait', image.naturalWidth < image.naturalHeight);
        modalImage.src = image.currentSrc || image.src;
        modalImage.alt = image.alt;
        if (modalTitle) modalTitle.textContent = card.querySelector('.testimonial-author strong')?.textContent || 'Reseña de nuestros viajeros';
        modal.showModal();
        document.body.classList.add('has-open-review');
      });
    });

    const closeReviewModal = () => {
      if (modal?.open) modal.close();
      document.body.classList.remove('has-open-review');
    };
    document.querySelector('#testimonial-modal-close')?.addEventListener('click', closeReviewModal);
    modal?.addEventListener('click', event => { if (event.target === modal) closeReviewModal(); });
    modal?.addEventListener('close', () => document.body.classList.remove('has-open-review'));
    showReview(0);
  }

  const whatsappPhone = '14076843142';
  const openWhatsApp = message => {
    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  document.querySelectorAll('.offer-card .whatsapp-action').forEach(action => {
    action.classList.remove('whatsapp-action');
    action.classList.add('offer-card__cta');
    action.textContent = 'Armar mi paquete →';
    action.addEventListener('click', () => { window.location.href = 'index.html#contacto'; });
  });

  const bindWhatsAppActions = (root = document) => {
    root.querySelectorAll('.whatsapp-action:not([data-whatsapp-bound])').forEach(action => {
      action.dataset.whatsappBound = 'true';
      if (action.tagName === 'A') action.href = `https://wa.me/${whatsappPhone}`;
      action.addEventListener('click', event => {
        event.preventDefault();
        const offerTitle = action.closest('.offer-card')?.querySelector('h3')?.textContent.trim();
        const message = action.dataset.message || (offerTitle
          ? `Hola Magical Dreamers, quisiera recibir información sobre: ${offerTitle}.`
          : 'Hola Magical Dreamers, quisiera recibir información para planificar mi próximo viaje.');
        openWhatsApp(message);
      });
    });
  };
  bindWhatsAppActions();

  document.querySelector('#quote-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = [
      'Hola Magical Dreamers, quisiera solicitar una cotización.',
      '',
      `Nombre: ${data.get('name') || '-'}`,
      `Email: ${data.get('email') || '-'}`,
      `WhatsApp: ${data.get('phone') || '-'}`,
      `Destino: ${data.get('destination') || '-'}`,
      `Fecha estimada: ${data.get('date') || 'A definir'}`,
      `Cantidad de viajeros: ${data.get('travelers') || 'A definir'}`,
      `Detalles: ${data.get('message') || 'Sin detalles adicionales'}`
    ].join('\n');
    document.querySelector('#form-success')?.classList.add('is-visible');
    openWhatsApp(message);
  });

  const filterButtons = [...document.querySelectorAll('.promo-filter button')];
  const setDataState = (element, mode, message) => {
    if (!element) return;
    element.hidden = mode === 'hidden';
    element.className = `data-state${mode === 'hidden' ? '' : ` data-state--${mode}`}`;
    const text = element.querySelector('p');
    if (text && message) text.textContent = message;
  };
  const applyPromotionFilter = filter => {
    document.querySelectorAll('.offer-card').forEach(offer => {
      offer.hidden = filter !== 'all' && offer.dataset.category !== filter;
    });
  };
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.toggle('is-active', item === button));
    applyPromotionFilter(button.dataset.filter);
  }));

  const offerGrid = document.querySelector('#offer-grid');
  const promotionStatus = document.querySelector('#promotion-status');
  const createPromotionCard = promotion => {
    const card = document.createElement('article');
    card.className = 'offer-card reveal is-visible';
    card.dataset.category = promotion.categoria;

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'offer-card__image';
    const image = document.createElement('img');
    image.src = promotion.imagenUrl;
    image.alt = promotion.imagenAlt || promotion.titulo;
    image.loading = 'lazy';
    const badge = document.createElement('span');
    badge.className = 'offer-card__badge';
    badge.textContent = promotion.etiqueta;
    imageWrapper.append(image, badge);

    const body = document.createElement('div');
    body.className = 'offer-card__body';
    const subtitle = document.createElement('small');
    subtitle.textContent = promotion.subtitulo || (promotion.categoria === 'disney' ? 'DISNEY' : 'UNIVERSAL');
    const title = document.createElement('h3');
    title.textContent = promotion.titulo;
    const description = document.createElement('p');
    description.textContent = promotion.descripcion;
    const action = document.createElement('a');
    action.className = 'offer-card__cta';
    action.href = 'index.html#contacto';
    action.textContent = 'Armar mi paquete →';
    body.append(subtitle, title, description, action);
    card.append(imageWrapper, body);
    return card;
  };

  const loadPromotionsFromSanity = async () => {
    if (!offerGrid) return;
    try {
      if (!window.MagicalDreamersSanity) throw new Error('La conexión con Sanity no está disponible.');
      const promotions = await window.MagicalDreamersSanity.getPromotions();
      offerGrid.replaceChildren();
      if (!promotions.length) {
        filterButtons.forEach(button => { button.disabled = true; });
        setDataState(promotionStatus, 'empty', 'No hay promociones activas en este momento.');
        offerGrid.dataset.source = 'empty';
        return;
      }
      const fragment = document.createDocumentFragment();
      promotions.forEach(promotion => fragment.appendChild(createPromotionCard(promotion)));
      offerGrid.replaceChildren(fragment);
      filterButtons.forEach(button => { button.disabled = false; });
      setDataState(promotionStatus, 'hidden');
      const activeFilter = document.querySelector('.promo-filter button.is-active')?.dataset.filter || 'all';
      applyPromotionFilter(activeFilter);
      offerGrid.dataset.source = 'sanity';
    } catch {
      offerGrid.replaceChildren();
      filterButtons.forEach(button => { button.disabled = true; });
      setDataState(promotionStatus, 'error', 'Las promociones no están disponibles temporalmente. Intenta nuevamente más tarde.');
      offerGrid.dataset.source = 'error';
    }
  };
  loadPromotionsFromSanity();

  let agents = [];
  const agentGrid = document.querySelector('#full-agent-grid');
  const agentSearch = document.querySelector('#agent-search');
  const agentCount = document.querySelector('#agent-count');
  const emptyAgents = document.querySelector('#empty-agents');
  const agentStatus = document.querySelector('#agent-status');
  const gradients = ['linear-gradient(145deg,#c53c89,#6f3da9)','linear-gradient(145deg,#4936a8,#2789b0)','linear-gradient(145deg,#e5a72e,#c53c89)','linear-gradient(145deg,#249f98,#4936a8)'];
  const initials = name => name.split(/\s+|&/).filter(word => word && word.toLocaleLowerCase('es') !== 'y').slice(0, 2).map(word => word[0]).join('').toUpperCase();
  const createAgentCard = ([name, handle, email], index) => {
    const card = document.createElement('article');
    card.className = 'agent-mini';

    const avatar = document.createElement('div');
    avatar.className = 'agent-mini__avatar';
    avatar.style.setProperty('--avatar', gradients[index % gradients.length]);
    avatar.textContent = initials(name);

    const content = document.createElement('div');
    content.className = 'agent-mini__content';
    const heading = document.createElement('h3');
    heading.textContent = name;

    const links = document.createElement('div');
    links.className = 'agent-mini__links';
    const instagram = document.createElement('a');
    instagram.href = `https://www.instagram.com/${encodeURIComponent(handle.replace('@', ''))}/`;
    instagram.target = '_blank';
    instagram.rel = 'noopener';
    instagram.setAttribute('aria-label', `Ver el perfil de ${name} en Instagram`);
    instagram.textContent = handle;
    links.appendChild(instagram);

    if (email) {
      const emailLink = document.createElement('a');
      emailLink.className = 'agent-mini__email';
      emailLink.href = `mailto:${email}`;
      emailLink.setAttribute('aria-label', `Enviar un correo a ${name}`);
      emailLink.textContent = email;
      links.appendChild(emailLink);
    }

    content.append(heading, links);
    card.append(avatar, content);
    return card;
  };
  const renderAgents = query => {
    if (!agentGrid) return;
    const normalized = query.trim().toLocaleLowerCase('es');
    const visibleAgents = agents.filter(([name, handle, email]) => `${name} ${handle} ${email}`.toLocaleLowerCase('es').includes(normalized));
    const fragment = document.createDocumentFragment();
    visibleAgents.forEach((agent, index) => fragment.appendChild(createAgentCard(agent, index)));
    agentGrid.replaceChildren(fragment);
    if (agentCount) agentCount.textContent = visibleAgents.length;
    if (emptyAgents) emptyAgents.style.display = agents.length && !visibleAgents.length ? 'block' : 'none';
  };
  if (agentGrid) {
    agentSearch?.addEventListener('input', event => renderAgents(event.target.value));
    Promise.resolve()
      .then(() => {
        if (!window.MagicalDreamersSanity) throw new Error('La conexión con Sanity no está disponible.');
        return window.MagicalDreamersSanity.getAgents();
      })
      .then(remoteAgents => {
        agents = remoteAgents
          .map(agent => [agent.nombre || '', agent.instagram || '', agent.email || ''])
          .sort(([nameA], [nameB]) => nameA.localeCompare(nameB, 'es', {sensitivity: 'base'}));
        if (!agents.length) {
          agentGrid.replaceChildren();
          if (agentCount) agentCount.textContent = '0';
          if (agentSearch) agentSearch.disabled = true;
          setDataState(agentStatus, 'empty', 'No hay agentes activos para mostrar en este momento.');
          agentGrid.dataset.source = 'empty';
          return;
        }
        if (agentSearch) agentSearch.disabled = false;
        setDataState(agentStatus, 'hidden');
        renderAgents(agentSearch?.value || '');
        agentGrid.dataset.source = 'sanity';
      })
      .catch(() => {
        agents = [];
        agentGrid.replaceChildren();
        if (agentCount) agentCount.textContent = '0';
        if (agentSearch) agentSearch.disabled = true;
        if (emptyAgents) emptyAgents.style.display = 'none';
        setDataState(agentStatus, 'error', 'El equipo no está disponible temporalmente. Intenta nuevamente más tarde.');
        agentGrid.dataset.source = 'error';
      });
  }

  const careerForm = document.querySelector('#career-form');
  if (careerForm) {
    const steps = [...careerForm.querySelectorAll('.form-step')];
    const progress = [...careerForm.querySelectorAll('.form-progress i')];
    const stepLabel = careerForm.querySelector('#career-step-label');
    const stepTitle = careerForm.querySelector('#career-step-title');
    const progressText = careerForm.querySelector('#career-progress-text');
    let activeStep = 0;

    const updateConditionalFields = () => {
      careerForm.querySelectorAll('[data-condition-field]').forEach(container => {
        const fieldName = container.dataset.conditionField;
        const values = container.dataset.conditionValue.split('|');
        const control = careerForm.querySelector(`[name="${fieldName}"]:checked`) || careerForm.querySelector(`[name="${fieldName}"]`);
        const parentConditional = container.parentElement.closest('[data-condition-field]');
        const visible = control && values.includes(control.value) && !parentConditional?.hidden;
        container.hidden = !visible;
        container.querySelectorAll('input,select,textarea').forEach(field => {
          field.disabled = !visible;
          field.required = visible && field.hasAttribute('data-required-when-visible');
          if (!visible) field.setCustomValidity('');
        });
      });

      careerForm.querySelectorAll('.eligibility-message').forEach(message => { message.hidden = true; });
      const blockedControl = careerForm.querySelector('[data-block-message]:checked') ||
        careerForm.querySelector('select option[data-block-message]:checked')?.parentElement;
      if (blockedControl) {
        const messageId = blockedControl.dataset.blockMessage || blockedControl.selectedOptions?.[0]?.dataset.blockMessage;
        const message = messageId && document.querySelector(`#${messageId}`);
        if (message) message.hidden = false;
      }
    };

    const validateCheckboxGroups = step => {
      let valid = true;
      step.querySelectorAll('[data-checkbox-group]').forEach(group => {
        const checkboxes = [...group.querySelectorAll('input[type="checkbox"]')];
        const hasSelection = checkboxes.some(input => input.checked);
        group.classList.toggle('is-invalid', !hasSelection);
        checkboxes[0]?.setCustomValidity(hasSelection ? '' : 'Selecciona al menos una opción.');
        if (!hasSelection) {
          group.scrollIntoView({ behavior: 'smooth', block: 'center' });
          valid = false;
        }
      });
      return valid;
    };

    const isBlocked = step => {
      const blockedRadio = step.querySelector('[data-block-message]:checked');
      const blockedSelect = [...step.querySelectorAll('select')].find(select => select.selectedOptions[0]?.dataset.blockMessage);
      return Boolean(blockedRadio || blockedSelect);
    };

    const showStep = (index, shouldScroll = true) => {
      activeStep = index;
      steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
      progress.forEach((item, i) => item.classList.toggle('is-active', i <= index));
      const percent = Math.round(((index + 1) / steps.length) * 100);
      if (stepLabel) stepLabel.textContent = `Paso ${index + 1} de ${steps.length}`;
      if (stepTitle) stepTitle.textContent = steps[index].dataset.title || '';
      if (progressText) progressText.textContent = `${percent}%`;
      if (shouldScroll) careerForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    careerForm.addEventListener('change', event => {
      updateConditionalFields();
      const group = event.target.closest('[data-checkbox-group]');
      if (group) {
        const checkboxes = [...group.querySelectorAll('input[type="checkbox"]')];
        const noneOption = checkboxes.find(input => input.value === 'Ninguna de las anteriores');
        if (event.target === noneOption && noneOption.checked) {
          checkboxes.filter(input => input !== noneOption).forEach(input => { input.checked = false; });
        } else if (event.target.checked && noneOption) {
          noneOption.checked = false;
        }
        const hasSelection = checkboxes.some(input => input.checked);
        group.classList.toggle('is-invalid', !hasSelection);
        checkboxes[0]?.setCustomValidity(hasSelection ? '' : 'Selecciona al menos una opción.');
      }
    });

    careerForm.querySelectorAll('.form-next').forEach(button => button.addEventListener('click', () => {
      updateConditionalFields();
      const currentStep = steps[activeStep];
      const fields = [...currentStep.querySelectorAll('input,select,textarea')].filter(field => !field.disabled);
      const fieldsValid = fields.every(field => field.reportValidity());
      if (!validateCheckboxGroups(currentStep) || !fieldsValid || isBlocked(currentStep)) return;
      showStep(Math.min(activeStep + 1, steps.length - 1));
    }));
    careerForm.querySelectorAll('.form-prev').forEach(button => button.addEventListener('click', () => showStep(Math.max(activeStep - 1, 0))));
    careerForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!careerForm.reportValidity()) return;
      const data = new FormData(careerForm);
      const professionalExperience = data.getAll('professionalExperience').join(', ') || '-';
      const message = [
        '*Postulación inicial · Magical Dreamers*',
        '',
        '*Datos personales*',
        `Nombre: ${data.get('name') || '-'}`,
        `Edad: ${data.get('age') || '-'}`,
        `Residencia: ${data.get('location') || '-'}`,
        `Email: ${data.get('email') || '-'}`,
        `WhatsApp: ${data.get('phone') || '-'}`,
        `Ocupación actual: ${data.get('occupation') || '-'}`,
        '',
        '*Experiencia viajera*',
        `Conoce Walt Disney World: ${data.get('disneyVisited') || '-'}`,
        `Última visita a WDW: ${data.get('disneyLastVisit') || '-'}`,
        `Cantidad de visitas a WDW: ${data.get('disneyVisits') || '-'}`,
        `Se hospedó en hoteles Disney: ${data.get('disneyHotels') || '-'}`,
        `Hoteles: ${data.get('disneyHotelNames') || '-'}`,
        `Conoce Universal Orlando: ${data.get('universalVisited') || '-'}`,
        `Última visita a Universal: ${data.get('universalLastVisit') || '-'}`,
        `Otros destinos: ${data.get('otherDestinations') || '-'}`,
        '',
        '*Experiencia con agentes*',
        `Utilizó un agente: ${data.get('usedTravelAgent') || '-'}`,
        `Agente: ${data.get('travelAgentName') || '-'}`,
        `Agencia: ${data.get('travelAgency') || '-'}`,
        `Experiencia: ${data.get('travelAgentExperience') || '-'}`,
        '',
        '*Perfil profesional*',
        `Áreas de experiencia: ${professionalExperience}`,
        `Experiencia como agente: ${data.get('travelAgentWork') || '-'}`,
        `Agencia y período: ${data.get('travelAgentWorkDetails') || '-'}`,
        '',
        '*Proyecto*',
        `Objetivo: ${data.get('projectGoal') || '-'}`,
        `Disponibilidad semanal: ${data.get('weeklyHours') || '-'}`,
        `Motivación: ${data.get('motivation') || '-'}`,
        '',
        '*Redes e inglés*',
        `Utiliza Instagram: ${data.get('usesInstagram') || '-'}`,
        `Usuario: ${data.get('instagramUser') || '-'}`,
        `Uso de redes: ${data.get('socialUse') || '-'}`,
        `Nivel de inglés: ${data.get('englishLevel') || '-'}`,
        '',
        '*Origen de la postulación*',
        `Cómo conoció Magical Dreamers: ${data.get('discoverySource') || '-'}`,
        `Agente que recomendó: ${data.get('referringAgent') || '-'}`,
        '',
        'Declaraciones del modelo de trabajo y política de privacidad: aceptadas.'
      ].join('\n');
      const success = careerForm.querySelector('#career-success');
      if (success) success.hidden = false;
      openWhatsApp(message);
    });

    updateConditionalFields();
    showStep(0, false);
  }

  const formZones = [...document.querySelectorAll('#quote-form, #career-form')];
  if (formZones.length) {
    const visibleFormZones = new Set();
    const formZoneObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visibleFormZones.add(entry.target) : visibleFormZones.delete(entry.target));
      document.body.classList.toggle('form-zone-visible', visibleFormZones.size > 0);
    }, { threshold: 0.01 });
    formZones.forEach(form => formZoneObserver.observe(form));
  }

  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Volver arriba');
  backToTop.textContent = '↑';
  document.body.appendChild(backToTop);
  const updateBackToTop = () => backToTop.classList.toggle('is-visible', window.scrollY > 650);
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  updateBackToTop();

  document.querySelectorAll('#year').forEach(year => { year.textContent = new Date().getFullYear(); });
});
