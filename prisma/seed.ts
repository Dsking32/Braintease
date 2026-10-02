import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  "MATHEMATICS",
  "SCIENCE",
  "LOGIC",
  "GENERAL KNOWLEDGE",
  "NIGERIA",
  "AFRICA",
  "WORLD",
  "HISTORY",
  "CULTURE",
  "LANGUAGE",
  "MEMORY",
  "PROBLEM SOLVING",
  "CURRENT KNOWLEDGE",
];

const levels = [
  { id: 1, name: "CURIOUS", minXp: 0 },
  { id: 2, name: "EXPLORER", minXp: 100 },
  { id: 3, name: "THINKER", minXp: 300 },
  { id: 4, name: "CHALLENGER", minXp: 600 },
  { id: 5, name: "STRATEGIST", minXp: 1_000 },
  { id: 6, name: "MASTERMIND", minXp: 1_500 },
  { id: 7, name: "ELITE", minXp: 2_200 },
  { id: 8, name: "LEGEND", minXp: 3_000 },
];

const plans = [
  {
    code: "DAILY",
    name: "Daily",
    description: "One day of BrainTease access",
    priceMinor: 10_000,
    interval: "DAY",
    intervalValue: 1,
    features: { dailyChallenges: true },
  },
  {
    code: "WEEKLY",
    name: "Weekly",
    description: "Seven days of BrainTease access",
    priceMinor: 15_000,
    interval: "WEEK",
    intervalValue: 1,
    features: { dailyChallenges: true },
  },
];

type SeedQuestion = {
  category: string;
  text: string;
  options: [string, string, string, string];
  answer: string;
  explanation: string;
  difficulty: number;
  timeLimitSec: number;
};

