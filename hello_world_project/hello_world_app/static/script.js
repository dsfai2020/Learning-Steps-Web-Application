const walkthroughConfigElement = document.getElementById('walkthrough-config');
const stepExplainer = document.getElementById('step-explainer');
const advanceStepButton = document.getElementById('advance-step-btn');
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
const diagramNodes = Array.from(document.querySelectorAll('[data-diagram-step]'));
const diagramArrows = Array.from(document.querySelectorAll('[data-arrow-step]'));
const sequenceSteps = Array.from(document.querySelectorAll('.sequence-step'));
const initialWalkthrough = walkthroughConfigElement
  ? JSON.parse(walkthroughConfigElement.textContent)
  : { brand: 'Lesson platform', eyebrow: 'Reusable lesson', mode_label: 'Lesson', builder_note: '', steps: [] };

const walkthroughState = JSON.parse(JSON.stringify(initialWalkthrough));
const totalSteps = walkthroughState.steps.length;
let currentStep = 0;

function getStepName(stepIndex) {
  return walkthroughState.steps[stepIndex]?.label || `Step ${stepIndex + 1}`;
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

function renderStepLabels() {
  diagramNodes.forEach((element, index) => {
    const number = element.querySelector('.flow-node-number');
    const label = element.querySelector('strong');

    if (number) {
      number.textContent = `${index + 1}`;
    }

    if (label) {
      label.textContent = getStepName(index);
    }

    element.setAttribute('aria-label', `Go to step ${index + 1}: ${getStepName(index)}`);
  });

  sequenceSteps.forEach((element, index) => {
    const number = element.querySelector('.sequence-number');
    const label = element.querySelector('strong');
    const text = element.querySelector('p');
    const step = walkthroughState.steps[index];

    if (number) {
      number.textContent = `${index + 1}`;
    }

    if (label) {
      label.textContent = getStepName(index);
    }

    if (text && step) {
      text.textContent = step.card_text;
    }

    element.setAttribute('aria-label', `Go to step ${index + 1}: ${getStepName(index)}`);
  });
}

function syncBuilderInputs(stepIndex) {
  const step = walkthroughState.steps[stepIndex];
  if (!step) {
    return;
  }

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

function syncDiagram(stepIndex) {
  diagramNodes.forEach((element, index) => {
    element.classList.toggle('is-active', index === stepIndex);
    element.classList.toggle('is-complete', index < stepIndex);
  });

  diagramArrows.forEach((element, index) => {
    element.classList.toggle('is-active', index === stepIndex - 1);
    element.classList.toggle('is-complete', index < stepIndex - 1);
  });
}

function syncActiveStep(stepIndex, options = {}) {
  const { skipBuilderInputs = false } = options;
  currentStep = stepIndex;
  const step = walkthroughState.steps[stepIndex];

  renderStaticLessonFields();
  renderStepLabels();

  sequenceSteps.forEach((element, index) => {
    element.classList.toggle('is-active', index === stepIndex);
  });

  if (diagramStatus) {
    diagramStatus.textContent = `Current step: ${getStepName(stepIndex)}`;
  }

  if (step && heroStepTitle && heroStepSummary && heroStepDetail) {
    heroStepTitle.textContent = getHeroStepTitle(stepIndex);
    heroStepSummary.textContent = step.hero_summary;
    heroStepDetail.textContent = step.hero_detail;
  }

  if (stepExplainer && step) {
    const paragraph = stepExplainer.querySelector('p');
    if (paragraph) {
      paragraph.textContent = step.explainer;
    }
  }

  const badge = document.querySelector('.panel-badge');
  if (badge) {
    badge.textContent = `${walkthroughState.mode_label} · Step ${stepIndex + 1} of ${totalSteps}`;
  }

  if (advanceStepButton) {
    advanceStepButton.textContent = `Next Step: ${getStepName((stepIndex + 1) % totalSteps)}`;
  }

  if (!skipBuilderInputs) {
    syncBuilderInputs(stepIndex);
  }
  syncDiagram(stepIndex);
}

function updateStepExplainer(stepIndex) {
  syncActiveStep(stepIndex);
}

function handleAdvanceStep() {
  const nextStep = (currentStep + 1) % totalSteps;
  updateStepExplainer(nextStep);
}

function handleBuilderInput() {
  const step = walkthroughState.steps[currentStep];
  if (!step) {
    return;
  }

  if (brandInput) {
    walkthroughState.brand = brandInput.value;
  }

  if (eyebrowInput) {
    walkthroughState.eyebrow = eyebrowInput.value;
  }

  if (stepTitleInput) {
    step.label = stepTitleInput.value;
  }

  if (stepCardTextInput) {
    step.card_text = stepCardTextInput.value;
  }

  if (stepSummaryInput) {
    step.hero_summary = stepSummaryInput.value;
  }

  if (stepDetailInput) {
    step.hero_detail = stepDetailInput.value;
  }

  if (stepExplainerInput) {
    step.explainer = stepExplainerInput.value;
  }

  if (!walkthroughState.brand.trim()) {
    walkthroughState.brand = 'Untitled lesson';
  }

  if (!walkthroughState.eyebrow.trim()) {
    walkthroughState.eyebrow = 'Reusable lesson';
  }

  if (!step.label.trim()) {
    step.label = `Step ${currentStep + 1}`;
  }

  if (!step.card_text.trim()) {
    step.card_text = 'Add a short sequence description for this step.';
  }

  if (!step.hero_summary.trim()) {
    step.hero_summary = 'Add a short summary for this step.';
  }

  if (!step.hero_detail.trim()) {
    step.hero_detail = 'Add a more detailed explanation for this step.';
  }

  if (!step.explainer.trim()) {
    step.explainer = 'Add the supporting explainer text for this step.';
  }

  syncActiveStep(currentStep, { skipBuilderInputs: true });
}

function jumpToStep(stepIndex) {
  updateStepExplainer(stepIndex);
}

function handleStepKeydown(event) {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }

  event.preventDefault();
  const stepIndex = Number.parseInt(event.currentTarget.dataset.step ?? event.currentTarget.dataset.diagramStep, 10);
  if (Number.isNaN(stepIndex)) {
    return;
  }

  jumpToStep(stepIndex);
}

function handleStepClick(event) {
  const stepIndex = Number.parseInt(event.currentTarget.dataset.step ?? event.currentTarget.dataset.diagramStep, 10);
  if (Number.isNaN(stepIndex)) {
    return;
  }

  jumpToStep(stepIndex);
}

function initializeWalkthrough() {
  if (advanceStepButton) {
    advanceStepButton.addEventListener('click', handleAdvanceStep);
  }

  [brandInput, eyebrowInput, stepTitleInput, stepCardTextInput, stepSummaryInput, stepDetailInput, stepExplainerInput]
    .filter(Boolean)
    .forEach((element) => {
      element.addEventListener('input', handleBuilderInput);
    });

  sequenceSteps.forEach((element) => {
    element.addEventListener('click', handleStepClick);
    element.addEventListener('keydown', handleStepKeydown);
  });

  diagramNodes.forEach((element) => {
    element.addEventListener('click', handleStepClick);
    element.addEventListener('keydown', handleStepKeydown);
  });

  renderStaticLessonFields();
  syncActiveStep(0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWalkthrough, { once: true });
} else {
  initializeWalkthrough();
}
