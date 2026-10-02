# BRAINTEASE

## MASTER AI BUILD SPECIFICATION

### Version 1.0

---

# 1. INSTRUCTION TO THE AI DEVELOPER

You are a senior full-stack product engineer, software architect, UI/UX designer and product implementation specialist.

Your task is to design and build a production-ready web application called:

# BrainTease

BrainTease is a Nigerian cognitive challenge and competitive quiz platform.

Do not build a generic quiz website.

Build a complete product with:

* Modern consumer-facing web application
* User authentication
* Subscription system
* Daily challenges
* Question engine
* Adaptive difficulty
* Scoring
* XP
* Levels
* Streaks
* Achievements
* Leaderboards
* User profiles
* Performance analytics
* Admin dashboard
* Question management
* Subscription management
* Billing transaction records
* Notification system
* VAS/DCB-ready architecture
* Mobile-app-ready API architecture

The application must be designed so that the VAS/DCB integration can be connected later without rebuilding the core application.

Do not create mock screens only.

Build functional frontend, backend, database, authentication, APIs and business logic.

---

# 2. PRODUCT NAME

Product:

BrainTease

Tagline:

Challenge Your Mind. Every Day.

Alternative messaging:

* Test Your Thinking.
* How Sharp Are You Today?
* Think. Play. Improve.
* Your Brain Has a Score.

Use:

"Challenge Your Mind. Every Day."

as the primary brand message.

---

# 3. PRODUCT PURPOSE

BrainTease is designed to encourage continuous engagement with:

* Critical thinking
* Logical reasoning
* Mathematics
* Science
* General knowledge
* Nigerian culture
* Nigerian history
* African knowledge
* World knowledge
* Memory
* Problem solving
* Pattern recognition
* Language
* Speed

The platform should turn these activities into an engaging game.

The product must NOT present BrainTease scores as medical diagnoses, medical cognitive tests or clinical assessments.

All scores are game-performance metrics.

---

# 4. CORE PRODUCT LOOP

The most important product loop is:

SUBSCRIBE
↓
PLAY
↓
ANSWER
↓
SCORE
↓
SEE PERFORMANCE
↓
SEE RANK
↓
IMPROVE
↓
RETURN TOMORROW

The entire product should be optimized around this loop.

---

# 5. TARGET MARKET

Initial market:

Nigeria.

Primary users:

* Students
* Young professionals
* General mobile users
* Knowledge enthusiasts
* Competitive gamers
* People interested in intellectual challenges
* Older adults looking for engaging brain games

The platform should be globally extensible.

Do not hard-code Nigeria-specific assumptions into the architecture.

---

# 6. BUSINESS MODEL

Initial subscription plans:

## DAILY

Price:

₦100

Billing period:

1 day

---

## WEEKLY

Price:

₦150

Billing period:

7 days

---

# 7. FUTURE BUSINESS MODEL

The architecture must support:

* Monthly subscriptions
* Premium challenge packs
* Tournament access
* Sponsored competitions
* School competitions
* University competitions
* Corporate competitions
* Premium mobile features
* Other future subscription plans

Do not hard-code only two plans.

Create a dynamic subscription-plan system.

---

# 8. CHANNELS

Initial:

1. Web
2. USSD
3. SMS

Future:

4. Android
5. iOS

The backend must expose APIs that can be consumed by all channels.

Architecture:

WEB
USSD
SMS
MOBILE APP
|
↓
BRAINTEASE API
|
↓
DATABASE / SERVICES

---

# 9. USER TYPES

Create role-based access.

## PLAYER

Normal user.

Can:

* Play challenges
* View score
* View profile
* View leaderboard
* View achievements
* View streak
* View subscription
* Manage account

## CONTENT_MANAGER

Can:

* Create questions
* Edit questions
* Review questions
* Publish questions
* Manage categories

## SUPPORT_ADMIN

Can:

* View users
* View subscriptions
* View transactions
* Handle account issues
* View activity

## SUPER_ADMIN

Full access.

---

# 10. WEB APPLICATION STRUCTURE

Create the following major areas:

PUBLIC WEBSITE

/auth

/app

/admin

---

# 11. PUBLIC WEBSITE

Create:

/

Landing page

/pricing

Pricing

/how-it-works

How BrainTease works

/leaderboard

Public leaderboard

/about

About BrainTease

/terms

Terms and conditions

/privacy

Privacy policy

/contact

Contact/support

---

# 12. LANDING PAGE

The landing page must be visually impressive.

Do not create a generic corporate landing page.

The visual style should feel like:

* Gaming
* Intelligence
* Technology
* Competition
* Premium
* Modern

Use:

* Strong typography
* Modern cards
* Subtle animations
* Interactive score elements
* Progress indicators
* Challenge cards
* Leaderboard previews
* Responsive design

Avoid excessive animation.

The website must remain fast.

---

# 13. HERO SECTION

Headline:

# Challenge Your Mind. Every Day.

Supporting text:

Test your knowledge, logic, speed and problem-solving skills.

Compete with players across Nigeria and eventually the world.

Primary CTA:

START CHALLENGE

Secondary CTA:

VIEW LEADERBOARD

Display a visual representation of:

Today's Challenge

10 Questions

5 Minutes

1,000 Possible Points

---

# 14. LANDING PAGE SECTIONS

Build:

