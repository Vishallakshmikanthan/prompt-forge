# Prompt Schema Definition

Structured data formats for prompts within PromptForge.

## Core Conceptual Model

```typescript
type Prompt = {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  versionCount: number;
  forksCount: number;
  starsCount: number;
}
```
