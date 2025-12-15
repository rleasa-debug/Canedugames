# 📥 How to Copy Files from Figma Make to Your Computer

## Quick Overview

You'll be copying files one-by-one from Figma Make to your computer. It's copy-paste work, but straightforward!

**Time needed:** About 10-15 minutes for all files

---

## Method 1: Copy-Paste Each File (Recommended)

### Step-by-Step for Each File:

#### In Figma Make (this window):
1. **Find the file browser** on the LEFT side of the screen
2. **Click on a file** (e.g., `App.tsx`)
3. The code will appear in the editor
4. **Select all the code:**
   - Windows: Press `Ctrl + A`
   - Mac: Press `Cmd + A`
5. **Copy the code:**
   - Windows: Press `Ctrl + C`
   - Mac: Press `Cmd + C`

#### On Your Computer:
6. **Open a text editor:**
   - Windows: Use **Notepad** or **VS Code** (recommended)
   - Mac: Use **TextEdit** or **VS Code** (recommended)
7. **Create a new file**
8. **Paste the code:**
   - Windows: Press `Ctrl + V`
   - Mac: Press `Cmd + V`
9. **Save the file:**
   - Use the EXACT same name as in Figma Make
   - Save it in the correct folder
   - Make sure the extension is correct (`.tsx`, `.ts`, `.css`, etc.)

**Repeat for each file!**

---

## Detailed Example: Copying App.tsx

Let's walk through copying your first file step-by-step:

### 1. In Figma Make:
```
Look at the LEFT sidebar → You'll see files listed like:
├── App.tsx          ← Click this!
├── main.tsx
├── index.html
└── ...
```

### 2. Click on `App.tsx`
- The file content appears in the middle/right area
- You'll see lots of code

### 3. Select All Code
- Click anywhere in the code
- Press `Ctrl + A` (Windows) or `Cmd + A` (Mac)
- All the code should be highlighted/selected

### 4. Copy the Code
- Press `Ctrl + C` (Windows) or `Cmd + C` (Mac)
- The code is now copied to your clipboard

### 5. On Your Computer:
- Open your `canedugames` folder on your Desktop
- Right-click in the folder → **New** → **Text Document** (Windows)
  - Or use a code editor like VS Code

### 6. Paste the Code
- Open the new file
- Press `Ctrl + V` (Windows) or `Cmd + V` (Mac)
- All the code should appear!

### 7. Save with Correct Name
- Click **File** → **Save As**
- Name it: `App.tsx` (exact spelling, exact capitalization)
- **Important:** Change "Save as type" to **"All Files"**
- Make sure it ends with `.tsx` not `.txt`
- Click **Save**

✅ You just copied your first file!

---

## Quick Reference: File Organization

When you copy files, put them in the right folders:

```
canedugames/                    ← Main folder on your Desktop
├── App.tsx                     ← Copy here
├── main.tsx                    ← Copy here
├── index.html                  ← Copy here
├── package.json                ← Copy here
├── vite.config.ts              ← Copy here
├── tsconfig.json               ← Copy here
├── vercel.json                 ← Copy here
│
├── components/                 ← Create this folder
│   ├── Logo.tsx                ← Copy here
│   ├── Auth.tsx                ← Copy here
│   ├── GameCard.tsx            ← Copy here
│   └── ... (all other components)
│
├── contexts/                   ← Create this folder
│   ├── ScoreContext.tsx        ← Copy here
│   ├── ProgressionContext.tsx  ← Copy here
│   └── AuthContext.tsx         ← Copy here
│
├── utils/                      ← Create this folder
│   ├── voice.ts                ← Copy here
│   └── supabase/               ← Create subfolder
│       ├── client.tsx          ← Copy here
│       └── info.tsx            ← Copy here
│
├── supabase/                   ← Create this folder
│   └── functions/              ← Create subfolder
│       └── server/             ← Create subfolder
│           ├── index.tsx       ← Copy here
│           ├── kv_store.tsx    ← Copy here
│           └── elevenlabs.tsx  ← Copy here
│
└── styles/                     ← Create this folder
    └── globals.css             ← Copy here
```

---

## Pro Tips for Faster Copying

### Tip 1: Use VS Code (Recommended!)

**VS Code is a free code editor that makes this much easier:**

1. Download VS Code: https://code.visualstudio.com
2. Install it
3. Open VS Code
4. Click **File** → **Open Folder**
5. Select your `canedugames` folder
6. Now you can create files easily:
   - Right-click in the sidebar → **New File**
   - Type the file name (e.g., `App.tsx`)
   - Paste the code
   - It auto-saves!

### Tip 2: Create All Folders First

Before copying files, create all the folders:

```
canedugames/
├── components/
│   ├── ui/
│   ├── games/
│   └── figma/
├── contexts/
├── utils/
│   └── supabase/
├── supabase/
│   └── functions/
│       └── server/
├── styles/
└── public/
```

This way you know where to put each file as you copy it.

### Tip 3: Work in Batches

Don't try to copy everything at once. Work in batches:

**Batch 1: Essential Files (5 files)**
- App.tsx
- main.tsx
- index.html
- package.json
- vite.config.ts

**Batch 2: Config Files (4 files)**
- tsconfig.json
- tsconfig.node.json
- vercel.json
- logo.svg

**Batch 3: Contexts (3 files)**
- All files in `/contexts` folder

**Batch 4: Utils (3 files)**
- All files in `/utils` folder

**Batch 5: Components (Many files)**
- All files in `/components` folder (this will take the longest)

**Batch 6: Backend (3 files)**
- All files in `/supabase/functions/server` folder

**Batch 7: Styles (1 file)**
- globals.css

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Wrong File Extension
```
Wrong: App.tsx.txt
Right: App.tsx
```