1. Hero
2. How It Works
3. Daily Challenge
4. Categories
5. Leaderboard preview
6. Gamification
7. Subscription plans
8. Why BrainTease
9. CTA
10. Footer

---

# 15. CATEGORIES

Initial categories:

MATHEMATICS

SCIENCE

LOGIC

GENERAL KNOWLEDGE

NIGERIA

AFRICA

WORLD

HISTORY

CULTURE

LANGUAGE

MEMORY

PROBLEM SOLVING

CURRENT KNOWLEDGE

The admin must be able to create additional categories.

---

# 16. AUTHENTICATION

Support:

* Phone number
* OTP

Future:

* Email
* Google
* Apple

For VAS users:

Phone number/MSISDN should be the primary identity.

Never display a user's phone number publicly.

---

# 17. USER REGISTRATION FLOW

User clicks:

START CHALLENGE

↓

Enter phone number

↓

Send OTP

↓

Verify OTP

↓

Create account

↓

Show onboarding

---

# 18. ONBOARDING

After registration ask:

Display name

Age range

Optional:

Gender

State

Interests

Do not make unnecessary personal information mandatory.

Ask:

"What challenges interest you?"

Options:

Mathematics

Science

Logic

Culture

History

General Knowledge

Mixed

Store preferences.

These preferences can later be used by the recommendation engine.

---

# 19. USER DASHBOARD

After login:

# Good morning, [NAME]

Your BrainTease Level:

MASTERmind

Current streak:

18 days

Today's Challenge:

10 Questions

Estimated time:

5 minutes

CTA:

START TODAY'S CHALLENGE

---

# 20. DASHBOARD CARDS

Show:

Current Level

XP

BrainTease Score

Daily Streak

Nigeria Rank

Global Rank

Questions Answered

Accuracy

---

# 21. DAILY CHALLENGE

Every user should receive a Daily Challenge.

Default:

10 questions.

Default estimated time:

5 minutes.

Question categories should be mixed unless the user has selected a specific challenge.

---

# 22. DAILY CHALLENGE RULES

A Daily Challenge consists of:

10 questions.

Each question has:

* Question
* Answers
* Correct answer
* Category
* Difficulty
* Time limit
* Points

Questions should be selected dynamically.

Do not always send the same 10 questions to everyone.

---

# 23. QUESTION TYPES

Support:

MULTIPLE_CHOICE

TRUE_FALSE

SEQUENCE

PATTERN

NUMERICAL

WORD

LOGIC

MEMORY

IMAGE_BASED

Future:

AUDIO

VIDEO

The database must use a question_type field.

---

# 24. QUESTION MODEL

Each question must support:

id

category_id

question_type

question_text

question_image

option_a

option_b

option_c

option_d

correct_answer

explanation

difficulty

points

time_limit

status

source

created_by

reviewed_by

published_at

created_at

updated_at

---

# 25. QUESTION STATUS

Possible statuses:

DRAFT

UNDER_REVIEW

APPROVED

PUBLISHED

ARCHIVED

REJECTED

Only PUBLISHED questions can appear in gameplay.

---

# 26. QUESTION QUALITY CONTROL

Question workflow:

AI / HUMAN CREATION

↓

DRAFT

↓

REVIEW

↓

APPROVED

↓

PUBLISHED

↓

PLAYER FEEDBACK

↓

ANALYTICS

Questions with abnormal failure rates should be flagged for review.

---

# 27. DIFFICULTY LEVEL

Use:

1 = Beginner

2 = Easy

3 = Intermediate

4 = Advanced

5 = Expert

6 = Master

Difficulty should be stored numerically.

---

# 28. ADAPTIVE DIFFICULTY

The system should dynamically adjust question difficulty.

If user performs strongly:

Increase difficulty.

If user performs poorly:

Reduce difficulty.

Example:

Accuracy > 85%

Increase difficulty.

Accuracy 65–85%

Maintain.

Accuracy < 65%

Reduce difficulty.

These values should be configurable from the admin panel.

---

# 29. SCORING

Base points depend on difficulty.

Example:

Beginner = 50

Easy = 75

Intermediate = 100

Advanced = 125

Expert = 150

Master = 200

---

# 30. SPEED BONUS

Users receive additional points based on response speed.

Example:

Very fast:

+20%

Fast:

+10%

Normal:

+0%

The scoring algorithm must be implemented server-side.

Never trust scores sent by the frontend.

---

# 31. STREAK BONUS

Users receive a streak for completing their Daily Challenge.

Example:

1 day = 1 streak

7 days = 7-day achievement

30 days = 30-day achievement

100 days = 100-day achievement

The streak should reset according to the configured product rules if the user fails to participate.

---

# 32. XP

XP is different from score.

Score:

Performance in a challenge.

XP:

Long-term progression.

Example:

Challenge completed:

+100 XP

Perfect score:

+50 XP

7-day streak:

+100 XP

Achievement:

+250 XP

---

# 33. USER LEVELS

Initial levels:

LEVEL 1
CURIOUS

LEVEL 2
EXPLORER

LEVEL 3
THINKER

LEVEL 4
CHALLENGER

LEVEL 5
STRATEGIST

LEVEL 6
MASTERMIND

LEVEL 7
ELITE

LEVEL 8
LEGEND

Store levels in the database.

Do not hard-code them into frontend logic.

---

# 34. LEADERBOARD

Create:

GLOBAL

NIGERIA

STATE

CATEGORY

WEEKLY

MONTHLY

