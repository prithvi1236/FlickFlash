# Font Setup Instructions

To complete the font setup, you need to download the following fonts and place them in this directory:

## Required Fonts:

### Preahvihear
- Download from: https://fonts.google.com/specimen/Preahvihear
- File needed: `Preahvihear-Regular.ttf`

### Poppins
- Download from: https://fonts.google.com/specimen/Poppins
- Files needed:
  - `Poppins-Light.ttf`
  - `Poppins-Regular.ttf`
  - `Poppins-Medium.ttf`
  - `Poppins-SemiBold.ttf`

## Download Steps:

1. Visit the Google Fonts links above
2. Click "Download family" for each font
3. Extract the downloaded ZIP files
4. Copy the required .ttf files to this directory
5. Restart your Expo development server

## Alternative Quick Setup:

You can also download the fonts directly using these commands (if you have curl installed):

```bash
# Download Preahvihear
curl -o Preahvihear-Regular.ttf "https://github.com/google/fonts/raw/main/ofl/preahvihear/Preahvihear-Regular.ttf"

# Download Poppins variants
curl -o Poppins-Light.ttf "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Light.ttf"
curl -o Poppins-Regular.ttf "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf"
curl -o Poppins-Medium.ttf "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Medium.ttf"
curl -o Poppins-SemiBold.ttf "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-SemiBold.ttf"
```

After placing the fonts in this directory, the app will automatically load them and apply the custom typography. 