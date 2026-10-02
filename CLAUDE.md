# BrainTease
Follow SPEC.md. Work phase by phase (SPEC section 136). Explain, implement, test, fix, continue.
Rules: scoring/timers/subscription status are server-side only; money is integer kobo; never activate
a subscription without verified provider callback (idempotent on provider_transaction_id); no hard-coded
plans, categories, levels or providers; only PUBLISHED questions in gameplay; no medical claims about scores.
Run `npm test` before finishing any phase.