The leaderboard should be calculated from server-side data.

---

# 35. LEADERBOARD UI

Example:

# Nigeria Leaderboard

1. BrainMaster — 98,420
2. ThinkFast — 97,210
3. LogicKing — 95,810
4. QuizMaster — 94,520
5. MindRunner — 92,110

Show current user's position even if outside the top 10.

Example:

You

# 2,481

Score:

52,480

---

# 36. PROFILE PAGE

Profile should contain:

Avatar

Display name

Level

XP

BrainTease Score

Streak

Questions answered

Accuracy

Average response time

Nigeria ranking

Global ranking

Achievements

Category performance

---

# 37. PERFORMANCE ANALYTICS

Create:

## My Performance

Categories:

Mathematics
Science
Logic
Culture
Nigeria
History
General Knowledge
Problem Solving

For each category show:

Accuracy

Questions attempted

Average score

Average response time

Difficulty reached

---

# 38. PERFORMANCE VISUALIZATION

Use attractive charts.

Example:

Mathematics
88%

Logic
81%

Culture
94%

Science
63%

Problem Solving
79%

These are game-performance indicators only.

Display appropriate explanatory language.

---

# 39. ACHIEVEMENTS

Create achievement system.

Initial achievements:

FIRST_CHALLENGE

TEN_QUESTIONS

HUNDRED_QUESTIONS

THOUSAND_QUESTIONS

PERFECT_SCORE

SEVEN_DAY_STREAK

THIRTY_DAY_STREAK

HUNDRED_DAY_STREAK

MATH_MASTER

LOGIC_MASTER

SCIENCE_MASTER

CULTURE_MASTER

SPEED_THINKER

BRAINTEASE_ELITE

---

# 40. NOTIFICATIONS

Build notification infrastructure.

Notification types:

DAILY_CHALLENGE

STREAK_REMINDER

ACHIEVEMENT

LEADERBOARD_CHANGE

SUBSCRIPTION

PAYMENT

SYSTEM

Future:

Push notification

SMS

Email

---

# 41. SUBSCRIPTION SYSTEM

Build a complete subscription engine.

Tables:

plans

subscriptions

subscription_events

billing_transactions

payment_attempts

renewals

cancellations

---

# 42. PLAN MODEL

Each plan must contain:

id

name

description

price

currency

billing_interval

interval_value

features

status

created_at

updated_at

Example:

Daily

100

NGN

DAY

1

Weekly

150

NGN

WEEK

1

---

# 43. SUBSCRIPTION STATES

Use:

PENDING

ACTIVE

GRACE_PERIOD

PAYMENT_FAILED

CANCELLED

EXPIRED

SUSPENDED

---

# 44. SUBSCRIPTION FLOW

WEB:

User selects plan.

↓

System creates subscription request.

↓

DCB provider processes request.

↓

Payment succeeds.

↓

Provider callback.

↓

Verify transaction.

↓

Activate subscription.

↓

Create subscription event.

↓

Notify user.

---

# 45. IMPORTANT BILLING RULE

Never activate a subscription solely because the frontend says payment succeeded.

Activation must occur after server-side verification of the billing provider response.

---

# 46. DCB INTEGRATION ARCHITECTURE

Create an abstraction:

PaymentProvider

Methods:

initializeSubscription()

charge()

verifyTransaction()

cancelSubscription()

getSubscriptionStatus()

handleCallback()

This allows multiple aggregators/MNOs to be integrated later.

Example:

MTNProvider

AirtelProvider

GloProvider

NineMobileProvider

Do not hard-code provider-specific logic throughout the application.

---

# 47. VAS ADAPTER

Create a service layer:

VASProviderAdapter

It should support:

subscribe

renew

unsubscribe

status

charge

callback

reversal

reconciliation

The exact provider implementation can be connected later.

---

# 48. WEB SUBSCRIPTION FLOW

User:

BrainTease.com

↓

START CHALLENGE

↓

Enter phone number

↓

Choose:

₦100 Daily

₦150 Weekly

↓

Display terms

↓

Confirm

↓

DCB authentication

↓

Charge

↓

Server verifies

↓

Subscription ACTIVE

↓

User enters challenge

---

# 49. USSD ARCHITECTURE

Create backend endpoints capable of supporting:

POST /api/v1/ussd

The USSD provider will send:

session_id

msisdn

service_code

network

text

timestamp

The API returns the next menu.

---

# 50. USSD MENU

Example:

BrainTease

1. Subscribe
2. Today's Challenge
3. My Score
4. Leaderboard
5. My Subscription
6. Help

---

# 51. USSD SUBSCRIPTION

1. Subscribe

↓

1. Daily ₦100
2. Weekly ₦150

↓

Display confirmation.

↓

DCB process.

↓

Success:

"BrainTease activated successfully."

---

# 52. SMS ARCHITECTURE

Create:

POST /api/v1/sms/inbound

Support keyword processing.

Example:

BRAIN

User sends:

BRAIN

System:

"Welcome to BrainTease. Reply 1 for Daily ₦100 or 2 for Weekly ₦150."

The exact shortcode and keyword should be configurable.

---

# 53. MOBILE APP ARCHITECTURE

Do not build the mobile app yet.

However:

Every major web feature must be exposed through clean REST/JSON APIs.

Future mobile app:

Flutter or React Native.

The mobile app should authenticate using the same BrainTease backend.

---

