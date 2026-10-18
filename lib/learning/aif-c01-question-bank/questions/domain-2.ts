import { defineAifQuestion } from "@/lib/learning/aif-c01-question-bank/define"
import type { AifExamQuestion } from "@/lib/learning/aif-c01-question-bank/types"

export const domain2Questions: AifExamQuestion[] = [
  defineAifQuestion({
    id: "aif-d2-001",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.1",
    topic: "tokens",
    difficulty: "easy",
    stem: "In generative AI, what is a token?",
    options: [
      {
        id: "A",
        text: "A model-specific unit produced by a tokenizer that the model processes as input or output",
        explanation:
          "Correct. Models consume and produce token IDs from a tokenizer vocabulary, not raw human word counts.",
      },
      {
        id: "B",
        text: "Exactly one English word in every language",
        explanation:
          "Incorrect. Token boundaries vary by model and language; one word can map to several tokens or share a token.",
      },
      {
        id: "C",
        text: "An AWS access key used to call foundation models",
        explanation:
          "Incorrect. Access credentials authorize API calls; they are unrelated to how text is segmented for inference.",
      },
      {
        id: "D",
        text: "A permanent database row that stores every past prompt",
        explanation:
          "Incorrect. Tokens are units of model computation within a request, not durable storage records.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-002",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.1",
    topic: "tokens",
    difficulty: "medium",
    stem: "A prompt includes system instructions, chat history, retrieved documents, and space for the model reply. Why must the application reserve capacity for the reply?",
    options: [
      {
        id: "A",
        text: "Input and generated output share one finite context window",
        explanation:
          "Correct. Everything in the request plus tokens the model generates must fit within the model's context limit.",
      },
      {
        id: "B",
        text: "TLS encryption doubles the token count of every response",
        explanation:
          "Incorrect. Transport security does not change how many tokens the model allocates inside its context window.",
      },
      {
        id: "C",
        text: "Embeddings cannot be created unless the output reserve equals the input size",
        explanation:
          "Incorrect. Embedding and generative context budgets are separate concerns; equal reserves are not required.",
      },
      {
        id: "D",
        text: "IAM denies generation unless output tokens are prepaid as Provisioned Throughput",
        explanation:
          "Incorrect. IAM authorizes API actions; output reservation is a context-budget design choice, not a permission rule.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-003",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.1",
    topic: "embeddings",
    difficulty: "easy",
    stem: "What do text embeddings primarily represent?",
    options: [
      {
        id: "A",
        text: "Dense numeric vectors that place semantically related phrases near each other in vector space",
        explanation:
          "Correct. Embedding models map text into vectors so similar meaning tends to produce similar geometry.",
      },
      {
        id: "B",
        text: "Human-readable labels that name every dimension of meaning",
        explanation:
          "Incorrect. Individual embedding dimensions rarely have simple natural-language labels.",
      },
      {
        id: "C",
        text: "Encrypted ciphertext of the original document",
        explanation:
          "Incorrect. Embeddings are semantic representations, not cryptographic encryption of the source text.",
      },
      {
        id: "D",
        text: "Exact keyword indexes that only match identical strings",
        explanation:
          "Incorrect. Keyword indexes support exact or lexical match; embeddings support semantic similarity.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-004",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.1",
    topic: "embeddings",
    difficulty: "medium",
    stem: "A retrieval pipeline embeds user queries with Model A and document chunks with Model B from a different family. What is the most likely problem?",
    options: [
      {
        id: "A",
        text: "Query and document vectors may not be comparable because embedding spaces are model-specific",
        explanation:
          "Correct. Similarity search assumes a shared embedding space; mixing incompatible models breaks relevance ranking.",
      },
      {
        id: "B",
        text: "Amazon S3 will reject storing vectors from two models in the same bucket",
        explanation:
          "Incorrect. Object storage does not enforce embedding-model compatibility; that is an application design concern.",
      },
      {
        id: "C",
        text: "Tokenizers will automatically convert both models into one shared vocabulary",
        explanation:
          "Incorrect. Tokenizers and embedding spaces stay tied to each model; they do not merge automatically.",
      },
      {
        id: "D",
        text: "Attention weights become negative and cancel retrieval scores",
        explanation:
          "Incorrect. Attention is an internal transformer mechanism; this failure mode is about incompatible vector spaces.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-005",
    format: "multi-response",
    domainId: "genai-fundamentals",
    taskStatement: "2.1",
    topic: "transformers",
    difficulty: "medium",
    stem: "Which statements correctly describe self-attention in transformer models? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "Each token produces query, key, and value representations used to weight relationships among tokens",
        explanation:
          "Correct. Query-key similarity yields attention weights that combine value vectors from other tokens.",
      },
      {
        id: "B",
        text: "Attention alone encodes absolute token order without any positional information",
        explanation:
          "Incorrect. Standard attention is permutation-sensitive only when positional signals are added separately.",
      },
      {
        id: "C",
        text: "Positional information helps the model distinguish sequences that share the same tokens in different order",
        explanation:
          "Correct. Position encodings or similar mechanisms supply order that bag-of-tokens attention would otherwise lose.",
      },
      {
        id: "D",
        text: "Self-attention guarantees that every attended token is factually verified against a knowledge base",
        explanation:
          "Incorrect. Attention is a learned weighting mechanism, not a factuality or citation guarantee.",
      },
      {
        id: "E",
        text: "Attention scores are the same thing as AWS IAM permission boundaries",
        explanation:
          "Incorrect. Attention is an ML mechanism inside the model; IAM governs AWS API authorization.",
      },
    ],
    correctOptionIds: ["A", "C"],
  }),

  defineAifQuestion({
    id: "aif-d2-006",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.1",
    topic: "transformers",
    difficulty: "hard",
    stem: "A team doubles the context window for every request so the model always sees the full document set. Which assessment is most accurate?",
    options: [
      {
        id: "A",
        text: "Longer context raises compute and latency and still does not guarantee the model uses every fact",
        explanation:
          "Correct. Attention cost and latency grow with sequence length, and models can still underuse mid-context details.",
      },
      {
        id: "B",
        text: "Any increase in context length removes the need for retrieval or summarization forever",
        explanation:
          "Incorrect. Retrieval and summarization remain useful when noise, cost, or relevance matter more than raw length.",
      },
      {
        id: "C",
        text: "Transformer attention becomes free once context exceeds one million tokens",
        explanation:
          "Incorrect. Longer sequences typically increase compute; there is no free threshold at one million tokens.",
      },
      {
        id: "D",
        text: "Positional encodings stop working when context is longer than the training prompt average",
        explanation:
          "Incorrect. Models may degrade on extreme lengths, but that is not the primary lesson versus cost and utilization.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-007",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.1",
    topic: "foundation-models",
    difficulty: "easy",
    stem: "What best distinguishes a foundation model from a narrow task-specific model?",
    options: [
      {
        id: "A",
        text: "It is broadly pretrained so it can be adapted to many downstream tasks",
        explanation:
          "Correct. Foundation models learn general representations during large-scale pretraining before task adaptation.",
      },
      {
        id: "B",
        text: "It always returns deterministic, rule-checked answers",
        explanation:
          "Incorrect. Foundation models generate probabilistic outputs and still need application controls.",
      },
      {
        id: "C",
        text: "It can only run on premises and never through a managed API",
        explanation:
          "Incorrect. Foundation models can be hosted privately or invoked through managed services such as Amazon Bedrock.",
      },
      {
        id: "D",
        text: "It stores every enterprise fact permanently after one prompt",
        explanation:
          "Incorrect. A single prompt does not create durable enterprise knowledge inside the base model.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-008",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.1",
    topic: "foundation-models",
    difficulty: "medium",
    stem: "When selecting a foundation model for a production workload, which basis is strongest?",
    options: [
      {
        id: "A",
        text: "Measured quality, latency, cost, context limits, and governance fit on representative tasks",
        explanation:
          "Correct. Model choice is a workload decision backed by evidence, not brand prestige or size alone.",
      },
      {
        id: "B",
        text: "Always pick the largest available parameter count",
        explanation:
          "Incorrect. Larger models can raise cost and latency without improving the measured business outcome.",
      },
      {
        id: "C",
        text: "Prefer whichever model has the most marketing screenshots",
        explanation:
          "Incorrect. Marketing materials are not a substitute for evaluation on your data and constraints.",
      },
      {
        id: "D",
        text: "Assume any foundation model already contains current private company facts",
        explanation:
          "Incorrect. Private and current facts must be supplied through authorized context or retrieval.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-009",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.2",
    topic: "hallucinations",
    difficulty: "medium",
    stem: "What is a hallucination in generative AI?",
    options: [
      {
        id: "A",
        text: "Fluent output that is unsupported by or contradicts the provided evidence or reality",
        explanation:
          "Correct. The model can produce confident text that is not grounded in facts or retrieved sources.",
      },
      {
        id: "B",
        text: "Any response that uses more than one paragraph",
        explanation:
          "Incorrect. Length alone does not define hallucination; unsupported claims do.",
      },
      {
        id: "C",
        text: "A temporary AWS Region outage that blocks model invocation",
        explanation:
          "Incorrect. Service availability issues are infrastructure problems, not generative hallucinations.",
      },
      {
        id: "D",
        text: "Correct retrieval of a cited source document",
        explanation:
          "Incorrect. Successful grounding with accurate citations is the opposite of hallucination.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-010",
    format: "multi-response",
    domainId: "genai-fundamentals",
    taskStatement: "2.2",
    topic: "hallucinations",
    difficulty: "hard",
    stem: "A customer-support assistant must reduce unsupported claims. Which practices help? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "Ground answers in retrieved enterprise sources and require citations when claims depend on those sources",
        explanation:
          "Correct. Retrieval grounding and citations make unsupported generation easier to detect and reject.",
      },
      {
        id: "B",
        text: "Allow the model to invent policy exceptions when retrieval returns no matches",
        explanation:
          "Incorrect. Inventing policy is a high-risk hallucination pattern; abstention or escalation is safer.",
      },
      {
        id: "C",
        text: "Add evaluation and policy controls such as Amazon Bedrock model evaluation and Guardrails where appropriate",
        explanation:
          "Correct. Measuring behaviour and enforcing configured policies complements prompt wording alone.",
      },
      {
        id: "D",
        text: "Disable logging so incorrect answers cannot be audited",
        explanation:
          "Incorrect. Removing observability hides failures and blocks responsible improvement.",
      },
      {
        id: "E",
        text: "Assume doubling temperature always eliminates factual errors",
        explanation:
          "Incorrect. Higher temperature usually increases randomness; it is not a factuality control.",
      },
    ],
    correctOptionIds: ["A", "C"],
  }),

  defineAifQuestion({
    id: "aif-d2-011",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.1",
    topic: "diffusion-models",
    difficulty: "easy",
    stem: "How do diffusion models typically generate images?",
    options: [
      {
        id: "A",
        text: "They iteratively denoise from a noisy starting point toward a sample matching the conditioning signal",
        explanation:
          "Correct. Diffusion generators reverse a noise process step by step, often guided by text or other conditions.",
      },
      {
        id: "B",
        text: "They look up the nearest exact stock photo by MD5 hash of the prompt",
        explanation:
          "Incorrect. Diffusion synthesizes new samples; it is not a deterministic file-hash lookup of existing assets.",
      },
      {
        id: "C",
        text: "They run only classical decision trees over pixel histograms",
        explanation:
          "Incorrect. Decision trees are a different ML family and do not describe diffusion image generation.",
      },
      {
        id: "D",
        text: "They require the user to hand-paint every pixel before inference starts",
        explanation:
          "Incorrect. Users provide conditioning such as text; the model synthesizes the image.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-012",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.1",
    topic: "diffusion-models",
    difficulty: "medium",
    stem: "A product team wants text-to-image generation for marketing drafts and already uses Amazon Bedrock for language models. What is the most accurate GenAI concept statement?",
    options: [
      {
        id: "A",
        text: "Image generation often uses diffusion-style foundation models that are distinct from next-token language models",
        explanation:
          "Correct. Text-to-image systems commonly rely on diffusion (or similar) generative processes rather than autoregressive token prediction alone.",
      },
      {
        id: "B",
        text: "Every language model can emit lossless PNG files by printing Base64 without a vision-capable generative path",
        explanation:
          "Incorrect. Reliable image generation needs an image-capable model or pipeline, not Base64 printing from a text-only LLM.",
      },
      {
        id: "C",
        text: "Diffusion models only classify images and never create new ones",
        explanation:
          "Incorrect. Generative diffusion models are used to create new samples, not merely classify inputs.",
      },
      {
        id: "D",
        text: "Image foundation models never accept text prompts as conditioning",
        explanation:
          "Incorrect. Text conditioning is a common control signal for modern text-to-image models.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-013",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.1",
    topic: "multimodal",
    difficulty: "medium",
    stem: "What does multimodal generative AI mean in practice?",
    options: [
      {
        id: "A",
        text: "The system can understand or generate across more than one modality, such as text, images, or audio",
        explanation:
          "Correct. Multimodal models jointly handle multiple input or output types rather than text alone.",
      },
      {
        id: "B",
        text: "The system must run in at least three AWS Regions at once",
        explanation:
          "Incorrect. Multimodality refers to data types, not multi-Region infrastructure.",
      },
      {
        id: "C",
        text: "The system can only answer multiple-choice exam questions",
        explanation:
          "Incorrect. Exam formats are unrelated to multimodal model capabilities.",
      },
      {
        id: "D",
        text: "The system refuses any prompt that mixes numbers and letters",
        explanation:
          "Incorrect. Mixing characters in text is normal; multimodal refers to distinct media types.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-014",
    format: "multi-response",
    domainId: "genai-fundamentals",
    taskStatement: "2.2",
    topic: "multimodal",
    difficulty: "medium",
    stem: "A retailer wants an assistant that answers questions about product photos and policy PDFs. Which statements are true? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "A multimodal model can help when the question depends on visual content in the product photo",
        explanation:
          "Correct. Vision-language capability is useful when answers depend on image understanding.",
      },
      {
        id: "B",
        text: "Text-only embedding of filenames is always enough to describe what appears inside every photo",
        explanation:
          "Incorrect. Filenames rarely capture visual detail; image understanding or image embeddings are needed.",
      },
      {
        id: "C",
        text: "Business limits still apply: visual answers can be wrong, biased, or expose sensitive image content without controls",
        explanation:
          "Correct. Multimodal GenAI inherits hallucination, privacy, and governance risks that must be managed.",
      },
      {
        id: "D",
        text: "Multimodal models automatically grant IAM admin access to every object in Amazon S3",
        explanation:
          "Incorrect. Model modality does not change AWS authorization; IAM still controls object access.",
      },
      {
        id: "E",
        text: "PDFs never need chunking or retrieval once any multimodal model is selected",
        explanation:
          "Incorrect. Long documents still require context budgeting, chunking, or retrieval design.",
      },
    ],
    correctOptionIds: ["A", "C"],
  }),

  defineAifQuestion({
    id: "aif-d2-015",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.2",
    topic: "token-pricing",
    difficulty: "easy",
    stem: "How are many foundation-model APIs, including Amazon Bedrock on-demand usage, commonly priced?",
    options: [
      {
        id: "A",
        text: "By tokens processed for input and output, often at different rates per model",
        explanation:
          "Correct. Usage metering typically counts input and output tokens, and prices vary by model and modality.",
      },
      {
        id: "B",
        text: "By the number of IAM users in the AWS account only",
        explanation:
          "Incorrect. IAM user count is not the unit of generative inference billing.",
      },
      {
        id: "C",
        text: "By the number of CSS pixels rendered in the front-end UI",
        explanation:
          "Incorrect. UI rendering is unrelated to model token metering.",
      },
      {
        id: "D",
        text: "By a flat fee that never changes when prompt length grows",
        explanation:
          "Incorrect. Longer prompts and completions usually increase billed token usage for on-demand calls.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-016",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.2",
    topic: "token-pricing",
    difficulty: "medium",
    stem: "A chatbot appends the entire knowledge base to every user turn. What is the most direct cost and performance impact?",
    options: [
      {
        id: "A",
        text: "Input token usage, latency, and spend rise because each request carries unnecessary context",
        explanation:
          "Correct. Oversized prompts inflate billed input tokens and slow inference without guaranteeing better answers.",
      },
      {
        id: "B",
        text: "Output token prices fall to zero because the model caches the knowledge base forever",
        explanation:
          "Incorrect. Sending large context repeatedly still incurs input usage; there is no automatic free forever cache.",
      },
      {
        id: "C",
        text: "Amazon CloudFront bills the tokens instead of the model provider",
        explanation:
          "Incorrect. CDN billing is separate; foundation-model usage is metered on the model invocation path.",
      },
      {
        id: "D",
        text: "Token pricing only applies when the response contains JSON",
        explanation:
          "Incorrect. Token metering applies to model input and output regardless of response format.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-017",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.3",
    topic: "amazon-bedrock",
    difficulty: "easy",
    stem: "What is Amazon Bedrock primarily designed to provide?",
    options: [
      {
        id: "A",
        text: "Managed API access to foundation models from Amazon and third-party providers without managing base-model servers",
        explanation:
          "Correct. Bedrock exposes supported foundation models through AWS APIs so teams skip owning base-model infrastructure.",
      },
      {
        id: "B",
        text: "A replacement for IAM that removes the need for authentication",
        explanation:
          "Incorrect. Bedrock invocations still use AWS identity and access controls.",
      },
      {
        id: "C",
        text: "A physical GPU shipment service for customer data centers only",
        explanation:
          "Incorrect. Bedrock is a managed cloud API service, not a hardware logistics product.",
      },
      {
        id: "D",
        text: "A spreadsheet tool that cannot call generative models",
        explanation:
          "Incorrect. Bedrock's purpose is foundation-model access and related generative AI capabilities.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-018",
    format: "multi-response",
    domainId: "genai-fundamentals",
    taskStatement: "2.3",
    topic: "amazon-bedrock",
    difficulty: "medium",
    stem: "Which Amazon Bedrock capabilities help teams build governed GenAI applications? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "Knowledge Bases for Amazon Bedrock to connect enterprise sources for retrieval-augmented generation",
        explanation:
          "Correct. Knowledge Bases help orchestrate ingestion, embeddings, storage, and retrieval for grounded answers.",
      },
      {
        id: "B",
        text: "Guardrails for Amazon Bedrock to apply configured content and sensitive-data policies around model interactions",
        explanation:
          "Correct. Guardrails add policy controls that complement prompts and application authorization.",
      },
      {
        id: "C",
        text: "Automatic deletion of all CloudTrail logs that mention Bedrock API calls",
        explanation:
          "Incorrect. Governance needs auditability; deleting trails works against secure operations.",
      },
      {
        id: "D",
        text: "A setting that makes every model response legally binding without human review",
        explanation:
          "Incorrect. No Bedrock switch converts probabilistic outputs into unchecked legal commitments.",
      },
      {
        id: "E",
        text: "Replacing VPC networking with public anonymous access for all models",
        explanation:
          "Incorrect. Secure designs retain identity, network, and data controls rather than anonymous public access.",
      },
    ],
    correctOptionIds: ["A", "B"],
  }),

  defineAifQuestion({
    id: "aif-d2-019",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.3",
    topic: "amazon-bedrock",
    difficulty: "hard",
    stem: "An architecture needs managed foundation-model inference today and may later customize supported models. Which AWS approach fits Domain 2 infrastructure choices?",
    options: [
      {
        id: "A",
        text: "Start with Amazon Bedrock for managed model access, and use Bedrock customization options or SageMaker AI when deeper training control is required",
        explanation:
          "Correct. Bedrock covers managed FM access and supported customization; SageMaker AI covers fuller custom ML lifecycle ownership.",
      },
      {
        id: "B",
        text: "Use Amazon Athena alone because SQL engines are foundation models",
        explanation:
          "Incorrect. Athena is an interactive query service, not a foundation-model hosting platform.",
      },
      {
        id: "C",
        text: "Store prompts in Amazon SQS and assume no model endpoint is ever needed",
        explanation:
          "Incorrect. Queues move messages; generative inference still requires a model invocation path.",
      },
      {
        id: "D",
        text: "Disable all model choice and hard-code a single open-source binary into every Lambda layer forever",
        explanation:
          "Incorrect. Rigid packaging ignores Bedrock's multi-model flexibility and measured model selection.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-020",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.3",
    topic: "sagemaker-jumpstart",
    difficulty: "easy",
    stem: "What is Amazon SageMaker JumpStart primarily used for?",
    options: [
      {
        id: "A",
        text: "Discovering and deploying pretrained models and solutions quickly inside Amazon SageMaker AI",
        explanation:
          "Correct. JumpStart offers pretrained models and solution templates so teams can start faster on SageMaker AI.",
      },
      {
        id: "B",
        text: "Issuing temporary credit cards for third-party SaaS purchases",
        explanation:
          "Incorrect. JumpStart is an ML model and solution hub, not a payments product.",
      },
      {
        id: "C",
        text: "Replacing Amazon VPC with a proprietary networking stack",
        explanation:
          "Incorrect. Networking remains an AWS infrastructure concern separate from JumpStart catalogs.",
      },
      {
        id: "D",
        text: "Compiling Java source code into JVM bytecode",
        explanation:
          "Incorrect. Language compilation is unrelated to SageMaker JumpStart's pretrained model catalog.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-021",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.3",
    topic: "sagemaker-jumpstart",
    difficulty: "medium",
    stem: "A team wants to fine-tune and host an open-weight language model with full control of training jobs and endpoints. Which pairing is most appropriate?",
    options: [
      {
        id: "A",
        text: "Use Amazon SageMaker AI, optionally starting from a JumpStart model, when owning the custom training and hosting lifecycle",
        explanation:
          "Correct. SageMaker AI is the broader custom ML platform; JumpStart accelerates starting from pretrained assets.",
      },
      {
        id: "B",
        text: "Use Amazon Route 53 health checks as the model training cluster",
        explanation:
          "Incorrect. DNS health checks do not train or host foundation models.",
      },
      {
        id: "C",
        text: "Use Amazon SNS topic filters to perform gradient updates",
        explanation:
          "Incorrect. Pub/sub filtering is not a training runtime for neural networks.",
      },
      {
        id: "D",
        text: "Use AWS Budgets alerts as the inference endpoint",
        explanation:
          "Incorrect. Budget alerts monitor spend; they do not serve model predictions.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-022",
    format: "multi-response",
    domainId: "genai-fundamentals",
    taskStatement: "2.3",
    topic: "sagemaker-jumpstart",
    difficulty: "medium",
    stem: "Which statements correctly contrast Amazon Bedrock and Amazon SageMaker JumpStart for GenAI work? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "Bedrock emphasizes managed API access to foundation models without operating base-model servers",
        explanation:
          "Correct. Bedrock's core value is managed FM inference and related application features.",
      },
      {
        id: "B",
        text: "SageMaker JumpStart helps teams find and deploy pretrained models within the SageMaker AI ML lifecycle",
        explanation:
          "Correct. JumpStart sits in SageMaker AI where customers own more of training, hosting, and operations.",
      },
      {
        id: "C",
        text: "JumpStart permanently replaces IAM for all AWS accounts that enable it",
        explanation:
          "Incorrect. Identity and access management remain required regardless of the ML service chosen.",
      },
      {
        id: "D",
        text: "Bedrock cannot be used for any generative language task by design",
        explanation:
          "Incorrect. Language generation is a primary Bedrock use case.",
      },
      {
        id: "E",
        text: "Choosing JumpStart means prompts no longer consume tokens",
        explanation:
          "Incorrect. Hosted generative models still process tokens; the hosting platform does not remove that reality.",
      },
    ],
    correctOptionIds: ["A", "B"],
  }),

  defineAifQuestion({
    id: "aif-d2-023",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.3",
    topic: "amazon-q",
    difficulty: "easy",
    stem: "What is Amazon Q in the AWS generative AI portfolio?",
    options: [
      {
        id: "A",
        text: "A family of generative AI assistants, including Amazon Q Developer and Amazon Q Business, that help with software and enterprise work",
        explanation:
          "Correct. Amazon Q products assist developers and business users with generative AI tailored to those workflows.",
      },
      {
        id: "B",
        text: "A relational database engine that replaces Amazon Aurora",
        explanation:
          "Incorrect. Amazon Q is an assistant portfolio, not a relational database service.",
      },
      {
        id: "C",
        text: "A hardware security module fleet sold only as appliances",
        explanation:
          "Incorrect. HSMs are a different AWS security category; Amazon Q is generative assistance software.",
      },
      {
        id: "D",
        text: "A deprecated name for Amazon Simple Queue Service",
        explanation:
          "Incorrect. Amazon SQS remains the queue service; Amazon Q is a separate GenAI assistant offering.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-024",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.3",
    topic: "amazon-q",
    difficulty: "medium",
    stem: "A company wants employees to ask natural-language questions over internal wikis and ticketing systems with enterprise access controls. Which AWS GenAI product direction fits best?",
    options: [
      {
        id: "A",
        text: "Amazon Q Business connected to authorized company data sources",
        explanation:
          "Correct. Amazon Q Business is aimed at employee assistants over enterprise content with organizational controls.",
      },
      {
        id: "B",
        text: "Amazon Macie alone with no generative assistant interface",
        explanation:
          "Incorrect. Macie helps discover sensitive data; it is not an employee Q&A assistant over wikis.",
      },
      {
        id: "C",
        text: "AWS Snowball Edge devices answering chat without any model",
        explanation:
          "Incorrect. Snowball is a data-transfer appliance family, not an enterprise chat assistant.",
      },
      {
        id: "D",
        text: "Amazon CloudWatch alarms that rewrite wiki pages automatically",
        explanation:
          "Incorrect. CloudWatch monitors metrics and logs; it does not provide enterprise generative Q&A.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-025",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.3",
    topic: "agentic-ai",
    difficulty: "medium",
    stem: "In generative AI, what does an agentic application typically add beyond a single prompt-response call?",
    options: [
      {
        id: "A",
        text: "Planning or tool use so the system can take multi-step actions toward a goal under application controls",
        explanation:
          "Correct. Agents combine model reasoning with tools, memory, and orchestration rather than one-shot completion only.",
      },
      {
        id: "B",
        text: "Removing all authorization checks because the model is trusted",
        explanation:
          "Incorrect. Agentic systems increase the need for scoped permissions, because tools can change real systems.",
      },
      {
        id: "C",
        text: "Guaranteeing that every tool call is free of side effects",
        explanation:
          "Incorrect. Tools often have side effects; designs must constrain and audit them.",
      },
      {
        id: "D",
        text: "Replacing metrics and logs with silent background execution",
        explanation:
          "Incorrect. Multi-step agents need stronger observability, not less.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-026",
    format: "multi-response",
    domainId: "genai-fundamentals",
    taskStatement: "2.3",
    topic: "agentic-ai",
    difficulty: "hard",
    stem: "Which AWS building blocks are relevant when teams implement agentic GenAI applications? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "Amazon Bedrock AgentCore for running and operating agents with managed runtime, memory, identity, and observability capabilities",
        explanation:
          "Correct. Bedrock AgentCore provides infrastructure services that help deploy and operate agents at scale on AWS.",
      },
      {
        id: "B",
        text: "Strands Agents as an SDK approach for building and orchestrating model-driven agents that call tools",
        explanation:
          "Correct. Strands Agents is an AWS-oriented open SDK pattern for composing agent workflows and tool use.",
      },
      {
        id: "C",
        text: "Amazon Polly lexicons as the only required control plane for tool authorization",
        explanation:
          "Incorrect. Polly is a text-to-speech service; tool authorization still depends on identity and application policy.",
      },
      {
        id: "D",
        text: "AWS Glue crawlers that automatically approve production spend without human gates",
        explanation:
          "Incorrect. Crawlers discover data catalogs; they do not replace agent spend or change-management controls.",
      },
      {
        id: "E",
        text: "Amazon EMR bootstrap actions that disable CloudWatch for agent workloads",
        explanation:
          "Incorrect. Turning off observability works against safe agent operations.",
      },
    ],
    correctOptionIds: ["A", "B"],
  }),

  defineAifQuestion({
    id: "aif-d2-027",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.3",
    topic: "agentic-ai",
    difficulty: "medium",
    stem: "Why do agentic GenAI systems need stronger identity and tool-permission design than a read-only chatbot?",
    options: [
      {
        id: "A",
        text: "Agents may invoke tools that change tickets, data, or infrastructure, so least-privilege scopes and audits matter more",
        explanation:
          "Correct. Tool-using agents expand the blast radius; authorization and observability become first-class controls.",
      },
      {
        id: "B",
        text: "Agents never call external APIs, so permissions are decorative",
        explanation:
          "Incorrect. Tool calling is a defining agent capability and often reaches external systems.",
      },
      {
        id: "C",
        text: "Foundation models automatically create temporary root users for each thought step",
        explanation:
          "Incorrect. Models do not mint AWS root credentials as part of reasoning.",
      },
      {
        id: "D",
        text: "Agent frameworks legally indemnify every incorrect tool call",
        explanation:
          "Incorrect. Frameworks do not remove operational or compliance responsibility for actions taken.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-028",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.2",
    topic: "genai-limitations",
    difficulty: "easy",
    stem: "Which limitation should stakeholders expect from generative AI systems?",
    options: [
      {
        id: "A",
        text: "Outputs can be fluent yet incorrect, outdated, or missing private facts not supplied in context",
        explanation:
          "Correct. Probabilistic generation does not guarantee truthfulness or access to unprovided private knowledge.",
      },
      {
        id: "B",
        text: "Models always refuse to answer until a human types the final sentence",
        explanation:
          "Incorrect. Models can respond autonomously; human review is a design choice, not a universal limitation.",
      },
      {
        id: "C",
        text: "Generative models can never summarize text of any length",
        explanation:
          "Incorrect. Summarization is a common GenAI capability, though quality still needs evaluation.",
      },
      {
        id: "D",
        text: "Token limits disappear after the first successful API call",
        explanation:
          "Incorrect. Context windows remain finite for subsequent calls.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-029",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.2",
    topic: "genai-limitations",
    difficulty: "medium",
    stem: "A finance process requires exact, repeatable calculation of tax rules from a codified policy engine. Why might GenAI be a poor primary solution?",
    options: [
      {
        id: "A",
        text: "Generative models are probabilistic and may invent steps instead of executing deterministic policy code",
        explanation:
          "Correct. Exact policy execution usually belongs in rules or deterministic services, with GenAI at most assisting explanation.",
      },
      {
        id: "B",
        text: "Foundation models cannot be invoked from AWS accounts in any Region",
        explanation:
          "Incorrect. AWS offers managed GenAI services; availability is not the core issue in this scenario.",
      },
      {
        id: "C",
        text: "Tax rules are stored only as images that no OCR system can read",
        explanation:
          "Incorrect. The scenario is about deterministic execution, not an assumed OCR impossibility.",
      },
      {
        id: "D",
        text: "Embeddings permanently delete source policy documents after vectorization",
        explanation:
          "Incorrect. Embedding pipelines should retain source documents; deletion is not an inherent GenAI property.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-030",
    format: "multi-response",
    domainId: "genai-fundamentals",
    taskStatement: "2.2",
    topic: "genai-limitations",
    difficulty: "hard",
    stem: "Which business risks are inherent enough that GenAI designs should plan mitigations up front? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "Hallucinated or incomplete answers that users may trust because the tone sounds confident",
        explanation:
          "Correct. Fluency can mask error; grounding, evaluation, and human escalation are common mitigations.",
      },
      {
        id: "B",
        text: "Cost and latency growth when prompts, history, and retrieved context expand without budgeting",
        explanation:
          "Correct. Token usage and long contexts directly affect spend and response time.",
      },
      {
        id: "C",
        text: "Guaranteed identical outputs for the same prompt across all model versions forever",
        explanation:
          "Incorrect. Model updates and sampling mean behaviour can change; sameness is not guaranteed.",
      },
      {
        id: "D",
        text: "Automatic compliance with every global regulation without configuration",
        explanation:
          "Incorrect. Compliance remains an organizational responsibility with explicit controls.",
      },
      {
        id: "E",
        text: "Complete elimination of bias once a larger model is selected",
        explanation:
          "Incorrect. Larger models do not remove the need to assess and mitigate bias.",
      },
    ],
    correctOptionIds: ["A", "B"],
  }),

  defineAifQuestion({
    id: "aif-d2-031",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.2",
    topic: "context-engineering",
    difficulty: "medium",
    stem: "What is the core idea of context engineering for GenAI applications?",
    options: [
      {
        id: "A",
        text: "Deliberately selecting, structuring, and budgeting the information the model sees so it can perform the task reliably",
        explanation:
          "Correct. Context engineering treats instructions, history, tools, and retrieved evidence as a designed, limited resource.",
      },
      {
        id: "B",
        text: "Encrypting the VPC CIDR range inside every user prompt",
        explanation:
          "Incorrect. Network addressing does not belong in prompts and is not what context engineering means.",
      },
      {
        id: "C",
        text: "Training a new foundation model from scratch for each user session",
        explanation:
          "Incorrect. Per-session pretraining is impractical; context engineering works with existing models.",
      },
      {
        id: "D",
        text: "Deleting evaluation datasets so prompts cannot be compared",
        explanation:
          "Incorrect. Evaluation remains essential; context engineering does not replace measurement.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-032",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.2",
    topic: "context-engineering",
    difficulty: "hard",
    stem: "A support bot must answer from a large policy corpus without exceeding the model context window. Which design best reflects context engineering?",
    options: [
      {
        id: "A",
        text: "Retrieve only the most relevant chunks, allocate budget across instructions, evidence, and output, and evaluate after trimming",
        explanation:
          "Correct. Selective retrieval plus an explicit context budget preserves high-value evidence within limits.",
      },
      {
        id: "B",
        text: "Paste the entire corpus into the system prompt on every request and ignore truncation errors",
        explanation:
          "Incorrect. Blind pasting causes overflow, cost spikes, and uncontrolled truncation of important policy text.",
      },
      {
        id: "C",
        text: "Remove the user question so more policy text fits",
        explanation:
          "Incorrect. Without the question, the model lacks the task signal needed to answer correctly.",
      },
      {
        id: "D",
        text: "Replace retrieval with a random page from the corpus to reduce engineering effort",
        explanation:
          "Incorrect. Random context sacrifices relevance and increases wrong or incomplete answers.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-033",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.1",
    topic: "tokens",
    difficulty: "hard",
    stem: "A localization team notices that the same user message costs more tokens in one language than another for the same model. What explains this best?",
    options: [
      {
        id: "A",
        text: "Tokenizers are model- and vocabulary-specific, so languages and scripts can split into different token counts",
        explanation:
          "Correct. Non-English text, code, and symbols often tokenize less efficiently depending on the vocabulary.",
      },
      {
        id: "B",
        text: "AWS bills an extra token for every Unicode code point in every Region",
        explanation:
          "Incorrect. Billing follows the model's tokenizer usage, not a universal per-code-point AWS surcharge rule.",
      },
      {
        id: "C",
        text: "Embeddings convert every language into exactly one token before generation",
        explanation:
          "Incorrect. Embeddings produce vectors; they do not collapse all languages to a single generative token.",
      },
      {
        id: "D",
        text: "Attention layers refuse multilingual prompts until they are translated to Morse code",
        explanation:
          "Incorrect. Multilingual prompts are routine; Morse code is unrelated to tokenization cost differences.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-034",
    format: "multi-response",
    domainId: "genai-fundamentals",
    taskStatement: "2.3",
    topic: "amazon-bedrock",
    difficulty: "medium",
    stem: "A platform team is standardizing GenAI on AWS. Which statements about Amazon Bedrock are accurate? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "Applications can invoke supported foundation models through AWS APIs while AWS manages the underlying model hosting for those offerings",
        explanation:
          "Correct. Bedrock provides managed access so customers focus on application logic rather than base-model servers.",
      },
      {
        id: "B",
        text: "Teams can choose among multiple model providers and model IDs based on workload fit",
        explanation:
          "Correct. Bedrock's catalog lets applications select models that match quality, latency, and modality needs.",
      },
      {
        id: "C",
        text: "Bedrock removes the need for least-privilege IAM on InvokeModel and related actions",
        explanation:
          "Incorrect. Bedrock API actions remain authorized through IAM policies.",
      },
      {
        id: "D",
        text: "Bedrock stores every prompt forever in a public bucket by default",
        explanation:
          "Incorrect. Customers control data handling; public default prompt dumps are not the service model.",
      },
      {
        id: "E",
        text: "Using Bedrock means SageMaker AI can never be used in the same account",
        explanation:
          "Incorrect. Accounts commonly combine Bedrock for managed FMs with SageMaker AI for custom ML work.",
      },
    ],
    correctOptionIds: ["A", "B"],
  }),

  defineAifQuestion({
    id: "aif-d2-035",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.1",
    topic: "embeddings",
    difficulty: "hard",
    stem: "An architect proposes storing 3,072-dimensional embeddings for every support ticket and comparing them with cosine similarity. Which trade-off should they communicate?",
    options: [
      {
        id: "A",
        text: "Higher dimensions can improve expressiveness while increasing storage, compute, and the need for compatible query embeddings",
        explanation:
          "Correct. Embedding design trades semantic quality against cost, latency, and operational complexity.",
      },
      {
        id: "B",
        text: "Cosine similarity only works when vectors contain integers between 0 and 10",
        explanation:
          "Incorrect. Cosine similarity works on real-valued vectors; integer-only ranges are not required.",
      },
      {
        id: "C",
        text: "Any embedding dimension above 32 makes retrieval mathematically impossible",
        explanation:
          "Incorrect. Production embedding models commonly use hundreds or thousands of dimensions.",
      },
      {
        id: "D",
        text: "Similarity search replaces the need to secure source ticket content",
        explanation:
          "Incorrect. Authorization and privacy controls remain necessary for source data and derived vectors.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-036",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.2",
    topic: "foundation-models",
    difficulty: "hard",
    stem: "A startup wants one foundation model to act as the entire product: billing, access control, audit, and customer UI. What is the best GenAI fundamentals critique?",
    options: [
      {
        id: "A",
        text: "A foundation model is a component; applications still need product logic, security, evaluation, and operational controls around it",
        explanation:
          "Correct. FMs provide generative capability, not a complete governed business system by themselves.",
      },
      {
        id: "B",
        text: "Foundation models already include PCI-compliant billing ledgers for every industry",
        explanation:
          "Incorrect. Payment and compliance systems are separate application responsibilities.",
      },
      {
        id: "C",
        text: "Foundation models automatically issue unique IAM roles per generated sentence",
        explanation:
          "Incorrect. Identity provisioning is an AWS and application concern, not a side effect of generation.",
      },
      {
        id: "D",
        text: "Foundation models remove the need to define user experience or error handling",
        explanation:
          "Incorrect. UX, failures, and fallbacks remain product design work.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-037",
    format: "single-choice",
    domainId: "genai-fundamentals",
    taskStatement: "2.1",
    topic: "transformers",
    difficulty: "easy",
    stem: "Why do transformer language models need positional information in addition to token embeddings?",
    options: [
      {
        id: "A",
        text: "Self-attention alone does not encode token order, so position signals distinguish different sequences",
        explanation:
          "Correct. Without position, reordered tokens can look alike to attention over a bag of representations.",
      },
      {
        id: "B",
        text: "Positional encodings are AWS Region codes embedded into every request",
        explanation:
          "Incorrect. Position refers to sequence order inside the model, not cloud Region identifiers.",
      },
      {
        id: "C",
        text: "Position vectors replace the need for a vocabulary or tokenizer",
        explanation:
          "Incorrect. Models still tokenize text into vocabulary IDs; position supplements those embeddings.",
      },
      {
        id: "D",
        text: "Position information is only used when generating images with diffusion",
        explanation:
          "Incorrect. Positional signals are fundamental to transformer sequence modeling for language as well.",
      },
    ],
    correctOptionIds: ["A"],
  }),

  defineAifQuestion({
    id: "aif-d2-038",
    format: "multi-response",
    domainId: "genai-fundamentals",
    taskStatement: "2.2",
    topic: "context-engineering",
    difficulty: "medium",
    stem: "Which practices are part of effective context engineering for a production GenAI assistant? (Select TWO.)",
    options: [
      {
        id: "A",
        text: "Keep system instructions concise and versioned so behaviour changes are intentional",
        explanation:
          "Correct. Clear, versioned instructions make context changes reviewable and testable.",
      },
      {
        id: "B",
        text: "Prefer relevant retrieved evidence over dumping entire corpora into the prompt",
        explanation:
          "Correct. Relevance-focused retrieval protects the context budget and improves answer quality.",
      },
      {
        id: "C",
        text: "Hide tool errors from logs so the model can invent successful outcomes",
        explanation:
          "Incorrect. Suppressing tool failures encourages hallucination and blocks debugging.",
      },
      {
        id: "D",
        text: "Disable output reserves so completions can silently truncate mid-sentence forever",
        explanation:
          "Incorrect. Reserving output capacity is part of responsible context budgeting.",
      },
      {
        id: "E",
        text: "Treat the context window as infinite once Provisioned Throughput is enabled",
        explanation:
          "Incorrect. Provisioned Throughput affects capacity pricing and limits, not the model's finite context length.",
      },
      {
        id: "F",
        text: "Store API keys inside the system prompt so the model can rotate them",
        explanation:
          "Incorrect. Secrets belong in secure secret stores and environment configuration, never in prompts.",
      },
    ],
    correctOptionIds: ["A", "B"],
  }),
]