**Fix:** When saving, choose "All Files" as the file type.

### ❌ Mistake 2: Wrong Folder
```
Wrong: canedugames/Logo.tsx
Right: canedugames/components/Logo.tsx
```

**Fix:** Make sure you're in the correct folder before saving.

### ❌ Mistake 3: Copying Empty Files
```
Wrong: File has 0 bytes
Right: File has code in it
```

**Fix:** Make sure you selected ALL the code before copying.

### ❌ Mistake 4: Missing Files
```
Wrong: Only copied 10 files
Right: Copied all 60+ files
```

**Fix:** Use the checklist to make sure you got everything.

---

## Checklist: Files to Copy

### Root Files (in main `canedugames` folder):
- [ ] App.tsx
- [ ] main.tsx
- [ ] index.html
- [ ] package.json
- [ ] vite.config.ts
- [ ] tsconfig.json
- [ ] tsconfig.node.json
- [ ] vercel.json
- [ ] logo.svg

### Components Folder (`/components`):
- [ ] Logo.tsx
- [ ] Auth.tsx
- [ ] AuthButton.tsx
- [ ] GameCard.tsx
- [ ] ScoreDisplay.tsx
- [ ] LevelDisplay.tsx
- [ ] LevelUpModal.tsx
- [ ] VoiceToggle.tsx
- [ ] TextWithVoice.tsx
- [ ] PremiumUpgrade.tsx
- [ ] UpgradeBanner.tsx
- [ ] SubscriptionSuccess.tsx
- [ ] ProgressDashboard.tsx
- [ ] ReportCard.tsx
- [ ] Leaderboard.tsx
- [ ] AdminDashboard.tsx
- [ ] MathGame.tsx
- [ ] ReadingGame.tsx
- [ ] SpellingGame.tsx
- [ ] TypingGame.tsx
- [ ] MathQuiz.tsx
- [ ] TimesTablesPractice.tsx
- [ ] PhonicsGame.tsx
- [ ] RhymingGame.tsx
- [ ] SpellingBee.tsx
- [ ] ReadingComprehension.tsx
- [ ] VowelSoundsSorting.tsx
- [ ] PrefixSuffixGame.tsx
- [ ] ISpyWords.tsx
- [ ] SentenceStars.tsx
- [ ] StorySequencing.tsx
- [ ] MathMatchingGame.tsx
- [ ] PatternRecognition.tsx
- [ ] ShapeComparisonGame.tsx
- [ ] FactorBattleship.tsx
- [ ] AngleBisectorGame.tsx
- [ ] MappingMapleLeaf.tsx
- [ ] GeographyQuiz.tsx
- [ ] ChartInterpretation.tsx
- [ ] CurriculumInfo.tsx
- [ ] MazeGame.tsx
- [ ] TypingTest.tsx
- [ ] AdBanner.tsx
- [ ] GoogleAdSense.tsx
- [ ] UniversalAd.tsx
- [ ] PrivacyPolicy.tsx
- [ ] TermsOfService.tsx

### Components/UI Folder (`/components/ui`):
- [ ] Copy ALL files you see in `/components/ui`

### Components/Games Folder (`/components/games`):
- [ ] WordFamilyKeys.tsx

### Components/Figma Folder (`/components/figma`):
- [ ] ImageWithFallback.tsx

### Contexts Folder (`/contexts`):
- [ ] ScoreContext.tsx
- [ ] ProgressionContext.tsx
- [ ] AuthContext.tsx

### Utils Folder (`/utils`):
- [ ] voice.ts

### Utils/Supabase Folder (`/utils/supabase`):
- [ ] client.tsx
- [ ] info.tsx

### Supabase Folder (`/supabase/functions/server`):
- [ ] index.tsx
- [ ] kv_store.tsx
- [ ] elevenlabs.tsx

### Styles Folder (`/styles`):
- [ ] globals.css

---

## How to Check You Got Everything

After copying all files, your folder should look like this when you open it:

```
canedugames/
├── 📄 App.tsx (large file, ~1000+ lines)
├── 📄 main.tsx (small file, ~10 lines)
├── 📄 index.html (small file, ~20 lines)
├── 📄 package.json (medium file, ~40 lines)
├── 📄 vite.config.ts (small file, ~20 lines)
├── 📄 tsconfig.json (small file, ~30 lines)
├── 📄 vercel.json (small file, ~10 lines)
├── 📄 logo.svg (SVG file)
├── 📁 components/ (folder with 60+ files)
├── 📁 contexts/ (folder with 3 files)
├── 📁 utils/ (folder with 1 file + supabase subfolder)
├── 📁 supabase/ (nested folders with 3 files)
└── 📁 styles/ (folder with 1 file)
```

**Quick test:**
1. Count the files in `canedugames/components/` → Should be 50+ files
2. Open `App.tsx` → Should be very long (1000+ lines)
3. Open `package.json` → Should have "dependencies" and "devDependencies"

---

## Video Tutorial Alternative

If you prefer watching a video, search YouTube for:
- "How to download files from web editor"
- "VS Code tutorial for beginners"

The process is the same for any web-based code editor.

---

## Need Help?

**If you get stuck:**
- Tell me which file you're trying to copy
- Tell me what error you see
- I can walk you through it step-by-step!

---

## Ready to Start?

**Recommended approach:**

1. **Install VS Code first** (makes it much easier)
2. **Create the `canedugames` folder** on your Desktop
3. **Open it in VS Code**
4. **Start with the small files** (main.tsx, index.html)
5. **Work your way through** the checklist
6. **Take breaks!** It's tedious but important

**Let me know when you're ready to start, or if you need help with any specific file!** 🚀