# 54. MOBILE SUBSCRIPTION LINKING

Future flow:

User downloads app.

↓

Enters phone number.

↓

OTP.

↓

Backend checks:

Is there an active VAS subscription?

YES

↓

Unlock premium features.

NO

↓

Show subscription options.

The mobile app must not create a second subscription when an active VAS subscription already exists.

---

# 55. ADMIN DASHBOARD

Build:

/admin

Dashboard sections:

Overview

Users

Questions

Categories

Challenges

Subscriptions

Transactions

Leaderboards

Achievements

Notifications

Reports

Settings

Audit Logs

---

# 56. ADMIN OVERVIEW

Display:

Total users

Active users

Active subscribers

Daily subscribers

Weekly subscribers

New subscribers

Cancelled subscriptions

Revenue

Today's challenges

Questions answered

DAU

WAU

MAU

Renewal rate

Churn

---

# 57. USER MANAGEMENT

Admin can:

Search users.

Filter users.

View profile.

View subscription.

View transactions.

View gameplay history.

View scores.

Suspend account.

Restore account.

View audit history.

Admin must not see sensitive information unless their role permits it.

---

# 58. QUESTION MANAGEMENT

Admin can:

Create

Edit

Review

Approve

Reject

Publish

Archive

Search

Filter

Bulk upload

Questions.

Filters:

Category

Difficulty

Status

Question type

Created date

---

# 59. QUESTION IMPORT

Support CSV import.

CSV fields:

question_text

question_type

category

option_a

option_b

option_c

option_d

correct_answer

explanation

difficulty

points

time_limit

The system must validate imported questions before saving.

---

# 60. CATEGORY MANAGEMENT

Admin can:

Create category

Edit category

Deactivate category

Set category icon

Set category description

Set category colour/theme

Do not hard-code categories.

---

# 61. TRANSACTION MANAGEMENT

Admin should see:

Transaction ID

User

MSISDN masked

Plan

Amount

Provider

MNO

Status

Reference

Created At

Updated At

---

# 62. TRANSACTION STATES

PENDING

SUCCESS

FAILED

REVERSED

REFUNDED

UNKNOWN

---

# 63. RECONCILIATION

Create a reconciliation system.

Allow admin to upload provider transaction reports.

Compare:

Internal transaction

vs

Provider transaction.

Flag:

Missing transaction

Duplicate

Amount mismatch

Status mismatch

Unmatched

---

# 64. AUDIT LOGGING

Record important administrative actions.

Example:

Admin X

approved question #1234

at:

2026-10-02 10:20

Log:

actor

action

entity

entity_id

old_value

new_value

timestamp

IP where appropriate

---

# 65. API DESIGN

Use versioned API:

/api/v1/

Core endpoints:

POST /auth/request-otp

POST /auth/verify-otp

GET /me

GET /dashboard

GET /plans

POST /subscriptions

GET /subscriptions/current

POST /subscriptions/cancel

GET /challenges/today

POST /challenges/start

POST /challenges/{id}/answer

POST /challenges/{id}/complete

GET /scores

GET /leaderboards

GET /profile

GET /achievements

GET /performance

---

# 66. ADMIN API

/api/v1/admin/

Endpoints:

GET /users

GET /users/{id}

GET /questions

POST /questions

PUT /questions/{id}

DELETE /questions/{id}

POST /questions/{id}/approve

POST /questions/{id}/publish

GET /subscriptions

GET /transactions

GET /analytics

GET /audit-logs

---

# 67. SECURITY REQUIREMENTS

Implement:

JWT or secure session authentication.

OTP rate limiting.

API rate limiting.

CSRF protection where applicable.

Input validation.

SQL injection prevention.

XSS prevention.

Secure HTTP headers.

Role-based authorization.

Password/secret protection.

Secure environment variables.

Never expose secrets to frontend.

---

# 68. DATABASE

Use a relational database.

Preferred:

PostgreSQL.

Create proper migrations.

Do not use an unstructured database design.

---

# 69. CORE DATABASE TABLES

users

user_profiles

user_preferences

otp_requests

categories

questions

question_options

question_attempts

challenges

challenge_questions

challenge_attempts

scores

xp_transactions

levels

achievements

user_achievements

streaks

leaderboard_entries

plans

subscriptions

subscription_events

billing_transactions

payment_attempts

notifications

notification_logs

vas_events

reconciliation_records

admin_users

audit_logs

system_settings

---

# 70. DATABASE RELATIONSHIPS

USER

has one PROFILE

has many ATTEMPTS

has many CHALLENGES

has many SCORES

has many XP TRANSACTIONS

has one STREAK

has many ACHIEVEMENTS

has many SUBSCRIPTIONS

has many BILLING TRANSACTIONS

has many NOTIFICATIONS

---

# 71. CHALLENGE DATA MODEL

Challenge:

id

user_id

challenge_type

status

total_questions

correct_answers

total_score

started_at

completed_at

duration

created_at

Challenge questions:

challenge_id

question_id

order

points_available

---

# 72. QUESTION ATTEMPT

Store:

user_id

challenge_id

question_id

selected_answer

correct

response_time_ms

points_awarded

answered_at

This data is required for performance analytics.

---

# 73. LEADERBOARD ENGINE

Do not calculate the entire leaderboard on every page request.

Use an optimized leaderboard strategy.

Possible implementation:

Redis sorted sets

or

precomputed leaderboard tables.

