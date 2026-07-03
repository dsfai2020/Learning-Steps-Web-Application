const walkthroughConfigElement = document.getElementById('walkthrough-config');
const stepExplainer = document.getElementById('step-explainer');
const advanceStepButton = document.getElementById('advance-step-btn');
const addStepButton = document.getElementById('add-step-btn');
const removeStepButton = document.getElementById('remove-step-btn');
const buildQuizButton = document.getElementById('build-quiz-btn');
const quizBoard = document.getElementById('quiz-board');
const quizSelectAllCheckbox = document.getElementById('quiz-select-all');
const quizFieldCheckboxes = Array.from(document.querySelectorAll('.quiz-field-checkbox'));
const quizModeRadios = Array.from(document.querySelectorAll('.quiz-mode-radio'));

const diagramStatus = document.getElementById('diagram-status');
const brandTitle = document.getElementById('brand-title');
const lessonEyebrow = document.getElementById('lesson-eyebrow');
const heroStepTitle = document.getElementById('hero-step-title');
const heroStepSummary = document.getElementById('hero-step-summary');
const heroStepDetail = document.getElementById('hero-step-detail');
const modeBadge = document.getElementById('mode-badge');
const builderNoteCopy = document.getElementById('builder-note-copy');

const brandInput = document.getElementById('brand-input');
const eyebrowInput = document.getElementById('eyebrow-input');
const stepTitleInput = document.getElementById('step-title-input');
const stepCardTextInput = document.getElementById('step-card-text-input');
const stepSummaryInput = document.getElementById('step-summary-input');
const stepDetailInput = document.getElementById('step-detail-input');
const stepExplainerInput = document.getElementById('step-explainer-input');

const diagramContainer = document.getElementById('rag-diagram');
const sequenceContainer = document.getElementById('sequence-strip');

const initialWalkthrough = walkthroughConfigElement
  ? JSON.parse(walkthroughConfigElement.textContent)
  : { brand: 'Lesson platform', eyebrow: 'Reusable lesson', mode_label: 'Lesson', builder_note: '', steps: [] };

const walkthroughState = JSON.parse(JSON.stringify(initialWalkthrough));
let currentStep = 0;
let quizBuilt = false;
let quizMode = 'cards';

const quizFieldLabels = {
  card_text: 'Sequence Card Copy',
  hero_summary: 'Top Summary',
  hero_detail: 'Detailed Explanation',
  explainer: 'Step Explainer Text',
};

const pageRevealTargets = {
  card_text: '.sequence-step p',
  hero_summary: '#hero-step-summary',
  hero_detail: '#hero-step-detail',
  explainer: '#step-explainer p',
};

function totalSteps() {
  return walkthroughState.steps.length;
}

function createDefaultStep(stepIndex) {
  return {
    label: `Step ${stepIndex + 1}`,
    card_text: 'Add a short sequence description for this step.',
    hero_summary: 'Add a short summary for this step.',
    hero_detail: 'Add a more detailed explanation for this step.',
    explainer: 'Add the supporting explainer text for this step.',
  };
}

function normalizeStep(step, stepIndex) {
  const fallback = createDefaultStep(stepIndex);
  const normalized = { ...fallback, ...step };

  if (!normalized.label.trim()) {
    normalized.label = fallback.label;
  }
  if (!normalized.card_text.trim()) {
    normalized.card_text = fallback.card_text;
  }
  if (!normalized.hero_summary.trim()) {
    normalized.hero_summary = fallback.hero_summary;
  }
  if (!normalized.hero_detail.trim()) {
    normalized.hero_detail = fallback.hero_detail;
  }
  if (!normalized.explainer.trim()) {
    normalized.explainer = fallback.explainer;
  }

  return normalized;
}

function getStep(stepIndex) {
  if (!walkthroughState.steps[stepIndex]) {
    walkthroughState.steps[stepIndex] = createDefaultStep(stepIndex);
  }
  walkthroughState.steps[stepIndex] = normalizeStep(walkthroughState.steps[stepIndex], stepIndex);
  return walkthroughState.steps[stepIndex];
}

function getStepName(stepIndex) {
  return getStep(stepIndex).label;
}

function getHeroStepTitle(stepIndex) {
  return `Step ${stepIndex + 1}: ${getStepName(stepIndex)}`;
}

function renderStaticLessonFields() {
  if (brandTitle) {
    brandTitle.textContent = walkthroughState.brand;
  }

  if (lessonEyebrow) {
    lessonEyebrow.textContent = walkthroughState.eyebrow;
  }

  if (modeBadge) {
    modeBadge.textContent = walkthroughState.mode_label;
  }

  if (builderNoteCopy) {
    builderNoteCopy.textContent = walkthroughState.builder_note;
  }

  document.title = walkthroughState.brand;
}

