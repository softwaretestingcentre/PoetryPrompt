# Manual UI Test Cases for PoetryPrompt

All tests use the format: **Given, When, Then**

## 1. Prompt Generation
- **Given** the PoetryPrompt app is loaded
- **When** the user clicks the "Get Prompt" button
- **Then** a new theme and style are displayed in the prompt area

## 2. Timer Functionality
- **Given** the user sees the prompt and timer
- **When** the user clicks the "Start Timer" button
- **Then** a 20-minute countdown timer starts and is visible

- **Given** the timer is running
- **When** the user submits a poem
- **Then** the timer stops and is reset/disabled

## 3. Poem Submission (Typed)
- **Given** the user has a prompt and timer
- **When** the user types a poem and clicks "Submit Poem"
- **Then** the poem is saved and appears in the poems panel

## 4. Poem Submission (Photo)
- **Given** the user has a prompt and timer
- **When** the user uploads a photo of a handwritten poem and clicks "Submit Poem"
- **Then** the photo is processed, text is extracted, and the poem is saved and appears in the poems panel

## 5. Poem Submission (Photo Upload)
- **Given** the user has a prompt and timer
- **When** the user uploads a photo of a handwritten poem and clicks "Submit Poem"
- **Then** the photo is processed, text is extracted, and the poem is saved and appears in the poems panel

## 6. Poem Search/Filter
- **Given** there are multiple poems in the poems panel
- **When** the user enters a search term in the search box
- **Then** only poems matching the search term (theme, style, or text) are displayed

## 7. Poem Display
- **Given** there are submitted poems
- **When** the user views the poems panel
- **Then** each poem displays its theme, style, date, and text/photo

## 8. UI Responsiveness
- **Given** the app is loaded on different screen sizes
- **When** the user resizes the browser window
- **Then** the layout remains readable and visually appealing

## 9. Visual Contrast
- **Given** the app is loaded
- **When** the user views the UI
- **Then** all text and interactive elements are readable against the background

---

Add more tests as features are added or UI changes are made.