const questions: SeedQuestion[] = [
  { category: "MATHEMATICS", text: "What is 12 multiplied by 8?", options: ["86", "96", "98", "108"], answer: "96", explanation: "12 times 8 equals 96.", difficulty: 1, timeLimitSec: 20 },
  { category: "MATHEMATICS", text: "What is the square root of 144?", options: ["10", "11", "12", "14"], answer: "12", explanation: "12 multiplied by 12 is 144.", difficulty: 2, timeLimitSec: 25 },
  { category: "MATHEMATICS", text: "What is three quarters of 80?", options: ["50", "55", "60", "65"], answer: "60", explanation: "80 divided by 4 and multiplied by 3 is 60.", difficulty: 3, timeLimitSec: 30 },
  { category: "MATHEMATICS", text: "If 3x + 7 = 31, what is x?", options: ["6", "7", "8", "9"], answer: "8", explanation: "Subtract 7 to get 3x = 24, then divide by 3.", difficulty: 4, timeLimitSec: 35 },
  { category: "MATHEMATICS", text: "A number is increased by 20% and becomes 180. What was the original number?", options: ["140", "150", "160", "165"], answer: "150", explanation: "180 divided by 1.2 is 150.", difficulty: 5, timeLimitSec: 40 },
  { category: "SCIENCE", text: "At standard atmospheric pressure, water freezes at what temperature in Celsius?", options: ["0", "10", "32", "100"], answer: "0", explanation: "The freezing point of water is 0 degrees Celsius.", difficulty: 1, timeLimitSec: 20 },
  { category: "SCIENCE", text: "Which gas do plants absorb during photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], answer: "Carbon dioxide", explanation: "Plants use carbon dioxide and water to produce sugars and oxygen.", difficulty: 2, timeLimitSec: 25 },
  { category: "SCIENCE", text: "What is the chemical symbol for sodium?", options: ["S", "So", "Na", "N"], answer: "Na", explanation: "Na comes from the Latin name natrium.", difficulty: 3, timeLimitSec: 30 },
  { category: "SCIENCE", text: "Which part of a eukaryotic cell contains most of its genetic material?", options: ["Ribosome", "Nucleus", "Cell membrane", "Golgi apparatus"], answer: "Nucleus", explanation: "Most eukaryotic DNA is housed in the nucleus.", difficulty: 4, timeLimitSec: 35 },
  { category: "LOGIC", text: "What number comes next: 2, 4, 8, 16, ...?", options: ["20", "24", "30", "32"], answer: "32", explanation: "Each number is twice the previous one.", difficulty: 1, timeLimitSec: 20 },
  { category: "LOGIC", text: "All glips are blue. No blue things are round. Can a glip be round?", options: ["Yes", "No", "Only sometimes", "Not enough information"], answer: "No", explanation: "Every glip is blue, and nothing blue is round.", difficulty: 3, timeLimitSec: 30 },
  { category: "LOGIC", text: "If yesterday was two days before Friday, what day is today?", options: ["Wednesday", "Thursday", "Friday", "Saturday"], answer: "Thursday", explanation: "Two days before Friday is Wednesday, so yesterday was Wednesday.", difficulty: 4, timeLimitSec: 35 },
  { category: "GENERAL KNOWLEDGE", text: "Which is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "Pacific", explanation: "The Pacific Ocean is the largest ocean by area.", difficulty: 1, timeLimitSec: 20 },
  { category: "GENERAL KNOWLEDGE", text: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], answer: "6", explanation: "A hexagon is a six-sided polygon.", difficulty: 2, timeLimitSec: 25 },
  { category: "GENERAL KNOWLEDGE", text: "Which instrument measures atmospheric pressure?", options: ["Thermometer", "Barometer", "Hygrometer", "Anemometer"], answer: "Barometer", explanation: "A barometer measures atmospheric pressure.", difficulty: 4, timeLimitSec: 35 },
  { category: "NIGERIA", text: "What is the capital city of Nigeria?", options: ["Lagos", "Kano", "Abuja", "Ibadan"], answer: "Abuja", explanation: "Abuja is Nigeria's federal capital city.", difficulty: 1, timeLimitSec: 20 },
  { category: "NIGERIA", text: "What is the currency of Nigeria?", options: ["Cedi", "Naira", "Dalasi", "Shilling"], answer: "Naira", explanation: "The naira is Nigeria's official currency.", difficulty: 1, timeLimitSec: 20 },
  { category: "NIGERIA", text: "Which Nigerian river gives its name to the country?", options: ["Benue", "Osun", "Niger", "Kaduna"], answer: "Niger", explanation: "The country is named after the Niger River.", difficulty: 3, timeLimitSec: 30 },
  { category: "AFRICA", text: "Which is the largest country in Africa by land area?", options: ["Sudan", "Democratic Republic of the Congo", "Algeria", "Libya"], answer: "Algeria", explanation: "Algeria is Africa's largest country by land area.", difficulty: 2, timeLimitSec: 25 },
  { category: "AFRICA", text: "Which African country is entirely surrounded by South Africa?", options: ["Eswatini", "Lesotho", "Botswana", "Namibia"], answer: "Lesotho", explanation: "Lesotho is an enclave surrounded by South Africa.", difficulty: 4, timeLimitSec: 35 },
  { category: "WORLD", text: "Which city is the capital of Japan?", options: ["Kyoto", "Osaka", "Tokyo", "Nagoya"], answer: "Tokyo", explanation: "Tokyo is Japan's capital.", difficulty: 1, timeLimitSec: 20 },
  { category: "WORLD", text: "What is the name of the line at 0 degrees latitude?", options: ["Prime Meridian", "Equator", "Tropic of Cancer", "International Date Line"], answer: "Equator", explanation: "The Equator is the line at zero degrees latitude.", difficulty: 3, timeLimitSec: 30 },
  { category: "HISTORY", text: "In which year did the first human land on the Moon?", options: ["1959", "1965", "1969", "1972"], answer: "1969", explanation: "Apollo 11 landed on the Moon in July 1969.", difficulty: 2, timeLimitSec: 25 },
  { category: "HISTORY", text: "Which ancient civilization built Machu Picchu?", options: ["Maya", "Inca", "Aztec", "Olmec"], answer: "Inca", explanation: "Machu Picchu was built by the Inca civilization.", difficulty: 4, timeLimitSec: 35 },
  { category: "CULTURE", text: "The masquerade tradition of Egungun is especially associated with which people?", options: ["Yoruba", "Tuareg", "Zulu", "Akan"], answer: "Yoruba", explanation: "Egungun is a Yoruba masquerade tradition honoring ancestors.", difficulty: 3, timeLimitSec: 30 },
  { category: "LANGUAGE", text: "What is the plural form of 'analysis'?", options: ["Analysises", "Analyses", "Analysis", "Analysi"], answer: "Analyses", explanation: "Analysis becomes analyses in the plural.", difficulty: 2, timeLimitSec: 25 },
  { category: "MEMORY", text: "Remember this sequence: 7, 2, 9, 4. What was the third number?", options: ["2", "4", "7", "9"], answer: "9", explanation: "The third number in the sequence is 9.", difficulty: 2, timeLimitSec: 25 },
  { category: "PROBLEM SOLVING", text: "A tap fills 12 litres in 3 minutes. At the same rate, how many litres does it fill in 8 minutes?", options: ["24", "28", "32", "36"], answer: "32", explanation: "The tap fills 4 litres per minute, so in 8 minutes it fills 32 litres.", difficulty: 4, timeLimitSec: 35 },
  { category: "CURRENT KNOWLEDGE", text: "Which organization publishes the annual Human Development Report?", options: ["UNDP", "WHO", "WTO", "UNESCO"], answer: "UNDP", explanation: "The United Nations Development Programme publishes the Human Development Report.", difficulty: 4, timeLimitSec: 35 },
  { category: "MATHEMATICS", text: "What is the remainder when 7 to the power of 100 is divided by 6?", options: ["0", "1", "2", "5"], answer: "1", explanation: "Since 7 leaves remainder 1 when divided by 6, every positive power of 7 also leaves remainder 1.", difficulty: 6, timeLimitSec: 45 },
];

async function main() {
  const categoryIds = new Map<string, string>();
  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { name },
      create: { name },
      update: { active: true },
      select: { id: true },
    });
    categoryIds.set(name, category.id);
  }

  for (const level of levels) {
    await prisma.level.upsert({ where: { id: level.id }, create: level, update: level });
  }

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      create: { ...plan, currency: "NGN", active: true },
      update: { ...plan, currency: "NGN", active: true },
    });
  }

  await prisma.$transaction(questions.map((question, index) => {
    const id = `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`;
    const categoryId = categoryIds.get(question.category);
    if (!categoryId) throw new Error(`Unknown seed category: ${question.category}`);
    const data = {
      categoryId,
      type: "MULTIPLE_CHOICE" as const,
      text: question.text,
      optionA: question.options[0],
      optionB: question.options[1],
      optionC: question.options[2],
      optionD: question.options[3],
      correctAnswer: question.answer,
      explanation: question.explanation,
      difficulty: question.difficulty,
      timeLimitSec: question.timeLimitSec,
      status: "PUBLISHED" as const,
      source: "BrainTease sample seed",
      publishedAt: new Date(),
    };
    return prisma.question.upsert({ where: { id }, create: { id, ...data }, update: data });
  }));

  console.info(`Seeded ${plans.length} plans, ${categories.length} categories, ${levels.length} levels, and ${questions.length} published questions.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());