function renderFlowDiagram(stepIndex) {
  if (!diagramContainer) {
    return;
  }

  const html = walkthroughState.steps.map((step, index) => {
    const node = `
      <div class="flow-node${index === stepIndex ? ' is-active' : ''}${index < stepIndex ? ' is-complete' : ''}" data-diagram-step="${index}" role="button" tabindex="0" aria-label="Go to step ${index + 1}: ${step.label}">
        <span class="flow-node-number">${index + 1}</span>
        <strong>${step.label}</strong>
      </div>
    `;

    if (index === walkthroughState.steps.length - 1) {
      return node;
    }

    const arrowClass = index === stepIndex - 1 ? ' is-active' : index < stepIndex - 1 ? ' is-complete' : '';
    return `${node}<span class="flow-arrow${arrowClass}" data-arrow-step="${index}" aria-hidden="true"></span>`;
  }).join('');

  diagramContainer.innerHTML = html;
}

function renderSequenceStrip(stepIndex) {
  if (!sequenceContainer) {
    return;
  }

  const html = walkthroughState.steps.map((step, index) => `
    <div class="sequence-step${index === stepIndex ? ' is-active' : ''}" data-step="${index}" role="button" tabindex="0" aria-label="Go to step ${index + 1}: ${step.label}">
      <span class="sequence-number">${index + 1}</span>
      <div>
        <strong>${step.label}</strong>
        <p>${step.card_text}</p>
      </div>
    </div>
  `).join('');

  sequenceContainer.innerHTML = html;
}

function syncBuilderInputs(stepIndex) {
  const step = getStep(stepIndex);

  if (brandInput) {
    brandInput.value = walkthroughState.brand;
  }

  if (eyebrowInput) {
    eyebrowInput.value = walkthroughState.eyebrow;
  }

  if (stepTitleInput) {
    stepTitleInput.value = step.label;
  }

  if (stepCardTextInput) {
    stepCardTextInput.value = step.card_text;
  }

  if (stepSummaryInput) {
    stepSummaryInput.value = step.hero_summary;
  }

  if (stepDetailInput) {
    stepDetailInput.value = step.hero_detail;
  }

  if (stepExplainerInput) {
    stepExplainerInput.value = step.explainer;
  }
}

function getSelectedQuizFields() {
  return quizFieldCheckboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.dataset.field)
    .filter(Boolean);
}

function clearPageRevealMode() {
  const revealed = document.querySelectorAll('[data-page-quiz-field]');
  revealed.forEach((element) => {
    element.classList.remove('quiz-mask', 'quiz-revealed');
    element.removeAttribute('role');
    element.removeAttribute('tabindex');
    element.removeAttribute('aria-label');
    delete element.dataset.pageQuizField;
    delete element.dataset.pageQuizStep;
  });
}

function applyPageRevealMode() {
  clearPageRevealMode();
  const selectedFields = getSelectedQuizFields();
  if (!selectedFields.length) {
    return;
  }

  selectedFields.forEach((fieldKey) => {
    const selector = pageRevealTargets[fieldKey];
    if (!selector) {
      return;
    }

    const elements = Array.from(document.querySelectorAll(selector));
    if (fieldKey === 'card_text') {
      elements.forEach((element, index) => {
        element.classList.add('quiz-mask');
        element.dataset.pageQuizField = fieldKey;
        element.dataset.pageQuizStep = `${index}`;
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        element.setAttribute('aria-label', `Reveal step ${index + 1} ${quizFieldLabels[fieldKey]}`);
      });
      return;
    }

    elements.forEach((element) => {
      element.classList.add('quiz-mask');
      element.dataset.pageQuizField = fieldKey;
      element.dataset.pageQuizStep = `${currentStep}`;
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
      element.setAttribute('aria-label', `Reveal ${quizFieldLabels[fieldKey]}`);
    });
  });
}

function syncQuizSelectAllState() {
  if (!quizSelectAllCheckbox) {
    return;
  }

  const checkedCount = quizFieldCheckboxes.filter((checkbox) => checkbox.checked).length;
  quizSelectAllCheckbox.checked = checkedCount === quizFieldCheckboxes.length;
  quizSelectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < quizFieldCheckboxes.length;
}

