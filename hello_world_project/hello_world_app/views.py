# myapp/views.py
from copy import deepcopy

from django.http import JsonResponse
from django.shortcuts import render


DEFAULT_WALKTHROUGH = {
    'page_title': 'How to integrate custom tools and intention into an LLM',
    'brand': 'How to integrate custom tools and intention into an LLM',
    'eyebrow': 'Reusable lesson platform',
    'diagram_title': 'Subject walkthrough',
    'mode_label': 'Example lesson',
    'builder_title': 'Lesson Studio',
    'builder_note': 'Use this page as an explanation platform. Select a step, then edit its title and descriptive text to adapt the lesson to any subject.',
    'steps': [
        {
            'label': 'Clarify Intention',
            'card_text': 'Define the user goal, the desired outcome, and the constraints the model should respect.',
            'hero_summary': 'A useful LLM workflow starts by making intention explicit. Before any tool is called, the system needs a clear objective and a framed problem to solve.',
            'hero_detail': 'This step turns vague input into an actionable direction. It is where you decide what the model should optimize for, what success looks like, and what kinds of answers are acceptable.',
            'explainer': 'The workflow begins by establishing intent. Strong intention-setting gives the model and any downstream tools a clear job to perform.',
        },
        {
            'label': 'Choose Custom Tools',
            'card_text': 'Identify which external tools, APIs, or functions can provide the missing capabilities the model does not have on its own.',
            'hero_summary': 'Once the task is clear, the system can decide whether the LLM should call custom tools for search, retrieval, calculations, workflow actions, or domain-specific logic.',
            'hero_detail': 'Tool selection is what turns a generic language model into an integrated system. Instead of forcing the model to improvise, you expose reliable capabilities that match the job.',
            'explainer': 'This step maps the intention to the available toolset. The model is no longer limited to text generation; it can be connected to concrete capabilities.',
        },
        {
            'label': 'Inject Tool Output',
            'card_text': 'Feed the tool results back into the model as grounded context so the response is based on real outputs instead of guesses.',
            'hero_summary': 'After the tool runs, its output must be packaged into the prompt in a way the LLM can interpret, reference, and reason over.',
            'hero_detail': 'This is where orchestration matters. Clean, structured tool output helps the model stay aligned with the facts returned by external systems and keeps the final answer anchored to evidence.',
            'explainer': 'Tool output becomes part of the model context here. The quality of this handoff strongly affects the accuracy and usefulness of the final answer.',
        },
        {
            'label': 'Generate Final Response',
            'card_text': 'Combine the original intention and the tool-derived context into a final response that is useful, grounded, and well-scoped.',
            'hero_summary': 'The final response is where intention and tooling come together. The LLM explains, summarizes, or acts based on the context produced by the integrated system.',
            'hero_detail': 'At this stage the model should not be improvising from scratch. It should be synthesizing the user goal with the trusted outputs of the connected tools.',
            'explainer': 'This is the payoff step. The integrated workflow produces an answer that reflects both the intended outcome and the capabilities supplied by custom tools.',
        },
    ],
}


BLANK_WALKTHROUGH = {
    'page_title': 'Build your own explainer',
    'brand': 'Build your own explainer',
    'eyebrow': 'Blank lesson mode',
    'diagram_title': 'Your subject walkthrough',
    'mode_label': 'Blank lesson',
    'builder_title': 'Lesson Studio',
    'builder_note': 'This blank version is meant for authoring. Select a step, then replace the placeholders with your own subject, process, and descriptive text.',
    'steps': [
        {
            'label': 'Step One',
            'card_text': 'Name the first phase of the process you want to explain.',
            'hero_summary': 'Write a short summary that introduces what happens in this step and why it matters.',
            'hero_detail': 'Use this area to explain the role of the step in more detail, including important decisions, assumptions, or outputs.',
            'explainer': 'Describe what this step does and how it connects to the rest of the subject.',
        },
        {
            'label': 'Step Two',
            'card_text': 'Describe the second phase in the sequence.',
            'hero_summary': 'Explain what changes here and what the learner should understand next.',
            'hero_detail': 'Add deeper context, examples, or rules that help the learner understand the transition into this stage.',
            'explainer': 'Use this space to clarify how this step moves the process forward.',
        },
        {
            'label': 'Step Three',
            'card_text': 'Outline the third stage of the lesson or workflow.',
            'hero_summary': 'Summarize the main action, transformation, or decision that occurs in this step.',
            'hero_detail': 'This is a good place to explain how information, work, or decisions are combined before the next stage.',
            'explainer': 'Add the instructional text you want learners to see for this stage.',
        },
        {
            'label': 'Step Four',
            'card_text': 'Use the final step to explain the outcome or completed state.',
            'hero_summary': 'Describe what the learner should expect at the end of the sequence.',
            'hero_detail': 'Wrap up the explanation with the result, the final synthesis, or the lesson takeaway.',
            'explainer': 'Explain how the sequence concludes and what the final result represents.',
        },
    ],
}


def get_walkthrough(blank_mode=False):
    source = BLANK_WALKTHROUGH if blank_mode else DEFAULT_WALKTHROUGH
    return deepcopy(source)

def index(request):
    blank_mode = request.GET.get('blank') == '1'
    walkthrough = get_walkthrough(blank_mode=blank_mode)
    return render(
        request,
        'index.html',
        context={
            'title': walkthrough['page_title'],
            'walkthrough': walkthrough,
            'walkthrough_config': walkthrough,
        },
    )


def api_index(request):
    data = {
        'title': DEFAULT_WALKTHROUGH['page_title'],
        'message': DEFAULT_WALKTHROUGH['steps'][0]['hero_summary'],
    }
    return JsonResponse(data)