Leaderboard should support:

global

country

state

category

weekly

monthly

---

# 74. TIMEZONE

Initial timezone:

Africa/Lagos

All backend timestamps should be stored consistently.

Convert to local timezone for user-facing displays.

---

# 75. CURRENCY

Initial currency:

NGN

Display:

₦100

₦150

Do not use floating-point arithmetic for monetary values.

Store money in the smallest unit where appropriate.

---

# 76. RESPONSIVE DESIGN

The web app must work on:

Mobile

Tablet

Desktop

Primary design target:

Mobile.

A user should be able to complete the entire Daily Challenge comfortably on a mobile phone.

---

# 77. DESIGN SYSTEM

Create a reusable design system.

Components:

Button

Card

Modal

Input

Select

Badge

Progress bar

Avatar

Leaderboard row

Question card

Timer

Score card

Achievement card

Stat card

Chart

Toast

Navigation

Bottom navigation

---

# 78. VISUAL STYLE

BrainTease should feel:

Modern

Intelligent

Energetic

Competitive

Premium

Playful

Avoid:

Overly childish design.

Avoid making it look like an online school.

Avoid excessive neon.

Avoid excessive gradients.

Use a polished technology/gaming aesthetic.

---

# 79. MOBILE QUESTION SCREEN

Example:

QUESTION 04/10

SCIENCE

DIFFICULTY: ADVANCED

What is the largest organ in the human body?

A. Heart

B. Liver

C. Skin

D. Lung

TIME

00:18

[Submit]

After selection:

Show feedback.

Correct:

Correct!

+125 points

Incorrect:

Not quite.

Correct answer:

Skin

Then:

NEXT QUESTION

---

# 80. GAME EXPERIENCE

The game should feel fast.

Avoid unnecessary page reloads.

Use client-side transitions while keeping scoring server-authoritative.

Questions should preload where appropriate.

---

# 81. TIMER

Timer must be controlled server-side sufficiently to prevent manipulation.

Frontend timer is for display.

Backend validates elapsed time.

---

# 82. ANTI-CHEAT

Implement:

Server-side scoring

Response-time validation

Rate limiting

Question randomization

Duplicate detection

Suspicious activity flags

Impossible-response detection

Do not allow the frontend to submit arbitrary points.

---

# 83. AI FEATURES

Design the system so AI can later provide:

Question generation

Question difficulty classification

Personalized challenge generation

Question explanations

Duplicate detection

Question quality analysis

Player recommendation

Content moderation

AI must not automatically publish questions without validation.

---

# 84. PERSONALIZATION ENGINE

Future service:

RecommendationEngine

Inputs:

User history

Category performance

Difficulty performance

Response time

Interests

Recent questions

Weak categories

Strong categories

Output:

Recommended questions.

---

# 85. CONTENT SAFETY

Questions must be reviewed for:

Incorrect information

Ambiguous wording

Offensive content

Hate content

Discriminatory content

Misinformation

Sensitive political claims

Medical misinformation

Religious sensitivity

Cultural sensitivity

---

# 86. CURRENT AFFAIRS

If current-affairs questions are introduced:

Store:

publication date

question date

source

review status

expiry date

Current questions should be periodically reviewed.

Do not allow outdated current-affairs questions to remain permanently active.

---

# 87. PERFORMANCE

Target:

Fast initial load.

API responses should generally be below 500ms under normal load.

Challenge transitions should feel instantaneous.

Use:

Caching

Database indexing

Lazy loading

Pagination

CDN

Image optimization

---

# 88. SCALABILITY

Design for:

10,000 users

100,000 users

1 million users

Architecture should be horizontally scalable.

Avoid architecture that requires major rewrites when traffic increases.

---

# 89. OBSERVABILITY

Implement:

Application logs

Error tracking

API monitoring

Database monitoring

Billing monitoring

Subscription monitoring

Performance monitoring

Important alerts:

Billing failures

High API error rate

Database failures

USSD failures

SMS failures

DCB callback failures

---

# 90. BACKUPS

Implement:

Automated database backups

Backup retention

Disaster recovery strategy

Restore testing

Do not consider the application production-ready without backup/recovery procedures.

---

# 91. ENVIRONMENT CONFIGURATION

Create:

.env.example

Never commit real secrets.

Environment variables should include placeholders for:

DATABASE_URL

JWT_SECRET

OTP_PROVIDER

SMS_PROVIDER

USSD_PROVIDER

DCB_PROVIDER

REDIS_URL

STORAGE_PROVIDER

APP_URL

API_URL

---

# 92. DEVELOPMENT ENVIRONMENTS

Support:

Development

Staging

Production

Never connect local development to production billing.

Use sandbox/test billing providers where available.

---

# 93. TESTING

Create:

Unit tests

Integration tests

API tests

Authentication tests

Subscription tests

Billing tests

Leaderboard tests

Game engine tests

Question tests

Admin tests

Security tests

---

# 94. CRITICAL TEST CASES

Test:

User registration.

OTP verification.

Duplicate OTP requests.

Daily subscription.

Weekly subscription.

Successful billing.

Failed billing.

Duplicate billing callback.

Subscription renewal.

Subscription cancellation.

Expired subscription.

Challenge creation.

Question answering.

Incorrect answer.

Correct answer.

Timer expiration.

Score calculation.

Leaderboard calculation.

Achievement unlock.

Streak.

Admin authorization.

---