function renderQuizBoard() {
  if (!quizBoard) {
    return;
  }

  if (quizMode === 'page') {
    if (!quizBuilt) {
      clearPageRevealMode();
      quizBoard.innerHTML = '<p class="quiz-empty">Click Build Quiz to turn the page into reveal mode. Click any masked field to reveal or hide its answer.</p>';
      return;
    }

    applyPageRevealMode();
    quizBoard.innerHTML = '<p class="quiz-empty">Page reveal mode is active. Click masked fields on the page to reveal and hide answers.</p>';
    return;
  }

  clearPageRevealMode();

  const selectedFields = getSelectedQuizFields();
  if (!quizBuilt) {
    quizBoard.innerHTML = '<p class="quiz-empty">Choose fields and click Build Quiz to generate interactive reveal cards.</p>';
    return;
  }

  if (!selectedFields.length) {
    quizBoard.innerHTML = '<p class="quiz-empty">Select at least one field to build the quiz.</p>';
    return;
  }

  const cards = [];
  walkthroughState.steps.forEach((step, stepIndex) => {
    selectedFields.forEach((fieldKey) => {
      const answer = step[fieldKey];
      if (!answer) {
        return;
      }

      cards.push(`
        <button class="quiz-card" type="button" data-step="${stepIndex}" data-field="${fieldKey}" aria-expanded="false">
          <span class="quiz-card-meta">Step ${stepIndex + 1} • ${step.label}</span>
          <span class="quiz-card-prompt">${quizFieldLabels[fieldKey]}</span>
          <span class="quiz-card-answer" hidden>${answer}</span>
          <span class="quiz-card-hint">Click to reveal answer</span>
        </button>
      `);
    });
  });

  if (!cards.length) {
    quizBoard.innerHTML = '<p class="quiz-empty">No content available for the selected fields yet.</p>';
    return;
  }

  quizBoard.innerHTML = `<div class="quiz-grid">${cards.join('')}</div>`;
}

function syncActiveStep(stepIndex, options = {}) {
  const { skipBuilderInputs = false } = options;
  const maxIndex = Math.max(totalSteps() - 1, 0);
  currentStep = Math.min(Math.max(stepIndex, 0), maxIndex);
  const step = getStep(currentStep);

  renderStaticLessonFields();
  renderFlowDiagram(currentStep);
  renderSequenceStrip(currentStep);

  if (diagramStatus) {
    diagramStatus.textContent = `Current step: ${step.label}`;
  }

  if (heroStepTitle && heroStepSummary && heroStepDetail) {
    heroStepTitle.textContent = getHeroStepTitle(currentStep);
    heroStepSummary.textContent = step.hero_summary;
    heroStepDetail.textContent = step.hero_detail;
  }

  if (stepExplainer) {
    const paragraph = stepExplainer.querySelector('p');
    if (paragraph) {
      paragraph.textContent = step.explainer;
    }
  }

  if (modeBadge) {
    modeBadge.textContent = `${walkthroughState.mode_label} · Step ${currentStep + 1} of ${totalSteps()}`;
  }

  if (advanceStepButton) {
    const nextStepIndex = (currentStep + 1) % totalSteps();
    advanceStepButton.textContent = `Next Step: ${getStepName(nextStepIndex)}`;
  }

  if (removeStepButton) {
    removeStepButton.disabled = totalSteps() <= 1;
  }

  if (!skipBuilderInputs) {
    syncBuilderInputs(currentStep);
  }

  if (quizBuilt) {
    renderQuizBoard();
  }
}

function handleAdvanceStep() {
  const nextStep = (currentStep + 1) % totalSteps();
  syncActiveStep(nextStep);
}

function handleBuilderInput() {
  const step = getStep(currentStep);

  if (brandInput) {
    walkthroughState.brand = brandInput.value.trim() ? brandInput.value : 'Untitled lesson';
  }

  if (eyebrowInput) {
    walkthroughState.eyebrow = eyebrowInput.value.trim() ? eyebrowInput.value : 'Reusable lesson';
  }

  if (stepTitleInput) {
    step.label = stepTitleInput.value.trim() ? stepTitleInput.value : `Step ${currentStep + 1}`;
  }

  if (stepCardTextInput) {
    step.card_text = stepCardTextInput.value.trim() ? stepCardTextInput.value : 'Add a short sequence description for this step.';
  }

  if (stepSummaryInput) {
    step.hero_summary = stepSummaryInput.value.trim() ? stepSummaryInput.value : 'Add a short summary for this step.';
  }

  if (stepDetailInput) {
    step.hero_detail = stepDetailInput.value.trim() ? stepDetailInput.value : 'Add a more detailed explanation for this step.';
  }

  if (stepExplainerInput) {
    step.explainer = stepExplainerInput.value.trim() ? stepExplainerInput.value : 'Add the supporting explainer text for this step.';
  }

  syncActiveStep(currentStep, { skipBuilderInputs: true });
}

function jumpToStep(stepIndex) {
  syncActiveStep(stepIndex);
}

function extractStepIndexFromElement(element) {
  if (!element) {
    return Number.NaN;
  }

  const value = element.dataset.step ?? element.dataset.diagramStep;
  return Number.parseInt(value, 10);
}

