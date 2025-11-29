# Troubleshooting Guide for Azm-e-Hayat Application

## Issues Fixed

1. **API Key Environment Variable Mismatch**: Fixed the API key reference in `services/geminiService.ts` from `process.env.API_KEY` to `process.env.GEMINI_API_KEY` to match the Vite configuration.

2. **Incorrect Package**: Updated `package.json` to use the correct Google Generative AI package (`@google/generative-ai` instead of the non-existent `@google/genai`).

3. **SDK API Corrections**: Updated the Google Generative AI SDK usage to match the correct API:
   - Changed import from `GoogleGenAI` to `GoogleGenerativeAI`
   - Updated schema type from `Type` to `SchemaType`
   - Corrected the model initialization and content generation API
   - Fixed response handling

4. **Environment Configuration**: Created `.env.local` file with the proper API key placeholder.

## How to Run the Application

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API key

### Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up API Key**:
   - Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/)
   - Update the `.env.local` file with your actual API key:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## Common Issues and Solutions

### Installation Failures
If `npm install` fails due to memory constraints:
- Try installing packages individually
- Increase memory allocation for Node.js: `node --max-old-space-size=4096 $(which npm) install`
- Use a different package manager like yarn: `yarn install`

### API Key Not Found
- Ensure the `.env.local` file exists in the root directory
- Verify the variable name matches: `GEMINI_API_KEY`
- Restart the development server after adding the API key

### Build Issues
- Make sure all dependencies are properly installed
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## Dependencies Used
- `react` and `react-dom`: Core React libraries
- `@google/generative-ai`: Google's official Generative AI SDK
- `recharts`: Charting library for visualizations
- `vite`: Build tool and development server