# 95. IDEMPOTENCY

Billing callbacks must be idempotent.

If the same payment callback arrives multiple times:

DO NOT charge or activate the subscription multiple times.

Use:

provider_transaction_id

as an idempotency key where appropriate.

---

# 96. WEBHOOK SECURITY

Verify provider webhook signatures where supported.

Never trust webhook data blindly.

Validate:

Signature

Transaction ID

Amount

Currency

User

Plan

Timestamp

Provider status

---

# 97. CUSTOMER EXPERIENCE

The product should always tell the user what is happening.

Bad:

"Error."

Good:

"We couldn't complete your subscription. No charge has been confirmed. Please try again."

Bad:

"Payment failed."

Good:

"Your payment could not be completed. Please try again or contact support."

---

# 98. EMPTY STATES

Design proper empty states.

Example:

No achievements yet.

"Complete your first challenge to unlock your first achievement."

No leaderboard:

"Complete a challenge to appear on the leaderboard."

No performance data:

"Start playing to build your BrainTease profile."

---

# 99. ERROR HANDLING

Never expose raw backend errors to users.

Log technical details internally.

Show friendly messages.

---

# 100. ACCESSIBILITY

Support:

Readable font sizes

Keyboard navigation

Contrast

Screen reader labels

Focus states

Clear error messages

Do not rely on colour alone.

---

# 101. SEO

Public pages should be SEO-friendly.

Metadata:

Title

Description

Open Graph

Twitter/X metadata

Canonical URLs

Structured data where appropriate

---

# 102. ANALYTICS EVENTS

Track:

signup_started

otp_requested

otp_verified

subscription_started

subscription_success

subscription_failed

challenge_started

question_answered

challenge_completed

achievement_unlocked

leaderboard_viewed

profile_viewed

subscription_cancelled

renewal_success

renewal_failed

---

# 103. EVENT PROPERTIES

For gameplay:

user_id

challenge_id

question_id

category

difficulty

response_time

correct

points

timestamp

For subscriptions:

user_id

plan_id

provider

mno

amount

transaction_id

status

timestamp

---

# 104. ADMIN ANALYTICS

Dashboard charts:

New users

Active users

Subscriptions

Revenue

Questions answered

Daily active users

Weekly active users

Monthly active users

Retention

Churn

Average score

Average accuracy

Top categories

---

# 105. PRODUCT SETTINGS

Admin-configurable settings:

Daily challenge question count

Default timer

Scoring multipliers

Difficulty thresholds

XP thresholds

Streak rules

Subscription plans

Leaderboard rules

Notification rules

Question categories

Maintenance mode

---

# 106. FEATURE FLAGS

Implement feature flags.

Examples:

ENABLE_DAILY_CHALLENGE

ENABLE_GLOBAL_LEADERBOARD

ENABLE_STATE_LEADERBOARD

ENABLE_TOURNAMENTS

ENABLE_REFERRALS

ENABLE_AI_QUESTIONS

ENABLE_MOBILE_PREMIUM

ENABLE_REWARDS

This allows features to be released gradually.

---

# 107. FUTURE TOURNAMENT SYSTEM

Architecture should eventually support:

Tournament

Participants

Entry rules

Start time

End time

Question set

Leaderboard

Winner

Rewards

The MVP does not need to implement the full tournament UI.

---

# 108. FUTURE FRIEND SYSTEM

Users should eventually be able to:

Search user

Follow friend

Challenge friend

View friend leaderboard

Send challenge

The database should not prevent this future feature.

---

# 109. FUTURE SCHOOL SYSTEM

Potential future entities:

School

Teacher

Student

Class

School leaderboard

Class leaderboard

School challenge

Do not build this into MVP unless required.

---

# 110. FUTURE CORPORATE SYSTEM

Potential:

Company

Employee

Department

Corporate leaderboard

Corporate challenge

Company competition

Again, architect for extensibility but do not overbuild the MVP.

---

# 111. FUTURE MOBILE APP

The mobile app should consume:

/api/v1/

It should not have separate business logic for:

Scoring

Subscription

Leaderboard

Achievements

Question selection

All core logic must live on the backend.

---

# 112. PROJECT STRUCTURE

Use a clean scalable architecture.

Suggested:

/apps
/web
/admin
/api

/packages
/ui
/types
/config
/utils

Or use an equivalent architecture appropriate to the chosen technology stack.

---

# 113. RECOMMENDED TECHNOLOGY

Preferred stack:

Frontend:

Next.js

TypeScript

Tailwind CSS

Component library:

shadcn/ui or equivalent

Backend:

Node.js

TypeScript

REST API

Database:

PostgreSQL

ORM:

Prisma or equivalent

Cache:

Redis

Authentication:

OTP + secure session/JWT

Storage:

S3-compatible storage

Deployment:

Cloud infrastructure capable of horizontal scaling.

If the AI developer has a strong reason to use an alternative stack, document the reason before implementation.

---

# 114. CODE QUALITY

Code must be:

Typed

Modular

Testable

Documented

Maintainable

Secure

Production-oriented

Avoid:

Massive files

Duplicated logic

Hard-coded business rules

Hard-coded pricing

Hard-coded categories

Hard-coded provider integrations

---

# 115. API DOCUMENTATION

Generate:

OpenAPI/Swagger documentation.

Every endpoint must document:

Request

Response

Authentication

Errors

Parameters

Example

---