function handleStepKeydown(event) {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }

  const target = event.target.closest('[data-step], [data-diagram-step]');
  if (!target) {
    return;
  }

  event.preventDefault();
  const stepIndex = extractStepIndexFromElement(target);
  if (!Number.isNaN(stepIndex)) {
    jumpToStep(stepIndex);
  }
}

function handleStepClick(event) {
  const target = event.target.closest('[data-step], [data-diagram-step]');
  if (!target) {
    return;
  }

  const stepIndex = extractStepIndexFromElement(target);
  if (!Number.isNaN(stepIndex)) {
    jumpToStep(stepIndex);
  }
}

function handleAddStep() {
  walkthroughState.steps.push(createDefaultStep(totalSteps()));
  syncActiveStep(totalSteps() - 1);
}

function handleRemoveStep() {
  if (totalSteps() <= 1) {
    return;
  }

  walkthroughState.steps.splice(currentStep, 1);
  const nextIndex = Math.min(currentStep, totalSteps() - 1);
  syncActiveStep(nextIndex);
}

function handleQuizSelectAllChange() {
  const checked = quizSelectAllCheckbox?.checked ?? false;
  quizFieldCheckboxes.forEach((checkbox) => {
    checkbox.checked = checked;
  });
  syncQuizSelectAllState();
  if (quizBuilt) {
    renderQuizBoard();
  }
}

function handleQuizFieldChange() {
  syncQuizSelectAllState();
  if (quizBuilt) {
    renderQuizBoard();
  }
}

function handleQuizModeChange(event) {
  quizMode = event.target.value;
  quizBuilt = false;
  clearPageRevealMode();
  renderQuizBoard();
}

function handleBuildQuiz() {
  quizBuilt = true;
  renderQuizBoard();
}

function handleQuizCardClick(event) {
  const card = event.target.closest('.quiz-card');
  if (!card) {
    return;
  }

  const answer = card.querySelector('.quiz-card-answer');
  const hint = card.querySelector('.quiz-card-hint');
  const isExpanded = card.getAttribute('aria-expanded') === 'true';

  card.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
  if (answer) {
    answer.hidden = isExpanded;
  }
  if (hint) {
    hint.textContent = isExpanded ? 'Click to reveal answer' : 'Click to hide answer';
  }
}

function handlePageRevealToggle(event) {
  const target = event.target.closest('[data-page-quiz-field]');
  if (!target) {
    return;
  }

  const isRevealed = target.classList.contains('quiz-revealed');
  target.classList.toggle('quiz-revealed', !isRevealed);
}

function handlePageRevealKeydown(event) {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }

  const target = event.target.closest('[data-page-quiz-field]');
  if (!target) {
    return;
  }

  event.preventDefault();
  const isRevealed = target.classList.contains('quiz-revealed');
  target.classList.toggle('quiz-revealed', !isRevealed);
}

function initializeWalkthrough() {
  if (!walkthroughState.steps.length) {
    walkthroughState.steps.push(createDefaultStep(0));
  }

  if (advanceStepButton) {
    advanceStepButton.addEventListener('click', handleAdvanceStep);
  }

  if (addStepButton) {
    addStepButton.addEventListener('click', handleAddStep);
  }

  if (removeStepButton) {
    removeStepButton.addEventListener('click', handleRemoveStep);
  }

  [brandInput, eyebrowInput, stepTitleInput, stepCardTextInput, stepSummaryInput, stepDetailInput, stepExplainerInput]
    .filter(Boolean)
    .forEach((element) => {
      element.addEventListener('input', handleBuilderInput);
    });

  if (sequenceContainer) {
    sequenceContainer.addEventListener('click', handleStepClick);
    sequenceContainer.addEventListener('keydown', handleStepKeydown);
  }

  if (diagramContainer) {
    diagramContainer.addEventListener('click', handleStepClick);
    diagramContainer.addEventListener('keydown', handleStepKeydown);
  }

  if (quizSelectAllCheckbox) {
    quizSelectAllCheckbox.addEventListener('change', handleQuizSelectAllChange);
  }

  quizFieldCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', handleQuizFieldChange);
  });

  quizModeRadios.forEach((radio) => {
    radio.addEventListener('change', handleQuizModeChange);
  });

  if (buildQuizButton) {
    buildQuizButton.addEventListener('click', handleBuildQuiz);
  }

  if (quizBoard) {
    quizBoard.addEventListener('click', handleQuizCardClick);
  }

  document.addEventListener('click', handlePageRevealToggle);
  document.addEventListener('keydown', handlePageRevealKeydown);

  syncQuizSelectAllState();
  renderQuizBoard();
  syncActiveStep(0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWalkthrough, { once: true });
} else {
  initializeWalkthrough();
}