# 116. ADMIN DOCUMENTATION

Document:

How to create questions.

How to approve questions.

How to publish questions.

How to create plans.

How to view transactions.

How to reconcile billing.

How to manage users.

How to view analytics.

---

# 117. DEPLOYMENT DOCUMENTATION

Provide:

README.md

SETUP.md

DEPLOYMENT.md

ENVIRONMENT.md

API.md

DATABASE.md

VAS_INTEGRATION.md

ADMIN_GUIDE.md

TESTING.md

---

# 118. VAS INTEGRATION DOCUMENT

The project must include a dedicated document explaining how a future aggregator can connect.

Include:

USSD endpoint

SMS endpoint

Subscription API

Charge API

Renewal callback

Cancellation callback

Transaction verification

Reversal

Reconciliation

Authentication

Webhook security

Example payloads

Example responses

---

# 119. SAMPLE SUBSCRIPTION API

POST

/api/v1/subscriptions

Request:

{
"plan_id": "daily",
"channel": "WEB",
"provider": "DCB_PROVIDER"
}

Response:

{
"status": "pending",
"subscription_id": "...",
"payment_url": "..."
}

Do not expose provider secrets.

---

# 120. SUBSCRIPTION CALLBACK

Provider calls:

POST

/api/v1/webhooks/dcb

The backend should:

1. Authenticate callback.
2. Validate transaction.
3. Check idempotency.
4. Verify amount.
5. Verify user.
6. Update transaction.
7. Activate subscription.
8. Record event.
9. Send notification.

---

# 121. USER SUBSCRIPTION API

GET:

/api/v1/subscriptions/current

Response should include:

plan

status

start_date

end_date

renewal_date

auto_renew

features

---

# 122. PRODUCT RULE

A user with an active subscription should immediately have access to the benefits associated with that plan.

A user without an active subscription should not access premium features.

Subscription status must be checked server-side.

---

# 123. GRACE PERIOD

Support configurable grace periods.

Example:

PAYMENT_FAILED

↓

GRACE_PERIOD

↓

Retry

↓

Success = ACTIVE

Failure = EXPIRED

The exact period should be configurable.

---

# 124. UNSUBSCRIBE

Users can cancel recurring subscription.

Cancellation should not necessarily immediately remove access.

The system should support:

cancel_at_period_end

and

immediate cancellation

depending on configured provider/business rules.

---

# 125. PRIVACY

Do not expose:

Phone numbers

Billing information

Internal IDs

Private profile information

on public pages.

Leaderboard uses:

Display name

Avatar

Score

Rank

---

# 126. CONTENT MANAGEMENT

Admin should be able to schedule:

Daily question sets

Special challenges

Seasonal challenges

Nigerian Independence challenges

Holiday challenges

Sponsored challenges

---

# 127. SEASON SYSTEM

Future architecture should support seasons.

Example:

BrainTease Season 1

October–December

At the end:

Leaderboard archived.

New season begins.

Players retain lifetime XP but seasonal scores reset.

---

# 128. GAME SEASONS

Each season can have:

Start date

End date

Theme

Question pool

Leaderboard

Achievements

Special challenges

---

# 129. PRODUCT LANGUAGE

Use simple language.

Do not use unnecessarily technical terms with players.

Instead of:

"Your cognitive performance index"

Use:

"Your BrainTease Score"

Instead of:

"Response latency"

Use:

"Average response time"

---

# 130. CORE UX PRINCIPLE

Every important screen should answer:

What can I do next?

Examples:

Dashboard:

START CHALLENGE

Result:

VIEW LEADERBOARD

Leaderboard:

PLAY AGAIN

Profile:

IMPROVE YOUR SCORE

---

# 131. RESULT SCREEN

After completing a challenge:

# Challenge Complete!

Score:

820

Accuracy:

80%

Correct:

8/10

Time:

03:42

XP:

+180

Current streak:

12 days

Nigeria rank:

#2,481

Global rank:

#17,390

Buttons:

VIEW LEADERBOARD

VIEW PERFORMANCE

PLAY AGAIN

---

# 132. SHARE FEATURE

Future:

Allow users to share achievements.

Example:

"I just scored 920 points on BrainTease. Can you beat me?"

Share options:

WhatsApp

X

Facebook

Instagram

Copy link

Do not expose phone number.

---

# 133. MOBILE-FIRST REQUIREMENT

The web experience must be designed primarily for mobile screens.

Test at:

320px

375px

390px

430px

768px

1024px

1440px

---

# 134. PERFORMANCE TARGET

Target Lighthouse:

Performance: 90+

Accessibility: 90+

Best Practices: 90+

SEO: 90+

Where practical.

---

# 135. PRODUCTION READINESS

Do not declare the project complete merely because the pages render.

Before declaring completion, verify:

Frontend works.

Backend works.

Database works.

Authentication works.

Questions work.

Scoring works.

Leaderboard works.

Subscription architecture works.

Admin works.

Tests pass.

Build succeeds.

No critical console errors.

No critical API errors.

Environment configuration documented.

---

# 136. AI DEVELOPMENT PROCESS

You must work in phases.

DO NOT attempt to generate the entire application in one uncontrolled step.

Phase 1:

Architecture

↓

Phase 2:

Database

↓

Phase 3:

Backend/API

↓

Phase 4:

Authentication

↓

Phase 5:

Game engine

↓

Phase 6:

Frontend

↓

Phase 7:

Admin

↓

Phase 8:

Subscription/VAS abstraction

↓

Phase 9:

Testing

↓

Phase 10:

Polish

↓

Phase 11:

Deployment documentation

---

# 137. BEFORE CODING

First inspect the existing repository.

Determine:

Current framework

Existing files

Existing dependencies

Existing database

Existing environment

Existing routes

Existing components

Existing authentication

Do not destroy working code without a reason.

If the repository is empty:

Initialize the recommended architecture.

---

# 138. DEVELOPMENT RULE

Before implementing a major feature:

1. Explain what will be changed.
2. Implement it.
3. Test it.
4. Fix errors.
5. Continue.

Do not leave known errors unresolved.

---

# 139. NO FAKE FUNCTIONALITY

Do not create:

Fake payment success

Fake leaderboard data

Fake subscription status

Fake API responses

Fake authentication

Fake transaction records

Mock data may be used only for development/demo mode and must be clearly separated from production logic.

---

# 140. DEMO MODE

Create a development/demo mode.

Demo mode may use:

Seed users

Seed questions

Seed scores

Seed leaderboard

Seed achievements

But production mode must use the real database.

---

# 141. SEED DATA

Create at least:

100 high-quality sample questions.

Categories:

Mathematics

Science

Logic

Nigeria

Culture

History

General Knowledge

World

Language

Problem Solving

Include different difficulty levels.

---

# 142. QUESTION CONTENT

Questions should be:

Clear

Factually accurate

Interesting

Non-ambiguous

Appropriate

Not repetitive

Not overly academic

Balanced between Nigerian and global content.

---

# 143. ADMIN QUESTION REVIEW

Admin should see:

Question

Options

Correct answer

Explanation

Category

Difficulty

Preview

Approve

Reject

Publish

---

# 144. FINAL DELIVERABLES

At the end of development provide:

1. Working web application.

2. Working backend.

3. PostgreSQL database.

4. Admin dashboard.

5. Authentication.

6. Game engine.

7. Scoring system.

8. Leaderboard.

9. Subscription engine.

10. VAS integration abstraction.

11. API documentation.

12. Database schema.

13. Test suite.

14. Deployment documentation.

15. Environment example.

16. Seed data.

17. README.

---

# 145. DEFINITION OF DONE

BrainTease is considered MVP complete when a new user can:

1. Visit BrainTease.
2. Register with phone number.
3. Verify OTP.
4. See available subscription plans.
5. Subscribe through the configured payment provider.
6. Have their subscription verified.
7. Access the Daily Challenge.
8. Answer 10 questions.
9. Receive a server-calculated score.
10. Receive XP.
11. Maintain a streak.
12. View their performance.
13. View the leaderboard.
14. View their profile.
15. View achievements.
16. Cancel/manage subscription.
17. Return the next day and receive a new challenge.

An administrator must be able to:

1. Log into admin.
2. Create questions.
3. Review questions.
4. Publish questions.
5. Manage categories.
6. Manage plans.
7. View users.
8. View subscriptions.
9. View transactions.
10. View analytics.
11. View audit logs.

---

# 146. IMPORTANT PRODUCT PRINCIPLES

Always prioritize:

USER EXPERIENCE

SECURITY

ACCURACY

PERFORMANCE

SCALABILITY

SIMPLICITY

RELIABILITY

Do not over-engineer the MVP.

But do not create technical debt that prevents:

VAS integration

Mobile application

Large-scale users

Advanced competition

---

# 147. FINAL ARCHITECTURE

The final product should conceptually be:

```
              BRAINTEASE
                   |
   --------------------------------
   |              |               |
  WEB            USSD            SMS
   |              |               |
   --------------------------------
                   |
             BRAINTEASE API
                   |
   -------------------------------------
   |          |          |             |
 AUTH       GAME       VAS          NOTIFY
   |          |          |             |
   |       QUESTIONS    DCB           SMS
   |       SCORING      BILLING       PUSH
   |       XP            MNO
   |       RANKING
   |
DATABASE
   |
```

---

|        |       |       |      |
USERS  QUESTIONS SCORES BILLING ANALYTICS
|
ADMIN PANEL
|
CONTENT TEAM

Future:

```
                   |
             MOBILE APP
             /          \
         ANDROID       iOS
```

---

# 148. FINAL PRODUCT VISION

BrainTease should evolve from:

A VAS quiz service

into:

A daily cognitive gaming platform

into:

A competitive intelligence and knowledge gaming ecosystem.

The user should eventually be able to say:

"I play BrainTease every day."

Not:

"I subscribed to a quiz service."

That distinction is fundamental to the product.

---

# 149. FINAL AI INSTRUCTION

Build BrainTease as a real production-quality software product.

Do not build only a UI prototype.

Do not skip backend architecture.

Do not hard-code business rules.

Do not hard-code payment providers.

Do not hard-code subscription plans.

Do not expose private user information.

Do not trust frontend scores.

Do not activate subscriptions without verified payment.

Do not publish unreviewed questions.

Do not make medical or clinical claims about user scores.

Make the system modular enough to support:

VAS

DCB

USSD

SMS

Web

Android

iOS

Tournaments

Leaderboards

AI personalization

Sponsored challenges

School competitions

Corporate competitions

and global expansion.

Build the MVP first, but architect the foundation for the complete BrainTease ecosystem.

# END OF MASTER BUILD SPECIFICATION
